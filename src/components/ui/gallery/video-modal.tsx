"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { MediaItemType } from "./gallery";
import { Image } from "@/components/ui/image";
import { createImageToVideo } from "@/services/gen-image-to-video";
import { appConfigAtom, store } from "@/stores";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

interface VideoModalProps {
  item: MediaItemType;
  isOpen: boolean;
  onClose: (isOutsideClick?: boolean) => void;
  onVideoGenerated?: (
    taskId: string,
    videoData: {
      prompt: string;
      model: string;
      duration: string;
      sourceImageBase64: string;
    }
  ) => void; // 视频生成成功回调
}

export const VideoModal = ({
  item,
  isOpen,
  onClose,
  onVideoGenerated,
}: VideoModalProps) => {
  const [prompt, setPrompt] = useState("");
  const [model, setModel] = useState("google_veo3_fast_i2v");
  const [duration, setDuration] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const { apiKey } = store.get(appConfigAtom);
  const t = useTranslations();

  // 定义支持时长的模型
  const durationSupportedModels = [
    "kling_21_i2v",
    "kling_21_i2v_hq",
    "minimaxi_hailuo_02_i2v",
  ];

  // 检查当前模型是否支持时长设置
  const isDurationSupported = durationSupportedModels.includes(model);

  // 获取当前模型支持的时长选项
  const getDurationOptions = (modelValue: string) => {
    switch (modelValue) {
      case "kling_21_i2v":
      case "kling_21_i2v_hq":
        return [
          { value: "5", label: "5秒" },
          { value: "10", label: "10秒" },
        ];
      case "minimaxi_hailuo_02_i2v":
        return [
          { value: "6", label: "6秒" },
          { value: "10", label: "10秒" },
        ];
      default:
        return [];
    }
  };

  // 当模型改变时重置时长
  const handleModelChange = (newModel: string) => {
    setModel(newModel);
    setDuration(""); // 重置时长
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      // TODO: 显示错误提示 - 需要输入提示词
      toast(t("common.enterPrompt"));
      return;
    }

    if (isDurationSupported && !duration) {
      // TODO: 显示错误提示 - 需要选择时长
      toast(t("common.enterDuration"));

      return;
    }

    if (!apiKey) {
      // TODO: 显示错误提示 - 需要 API Key
      return;
    }

    try {
      setIsGenerating(true);

      const videoParams: any = {
        apiKey,
        prompt,
        model,
        image: item.base64 || item.url || "",
      };

      // 只有支持时长的模型才添加 duration 参数
      if (isDurationSupported && duration) {
        videoParams.duration = duration;
      }

      const result = await createImageToVideo(videoParams);

      // 视频生成成功，通知父组件添加到我的资产
      if (result.task_id && onVideoGenerated) {
        onVideoGenerated(result.task_id, {
          prompt,
          model,
          duration,
          sourceImageBase64: item.base64 || item.url || "",
        });
      }

      // 关闭模态框
      onClose(false);

      console.log("Video generation initiated:", result);
    } catch (error) {
      console.error("Video generation failed:", error);
      // 错误已经在 createImageToVideo 中通过 emitter 处理了
    } finally {
      setIsGenerating(false);
    }
  };
  const handleClose = (open: boolean) => {
    if (!open) {
      // 这是通过按钮关闭，不需要阻止事件
      onClose(false);
    }
  };

  const handlePointerDownOutside = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    // 使用 requestAnimationFrame 延迟执行，确保当前事件处理完成
    requestAnimationFrame(() => {
      // 这是通过外部点击关闭，需要阻止事件
      onClose(true);
    });
  };

  const handleInteractOutside = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <Dialog modal open={isOpen} onOpenChange={handleClose}>
      <DialogContent
        className="max-w-4xl"
        onClick={(e) => e.stopPropagation()}
        onPointerDownOutside={handlePointerDownOutside}
        onInteractOutside={handleInteractOutside}
      >
        <DialogHeader>
          <DialogTitle>{t("common.genVideo")}</DialogTitle>
        </DialogHeader>
        <div className="flex gap-6">
          {/* Left side - Image preview */}
          <div className="flex h-96 w-96 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-gray-100 dark:bg-gray-800">
            <Image
              src={item.url}
              base64={item.base64}
              alt={item.title || "Image"}
              className="max-h-full max-w-full object-contain"
            />
          </div>

          {/* Right side - Controls */}
          <div className="min-w-0 flex-1">
            <div className="space-y-6 rounded-lg bg-white p-6 dark:bg-gray-900">
              {/* 提示词 */}
              <div className="space-y-2">
                <Label htmlFor="prompt">{t("common.prompt")}</Label>
                <Textarea
                  id="prompt"
                  placeholder={t("common.promptPlaceHolder")}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-[100px] resize-none"
                />
              </div>

              {/* 模型选择 */}
              <div className="space-y-2">
                <Label htmlFor="model">{t("common.modelSelect")}</Label>
                <Select value={model} onValueChange={handleModelChange}>
                  <SelectTrigger>
                    <SelectValue placeholder={t("common.model")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="google_veo3_fast_i2v">
                      veo-3-fast
                    </SelectItem>
                    <SelectItem value="google_veo3_pro_i2v">
                      veo-3-pro
                    </SelectItem>
                    <SelectItem value="kling_21_i2v">kling2.1</SelectItem>
                    <SelectItem value="kling_21_i2v_hq">kling2.1 HQ</SelectItem>
                    <SelectItem value="minimaxi_hailuo_02_i2v">
                      minimax-hailuo-02
                    </SelectItem>
                    <SelectItem value="midjourney_i2v">midjourney</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* 时长选择 - 只在支持的模型下显示 */}
              {isDurationSupported && (
                <div className="space-y-2">
                  <Label htmlFor="duration">{t("common.duration")}</Label>
                  <Select value={duration} onValueChange={setDuration}>
                    <SelectTrigger>
                      <SelectValue placeholder={t("common.selectDuration")} />
                    </SelectTrigger>
                    <SelectContent>
                      {getDurationOptions(model).map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* 生成按钮 */}
              <div className="flex justify-end">
                <Button
                  className="w-full"
                  onClick={handleGenerate}
                  disabled={isGenerating}
                >
                  {isGenerating ? t("common.genrating") : t("common.gen")}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
