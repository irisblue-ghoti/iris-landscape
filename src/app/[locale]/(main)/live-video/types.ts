// 视频源类型定义
export interface VideoSource {
  id: string;
  name: string;
  protocol: "webrtc" | "rtsp";
  url: string;
  status: "disconnected" | "connecting" | "connected" | "error";
  errorMessage?: string;
  stats?: {
    fps: number;
    latency: number;
    resolution: string;
  };
  burstMode?: {
    enabled: boolean;
    interval: number; // 秒
    count: number; // 张数
  };
}

// 截图帧类型定义
export interface CapturedFrame {
  id: string;
  sourceId: string;
  sourceName: string;
  timestamp: number;
  dataUrl: string;
  width: number;
  height: number;
  selected: boolean;
}

// 视频连接配置
export interface VideoConnectionConfig {
  iceServers?: RTCIceServer[];
  wsHost?: string;
}
