"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Play,
  Download,
  Loader2,
  CheckCircle,
  XCircle,
  Share2,
  Coins,
} from "lucide-react";
import {
  useUnderwaterEnhancement,
  calculateTotalCredits,
  RESOLUTION_OPTIONS,
  ASPECT_RATIO_OPTIONS,
  MODEL_OPTIONS,
  DEFAULT_MODEL,
  type OutputResolution,
  type AspectRatio,
  type UnderwaterModel,
} from "../hooks/use-underwater-enhancement";
import { useShare } from "@/hooks/use-share";
import { ShareDialog } from "@/components/shared/share-dialog";
import type { UploadedImage } from "./underwater-uploader";
import Image from "next/image";
import { useTranslations } from "next-intl";

interface Props {
  images: UploadedImage[];
  onComplete: () => void;
  onImagesUpdate: (images: UploadedImage[]) => void;
}

export function ProcessingQueue({ images, onComplete, onImagesUpdate }: Props) {
  const t = useTranslations();
  const shareT = useTranslations("share");
  const { processImages, isProcessing } = useUnderwaterEnhancement();
  const { isSharing } = useShare();
  const [queue, setQueue] = useState<UploadedImage[]>(images);
  const [selectedModel, setSelectedModel] =
    useState<UnderwaterModel>(DEFAULT_MODEL);

  // 输出分辨率选择（默认2K）
  const [outputResolution, setOutputResolution] =
    useState<OutputResolution>("2k");
  // 宽高比选择（默认16:9）
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("16:9");

  // Share dialog state
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [shareImageUrl, setShareImageUrl] = useState<string>("");
  const [isBatchShare, setIsBatchShare] = useState(false);
  const [shareImageUrls, setShareImageUrls] = useState<string[]>([]);

  // 预估积分状态
  const [estimatedCredits, setEstimatedCredits] = useState<number>(0);

  useEffect(() => {
    setQueue(images);
  }, [images]);

  // 根据分辨率和待处理图片数量计算预估积分
  useEffect(() => {
    const pendingCount = queue.filter((img) => img.status === "pending").length;
    const total = calculateTotalCredits(pendingCount, outputResolution);
    setEstimatedCredits(total);
  }, [queue, outputResolution]);

  const handleStartProcessing = async () => {
    await processImages(
      queue,
      selectedModel,
      outputResolution,
      aspectRatio,
      (updatedImages) => {
        setQueue(updatedImages);
        onImagesUpdate(updatedImages);
      }
    );
    onComplete();
  };

  // 获取所有成功处理的图片 URL
  const successfulUrls = queue
    .filter((img) => img.status === "success" && img.result)
    .map((img) => img.result!);

  // 批量分享处理
  const handleBatchShare = () => {
    if (successfulUrls.length === 0) return;
    setShareImageUrls(successfulUrls);
    setIsBatchShare(true);
    setIsShareDialogOpen(true);
  };

  // 单个分享处理
  const handleSingleShare = (imageUrl: string) => {
    setShareImageUrl(imageUrl);
    setIsBatchShare(false);
    setIsShareDialogOpen(true);
  };

  const pendingCount = queue.filter((img) => img.status === "pending").length;
  const processingCount = queue.filter(
    (img) => img.status === "processing"
  ).length;
  const completedCount = queue.filter((img) => img.status === "success").length;
  const failedCount = queue.filter((img) => img.status === "failed").length;

  if (queue.length === 0) {
    return null;
  }

  return (
    <Card className="p-6">
      <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex-1">
          <h3 className="text-lg font-medium">
            {t("underwater.queue.title") || "处理队列"}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            待处理 {pendingCount} | 处理中 {processingCount} | 已完成{" "}
            {completedCount} | 失败 {failedCount}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* 模型选择器 */}
          {pendingCount > 0 && (
            <Select
              value={selectedModel}
              onValueChange={(value) =>
                setSelectedModel(value as UnderwaterModel)
              }
              disabled={isProcessing}
            >
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="选择模型" />
              </SelectTrigger>
              <SelectContent>
                {MODEL_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex flex-col">
                      <span className="font-medium">{option.label}</span>
                      <span className="text-xs text-muted-foreground">
                        {option.description}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {/* 分辨率选择器 */}
          {pendingCount > 0 && (
            <Select
              value={outputResolution}
              onValueChange={(value) =>
                setOutputResolution(value as OutputResolution)
              }
              disabled={isProcessing}
            >
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="输出分辨率" />
              </SelectTrigger>
              <SelectContent>
                {RESOLUTION_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center justify-between gap-4">
                      <span className="font-medium">{option.label}</span>
                      <span className="text-xs text-muted-foreground">
                        {option.credits} 积分
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {/* 宽高比选择器 */}
          {pendingCount > 0 && (
            <Select
              value={aspectRatio}
              onValueChange={(value) => setAspectRatio(value as AspectRatio)}
              disabled={isProcessing}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="宽高比" />
              </SelectTrigger>
              <SelectContent>
                {ASPECT_RATIO_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{option.label}</span>
                      <span className="text-xs text-muted-foreground">
                        {option.description}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {/* 预估积分消耗 */}
          {pendingCount > 0 && (
            <div className="flex items-center gap-2 rounded-lg border bg-amber-50 px-4 py-2 dark:border-amber-800 dark:bg-amber-950/50">
              <Coins className="h-4 w-4 text-amber-500" />
              <span className="text-sm font-medium text-amber-700 dark:text-amber-400">
                预估消耗: {estimatedCredits} 积分
              </span>
            </div>
          )}

          <Button
            onClick={handleStartProcessing}
            disabled={isProcessing || pendingCount === 0}
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("underwater.queue.processing_status") || "处理中..."}
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                {t("underwater.queue.start") || "开始处理"}
              </>
            )}
          </Button>

          {/* 批量分享按钮 */}
          {successfulUrls.length > 0 && (
            <Button
              variant="outline"
              onClick={handleBatchShare}
              disabled={isSharing}
            >
              {isSharing ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Share2 className="mr-2 h-4 w-4" />
              )}
              {shareT("batch_share")} ({successfulUrls.length})
            </Button>
          )}
        </div>
      </div>

      <div className="max-h-[500px] space-y-3 overflow-y-auto pr-2">
        {queue.map((image) => (
          <div
            key={image.id}
            className="flex items-center gap-4 rounded-lg border p-4"
          >
            {/* 原图预览 */}
            <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded border">
              <Image
                src={image.preview}
                alt="原图"
                width={64}
                height={64}
                className="h-full w-full object-cover"
              />
            </div>

            {/* 文件信息 */}
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">{image.file.name}</p>
              <p className="text-sm text-muted-foreground">
                {(image.file.size / 1024 / 1024).toFixed(2)} MB
              </p>
              {image.error && (
                <p className="mt-1 text-xs text-red-500">{image.error}</p>
              )}
            </div>

            {/* 状态 */}
            <div className="flex flex-shrink-0 items-center gap-2">
              {image.status === "pending" && (
                <span className="text-sm text-muted-foreground">等待中</span>
              )}
              {image.status === "processing" && (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                  <span className="text-sm text-blue-500">处理中</span>
                </>
              )}
              {image.status === "success" && (
                <>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-500">完成</span>
                </>
              )}
              {image.status === "failed" && (
                <>
                  <XCircle className="h-4 w-4 text-red-500" />
                  <span className="text-sm text-red-500">失败</span>
                </>
              )}
            </div>

            {/* 操作按钮 */}
            {image.status === "success" && image.result && (
              <div className="flex flex-shrink-0 items-center gap-2">
                <Button size="sm" variant="outline" asChild>
                  <a
                    href={image.result}
                    download={`enhanced_${image.file.name}`}
                  >
                    <Download className="mr-1 h-4 w-4" />
                    下载
                  </a>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleSingleShare(image.result!)}
                >
                  <Share2 className="mr-1 h-4 w-4" />
                  {shareT("button")}
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 总体进度 */}
      {isProcessing && (
        <div className="mt-6">
          <div className="mb-2 flex justify-between text-sm">
            <span>{t("underwater.queue.overall_progress") || "整体进度"}</span>
            <span>
              {completedCount + failedCount} / {queue.length}
            </span>
          </div>
          <Progress
            value={((completedCount + failedCount) / queue.length) * 100}
          />
        </div>
      )}

      {/* 分享弹窗 */}
      <ShareDialog
        isOpen={isShareDialogOpen}
        onClose={() => setIsShareDialogOpen(false)}
        imageUrl={shareImageUrl}
        isBatch={isBatchShare}
        imageUrls={shareImageUrls}
      />
    </Card>
  );
}
