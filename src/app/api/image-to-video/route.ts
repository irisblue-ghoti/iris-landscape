import {
  APICallError,
  experimental_generateSpeech as generateSpeech,
} from "ai";
import { createAI302 } from "@302ai/ai-sdk";
import { createScopedLogger } from "@/utils";
import ky from "ky";
import { env } from "@/env";

const logger = createScopedLogger("image-to-video");

export async function POST(request: Request) {
  try {
    const {
      apiKey,
      prompt,
      model,
      image,
      duration,
    }: {
      apiKey: string;
      prompt: string;
      model: string;
      image: string;
      duration?: string;
    } = await request.json();

    // 1. 发起视频生成请求
    const response = await ky.post(
      `${env.NEXT_PUBLIC_API_URL}/302/video/create`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
        timeout: false,
        json: duration
          ? {
              prompt,
              model,
              image,
              duration,
            }
          : {
              prompt,
              model,
              image,
            },
      }
    );

    const initialData: any = await response.json();
    logger.info("Initial API Response:", initialData);

    // 2. 获取task_id并返回
    const taskId = initialData?.task_id;
    if (!taskId) {
      throw new Error("No task_id received from API");
    }

    logger.info("Video generation request initiated, task ID:", taskId);

    // 返回task_id，让客户端自行处理轮询
    return Response.json({
      task_id: taskId,
      status: "initiated",
      message: "Video generation started",
    });
  } catch (error) {
    logger.error("Video generation error:", error);

    // 处理 API 调用错误
    if (error instanceof APICallError) {
      const resp = error.responseBody;
      return Response.json(resp, { status: 500 });
    }

    // 处理一般错误
    const errorMessage =
      error instanceof Error ? error.message : "Failed to generate audio";
    const errorCode = 500;

    // 检查是否有响应体
    if (error instanceof Error) {
      const resp = (error as any)?.responseBody;
      if (resp) {
        return Response.json(resp, { status: 500 });
      }
    }

    // 返回标准化错误响应
    return Response.json(
      {
        error: {
          err_code: errorCode,
          message: errorMessage,
          message_cn: "生成视频失败",
          message_en: "Failed to generate video",
          message_ja: "视频生成に失敗しました",
          type: "VIDEO_GENERATION_ERROR",
        },
      },
      { status: errorCode }
    );
  }
}
