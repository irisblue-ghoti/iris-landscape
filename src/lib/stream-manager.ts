/**
 * 共享的流管理器
 * 用于在不同的 API 路由之间共享 FFmpeg 进程引用
 */

import { ChildProcess } from "child_process";

interface StreamInfo {
  process: ChildProcess;
  hlsDir: string;
  sessionId: string;
  startTime: number;
}

// 存储活动的 FFmpeg 进程
const activeStreams = new Map<string, StreamInfo>();

export function addStream(sessionId: string, info: StreamInfo) {
  activeStreams.set(sessionId, info);
}

export function getStream(sessionId: string): StreamInfo | undefined {
  return activeStreams.get(sessionId);
}

export function removeStream(sessionId: string): boolean {
  return activeStreams.delete(sessionId);
}

export function hasStream(sessionId: string): boolean {
  return activeStreams.has(sessionId);
}

export function getAllStreams(): Map<string, StreamInfo> {
  return activeStreams;
}
