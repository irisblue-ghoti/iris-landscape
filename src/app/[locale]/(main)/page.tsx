"use client";
import { useState, useEffect, lazy, Suspense } from "react";
import { UnderwaterUploader } from "./underwater-enhance/components/underwater-uploader";
import { ProcessingQueue } from "./underwater-enhance/components/processing-queue";
import { EnhancementHistory } from "./underwater-enhance/components/enhancement-history";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslations } from "next-intl";
import { useAtom } from "jotai";
import { appConfigAtom } from "@/stores";
import type { UploadedImage } from "./underwater-enhance/components/underwater-uploader";
import { Waves, Sparkles, Loader2 } from "lucide-react";

// 懒加载实时视频页面
const LiveVideoPage = lazy(() => import("./live-video/page"));

export default function MainPage() {
  const t = useTranslations();
  const [{ hideBrand }] = useAtom(appConfigAtom);
  const [activeTab, setActiveTab] = useState<"live" | "upload" | "history">("upload");
  const [images, setImages] = useState<UploadedImage[]>([]);

  useEffect(() => {
    let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }
    link.href = hideBrand ? "/next.ico" : "/favicon.ico";
  }, [hideBrand]);

  const handleImagesAdded = (newImages: UploadedImage[]) => {
    setImages((prev) => [...prev, ...newImages]);
  };

  const handleImageRemoved = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const handleAllImagesCleared = () => {
    setImages([]);
  };

  const handleProcessingComplete = () => {
    setImages([]);
  };

  // 从实时视频页面接收处理的图片
  const handleImagesFromLiveVideo = (newImages: UploadedImage[]) => {
    setImages((prev) => [...prev, ...newImages]);
    // 自动切换到批量处理标签
    setActiveTab("upload");
  };

  return (
    <div className="flex w-full flex-col">
      {/* Hero 区域 */}
      <div className="relative overflow-hidden bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50 dark:from-slate-900 dark:via-blue-950 dark:to-slate-900">
        {/* 装饰性背景 */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-sky-400/10 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />
          <Waves className="absolute top-10 right-20 h-16 w-16 text-sky-200/30 dark:text-sky-800/30" />
          <Waves className="absolute bottom-10 left-20 h-12 w-12 text-cyan-200/30 dark:text-cyan-800/30" />
        </div>

        <div className="container relative mx-auto px-6 py-16 text-center">
          {/* 主标题 */}
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-sky-100 px-4 py-1.5 text-sm font-medium text-sky-700 dark:bg-sky-900/50 dark:text-sky-300">
            <Sparkles className="h-4 w-4" />
            <span>AI 驱动的专业工具</span>
          </div>

          <h1 className="mb-4 text-5xl font-bold leading-tight">
            <span className="bg-gradient-to-r from-sky-600 to-cyan-600 bg-clip-text text-transparent dark:from-sky-400 dark:to-cyan-400">
              专业水下照片增强处理
            </span>
          </h1>

          <p className="mx-auto mb-8 max-w-2xl text-lg text-slate-600 dark:text-slate-300">
            一键还原高清画质，让每个水下瞬间更清晰动人
            <br />
            <span className="text-base text-slate-500 dark:text-slate-400">
              支持批量处理，智能识别，专为潜艇摄影定制
            </span>
          </p>

          {/* 特性标签 */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <div className="h-2 w-2 rounded-full bg-sky-500" />
              <span>批量处理</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <div className="h-2 w-2 rounded-full bg-cyan-500" />
              <span>一键增强</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <div className="h-2 w-2 rounded-full bg-blue-500" />
              <span>智能去雾</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <div className="h-2 w-2 rounded-full bg-indigo-500" />
              <span>色彩还原</span>
            </div>
          </div>
        </div>
      </div>

      {/* 主内容区 */}
      <div className="container mx-auto px-6 py-12">
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as "live" | "upload" | "history")}
          className="w-full"
        >
          {/* Tab 切换按钮 */}
          <div className="mb-8 flex justify-center">
            <TabsList className="inline-flex h-12 items-center rounded-xl bg-white p-1.5 shadow-lg dark:bg-slate-800">
              <TabsTrigger
                value="live"
                className="rounded-lg px-8 py-2.5 text-base font-medium transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white data-[state=active]:shadow-md"
              >
                🎥 实时视频
              </TabsTrigger>
              <TabsTrigger
                value="upload"
                className="rounded-lg px-8 py-2.5 text-base font-medium transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-sky-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white data-[state=active]:shadow-md"
              >
                📤 {t("underwater.tabs.batch") || "批量处理"}
              </TabsTrigger>
              <TabsTrigger
                value="history"
                className="rounded-lg px-8 py-2.5 text-base font-medium transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-sky-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white data-[state=active]:shadow-md"
              >
                📁 {t("underwater.tabs.history") || "历史记录"}
              </TabsTrigger>
            </TabsList>
          </div>

          {/* 实时视频页面 */}
          <TabsContent value="live">
            <Suspense
              fallback={
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
                </div>
              }
            >
              <LiveVideoPage onProcessImages={handleImagesFromLiveVideo} />
            </Suspense>
          </TabsContent>

          {/* 批量处理页面 */}
          <TabsContent value="upload" className="space-y-8">
            <UnderwaterUploader
              onImagesAdded={handleImagesAdded}
              onImageRemoved={handleImageRemoved}
              onAllImagesCleared={handleAllImagesCleared}
            />
            {images.length > 0 && (
              <ProcessingQueue
                images={images}
                onComplete={handleProcessingComplete}
                onImagesUpdate={setImages}
              />
            )}
          </TabsContent>

          {/* 历史记录页面 */}
          <TabsContent value="history">
            <EnhancementHistory />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
