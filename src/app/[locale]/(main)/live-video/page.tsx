"use client";
import { useAtom, useSetAtom } from "jotai";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { X, AlertCircle } from "lucide-react";
import { VideoPlayer } from "./components/video-player";
import { VideoSourceConfig } from "./components/video-source-config";
import { FrameQueue } from "./components/frame-queue";
import {
  videoSourcesAtom,
  activeSourceIdAtom,
  capturedFramesAtom,
  addVideoSourceAtom,
  updateVideoSourceAtom,
  removeVideoSourceAtom,
  addCapturedFrameAtom,
  removeCapturedFrameAtom,
  clearAllFramesAtom,
  toggleFrameSelectionAtom,
  selectedFramesAtom,
} from "./stores/video-store";
import type { VideoSource, CapturedFrame } from "./types";
import type { UploadedImage } from "../underwater-enhance/components/underwater-uploader";

interface Props {
  onProcessImages?: (images: UploadedImage[]) => void;
}

export default function LiveVideoPage({ onProcessImages }: Props) {
  const [videoSources] = useAtom(videoSourcesAtom);
  const [activeSourceId, setActiveSourceId] = useAtom(activeSourceIdAtom);
  const [capturedFrames] = useAtom(capturedFramesAtom);
  const [selectedFrames] = useAtom(selectedFramesAtom);

  const addVideoSource = useSetAtom(addVideoSourceAtom);
  const updateVideoSource = useSetAtom(updateVideoSourceAtom);
  const removeVideoSource = useSetAtom(removeVideoSourceAtom);
  const addCapturedFrame = useSetAtom(addCapturedFrameAtom);
  const removeCapturedFrame = useSetAtom(removeCapturedFrameAtom);
  const clearAllFrames = useSetAtom(clearAllFramesAtom);
  const toggleFrameSelection = useSetAtom(toggleFrameSelectionAtom);

  const activeSource = videoSources.find((s) => s.id === activeSourceId);
  const maxSources = 4;

  // 添加视频源
  const handleAddVideoSource = (config: {
    name: string;
    protocol: "webrtc" | "rtsp";
    url: string;
  }) => {
    addVideoSource(config);
  };

  // 更新视频源
  const handleUpdateSource = (
    id: string,
    updates: Partial<VideoSource>
  ) => {
    updateVideoSource(id, updates);
  };

  // 删除视频源
  const handleRemoveSource = (id: string) => {
    if (confirm("确定要删除这个视频源吗？")) {
      removeVideoSource(id);
    }
  };

  // 截图回调
  const handleCaptureFrame = (frame: CapturedFrame) => {
    addCapturedFrame(frame);
  };

  // 处理截图 - 转换为 UploadedImage 并传递给现有处理队列
  const handleProcessFrames = () => {
    if (selectedFrames.length === 0) {
      alert("请先选择要处理的截图");
      return;
    }

    // 将截图帧转换为 File 对象
    const images: UploadedImage[] = selectedFrames.map((frame) => {
      // Base64 转 File
      const arr = frame.dataUrl.split(",");
      const mime = arr[0].match(/:(.*?);/)?.[1] || "image/jpeg";
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      const file = new File(
        [u8arr],
        `capture_${frame.sourceName}_${frame.timestamp}.jpg`,
        { type: mime }
      );

      return {
        id: frame.id,
        file,
        preview: frame.dataUrl,
        status: "pending" as const,
      };
    });

    // 调用父组件的回调，传递图片到批量处理
    if (onProcessImages) {
      onProcessImages(images);
    }

    // 清空截图队列
    clearAllFrames();
  };

  return (
    <div className="container mx-auto px-6 py-8 space-y-8">
      {/* 标题区 */}
      <div className="text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent dark:from-purple-400 dark:to-pink-400">
          实时视频截图处理
        </h1>
        <p className="text-muted-foreground mt-2">
          支持 WebRTC 和 RTSP 协议，多路视频同时接入
        </p>
      </div>

      {/* 视频源管理 */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">📹 视频源管理</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {videoSources.length} / {maxSources}
          </span>
          <VideoSourceConfig
            onAdd={handleAddVideoSource}
            disabled={videoSources.length >= maxSources}
          />
        </div>
      </div>

      {videoSources.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 dark:bg-slate-900 rounded-xl border-2 border-dashed">
          <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-lg font-medium mb-2">还没有视频源</p>
          <p className="text-muted-foreground mb-4">
            点击"添加视频源"按钮开始
          </p>
          <VideoSourceConfig
            onAdd={handleAddVideoSource}
            disabled={videoSources.length >= maxSources}
          />
        </div>
      ) : (
        <>
          {/* 视频源 Tab 切换 */}
          <Tabs
            value={activeSourceId || undefined}
            onValueChange={setActiveSourceId}
          >
            <div className="flex items-center gap-2 mb-6">
              <TabsList className="flex-1">
                {videoSources.map((source) => (
                  <TabsTrigger
                    key={source.id}
                    value={source.id}
                    className="relative flex items-center gap-2"
                  >
                    <div
                      className={`h-2 w-2 rounded-full ${
                        source.status === "connected"
                          ? "bg-green-500"
                          : source.status === "connecting"
                          ? "bg-yellow-500 animate-pulse"
                          : source.status === "error"
                          ? "bg-red-500"
                          : "bg-gray-400"
                      }`}
                    />
                    {source.name}
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-5 w-5 ml-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveSource(source.id);
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {videoSources.map((source) => (
              <TabsContent key={source.id} value={source.id}>
                <VideoPlayer
                  source={source}
                  onUpdateSource={(updates) =>
                    handleUpdateSource(source.id, updates)
                  }
                  onCaptureFrame={handleCaptureFrame}
                />
              </TabsContent>
            ))}
          </Tabs>
        </>
      )}

      {/* 截图队列 */}
      <FrameQueue
        frames={capturedFrames}
        onToggleSelection={toggleFrameSelection}
        onRemove={removeCapturedFrame}
        onClearAll={clearAllFrames}
        onProcess={handleProcessFrames}
      />
    </div>
  );
}
