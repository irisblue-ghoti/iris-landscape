import {
  APICallError,
  experimental_generateImage as generateImage,
  generateText,
} from "ai";
import { createAI302 } from "@302ai/ai-sdk";
import { createScopedLogger, generateFluxKontextImage } from "@/utils";
import { env } from "@/env";
import ky from "ky";
import prompts from "@/constants/prompts";
import { anthropic } from "@ai-sdk/anthropic";

const logger = createScopedLogger("gen-image");

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
          source_lang: sourceLang,
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

export async function POST(request: Request) {
  try {
    const {
      prompt,
      apiKey,
      isOptimize = false,
      customOptimizePrompt,
      size = "1024x1024",
      model = "gpt-image-1",
      sourceLang = "ZH",
    }: {
      prompt: string;
      apiKey: string;
      isOptimize?: boolean;
      customOptimizePrompt?: string;
      size?: "1536x1024" | "1024x1024" | "1024x1536";
      model?: any;
      sourceLang?: "ZH" | "EN";
    } = await request.json();
    const ai302 = createAI302({
      apiKey,
      baseURL: env.NEXT_PUBLIC_API_URL,
    });
    let newPrompt = prompt;
    if (isOptimize) {
      const optimizePrompt = prompts.getOptimizePrompt(customOptimizePrompt);

      const { text } = await generateText({
        model: ai302.chatModel("claude-3-7-sonnet-20250219"),
        prompt: optimizePrompt.compile({ input: prompt }),
      });
      newPrompt = text;
    }

    let result: any;

    if (model === "flux-kontext-pro" || model === "flux-kontext-max") {
      // 翻译提示词为英文
      const englishPrompt = await translateToEnglish(
        newPrompt,
        apiKey,
        sourceLang
      );
      logger.info("Translated prompt for Flux-Kontext-Pro", {
        original: newPrompt,
        translated: englishPrompt,
      });

      // 使用Flux Kontext Pro模型生成图像
      const base64Image = await generateFluxKontextImage(
        env.NEXT_PUBLIC_API_URL,
        englishPrompt,
        apiKey,
        undefined,
        model
      );

      result = {
        images: [
          {
            base64Data: base64Image,
          },
        ],
      };
    } else {
      // 使用默认的GPT-4o模型生成图像
      const generateOptions: any = {
        model: ai302.image(model),
        prompt: newPrompt,
      };

      if (model !== "gemini-2.5-flash-image-preview") {
        generateOptions.size = size;
      }

      result = await generateImage(generateOptions);
    }

    logger.info("Image generated successfully");
    return Response.json({
      image: result,
    });
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
