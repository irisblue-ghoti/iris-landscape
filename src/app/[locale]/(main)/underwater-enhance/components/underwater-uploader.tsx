"use client";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { nanoid } from "nanoid";
import Image from "next/image";
import { useTranslations } from "next-intl";

export interface UploadedImage {
  id: string;
  file: File;
  preview: string;
  status: "pending" | "processing" | "success" | "failed";
  result?: string;
  error?: string;
}

interface Props {
  onImagesAdded: (images: UploadedImage[]) => void;
  onImageRemoved: (id: string) => void;
  onAllImagesCleared: () => void;
}

export function UnderwaterUploader({
  onImagesAdded,
  onImageRemoved,
  onAllImagesCleared,
}: Props) {
  const t = useTranslations();
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newImages: UploadedImage[] = acceptedFiles.map((file) => ({
        id: nanoid(),
        file,
        preview: URL.createObjectURL(file),
        status: "pending" as const,
      }));

      setUploadedImages((prev) => [...prev, ...newImages]);
      onImagesAdded(newImages);
    },
    [onImagesAdded]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
    },
    multiple: true,
  });

  const removeImage = (id: string) => {
    setUploadedImages((prev) => prev.filter((img) => img.id !== id));
    onImageRemoved(id);
  };

  const clearAll = () => {
    setUploadedImages([]);
    onAllImagesCleared();
  };

  return (
    <div className="space-y-6">
      {/* 上传区域 */}
      <Card
        {...getRootProps()}
        className={`group relative cursor-pointer overflow-hidden border-2 border-dashed transition-all duration-300 ${
          isDragActive
            ? "scale-[1.02] border-sky-500 bg-sky-50/50 shadow-xl dark:border-sky-400 dark:bg-sky-950/50"
            : "border-slate-300 bg-white hover:border-sky-400 hover:bg-sky-50/30 hover:shadow-lg dark:border-slate-700 dark:bg-slate-800/50 dark:hover:border-sky-500 dark:hover:bg-sky-950/30"
        }`}
      >
        <input {...getInputProps()} />

        {/* 装饰性背景 */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-sky-400/5 blur-3xl transition-all group-hover:bg-sky-400/10" />
          <div className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-cyan-400/5 blur-3xl transition-all group-hover:bg-cyan-400/10" />
        </div>

        <div className="relative flex min-h-[400px] flex-col items-center justify-center p-12 text-center">
          {/* 上传图标 */}
          <div
            className={`mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br transition-all duration-300 ${
              isDragActive
                ? "scale-110 from-sky-500 to-cyan-500 shadow-2xl"
                : "from-sky-400 to-cyan-400 shadow-lg group-hover:scale-105 group-hover:shadow-xl"
            }`}
          >
            {isDragActive ? (
              <ImageIcon className="h-12 w-12 animate-bounce text-white" />
            ) : (
              <Upload className="h-12 w-12 text-white transition-transform group-hover:scale-110" />
            )}
          </div>

          {/* 文字提示 */}
          <div className="space-y-3">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              {isDragActive
                ? t("underwater.upload.drag_active") || "释放以上传"
                : t("underwater.upload.drag_drop") || "拖拽照片到此处，或点击选择"}
            </h3>
            <p className="text-base text-slate-500 dark:text-slate-400">
              {t("underwater.upload.support") ||
                "支持 JPG、PNG、WEBP 格式，可一次上传多张"}
            </p>

            {/* 上传按钮 */}
            {!isDragActive && (
              <Button
                size="lg"
                className="mt-4 bg-gradient-to-r from-sky-500 to-cyan-500 px-8 text-base font-medium shadow-lg transition-all hover:scale-105 hover:shadow-xl"
              >
                <Upload className="mr-2 h-5 w-5" />
                选择文件
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* 已上传照片列表 */}
      {uploadedImages.length > 0 && (
        <Card className="overflow-hidden border-slate-200 bg-white p-6 shadow-lg dark:border-slate-700 dark:bg-slate-800/50">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              已上传 {uploadedImages.length} 张照片
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={clearAll}
              className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950"
            >
              <X className="mr-1 h-4 w-4" />
              {t("underwater.upload.clear") || "清空列表"}
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {uploadedImages.map((image) => (
              <div
                key={image.id}
                className="group relative aspect-square overflow-hidden rounded-xl border-2 border-slate-200 bg-slate-50 transition-all hover:scale-105 hover:border-sky-400 hover:shadow-lg dark:border-slate-700 dark:bg-slate-900"
              >
                <Image
                  src={image.preview}
                  alt={image.file.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 transition-opacity group-hover:opacity-100">
                  <Button
                    size="icon"
                    variant="destructive"
                    className="absolute right-2 top-2 h-8 w-8 shadow-lg"
                    onClick={() => removeImage(image.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100">
                  <p className="truncate text-xs text-white">
                    {image.file.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
