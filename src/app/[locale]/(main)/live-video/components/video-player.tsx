"use client";
import { useRef, useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Maximize,
  Camera,
  Zap,
  Loader2,
  Play,
  Square,
} from "lucide-react";
import { useWebRTC } from "../hooks/use-webrtc";
import { useRTSP } from "../hooks/use-rtsp";
import { useFrameCapture } from "../hooks/use-frame-capture";
import type { VideoSource, CapturedFrame } from "../types";

interface Props {
  source: VideoSource;
  onUpdateSource: (updates: Partial<VideoSource>) => void;
  onCaptureFrame: (frame: CapturedFrame) => void;
}

export function VideoPlayer({ source, onUpdateSource, onCaptureFrame }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { connectWebRTC, disconnect: disconnectWebRTC } = useWebRTC();
  const { connectRTSP, disconnect: disconnectRTSP } = useRTSP();
  const { captureFrame, startBurstCapture, stopBurstCapture } =
    useFrameCapture();

  const [isBurstMode, setIsBurstMode] = useState(false);
  const [stats, setStats] = useState({ fps: 0, latency: 0 });

  // 连接视频源
  const handleConnect = async () => {
    if (!videoRef.current || !source.url) return;

    onUpdateSource({ status: "connecting" });

    try {
      if (source.protocol === "webrtc") {
        await connectWebRTC(source.url, videoRef.current);
      } else {
        await connectRTSP(source.url, videoRef.current);
      }

      onUpdateSource({ status: "connected", errorMessage: undefined });

      // 监听视频元数据加载
      videoRef.current.onloadedmetadata = () => {
        if (videoRef.current) {
          onUpdateSource({
            stats: {
              fps: 30, // 可以通过其他方式获取实际 FPS
              latency: stats.latency,
              resolution: `${videoRef.current.videoWidth}x${videoRef.current.videoHeight}`,
            },
          });
        }
      };
    } catch (error) {
      console.error("Connection failed:", error);
      onUpdateSource({
        status: "error",
        errorMessage: error instanceof Error ? error.message : "连接失败",
      });
    }
  };

  // 断开连接
  const handleDisconnect = () => {
    if (source.protocol === "webrtc") {
      disconnectWebRTC();
    } else {
      disconnectRTSP();
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    stopBurstCapture();
    setIsBurstMode(false);
    onUpdateSource({ status: "disconnected" });
  };

  // 单张截图
  const handleCapture = () => {
    const frame = captureFrame(videoRef.current, source.id, source.name);
    if (frame) {
      onCaptureFrame(frame);
    }
  };

  // 连拍模式
  const handleBurstCapture = () => {
    if (isBurstMode) {
      stopBurstCapture();
      setIsBurstMode(false);
    } else {
      const interval = source.burstMode?.interval || 2;
      const count = source.burstMode?.count || 5;

      startBurstCapture(
        videoRef.current,
        source.id,
        source.name,
        interval,
        count,
        (frame) => {
          onCaptureFrame(frame);
        }
      );
      setIsBurstMode(true);

      // 自动停止
      setTimeout(() => {
        stopBurstCapture();
        setIsBurstMode(false);
      }, interval * count * 1000 + 500);
    }
  };

  // 全屏
  const handleFullscreen = () => {
    if (videoRef.current) {
      videoRef.current.requestFullscreen();
    }
  };

  // 组件卸载时清理
  useEffect(() => {
    return () => {
      handleDisconnect();
    };
  }, []);

  const isConnected = source.status === "connected";
  const isConnecting = source.status === "connecting";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* 左侧：视频源配置 */}
      <Card className="p-6 lg:col-span-1">
        <h3 className="text-lg font-semibold mb-4">📝 视频源配置</h3>

        <div className="space-y-4">
          <div>
            <Label>名称</Label>
            <Input
              value={source.name}
              onChange={(e) => onUpdateSource({ name: e.target.value })}
              placeholder="如：主摄像头"
              disabled={isConnected}
            />
          </div>

          <div>
            <Label>协议</Label>
            <div className="flex gap-4 mt-2">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={source.protocol === "webrtc"}
                  onChange={() => onUpdateSource({ protocol: "webrtc" })}
                  disabled={isConnected}
                />
                WebRTC
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={source.protocol === "rtsp"}
                  onChange={() => onUpdateSource({ protocol: "rtsp" })}
                  disabled={isConnected}
                />
                RTSP
              </label>
            </div>
          </div>

          <div>
            <Label>地址</Label>
            <Input
              value={source.url}
              onChange={(e) => onUpdateSource({ url: e.target.value })}
              placeholder={
                source.protocol === "webrtc"
                  ? "webrtc://..."
                  : "rtsp://192.168.1.100:554/stream"
              }
              disabled={isConnected}
            />
          </div>

          <div className="border-t pt-4">
            <Label className="mb-3 block">连拍设置</Label>
            <div className="space-y-3">
              <div>
                <Label className="text-sm text-muted-foreground">间隔（秒）</Label>
                <Input
                  type="number"
                  min="1"
                  max="10"
                  value={source.burstMode?.interval || 2}
                  onChange={(e) =>
                    onUpdateSource({
                      burstMode: {
                        ...source.burstMode,
                        interval: parseInt(e.target.value) || 2,
                        count: source.burstMode?.count || 5,
                        enabled: source.burstMode?.enabled || false,
                      },
                    })
                  }
                />
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">数量（张）</Label>
                <Input
                  type="number"
                  min="2"
                  max="20"
                  value={source.burstMode?.count || 5}
                  onChange={(e) =>
                    onUpdateSource({
                      burstMode: {
                        ...source.burstMode,
                        interval: source.burstMode?.interval || 2,
                        count: parseInt(e.target.value) || 5,
                        enabled: source.burstMode?.enabled || false,
                      },
                    })
                  }
                />
              </div>
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            {!isConnected ? (
              <Button
                onClick={handleConnect}
                disabled={!source.url || isConnecting}
                className="flex-1"
              >
                {isConnecting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    连接中...
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    连接
                  </>
                )}
              </Button>
            ) : (
              <Button
                onClick={handleDisconnect}
                variant="destructive"
                className="flex-1"
              >
                <Square className="mr-2 h-4 w-4" />
                断开
              </Button>
            )}
          </div>

          {source.errorMessage && (
            <div className="text-sm text-red-500 bg-red-50 dark:bg-red-950 p-3 rounded-lg">
              {source.errorMessage}
            </div>
          )}
        </div>
      </Card>

      {/* 右侧：视频播放器 */}
      <Card className="p-6 lg:col-span-2">
        <h3 className="text-lg font-semibold mb-4">🖥️ 实时视频</h3>

        {/* 视频画面 */}
        <div className="relative aspect-video bg-slate-900 rounded-lg overflow-hidden mb-4">
          <video
            ref={videoRef}
            className="w-full h-full object-contain"
            autoPlay
            muted
            playsInline
          />

          {!isConnected && (
            <div className="absolute inset-0 flex items-center justify-center text-slate-400">
              {isConnecting ? (
                <div className="text-center">
                  <Loader2 className="h-12 w-12 animate-spin mx-auto mb-2" />
                  <p>正在连接...</p>
                </div>
              ) : (
                <p>未连接视频源</p>
              )}
            </div>
          )}

          {/* 状态指示器 */}
          {isConnected && (
            <div className="absolute top-4 right-4 bg-black/70 rounded-lg px-3 py-2 text-white text-sm space-y-1">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                <span>已连接</span>
              </div>
              {source.stats && (
                <>
                  <div>FPS: {source.stats.fps}</div>
                  <div>{source.stats.resolution}</div>
                </>
              )}
            </div>
          )}
        </div>

        {/* 控制按钮 */}
        <div className="flex flex-wrap gap-3">
          <Button
            onClick={handleCapture}
            disabled={!isConnected}
            size="lg"
            className="flex-1"
          >
            <Camera className="mr-2 h-5 w-5" />
            截图
          </Button>

          <Button
            onClick={handleBurstCapture}
            disabled={!isConnected}
            size="lg"
            variant={isBurstMode ? "destructive" : "default"}
            className="flex-1"
          >
            <Zap className="mr-2 h-5 w-5" />
            {isBurstMode ? "停止连拍" : "连拍模式"}
          </Button>

          <Button
            onClick={handleFullscreen}
            disabled={!isConnected}
            size="lg"
            variant="outline"
          >
            <Maximize className="h-5 w-5" />
          </Button>
        </div>

        {isBurstMode && (
          <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg text-sm">
            <p className="font-medium">连拍模式运行中...</p>
            <p className="text-muted-foreground">
              每隔 {source.burstMode?.interval || 2} 秒截取一张，共{" "}
              {source.burstMode?.count || 5} 张
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}
