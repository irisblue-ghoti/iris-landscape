import { useState, useCallback } from "react";
import { useAtom } from "jotai";
import { generationStoreAtom } from "@/stores/slices/generation_store";
import { appConfigAtom, store } from "@/stores";
import { genImgWithImg } from "@/services/gen-img-with-img";
import { useHistory } from "@/hooks/db/use-gen-history";
import { useCredits } from "@/hooks/user";
import { toast } from "sonner";
import type { UploadedImage } from "../components/underwater-uploader";

/**
 * 302.AI gemini-3-pro-image-preview 定价规则
 *
 * Google 官方价格 (USD):
 * - 图像输入: ~$0.001/张 (560 tokens)
 * - 图像输出 1K/2K: $0.134/张 (1120 tokens)
 * - 图像输出 4K: $0.24/张 (2000 tokens)
 *
 * 平台积分换算:
 * - 1 人民币 = 10 积分
 * - 1 USD ≈ 7.2 人民币 ≈ 72 积分
 * - 302.AI 积分需要翻倍计算
 *
 * 最终积分计算: (USD价格 × 72 × 2) 向上取整
 */
const PRICING = {
  // Google 官方 USD 价格
  IMAGE_INPUT_USD: 0.001, // ~$0.001/张 (输入)
  IMAGE_OUTPUT_1K_USD: 0.134, // $0.134/张 (1K/2K输出)
  IMAGE_OUTPUT_2K_USD: 0.134, // $0.134/张 (1K/2K输出，官方1K和2K同价)
  IMAGE_OUTPUT_4K_USD: 0.24, // $0.24/张 (4K输出)

  // 换算比例
  CNY_PER_USD: 7.2, // 1 USD = 7.2 人民币
  CREDITS_PER_CNY: 10, // 1 人民币 = 10 积分
  MARKUP_MULTIPLIER: 2, // 302.AI 积分翻倍
};

// 计算最终积分: (USD × 7.2 × 10 × 2) = USD × 144
const calculatePriceInCredits = (usdPrice: number): number => {
  return Math.ceil(
    usdPrice *
      PRICING.CNY_PER_USD *
      PRICING.CREDITS_PER_CNY *
      PRICING.MARKUP_MULTIPLIER
  );
};

// 输出分辨率类型
export type OutputResolution = "1k" | "2k" | "4k";

// 宽高比类型
export type AspectRatio =
  | "1:1"
  | "3:2"
  | "2:3"
  | "16:9"
  | "9:16"
  | "4:3"
  | "3:4"
  | "21:9";

// 输出分辨率选项配置
// 积分 = (输入价格 + 输出价格) × 144 向上取整，2K 加收 20% 浮动
export const RESOLUTION_OPTIONS: {
  value: OutputResolution;
  label: string;
  description: string;
  credits: number;
}[] = [
  {
    value: "1k",
    label: "1K 标准",
    description: "1024px，适合网页展示",
    credits: calculatePriceInCredits(
      PRICING.IMAGE_INPUT_USD + PRICING.IMAGE_OUTPUT_1K_USD
    ), // ≈ 20 积分
  },
  {
    value: "2k",
    label: "2K 高清",
    description: "2048px，推荐选择",
    credits: Math.ceil(
      calculatePriceInCredits(
        PRICING.IMAGE_INPUT_USD + PRICING.IMAGE_OUTPUT_2K_USD
      ) * 1.2
    ), // ≈ 24 积分 (加收20%)
  },
  {
    value: "4k",
    label: "4K 超清",
    description: "4096px，最佳画质",
    credits: calculatePriceInCredits(
      PRICING.IMAGE_INPUT_USD + PRICING.IMAGE_OUTPUT_4K_USD
    ), // ≈ 35 积分
  },
];

// 宽高比选项配置
export const ASPECT_RATIO_OPTIONS: {
  value: AspectRatio;
  label: string;
  description: string;
}[] = [
  { value: "1:1", label: "1:1", description: "正方形" },
  { value: "3:2", label: "3:2", description: "横向标准" },
  { value: "2:3", label: "2:3", description: "纵向标准" },
  { value: "4:3", label: "4:3", description: "横向经典" },
  { value: "3:4", label: "3:4", description: "纵向经典" },
  { value: "16:9", label: "16:9", description: "横向宽屏" },
  { value: "9:16", label: "9:16", description: "纵向宽屏" },
  { value: "21:9", label: "21:9", description: "超宽屏" },
];

