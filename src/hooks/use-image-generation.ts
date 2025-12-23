import { useState } from "react";
import { useAtom } from "jotai";
import { generationStoreAtom } from "@/stores/slices/generation_store";
import { appConfigAtom, store } from "@/stores";
import { toast } from "sonner";
import { useHistory } from "@/hooks/db/use-gen-history";
import { generateImage } from "@/services/gen-img";
import { genImgWithImg } from "@/services/gen-img-with-img";
import { useTranslations } from "next-intl";
type ImageGenerationOptions = {
  rawPrompt?: string;
  prompt: string;
  imageData?: string;
  shouldUseImageInput?: boolean;
  type?: string;
  size?: "1024x1024" | "1536x1024" | "1024x1536";
  model?: string;
  sourceLang?: "ZH" | "EN";
};

export function useImageGeneration() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationCount, setGenerationCount] = useAtom(generationStoreAtom);
  const { apiKey } = store.get(appConfigAtom);
  const { addHistory, updateHistory } = useHistory();
  const t = useTranslations();
  const generateWithImage = async (options: ImageGenerationOptions) => {
    if (generationCount.generationCount >= 4) {
      toast.warning(t("global.error.max_generation"));
      return null;
    }

    setIsGenerating(true);
    setGenerationCount((prev) => ({
      ...prev,
      loading: true,
      generationCount: prev.generationCount + 1,
    }));

    let historyId = "";
    try {
      historyId = await addHistory({
        rawPrompt: options.rawPrompt || "",
        shouldOptimize: false,
        image: {
          base64: "",
          prompt: options.prompt,
          model: options.model || "",
          status: "pending",
          type: options.type,
        },
      });

      if (options.shouldUseImageInput && options.imageData) {
        const { image }: any = await genImgWithImg({
          img: options.imageData,
          prompt: options.prompt,
          apiKey: apiKey || "",
          size: options.size,
          model: options.model,
          sourceLang: options.sourceLang,
        });

        // 处理 base64 数据：检查是否已经包含 data URL 前缀
        let base64Data = "";
        if (image.b64_json) {
          // 如果已经是完整的 data URL，直接使用
          if (image.b64_json.startsWith("data:")) {
            base64Data = image.b64_json;
          } else {
            // 否则添加前缀
            base64Data = `data:image/png;base64,${image.b64_json}`;
          }
        } else if (image.url) {
          base64Data = image.url;
        }

        updateHistory(historyId, {
          rawPrompt: options.rawPrompt || "",
          shouldOptimize: false,
          image: {
            base64: base64Data,
            prompt: options.prompt,
            model: options.model || "",
            status: "success",
            type: options.type,
          },
        });

        return image;
      } else {
        const { image }: any = await generateImage({
          prompt: options.prompt,
          apiKey: apiKey || "",
          model: options.model,
          sourceLang: options.sourceLang,
        });

        updateHistory(historyId, {
          rawPrompt: options.rawPrompt || "",
          shouldOptimize: false,
          image: {
            base64: "data:image/png;base64," + image.images[0].base64Data,
            prompt: options.prompt,
            model: options.model || "",
            status: "success",
            type: options.type,
          },
        });

        return image;
      }
    } catch (error) {
      console.error(error);
      toast.error(t("global.error.generate_failed"));
      updateHistory(historyId, {
        rawPrompt: options.rawPrompt || "",
        shouldOptimize: false,
        image: {
          base64: "",
          prompt: "",
          model: "",
          status: "failed",
          type: options.type,
        },
      });
      return null;
    } finally {
      setIsGenerating(false);
      setGenerationCount((prev) => ({
        ...prev,
        generationCount: Math.max(prev.generationCount - 1, 0),
        loading: false,
      }));
    }
  };

  return {
    isGenerating,
    generateWithImage,
  };
}
