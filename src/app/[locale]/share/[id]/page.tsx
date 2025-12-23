"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, Loader2, ImageOff, Clock, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { ShareLanguageSwitcher } from "./share-language-switcher";
import { GLOBAL } from "@/constants/values";

interface ShareData {
  id: string;
  urls: string[];
  expiresAt: string;
  createdAt: string;
}

export default function SharePage() {
  const params = useParams();
  const router = useRouter();
  const shareId = params.id as string;
  const locale = useLocale();
  const t = useTranslations("sharePage");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [shareData, setShareData] = useState<ShareData | null>(null);
  const [downloadingIndex, setDownloadingIndex] = useState<number | null>(null);
  const [downloadingAll, setDownloadingAll] = useState(false);
  const [downloadedItems, setDownloadedItems] = useState<Set<number>>(new Set());

  // Auto-detect browser language and redirect if needed
  useEffect(() => {
    const detectAndRedirect = () => {
      // Get browser language
      const browserLang = navigator.language.split("-")[0];
      const supportedLocales = GLOBAL.LOCALE.SUPPORTED;

      // Check if the browser language is supported and different from current
      if (supportedLocales.includes(browserLang) && browserLang !== locale) {
        // Check if user has already set a preference (don't override)
        const hasLanguagePreference = sessionStorage.getItem("share_lang_preference");
        if (!hasLanguagePreference) {
          // Mark that we've auto-detected, so we don't redirect again
          sessionStorage.setItem("share_lang_preference", "auto");
          router.replace(`/${browserLang}/share/${shareId}`);
        }
      }
    };

    detectAndRedirect();
  }, [locale, router, shareId]);

  useEffect(() => {
    const fetchShareData = async () => {
      try {
        const response = await fetch(`/api/share/batch?id=${shareId}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || t("error.load_failed"));
        }

        setShareData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : t("error.load_failed"));
      } finally {
        setLoading(false);
      }
    };

    if (shareId) {
      fetchShareData();
    }
  }, [shareId, t]);

  const downloadImage = async (url: string, index: number) => {
    setDownloadingIndex(index);
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = `image-${index + 1}.${blob.type.split("/")[1] || "jpg"}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(downloadUrl);

      setDownloadedItems(prev => new Set(prev).add(index));
      toast.success(t("success.downloaded"));
    } catch (err) {
      toast.error(t("error.download_failed"));
    } finally {
      setDownloadingIndex(null);
    }
  };

  const downloadAll = async () => {
    if (!shareData) return;

    setDownloadingAll(true);
    try {
      for (let i = 0; i < shareData.urls.length; i++) {
        await downloadImage(shareData.urls[i], i);
        // Small delay between downloads
        if (i < shareData.urls.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }
      toast.success(t("success.all_downloaded"));
    } catch (err) {
      toast.error(t("error.download_failed"));
    } finally {
      setDownloadingAll(false);
    }
  };

  const formatExpiresAt = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const isExpired = shareData ? new Date(shareData.expiresAt) < new Date() : false;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-50 to-blue-50 dark:from-slate-950 dark:to-slate-900">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-sky-500" />
          <p className="text-lg text-slate-600 dark:text-slate-400">{t("loading")}</p>
        </div>
      </div>
    );
  }

  if (error || !shareData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-50 to-blue-50 dark:from-slate-950 dark:to-slate-900">
        <Card className="max-w-md">
          <CardContent className="flex flex-col items-center gap-4 p-8">
            <ImageOff className="h-16 w-16 text-slate-400" />
            <h1 className="text-xl font-semibold text-slate-900 dark:text-white">
              {t("error.title")}
            </h1>
            <p className="text-center text-slate-600 dark:text-slate-400">
              {error || t("error.not_found")}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isExpired) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-50 to-blue-50 dark:from-slate-950 dark:to-slate-900">
        <Card className="max-w-md">
          <CardContent className="flex flex-col items-center gap-4 p-8">
            <Clock className="h-16 w-16 text-amber-500" />
            <h1 className="text-xl font-semibold text-slate-900 dark:text-white">
              {t("error.expired_title")}
            </h1>
            <p className="text-center text-slate-600 dark:text-slate-400">
              {t("error.expired_message")}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50 dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md dark:bg-slate-950/80">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-sky-500 to-cyan-500 shadow-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6 text-white"
              >
                <path d="M2 12a5 5 0 0 0 5 5 8 8 0 0 1 5 2 8 8 0 0 1 5-2 5 5 0 0 0 5-5V7h-5a8 8 0 0 0-5 2 8 8 0 0 0-5-2H2Z" />
              </svg>
            </div>
            <span className="text-lg font-bold text-slate-900 dark:text-white">
              {t("title")}
            </span>
          </div>
          <ShareLanguageSwitcher />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Info Bar */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              {t("image_count", { count: shareData.urls.length })}
            </h1>
            <p className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              <Clock className="h-4 w-4" />
              {t("expires_at", { time: formatExpiresAt(shareData.expiresAt) })}
            </p>
          </div>
          <Button
            onClick={downloadAll}
            disabled={downloadingAll}
            className="bg-gradient-to-r from-sky-500 to-cyan-500 text-white hover:from-sky-600 hover:to-cyan-600"
          >
            {downloadingAll ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("downloading_all")}
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                {t("download_all")}
              </>
            )}
          </Button>
        </div>

        {/* Image Grid */}
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {shareData.urls.map((url, index) => (
            <Card
              key={index}
              className="group overflow-hidden transition-all hover:shadow-lg"
            >
              <CardContent className="p-0">
                <div className="relative aspect-square">
                  <Image
                    src={url}
                    alt={`Image ${index + 1}`}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/0 transition-all group-hover:bg-black/30" />

                  {/* Downloaded indicator */}
                  {downloadedItems.has(index) && (
                    <div className="absolute right-2 top-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-white">
                        <CheckCircle2 className="h-5 w-5" />
                      </div>
                    </div>
                  )}

                  {/* Download Button */}
                  <div className="absolute bottom-2 right-2 opacity-0 transition-opacity group-hover:opacity-100">
                    <Button
                      size="sm"
                      onClick={() => downloadImage(url, index)}
                      disabled={downloadingIndex === index}
                      className="bg-white/90 text-slate-900 hover:bg-white"
                    >
                      {downloadingIndex === index ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Download className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                <div className="p-3">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {t("image_label", { number: index + 1 })}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t bg-white/50 py-6 dark:bg-slate-950/50">
        <div className="container mx-auto px-6 text-center text-sm text-slate-500 dark:text-slate-400">
          {t("footer")}
        </div>
      </footer>
    </div>
  );
}
