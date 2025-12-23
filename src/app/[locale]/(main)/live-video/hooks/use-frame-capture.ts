import { useCallback, useRef } from "react";
import { nanoid } from "nanoid";
import type { CapturedFrame } from "../types";

export function useFrameCapture() {
  const burstIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // 单张截图
  const captureFrame = useCallback(
    (
      videoElement: HTMLVideoElement | null,
      sourceId: string,
      sourceName: string
    ): CapturedFrame | null => {
      if (!videoElement || videoElement.readyState < 2) {
        console.warn("Video not ready for capture");
        return null;
      }

      try {
        const canvas = document.createElement("canvas");
        canvas.width = videoElement.videoWidth;
        canvas.height = videoElement.videoHeight;

        const ctx = canvas.getContext("2d");
        if (!ctx) return null;

        // 绘制视频帧
        ctx.drawImage(videoElement, 0, 0);

        // 添加水印（时间戳 + 视频源名称）
        ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        ctx.fillRect(10, canvas.height - 70, 350, 60);
        ctx.fillStyle = "white";
        ctx.font = "bold 18px Arial";
        ctx.fillText(sourceName, 20, canvas.height - 45);
        ctx.font = "16px Arial";
        ctx.fillText(
          new Date().toLocaleString("zh-CN", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }),
          20,
          canvas.height - 20
        );

        const frame: CapturedFrame = {
          id: nanoid(),
          sourceId,
          sourceName,
          timestamp: Date.now(),
          dataUrl: canvas.toDataURL("image/jpeg", 0.92),
          width: canvas.width,
          height: canvas.height,
          selected: true,
        };

        return frame;
      } catch (error) {
        console.error("Screenshot failed:", error);
        return null;
      }
    },
    []
  );

  // 连拍模式
  const startBurstCapture = useCallback(
    (
      videoElement: HTMLVideoElement | null,
      sourceId: string,
      sourceName: string,
      interval: number,
      count: number,
      onCapture: (frame: CapturedFrame) => void
    ) => {
      if (burstIntervalRef.current) {
        clearInterval(burstIntervalRef.current);
      }

      let captured = 0;

      burstIntervalRef.current = setInterval(() => {
        if (captured >= count) {
          stopBurstCapture();
          return;
        }

        const frame = captureFrame(videoElement, sourceId, sourceName);
        if (frame) {
          onCapture(frame);
          captured++;
        }
      }, interval * 1000);

      return burstIntervalRef.current;
    },
    [captureFrame]
  );

  // 停止连拍
  const stopBurstCapture = useCallback(() => {
    if (burstIntervalRef.current) {
      clearInterval(burstIntervalRef.current);
      burstIntervalRef.current = null;
    }
  }, []);

  return {
    captureFrame,
    startBurstCapture,
    stopBurstCapture,
  };
}
