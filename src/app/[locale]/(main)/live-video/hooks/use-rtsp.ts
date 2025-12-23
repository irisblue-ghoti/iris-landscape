import { useCallback, useRef } from "react";
import Hls from "hls.js";

export function useRTSP() {
  const hlsRef = useRef<Hls | null>(null);
  const sessionIdRef = useRef<string | null>(null);

  const connectRTSP = useCallback(
    async (url: string, videoElement: HTMLVideoElement) => {
      try {
        const sessionId = `session-${Date.now()}`;
        sessionIdRef.current = sessionId;

        console.log("Starting RTSP to HLS conversion...");

        // 调用后端 API 启动 RTSP 转换
        const response = await fetch("/api/video/rtsp/start", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ rtspUrl: url, sessionId }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || "Failed to start RTSP stream");
        }

        const { hlsUrl } = await response.json();
        console.log("HLS stream available at:", hlsUrl);

        // 使用 hls.js 播放 HLS 流
        if (Hls.isSupported()) {
          const hls = new Hls({
            enableWorker: true,
            lowLatencyMode: true,
            backBufferLength: 90,
          });

          hlsRef.current = hls;

          hls.loadSource(hlsUrl);
          hls.attachMedia(videoElement);

          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            console.log("HLS manifest parsed, starting playback");
            videoElement.play().catch((e) => {
              console.error("Failed to play video:", e);
            });
          });

          hls.on(Hls.Events.ERROR, (event, data) => {
            console.error("HLS error:", data);
            if (data.fatal) {
              switch (data.type) {
                case Hls.ErrorTypes.NETWORK_ERROR:
                  console.error("Fatal network error, trying to recover");
                  hls.startLoad();
                  break;
                case Hls.ErrorTypes.MEDIA_ERROR:
                  console.error("Fatal media error, trying to recover");
                  hls.recoverMediaError();
                  break;
                default:
                  console.error("Fatal error, cannot recover");
                  hls.destroy();
                  break;
              }
            }
          });

          return { hls, sessionId };
        } else if (videoElement.canPlayType("application/vnd.apple.mpegurl")) {
          // 对于 Safari 等原生支持 HLS 的浏览器
          console.log("Using native HLS support");
          videoElement.src = hlsUrl;
          videoElement.play().catch((e) => {
            console.error("Failed to play video:", e);
          });

          return { sessionId };
        } else {
          throw new Error("HLS is not supported in this browser");
        }
      } catch (error) {
        console.error("RTSP connection failed:", error);
        throw error;
      }
    },
    []
  );

  const disconnect = useCallback(async () => {
    // 销毁 HLS 实例
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    // 停止后端转换
    if (sessionIdRef.current) {
      try {
        await fetch("/api/video/rtsp/stop", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId: sessionIdRef.current }),
        });
        console.log("RTSP stream stopped successfully");
      } catch (error) {
        console.error("Failed to stop RTSP stream:", error);
      }
      sessionIdRef.current = null;
    }
  }, []);

  return {
    connectRTSP,
    disconnect,
  };
}
