import { createScopedLogger, generateFluxKontextImage } from "@/utils";
import { env } from "@/env";
import ky from "ky";
import { APICallError } from "ai";
import { ErrorToast } from "@/components/ui/errorToast";
import { generateSeedEditImage } from "@/utils/seed-image";
import { generateSeedEditV3Image } from "@/utils/seed-image-3.0";
const logger = createScopedLogger("gen-img-with-img");

// Helper function to convert URL to File object
const urlToFile = async (url: string, filename: string): Promise<File> => {
  // Fetch the image
  const response = await fetch(url);
  const blob = await response.blob();

  // Create File object from blob
  return new File([blob], filename, { type: blob.type });
};

// Helper function to convert image URL to base64 (Node.js compatible)
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

interface DeepLTranslation {
  detected_source_language?: string;
  text: string;
}

interface DeepLResponse {
  translations: DeepLTranslation[];
}

// 翻译函数
async function translateToEnglish(
  text: string,
  apiKey: string,
  sourceLang: "ZH" | "EN"
): Promise<string> {
  try {
    const response = await ky.post(
      `${env.NEXT_PUBLIC_API_URL}/deepl/v2/translate`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        json: {
          text: [text],
          target_lang: "EN",
          source_lang: "ZH",
        },
      }
    );

    const result = (await response.json()) as DeepLResponse;
    logger.info("translation-success", { result });

    if (result.translations && result.translations.length > 0) {
      return result.translations[0].text;
    } else {
      throw new Error("No translations found in response");
    }
  } catch (error) {
    logger.error("Failed to translate text", error);
    // 如果翻译失败，返回原文
    return text;
  }
}

// 处理base64图像数据
const getCleanBase64 = (img: string): string => {
  // 如果是数据URL（以data:开头），提取出base64部分
  if (img.startsWith("data:")) {
    return img.split(",")[1];
  }
  return img;
};

// // Helper function to determine image orientation using Sharp
// const getImageOrientation = async (file: File): Promise<string> => {
//   try {
//     // Convert File to Buffer
//     const arrayBuffer = await file.arrayBuffer();
//     const buffer = Buffer.from(arrayBuffer);

//     // Get image metadata using Sharp
//     const metadata = await sharp(buffer).metadata();

//     if (!metadata.width || !metadata.height) {
//       logger.warn("Could not determine image dimensions, using default size");
//       return "1024x1024"; // Default to square if dimensions unavailable
//     }

//     if (metadata.width > metadata.height) {
//       return "1536x1024"; // Landscape
//     } else if (metadata.height > metadata.width) {
//       return "1024x1536"; // Portrait
//     } else {
//       return "1024x1024"; // Square
//     }
//   } catch (error) {
//     logger.error("Error in Sharp image processing:", error);
//     return "1024x1024"; // Default to square on error
//   }
// };