/**
 * 根据输出分辨率计算单张图片所需积分
 * @param resolution 输出分辨率
 * @returns 所需积分数
 */
export function calculateCredits(resolution: OutputResolution): number {
  const option = RESOLUTION_OPTIONS.find((opt) => opt.value === resolution);
  return option?.credits || RESOLUTION_OPTIONS[1].credits; // 默认2K
}

/**
 * 批量计算图片所需积分
 * @param imageCount 待处理图片数量
 * @param resolution 输出分辨率
 * @returns 总积分
 */
export function calculateTotalCredits(
  imageCount: number,
  resolution: OutputResolution
): number {
  return imageCount * calculateCredits(resolution);
}

// 固定的水下照片增强提示词
const UNDERWATER_ENHANCEMENT_PROMPT =
  "将这张水下照片进行图像处理，做成高保真，高分辨率，摄影级的照片，可以对图像进行一定程度美化。";

// 水下照片增强模型类型
export type UnderwaterModel =
  | "gemini-3-pro-image-preview"
  | "gemini-3-pro-image-preview-chat";

// 模型选项配置
export const MODEL_OPTIONS: {
  value: UnderwaterModel;
  label: string;
  description: string;
}[] = [
  {
    value: "gemini-3-pro-image-preview",
    label: "Gemini 3 Pro",
    description: "简化格式，推荐使用",
  },
  {
    value: "gemini-3-pro-image-preview-chat",
    label: "Gemini 3 Pro (Chat)",
    description: "OpenAI兼容格式",
  },
];

