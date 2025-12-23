import {
  APICallError,
  experimental_generateImage as generateImage,
  generateText,
} from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { createAI302 } from "@302ai/ai-sdk";
import { createScopedLogger, generateFluxKontextImage } from "@/utils";
import { env } from "@/env";
import ky from "ky";
import prompts from "@/constants/prompts";

const logger = createScopedLogger("gen-image");

export async function POST(request: Request) {
  try {
    const {
      prompt,
      apiKey,
      isOptimize,
      model,
    }: {
      prompt: string;
      apiKey: string;
      isOptimize: boolean;
      model: "gpt-image-1" | "flux-kontext-pro" | "flux-kontext-max";
    } = await request.json();
    const ai302 = createAI302({
      apiKey,
      baseURL: env.NEXT_PUBLIC_API_URL,
    });

    let newPrompt = prompt;

    if (isOptimize) {
      const { text } = await generateText({
        model: ai302.chatModel("claude-3-7-sonnet-20250219"),
        prompt: prompts.optimizeImage.compile({ input: prompt }),
      });
      newPrompt = text;
    }
    let newImage: any;
    if (model === "flux-kontext-pro" || model === "flux-kontext-max") {
      // 使用封装后的函数生成图像
      const base64Image = await generateFluxKontextImage(
        env.NEXT_PUBLIC_API_URL,
        newPrompt,
        apiKey,
        undefined,
        model as "flux-kontext-pro" | "flux-kontext-max"
      );

      newImage = {
        base64Data: base64Image,
      };
    } else {
      const { image }: any = await generateImage({
        model: ai302.image(model),
        prompt: newPrompt,
      });
      newImage = image;
    }

    logger.info("Image generated successfully");

    // Upload the generated base64 image to the server
    try {
      // Convert base64 to blob
      const base64Response = await fetch(
        `data:image/png;base64,${newImage.base64 || newImage.base64Data}`
      );
      const blob = await base64Response.blob();

      // Create FormData and append the image
      const formData = new FormData();
      formData.append("file", blob, "generated-image.png");

      // Upload the image
      const uploadResponse = await ky
        .post(`${env.NEXT_PUBLIC_AUTH_API_URL}/gpt/api/upload/gpt/image`, {
          body: formData,
        })
        .json<{
          code: number;
          msg: string;
          data: {
            url: string;
          };
        }>();
      if (uploadResponse.code === 0) {
        logger.info("Image uploaded successfully");

        return Response.json({
          image: {
            image: newImage.base64Data || newImage.base64,
            imageUrl: uploadResponse.data.url,
            prompt: newPrompt,
          },
        });
      } else {
        logger.error(`Upload failed: ${uploadResponse.msg}`);
        throw new Error(`Image upload failed: ${uploadResponse.msg}`);
      }
    } catch (uploadError) {
      logger.error("Error uploading generated image:", uploadError);
      // If upload fails, still return the base64 image
      return Response.json({
        image: {
          image: newImage.base64 || newImage.base64Data,
          prompt: newPrompt,
          uploadError: "Failed to upload the image to server",
        },
      });
    }
  } catch (error) {
    // logger.error(error);
    if (error instanceof APICallError) {
      // console.log("APICallError", error);

      const resp = error.responseBody;

      return Response.json(resp, { status: 500 });
    }
    // Handle different types of errors
    const errorMessage = "Failed to generate image";
    const errorCode = 500;

    if (error instanceof Error) {
      const resp = (error as any)?.responseBody as any; // You can add specific error code mapping here if needed
      return Response.json(resp, { status: 500 });
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
