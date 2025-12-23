"use client";
import { useState } from "react";
import { UnderwaterUploader } from "./components/underwater-uploader";
import { ProcessingQueue } from "./components/processing-queue";
import { EnhancementHistory } from "./components/enhancement-history";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslations } from "next-intl";
import type { UploadedImage } from "./components/underwater-uploader";

export default function UnderwaterEnhancePage() {
  const t = useTranslations();
  const [activeTab, setActiveTab] = useState<"upload" | "history">("upload");
  const [images, setImages] = useState<UploadedImage[]>([]);

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
    // 处理完成后可以刷新我的资产
    setImages([]);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          {t("underwater.title") || "水下照片增强"}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {t("underwater.description") || "专业的潜艇摄影照片处理工具"}
        </p>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as "upload" | "history")}
      >
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="upload">批量处理</TabsTrigger>
          <TabsTrigger value="history">我的资产</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="mt-6 space-y-6">
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

        <TabsContent value="history" className="mt-6">
          <EnhancementHistory />
        </TabsContent>
      </Tabs>
    </div>
  );
}