export async function POST(request: Request) {
  try {
    const {
      apiKey,
      img,
      prompt,
      size = "1024x1024",
      model = "gpt-image-1",
      sourceLang = "ZH",
    }: {
      img: string;
      prompt: string;
      apiKey: string;
      size: "1024x1024" | "1536x1024" | "1024x1536";
      model?:
        | "gpt-image-1"
        | "flux-kontext-pro"
        | "flux-kontext-max"
        | "SeedEdit 3.0"
        | "gemini-2.5-flash-image-preview"
        | "gemini-3-pro-image-preview";
      sourceLang?: "ZH" | "EN";
    } = await request.json();

    if (model === "gemini-3-pro-image-preview") {
      try {
        const res = await ky.post(
          `${env.NEXT_PUBLIC_API_URL}/302/image/generate`,
          {
            headers: {
              Authorization: `Bearer ${apiKey}`,
            },
            timeout: false,
            json: {
              prompt,
              model: "gemini-3-pro-image-preview",
              image: img,
            },
          }
        );

        const { image_url } = await res.json<any>();

        // 保留完整的 data URL（包含正确的 Content-Type）
        const base64Image = await urlToBase64(image_url);

        return Response.json({
          image: {
            b64_json: base64Image,  // 完整的 data URL，包含正确的 MIME 类型
            url: "",
          },
        });
      } catch (error) {
        console.error("Gemini 3 Pro image generation failed:", error);
        logger.error("Gemini 3 Pro image generation failed", error);
        return Response.json({ error: "图像生成失败" }, { status: 500 });
      }
    }

    if (model === "gemini-2.5-flash-image-preview") {
      try {
        const res = await ky.post(
          `${env.NEXT_PUBLIC_API_URL}/302/image/generate`,
          {
            headers: {
              Authorization: `Bearer ${apiKey}`,
            },
            timeout: false,
            json: {
              prompt,
              model: "gemini-2.5-flash-image",
              image: img,
              // ...(image !== "" ? { image } : {}),
            },
          }
        );
        const { image_url } = await res.json<any>();

        // 将返回的URL转换为base64 - 保留完整的 data URL
        const base64Image = await urlToBase64(image_url);

        return Response.json({
          image: {
            b64_json: base64Image,  // 返回完整的 data URL
            url: "",
          },
        });
      } catch (error) {
        logger.error("SeedEdit v3.0 generation failed", error);
        return Response.json({ error: "图像编辑失败" }, { status: 500 });
      }
    }

    if (model === "SeedEdit 3.0") {
      try {
        // 处理输入图像，确保它是base64格式
        // let imageBase64 = img;
        // if (img.startsWith("http")) {
        //   // 如果是URL，转换为base64
        //   imageBase64 = await urlToBase64(img);
        // }

        // 获取干净的base64数据（去掉前缀）
        // const cleanBase64 = getCleanBase64(imageBase64);

        // 使用SeedEdit进行图像编辑
        const url = await generateSeedEditV3Image(
          env.NEXT_PUBLIC_API_URL,
          prompt,
          apiKey,
          img
        );

        // 将返回的URL转换为base64
        const base64Image = await urlToBase64(url);

        return Response.json({
          image: {
            b64_json: base64Image,
            url: "",
          },
        });
      } catch (error) {
        logger.error("SeedEdit v3.0 generation failed", error);
        return Response.json({ error: "图像编辑失败" }, { status: 500 });
      }
    }

    if (
      model.toLowerCase() === "flux-kontext-pro" ||
      model.toLowerCase() === "flux-kontext-max"
    ) {
      try {
        // 处理输入图像，确保它是base64格式
        let imageBase64 = img;
        if (img.startsWith("http")) {
          // 如果是URL，转换为base64
          imageBase64 = await urlToBase64(img);
        }

        // 获取干净的base64数据（去掉前缀）
        const cleanBase64 = getCleanBase64(imageBase64);

        // 对于Flux Kontext Pro模型，我们需要先翻译提示词，然后使用不同的API
        const englishPrompt = await translateToEnglish(
          prompt,
          apiKey,
          sourceLang
        );
        logger.info("Translated prompt for Flux-Kontext-Pro", {
          original: prompt,
          translated: englishPrompt,
        });

        // 生成图像，传入输入图像
        const base64Image = await generateFluxKontextImage(
          env.NEXT_PUBLIC_API_URL,
          englishPrompt,
          apiKey,
          cleanBase64,
          model as "flux-kontext-pro" | "flux-kontext-max"
        );

        return Response.json({
          image: {
            // Flux Kontext 返回纯 base64，需要添加前缀
            b64_json: `data:image/png;base64,${base64Image}`,
            url: "",
          },
        });
      } catch (error) {
        logger.error("Error with Flux-Kontext-Pro model:", error);
        throw error;
      }
    }

    // 以下是原有的GPT-4o处理流程
    // Create FormData
    const formdata = new FormData();

    try {
      // Create an array to hold both images
      const imageFiles = [];
      let originalImageFile;

      // Convert origin image URL to File object
      if (img && img.startsWith("http")) {
        const filename = img.split("/").pop() || "image1.jpg";
        const imageFile = await urlToFile(img, filename);
        originalImageFile = imageFile;
        imageFiles.push(imageFile);
      } else {
        // Handle case where originImage is already a File or base64
        originalImageFile = img;
        imageFiles.push(img);
      }

      // Append both images to the FormData
      for (let i = 0; i < imageFiles.length; i++) {
        formdata.append("image", imageFiles[i]);
      }

      // Determine image size based on orientation of the first image (original)
      const imageSize = "1024x1024"; // Default size
      // if (originalImageFile instanceof File) {
      //   try {
      //     imageSize = await getImageOrientation(originalImageFile);
      //   } catch (error) {
      //     logger.error("Error determining image orientation:", error);
      //     // Fall back to default size
      //   }
      // }

      // Create a prompt that tells the API to modify the first image based on the second image's style

      formdata.append("prompt", prompt);

      // Add other required parameters
      formdata.append("model", model);
      formdata.append("quality", "auto");
      formdata.append("size", size || imageSize);

      // Call the API
      const result = await ky
        .post("https://api.302.ai/v1/images/edits", {
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
          retry: {
            limit: 1,
            methods: [
              "post",
              "get",
              "put",
              "head",
              "delete",
              "options",
              "trace",
            ], // 明确包含 'post'
          },
          body: formdata,
          timeout: 120000,
        })
        .text();

      logger.info("API response received", {
        result: result.substring(0, 200) + "...",
      });

      // Parse the response to get the image URL
      let responseData;
      try {
        responseData = JSON.parse(result);
      } catch (parseError) {
        logger.error("Failed to parse API response as JSON", {
          result: result.substring(0, 500),
          parseError,
        });
        throw new Error(
          `Invalid JSON response from API: ${result.substring(0, 200)}`
        );
      }
      const image = responseData?.data?.[0];

      if (!image) {
        logger.error("Image URL not found in response", responseData);
        return Response.json(
          {
            error: "Image URL not found in response",
          },
          { status: 500 }
        );
      }

      return Response.json({
        image,
      });
    } catch (apiError: any) {
      logger.error("API call failed:", apiError);

      // Check if error has response with error code for ErrorToast
      if (apiError.response) {
        try {
          const errorText = await apiError.response.text();
          const errorData = JSON.parse(errorText);
          if (errorData.error && errorData.error.err_code) {
            // If we have a structured error with err_code, return it directly
            return Response.json(errorData, {
              status: apiError.response.status || 500,
            });
          }
        } catch (parseError) {
          // If parsing fails, continue to default error handling
        }
      }

      throw apiError;
    }
  } catch (error: any) {
    logger.error("Error in gen-style-reference-image:", error);

    if (error instanceof APICallError) {
      const resp = error.responseBody;
      return Response.json(resp, { status: 500 });
    }

    // Handle different types of errors
    const errorMessage = "Failed to generate image";
    const errorCode = 500;

    if (error instanceof Error) {
      const resp = (error as any)?.responseBody as any;
      if (resp) {
        return Response.json(resp, { status: 500 });
      }
    }

    return Response.json(
      {
        error: {
          err_code: errorCode,
          message: errorMessage,
          message_cn: "生成图片失败",
          message_en: "Failed to generate image",
          message_ja: "画像の生成に失敗しました",
          type: "IMAGE_GENERATION_ERROR",
        },
      },
      { status: errorCode }
    );
  }
}
