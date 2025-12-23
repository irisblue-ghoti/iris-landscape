import { useState, useCallback } from "react";
import { toast } from "sonner";

export type ExpiresOption = "1h" | "24h" | "7d" | "30d";

export const EXPIRES_LABELS: Record<ExpiresOption, string> = {
  "1h": "1 小时",
  "24h": "24 小时",
  "7d": "7 天",
  "30d": "30 天",
};

interface ShareResult {
  success: boolean;
  shareUrl?: string;
  shareUrls?: string[];
  expiresAt?: string;
  error?: string;
}

/**
 * 分享功能 Hook
 */
export function useShare() {
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
          throw new Error(data.message || "生成分享链接失败");
        }

        return {
          success: true,
          shareUrl: data.shareUrl,
          expiresAt: data.expiresAt,
        };
      } catch (error) {
        const message = error instanceof Error ? error.message : "分享失败";
        return { success: false, error: message };
      } finally {
        setIsSharing(false);
      }
    },
    []
  );

  /**
   * 批量生成分享链接
   */
  const shareImages = useCallback(
    async (urls: string[], expires: ExpiresOption = "7d"): Promise<ShareResult> => {
      setIsSharing(true);
      try {
        const response = await fetch("/api/share", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ urls, expires }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "批量生成分享链接失败");
        }

        return {
          success: true,
          shareUrls: data.shareUrls,
          expiresAt: data.expiresAt,
        };
      } catch (error) {
        const message = error instanceof Error ? error.message : "批量分享失败";
        return { success: false, error: message };
      } finally {
        setIsSharing(false);
      }
    },
    []
  );

  /**
   * 复制到剪贴板
   */
  const copyToClipboard = useCallback(async (text: string): Promise<boolean> => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("已复制到剪贴板");
      return true;
    } catch (error) {
      toast.error("复制失败");
      return false;
    }
  }, []);

  /**
   * 分享并复制单个链接
   */
  const shareAndCopy = useCallback(
    async (url: string, expires: ExpiresOption = "7d"): Promise<boolean> => {
      const result = await shareImage(url, expires);
      if (result.success && result.shareUrl) {
        return copyToClipboard(result.shareUrl);
      }
      toast.error(result.error || "分享失败");
      return false;
    },
    [shareImage, copyToClipboard]
  );

  /**
   * 批量分享并复制所有链接
   */
  const shareAndCopyAll = useCallback(
    async (urls: string[], expires: ExpiresOption = "7d"): Promise<boolean> => {
      const result = await shareImages(urls, expires);
      if (result.success && result.shareUrls) {
        const allLinks = result.shareUrls.join("\n");
        return copyToClipboard(allLinks);
      }
      toast.error(result.error || "批量分享失败");
      return false;
    },
    [shareImages, copyToClipboard]
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
