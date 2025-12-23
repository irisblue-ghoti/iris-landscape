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
import { Play, Download, Loader2, CheckCircle, XCircle, Share2 } from "lucide-react";
import {
  useUnderwaterEnhancement,
  UNDERWATER_MODELS,
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
    useState<UnderwaterModel>("gemini-3-pro-image-preview");

  // Share dialog state
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [shareImageUrl, setShareImageUrl] = useState<string>("");
  const [isBatchShare, setIsBatchShare] = useState(false);
  const [shareImageUrls, setShareImageUrls] = useState<string[]>([]);

  useEffect(() => {
    setQueue(images);
  }, [images]);

  const handleStartProcessing = async () => {
    await processImages(queue, selectedModel, (updatedImages) => {
      setQueue(updatedImages);
      onImagesUpdate(updatedImages);
    });
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
  const completedCount = queue.filter(
    (img) => img.status === "success"
  ).length;
  const failedCount = queue.filter((img) => img.status === "failed").length;

  if (queue.length === 0) {
    return null;
  }

  return (
    <Card className="p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex-1">
          <h3 className="text-lg font-medium">
            {t("underwater.queue.title") || "处理队列"}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            待处理 {pendingCount} | 处理中 {processingCount} | 已完成{" "}
            {completedCount} | 失败 {failedCount}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* 模型选择器 */}
          <Select
            value={selectedModel}
            onValueChange={(value) => setSelectedModel(value as UnderwaterModel)}
            disabled={isProcessing}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="选择模型" />
            </SelectTrigger>
            <SelectContent>
              {UNDERWATER_MODELS.map((model) => (
                <SelectItem key={model.value} value={model.value}>
                  <div className="flex flex-col">
                    <span className="font-medium">{model.label}</span>
                    <span className="text-xs text-muted-foreground">
                      {model.description}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            onClick={handleStartProcessing}
            disabled={isProcessing || pendingCount === 0}
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {t("underwater.queue.processing_status") || "处理中..."}
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                {t("underwater.queue.start") || "开始处理"}
              </>
            )}
          </Button>

          {/* 批量分享按钮 */}
          {successfulUrls.length > 0 && (
            <Button variant="outline" onClick={handleBatchShare} disabled={isSharing}>
              {isSharing ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Share2 className="h-4 w-4 mr-2" />
              )}
              {shareT("batch_share")} ({successfulUrls.length})
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
        {queue.map((image) => (
          <div
            key={image.id}
            className="flex items-center gap-4 p-4 rounded-lg border"
          >
            {/* 原图预览 */}
            <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0 border">
              <Image
                src={image.preview}
                alt="原图"
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            </div>

            {/* 文件信息 */}
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{image.file.name}</p>
              <p className="text-sm text-muted-foreground">
                {(image.file.size / 1024 / 1024).toFixed(2)} MB
              </p>
              {image.error && (
                <p className="text-xs text-red-500 mt-1">{image.error}</p>
              )}
            </div>

            {/* 状态 */}
            <div className="flex items-center gap-2 flex-shrink-0">
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
              <div className="flex items-center gap-2 flex-shrink-0">
                <Button size="sm" variant="outline" asChild>
                  <a href={image.result} download={`enhanced_${image.file.name}`}>
                    <Download className="h-4 w-4 mr-1" />
                    下载
                  </a>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleSingleShare(image.result!)}
                >
                  <Share2 className="h-4 w-4 mr-1" />
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
          <div className="flex justify-between text-sm mb-2">
            <span>
              {t("underwater.queue.overall_progress") || "整体进度"}
            </span>
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
