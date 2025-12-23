import { createScopedLogger } from "@/utils";
import { env } from "@/env";
import ky from "ky";

const logger = createScopedLogger("gen-img-with-img");

// Helper function to convert image URL to compatible)
const urlToBase64 = async (url: string): Promise<string> => {
  const response = await fetch(url);

  // 检查响应状态
  if (!response.ok) {
    console.error(`下载失败: HTTP ${response.status} ${response.statusText}`);
    throw new Error(`Failed to fetch image: HTTP ${response.status}`);
  }

  const contentType = response.headers.get("content-type") || "image/png";
  const arrayBuffer = await response.arrayBuffer();

  // 验证数据大小
  if (arrayBuffer.byteLength < 100) {
    console.error("数据太小，可能不是有效图片:", arrayBuffer.byteLength);
    throw new Error("Downloaded data too small to be a valid image");
  }

  // 将arrayBuffer转换为base64字符串
  const base64 = Buffer.from(arrayBuffer).toString("base64");

  // 返回完整的data URL
  return `data:${contentType};base64,${base64}`;
};

export async function POST(request: Request) {
  try {
    const {
      apiKey: clientApiKey,
      img,
      prompt,
      model = "gemini-3-pro-image-preview",
      outputResolution = "2k",
      aspectRatio = "1:1",
    }: {
      img: string;
      prompt: string;
      apiKey?: string;
      model?: "gemini-3-pro-image-preview" | "gemini-3-pro-image-preview-chat";
      outputResolution?: "1k" | "2k" | "4k";
      aspectRatio?: string;
    } = await request.json();

    // 优先使用服务端环境变量中的 API Key，如果没有则使用客户端传来的
    const apiKey =
      env.API_KEY_302 || env.NEXT_PUBLIC_302_API_KEY || clientApiKey;

    if (!apiKey) {
      logger.error("No API key available");
      return Response.json({ error: "API Key 未配置" }, { status: 401 });
    }

    logger.info("Using API key", {
      hasKey: !!apiKey,
      keySource: env.API_KEY_302
        ? "server"
        : env.NEXT_PUBLIC_302_API_KEY
          ? "public"
          : "client",
    });

    try {
      const imageSizeKB = img ? Math.round((img.length * 0.75) / 1024) : 0;

      logger.info("Image generation request", {
        model,
        outputResolution,
        aspectRatio,
        hasImage: !!img,
        imageSizeKB: `${imageSizeKB}KB`,
        promptLength: prompt?.length || 0,
      });

      // 检查图片大小，超过 7MB 报错（API 限制）
      if (imageSizeKB > 7 * 1024) {
        logger.error("Image too large", { imageSizeKB });
        return Response.json(
          {
            error: {
              message: "图片文件过大，请上传小于 7MB 的图片",
              message_cn: "图片文件过大，请上传小于 7MB 的图片",
              type: "IMAGE_TOO_LARGE",
            },
          },
          { status: 400 }
        );
      }

      let base64Image: string;

      if (model === "gemini-3-pro-image-preview-chat") {
        // 使用 Chat 格式 API（OpenAI兼容格式）
        // 参考: https://doc.302.ai/380231548e0

        // 根据分辨率获取像素值
        const resolutionMap: Record<string, string> = {
          "1k": "1024",
          "2k": "2048",
          "4k": "4096",
        };
        const resolutionPixels = resolutionMap[outputResolution] || "2048";

        // 构建包含分辨率和比例要求的提示词
        const enhancedPrompt = `${prompt}需要生成分辨率为 ${resolutionPixels}px，宽高比为 ${aspectRatio} 的图片。`;

        logger.info("Chat API enhanced prompt", { enhancedPrompt });

        const res = await ky.post(
          `${env.NEXT_PUBLIC_API_URL}/v1/chat/completions`,
          {
            headers: {
              Authorization: `Bearer ${apiKey}`,
              "Content-Type": "application/json",
            },
            timeout: 300000,
            retry: {
              limit: 2,
              methods: ["post"],
              statusCodes: [408, 413, 429, 500, 502, 503, 504],
              backoffLimit: 5000,
            },
            json: {
              model: "gemini-3-pro-image-preview",
              temperature: 0.1,
              messages: [
                {
                  role: "user",
                  content: [
                    {
                      type: "image_url",
                      image_url: {
                        url: img, // 支持 base64 data URL 或 http URL
                      },
                    },
                    {
                      type: "text",
                      text: enhancedPrompt,
                    },
                  ],
                },
              ],
            },
          }
        );

        const responseData = await res.json<any>();
        logger.info("Chat API response received", {
          hasChoices: !!responseData.choices,
          choicesLength: responseData.choices?.length || 0,
        });

        // 从 Chat 响应中提取图片
        // 响应格式: { choices: [{ message: { content: "..." } }] }
        const content = responseData.choices?.[0]?.message?.content;

        if (!content) {
          logger.error("No content in Chat API response", responseData);
          throw new Error("API响应中未找到内容");
        }

        // Chat 格式返回的图片可能在 content 中作为 markdown 图片链接或直接是 base64
        // 尝试提取图片 URL
        const imageUrlMatch = content.match(/!\[.*?\]\((.*?)\)/);
        if (imageUrlMatch) {
          base64Image = await urlToBase64(imageUrlMatch[1]);
        } else if (content.startsWith("data:image")) {
          base64Image = content;
        } else {
          // 如果返回的是纯文本，可能需要从其他字段获取图片
          logger.error("Unable to extract image from Chat response", {
            content: content.substring(0, 200),
          });
          throw new Error("无法从响应中提取图片");
        }
      } else {
        // 使用 302.AI 简化格式 API（与 v0.0.1 一致）
        const res = await ky.post(
          `${env.NEXT_PUBLIC_API_URL}/302/image/generate`,
          {
            headers: {
              Authorization: `Bearer ${apiKey}`,
            },
            timeout: 300000, // 5分钟超时
            retry: {
              limit: 2,
              methods: ["post"],
              statusCodes: [408, 413, 429, 500, 502, 503, 504],
              backoffLimit: 5000,
            },
            json: {
              prompt,
              model: "gemini-3-pro-image-preview",
              image: img,
            },
          }
        );

        const { image_url } = await res.json<any>();

        // 保留完整的 data URL（包含正确的 Content-Type）
        base64Image = await urlToBase64(image_url);
      }

      return Response.json({
        image: {
          b64_json: base64Image,
          url: "",
        },
      });
    } catch (error: any) {
      console.error("Image generation failed:", error);
      logger.error("Image generation failed", error);

      // 解析错误类型并返回友好提示
      let errorMessage = "图像生成失败，请稍后重试";
      let errorType = "GENERATION_FAILED";

      if (
        error.message?.includes("fetch failed") ||
        error.cause?.code === "ECONNRESET" ||
        error.cause?.code === "UND_ERR_SOCKET"
      ) {
        if (
          error.cause?.message?.includes("other side closed") ||
          error.cause?.code === "UND_ERR_SOCKET"
        ) {
          errorMessage =
            "连接被服务器关闭，请尝试使用较小的图片（建议小于 2MB）";
          errorType = "CONNECTION_CLOSED";
        } else {
          errorMessage = "网络连接失败，请检查网络后重试";
          errorType = "NETWORK_ERROR";
        }
      } else if (
        error.message?.includes("timeout") ||
        error.name === "TimeoutError"
      ) {
        errorMessage = "请求超时，图片可能过大或网络较慢，请重试";
        errorType = "TIMEOUT_ERROR";
      } else if (error.response) {
        try {
          const errorData = await error.response.json();
          logger.error("API error response details:", errorData);
          console.error(
            "API error response details:",
            JSON.stringify(errorData, null, 2)
          );
          if (errorData.error?.message) {
            errorMessage =
              errorData.error.message_cn || errorData.error.message;
          } else if (errorData.message) {
            errorMessage = errorData.message_cn || errorData.message;
          }
        } catch {
          try {
            const errorText = await error.response.text();
            logger.error("API error response text:", errorText);
            console.error("API error response text:", errorText);
          } catch {
            // 忽略解析错误
          }
        }
      }

      return Response.json(
        {
          error: {
            message: errorMessage,
            message_cn: errorMessage,
            type: errorType,
          },
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    logger.error("Error in gen-img-with-img:", error);

    return Response.json(
      {
        error: {
          err_code: 500,
          message: "Failed to generate image",
          message_cn: "生成图片失败",
          message_en: "Failed to generate image",
          message_ja: "画像の生成に失敗しました",
          type: "IMAGE_GENERATION_ERROR",
        },
      },
      { status: 500 }
    );
  }
}
