import { useState, useCallback } from "react";
import { useAtom } from "jotai";
import { generationStoreAtom } from "@/stores/slices/generation_store";
import { appConfigAtom, store } from "@/stores";
import { genImgWithImg } from "@/services/gen-img-with-img";
import { useHistory } from "@/hooks/db/use-gen-history";
import { toast } from "sonner";
import type { UploadedImage } from "../components/underwater-uploader";

// 固定的水下照片增强提示词
const UNDERWATER_ENHANCEMENT_PROMPT =
  "将这张水下照片进行图像处理，做成高保真，高分辨率，摄影级的照片，可以对图像进行一定程度美化。";

// 可选的模型列表
export const UNDERWATER_MODELS = [
  { value: "gemini-3-pro-image-preview", label: "Gemini 3 Pro", description: "水下照片增强" },
] as const;

export type UnderwaterModel = (typeof UNDERWATER_MODELS)[number]["value"];

/**
 * 上传图片到 OBS
 * @param base64Data Base64 图片数据
 * @returns OBS URL 或原始 base64（如果上传失败）
 */
async function uploadToObs(base64Data: string): Promise<string> {
  try {
    const response = await fetch("/api/upload/obs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image: base64Data }),
    });

    if (!response.ok) {
      console.warn("OBS 上传失败，使用 base64 格式");
      return base64Data;
    }

    const data = await response.json();
    return data.url || base64Data;
  } catch (error) {
    console.warn("OBS 上传出错，使用 base64 格式:", error);
    return base64Data;
  }
}

export function useUnderwaterEnhancement() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [generationCount, setGenerationCount] = useAtom(generationStoreAtom);
  const { apiKey } = store.get(appConfigAtom);
  const { addHistory, updateHistory } = useHistory();

  // 将File转换为base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // 处理单张图片
  const processImage = async (
    image: UploadedImage,
    model: UnderwaterModel = "gemini-3-pro-image-preview"
  ): Promise<{ success: boolean; result?: string; error?: string; historyId?: string }> => {
    let historyId: string | undefined;

    try {
      // 转换为base64
      const base64 = await fileToBase64(image.file);

      // 上传原始图片到 OBS
      const originalImageUrl = await uploadToObs(base64);

      // 添加到历史记录（使用 OBS URL 或 base64）
      historyId = await addHistory({
        rawPrompt: "水下照片增强",
        shouldOptimize: false,
        image: {
          base64: originalImageUrl,
          prompt: UNDERWATER_ENHANCEMENT_PROMPT,
          model: model,
          status: "pending",
          type: "underwater-enhancement",
        },
      });

      // 调用API处理
      const result: any = await genImgWithImg({
        img: base64,
        prompt: UNDERWATER_ENHANCEMENT_PROMPT,
        apiKey: apiKey || "",
        model: model as any,
        sourceLang: "ZH",
      });

      let enhancedImage: string;
      let enhancedImageUrl: string;

      if (result.image.b64_json) {
        // API 返回 base64 数据（现在应该包含完整的 data URL）
        enhancedImage = result.image.b64_json;

        // 上传增强后的图片到 OBS
        try {
          enhancedImageUrl = await uploadToObs(enhancedImage);
        } catch (uploadError) {
          console.error("OBS 上传失败:", uploadError);
          throw uploadError;
        }
      } else if (result.image.url) {
        // API 返回 URL（可能是外部 URL）
        // 如果是外部 URL，需要下载后再上传到 OBS
        // 目前先直接使用 API 的 URL
        enhancedImageUrl = result.image.url;
      } else {
        console.error("API返回数据格式错误:", result);
        throw new Error("API返回的图片数据格式不正确");
      }

      // 更新历史记录为成功（使用 OBS URL）
      updateHistory(historyId, {
        rawPrompt: "水下照片增强",
        shouldOptimize: false,
        image: {
          base64: enhancedImageUrl,
          prompt: UNDERWATER_ENHANCEMENT_PROMPT,
          model: model,
          status: "success",
          type: "underwater-enhancement",
        },
      });

      // 返回 OBS URL 或 base64
      return { success: true, result: enhancedImageUrl, historyId };
    } catch (error) {
      console.error("处理失败:", error);

      // 如果历史记录已创建，更新为失败状态
      if (historyId !== undefined) {
        try {
          // 获取原始图片的 base64（如果还没转换则转换）
          const base64 = image.preview || await fileToBase64(image.file);
          // 尝试上传失败的原始图片
          const failedImageUrl = await uploadToObs(base64);

          updateHistory(historyId, {
            rawPrompt: "水下照片增强",
            shouldOptimize: false,
            image: {
              base64: failedImageUrl,
              prompt: UNDERWATER_ENHANCEMENT_PROMPT,
              model: model,
              status: "failed",
              type: "underwater-enhancement",
            },
          });
        } catch (updateError) {
          console.error("更新历史记录失败状态时出错:", updateError);
        }
      }

      return {
        success: false,
        error: error instanceof Error ? error.message : "处理失败",
        historyId,
      };
    }
  };

  // 批量处理图片（队列机制）
  const processImages = useCallback(
    async (
      images: UploadedImage[],
      model: UnderwaterModel,
      onProgress: (updatedImages: UploadedImage[]) => void
    ) => {
      if (generationCount.generationCount >= 4) {
        toast.warning("已达到最大并发处理数量，请稍后再试");
        return;
      }

      setIsProcessing(true);
      const updatedImages = [...images];
      let activeProcessing = 0;
      const MAX_CONCURRENT = 4;

      const processNext = async (index: number): Promise<void> => {
        if (index >= images.length) return;

        // 等待有空闲槽位
        while (activeProcessing >= MAX_CONCURRENT) {
          await new Promise((resolve) => setTimeout(resolve, 500));
        }

        activeProcessing++;
        updatedImages[index].status = "processing";
        onProgress([...updatedImages]);

        // 更新全局计数
        setGenerationCount((prev) => ({
          ...prev,
          generationCount: prev.generationCount + 1,
          loading: true,
        }));

        const result = await processImage(images[index], model);

        if (result.success && result.result) {
          updatedImages[index].status = "success";
          updatedImages[index].result = result.result;
          toast.success(`${images[index].file.name} 处理完成`);
        } else {
          updatedImages[index].status = "failed";
          updatedImages[index].error = result.error;
          toast.error(`${images[index].file.name} 处理失败`);
        }

        activeProcessing--;

        // 更新全局计数
        setGenerationCount((prev) => ({
          ...prev,
          generationCount: Math.max(prev.generationCount - 1, 0),
          loading: prev.generationCount > 1,
        }));

        onProgress([...updatedImages]);

        // 处理下一张
        if (index + MAX_CONCURRENT < images.length) {
          await processNext(index + MAX_CONCURRENT);
        }
      };

      // 并发启动多个处理任务
      const concurrentTasks = Math.min(MAX_CONCURRENT, images.length);
      await Promise.all(
        Array.from({ length: concurrentTasks }, (_, i) => processNext(i))
      );

      setIsProcessing(false);
      toast.success("所有照片处理完成！");
    },
    [apiKey, generationCount.generationCount, setGenerationCount]
  );

  return {
    isProcessing,
    processImage,
    processImages,
  };
}
