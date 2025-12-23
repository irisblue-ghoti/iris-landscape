import { useState, useCallback } from "react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

export type ExpiresOption = "1h" | "24h" | "7d" | "30d";

interface ShareResult {
  success: boolean;
  shareUrl?: string;
  shareUrls?: string[];
  shareId?: string;
  expiresAt?: string;
  error?: string;
}

/**
 * 分享功能 Hook
 */
export function useShare() {
  const t = useTranslations("share");
  const [isSharing, setIsSharing] = useState(false);

  /**
   * 生成单个图片的分享链接
   */
  const shareImage = useCallback(
    async (url: string, expires: ExpiresOption = "7d"): Promise<ShareResult> => {
      setIsSharing(true);
      try {
        const response = await fetch("/api/share", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url, expires }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || t("error.generate_failed"));
        }

        return {
          success: true,
          shareUrl: data.shareUrl,
          expiresAt: data.expiresAt,
        };
      } catch (error) {
        const message = error instanceof Error ? error.message : t("error.share_failed");
        return { success: false, error: message };
      } finally {
        setIsSharing(false);
      }
    },
    [t]
  );

  /**
   * 批量生成分享链接（聚合链接）
   */
  const shareImages = useCallback(
    async (urls: string[], expires: ExpiresOption = "7d"): Promise<ShareResult> => {
      setIsSharing(true);
      try {
        const response = await fetch("/api/share/batch", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ urls, expires }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || t("error.batch_failed"));
        }

        return {
          success: true,
          shareUrl: data.shareUrl,
          shareId: data.shareId,
          expiresAt: data.expiresAt,
        };
      } catch (error) {
        const message = error instanceof Error ? error.message : t("error.batch_failed");
        return { success: false, error: message };
      } finally {
        setIsSharing(false);
      }
    },
    [t]
  );

  /**
   * 复制到剪贴板
   */
  const copyToClipboard = useCallback(async (text: string): Promise<boolean> => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(t("success.copied"));
      return true;
    } catch (error) {
      toast.error(t("error.copy_failed"));
      return false;
    }
  }, [t]);

  /**
   * 分享并复制单个链接
   */
  const shareAndCopy = useCallback(
    async (url: string, expires: ExpiresOption = "7d"): Promise<boolean> => {
      const result = await shareImage(url, expires);
      if (result.success && result.shareUrl) {
        return copyToClipboard(result.shareUrl);
      }
      toast.error(result.error || t("error.share_failed"));
      return false;
    },
    [shareImage, copyToClipboard, t]
  );

  /**
   * 批量分享并复制聚合链接
   */
  const shareAndCopyAll = useCallback(
    async (urls: string[], expires: ExpiresOption = "7d"): Promise<boolean> => {
      const result = await shareImages(urls, expires);
      if (result.success && result.shareUrl) {
        return copyToClipboard(result.shareUrl);
      }
      toast.error(result.error || t("error.batch_failed"));
      return false;
    },
    [shareImages, copyToClipboard, t]
  );

  return {
    isSharing,
    shareImage,
    shareImages,
    copyToClipboard,
    shareAndCopy,
    shareAndCopyAll,
  };
}