// 默认模型
export const DEFAULT_MODEL: UnderwaterModel = "gemini-3-pro-image-preview";

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
  const { credits, updateCredits, checkCredits } = useCredits();

  // 将File转换为base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // 压缩图片（如果超过指定大小）
  const compressImage = async (
    base64: string,
    maxSizeKB: number = 2000
  ): Promise<string> => {
    // 估算当前大小
    const currentSizeKB = Math.round((base64.length * 0.75) / 1024);

    // 如果已经小于目标大小，直接返回
    if (currentSizeKB <= maxSizeKB) {
      return base64;
    }

    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          reject(new Error("无法创建 canvas context"));
          return;
        }

        // 计算压缩比例
        const ratio = Math.sqrt(maxSizeKB / currentSizeKB);
        const newWidth = Math.round(img.width * ratio);
        const newHeight = Math.round(img.height * ratio);

        canvas.width = newWidth;
        canvas.height = newHeight;

        // 绘制压缩后的图片
        ctx.drawImage(img, 0, 0, newWidth, newHeight);

        // 转换为 base64，使用 JPEG 格式并调整质量
        let quality = 0.85;
        let result = canvas.toDataURL("image/jpeg", quality);

        // 如果还是太大，降低质量
        while ((result.length * 0.75) / 1024 > maxSizeKB && quality > 0.3) {
          quality -= 0.1;
          result = canvas.toDataURL("image/jpeg", quality);
        }

        console.log(
          `图片压缩: ${currentSizeKB}KB -> ${Math.round((result.length * 0.75) / 1024)}KB`
        );
        resolve(result);
      };
      img.onerror = () => reject(new Error("图片加载失败"));
      img.src = base64;
    });
  };

  // 处理单张图片
  const processImage = async (
    image: UploadedImage,
    model: UnderwaterModel = DEFAULT_MODEL,
    outputResolution: OutputResolution = "2k",
    aspectRatio: AspectRatio = "1:1"
  ): Promise<{
    success: boolean;
    result?: string;
    error?: string;
    historyId?: string;
    creditsUsed?: number;
    insufficientCredits?: boolean;
  }> => {
    let historyId: string | undefined;

    try {
      // 根据用户选择的输出分辨率计算积分
      const creditsToDeduct = calculateCredits(outputResolution);

      // 检查积分是否足够
      const creditCheck = checkCredits(creditsToDeduct);
      if (!creditCheck.sufficient) {
        return {
          success: false,
          error: `积分不足，当前余额 ${creditCheck.currentCredits}，需要 ${creditsToDeduct} 积分，请先充值`,
          insufficientCredits: true,
        };
      }

      // 转换为base64
      const rawBase64 = await fileToBase64(image.file);

      // 压缩图片（限制为 2MB 以避免网络传输问题）
      const base64 = await compressImage(rawBase64, 2000);

      // 上传原始图片到 OBS（使用压缩后的版本）
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

      // 调用API处理（使用压缩后的图片）
      let result: any;
      try {
        result = await genImgWithImg({
          img: base64,
          prompt: UNDERWATER_ENHANCEMENT_PROMPT,
          apiKey: apiKey || "",
          model: model,
          outputResolution,
          aspectRatio,
        });
      } catch (apiError: any) {
        // 解析 API 错误信息
        const errorMsg =
          apiError?.apiError?.message_cn ||
          apiError?.apiError?.message ||
          apiError?.message ||
          "图像处理失败";
        throw new Error(errorMsg);
      }

      // 检查是否返回了错误
      if (result.error) {
        const errorMsg =
          result.error.message_cn || result.error.message || "图像处理失败";
        throw new Error(errorMsg);
      }

      let enhancedImage: string;
      let enhancedImageUrl: string;

      if (result.image?.b64_json) {
        // API 返回 base64 数据（现在应该包含完整的 data URL）
        enhancedImage = result.image.b64_json;

        // 上传增强后的图片到 OBS
        try {
          enhancedImageUrl = await uploadToObs(enhancedImage);
        } catch (uploadError) {
          console.error("OBS 上传失败:", uploadError);
          throw new Error("图片保存失败，请重试");
        }
      } else if (result.image?.url) {
        // API 返回 URL（可能是外部 URL）
        // 目前先直接使用 API 的 URL
        enhancedImageUrl = result.image.url;
      } else {
        console.error("API返回数据格式错误:", result);
        throw new Error("图像处理返回异常，请重试");
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

      // 根据用户选择的输出分辨率扣除积分
      const resolutionLabel =
        RESOLUTION_OPTIONS.find((opt) => opt.value === outputResolution)
          ?.label || outputResolution.toUpperCase();
      const creditResult = await updateCredits(
        -creditsToDeduct,
        "consume",
        `水下照片增强处理 (${resolutionLabel})`
      );

      // 如果积分扣减失败（可能是并发导致积分不足）
      if (!creditResult.success) {
        console.error("积分扣减失败:", creditResult.error);
        // 图片已处理成功但积分不足，仍然返回成功结果
        // 但记录警告日志，后续可以考虑补扣或其他处理
        console.warn("图片处理成功但积分扣减失败，用户可能需要补充积分");
      }

      // 返回 OBS URL 或 base64
      return {
        success: true,
        result: enhancedImageUrl,
        historyId,
        creditsUsed: creditsToDeduct,
      };
    } catch (error) {
      console.error("处理失败:", error);

      // 如果历史记录已创建，更新为失败状态
      if (historyId !== undefined) {
        try {
          // 获取原始图片的 base64（如果还没转换则转换）
          const base64 = image.preview || (await fileToBase64(image.file));
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
      outputResolution: OutputResolution,
      aspectRatio: AspectRatio,
      onProgress: (updatedImages: UploadedImage[]) => void
    ) => {
      if (generationCount.generationCount >= 4) {
        toast.warning("已达到最大并发处理数量，请稍后再试");
        return;
      }

      // 检查总积分是否足够处理所有图片
      const totalCreditsNeeded = calculateTotalCredits(
        images.length,
        outputResolution
      );
      const creditCheck = checkCredits(totalCreditsNeeded);
      if (!creditCheck.sufficient) {
        toast.error(
          `积分不足！当前余额 ${creditCheck.currentCredits}，处理 ${images.length} 张图片需要 ${totalCreditsNeeded} 积分，请先充值`
        );
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

        const result = await processImage(
          images[index],
          model,
          outputResolution,
          aspectRatio
        );

        if (result.success && result.result) {
          updatedImages[index].status = "success";
          updatedImages[index].result = result.result;
          toast.success(`${images[index].file.name} 处理完成`);
        } else {
          updatedImages[index].status = "failed";
          updatedImages[index].error = result.error;
          // 如果是积分不足，显示特殊提示
          if (result.insufficientCredits) {
            toast.error(`积分不足，请充值后继续处理`);
          } else {
            toast.error(
              `${images[index].file.name}: ${result.error || "处理失败"}`
            );
          }
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
    [apiKey, generationCount.generationCount, setGenerationCount, checkCredits]
  );

  return {
    isProcessing,
    processImage,
    processImages,
    checkCredits,
    credits,
  };
}
