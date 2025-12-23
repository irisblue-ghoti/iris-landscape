"use client";
import { useState, useEffect, lazy, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { UnderwaterUploader } from "./underwater-enhance/components/underwater-uploader";
import { ProcessingQueue } from "./underwater-enhance/components/processing-queue";
import { EnhancementHistory } from "./underwater-enhance/components/enhancement-history";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useTranslations } from "next-intl";
import { useAtom } from "jotai";
import { appConfigAtom } from "@/stores";
import type { UploadedImage } from "./underwater-enhance/components/underwater-uploader";
import { Loader2 } from "lucide-react";

// 懒加载实时视频页面
const LiveVideoPage = lazy(() => import("./live-video/page"));

export default function MainPage() {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const [{ hideBrand }] = useAtom(appConfigAtom);
  const tabFromUrl = searchParams.get("tab") as
    | "live"
    | "upload"
    | "history"
    | null;
  const [activeTab, setActiveTab] = useState<"live" | "upload" | "history">(
    tabFromUrl || "upload"
  );
  const [images, setImages] = useState<UploadedImage[]>([]);

  // 当 URL 参数变化时更新 Tab
  useEffect(() => {
    if (tabFromUrl && ["live", "upload", "history"].includes(tabFromUrl)) {
      setActiveTab(tabFromUrl);
    }
  }, [tabFromUrl]);

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
      {/* 主内容区 */}
      <div className="container mx-auto px-6 py-8">
        <Tabs
          value={activeTab}
          onValueChange={(value) =>
            setActiveTab(value as "live" | "upload" | "history")
          }
          className="w-full"
        >
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

          {/* 我的资产页面 */}
          <TabsContent value="history">
            <EnhancementHistory />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
