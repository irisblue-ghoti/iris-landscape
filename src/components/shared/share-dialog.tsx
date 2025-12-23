"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { QRCodeSVG } from "qrcode.react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Copy, Check, Loader2, Share2 } from "lucide-react";
import { toast } from "sonner";
import { useShare, type ExpiresOption } from "@/hooks/use-share";

interface ShareDialogProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  isBatch?: boolean;
  imageUrls?: string[];
}

export function ShareDialog({
  isOpen,
  onClose,
  imageUrl,
  isBatch = false,
  imageUrls = [],
}: ShareDialogProps) {
  const t = useTranslations("share");
  const { shareImage, shareImages, isSharing } = useShare();
  const [expires, setExpires] = useState<ExpiresOption>("7d");
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateShare = useCallback(async () => {
    setIsGenerating(true);
    try {
      let result;
      if (isBatch && imageUrls.length > 0) {
        result = await shareImages(imageUrls, expires);
      } else {
        result = await shareImage(imageUrl, expires);
      }

      if (result.success && result.shareUrl) {
        setShareUrl(result.shareUrl);
      } else {
        toast.error(result.error || t("error.generate_failed"));
      }
    } catch (error) {
      toast.error(t("error.generate_failed"));
    } finally {
      setIsGenerating(false);
    }
  }, [imageUrl, imageUrls, isBatch, expires, shareImage, shareImages, t]);

  const handleCopy = useCallback(async () => {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success(t("success.copied"));
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error(t("error.copy_failed"));
    }
  }, [shareUrl, t]);

  const handleClose = useCallback(() => {
    setShareUrl(null);
    setCopied(false);
    onClose();
  }, [onClose]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            {isBatch ? t("batch_share") : t("button")}
          </DialogTitle>
          <DialogDescription>
            {isBatch
              ? t("dialog.batch_description", { count: imageUrls.length })
              : t("dialog.description")}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          {/* 有效期选择 */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{t("expires")}:</span>
            <Select
              value={expires}
              onValueChange={(value) => setExpires(value as ExpiresOption)}
              disabled={!!shareUrl}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1h">{t("expires_1h")}</SelectItem>
                <SelectItem value="24h">{t("expires_24h")}</SelectItem>
                <SelectItem value="7d">{t("expires_7d")}</SelectItem>
                <SelectItem value="30d">{t("expires_30d")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 生成按钮 或 结果展示 */}
          {!shareUrl ? (
            <Button
              onClick={handleGenerateShare}
              disabled={isGenerating || isSharing}
              className="w-full"
            >
              {isGenerating || isSharing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("dialog.generating")}
                </>
              ) : (
                t("dialog.generate")
              )}
            </Button>
          ) : (
            <>
              {/* 二维码 */}
              <div className="flex justify-center rounded-lg bg-white p-4">
                <QRCodeSVG
                  value={shareUrl}
                  size={180}
                  level="M"
                  includeMargin={true}
                />
              </div>

              {/* 链接输入框和复制按钮 */}
              <div className="flex items-center gap-2">
                <Input
                  value={shareUrl}
                  readOnly
                  className="flex-1 text-sm"
                />
                <Button
                  size="icon"
                  variant="outline"
                  onClick={handleCopy}
                  className="shrink-0"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>

              {/* 提示文本 */}
              <p className="text-center text-xs text-muted-foreground">
                {t("dialog.scan_or_copy")}
              </p>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
