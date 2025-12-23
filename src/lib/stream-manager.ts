/**
 * 共享的流管理器
 * 用于在不同的 API 路由之间共享 FFmpeg 进程引用
 *
 * 注意：由于 Next.js 开发模式下不同 API 路由可能在不同模块实例中运行，
 * 我们使用文件系统来持久化 PID 信息
 */

import { ChildProcess } from "child_process";
import fs from "fs";
import path from "path";

interface StreamInfo {
  process: ChildProcess;
  hlsDir: string;
  sessionId: string;
  startTime: number;
}

interface StreamPidInfo {
  pid: number;
  hlsDir: string;
  sessionId: string;
  startTime: number;
}

// 内存中存储活动的 FFmpeg 进程（用于同一模块实例内）
const activeStreams = new Map<string, StreamInfo>();

// PID 文件存储目录
const PID_DIR = path.join(process.cwd(), ".rtsp-pids");

// 确保 PID 目录存在
function ensurePidDir() {
  if (!fs.existsSync(PID_DIR)) {
    fs.mkdirSync(PID_DIR, { recursive: true });
  }
}

// 获取 PID 文件路径
function getPidFilePath(sessionId: string): string {
  return path.join(PID_DIR, `${sessionId}.json`);
}

// 保存 PID 到文件
function savePidToFile(sessionId: string, info: StreamPidInfo) {
  ensurePidDir();
  const filePath = getPidFilePath(sessionId);
  fs.writeFileSync(filePath, JSON.stringify(info), "utf-8");
  console.log("Saved PID to file:", filePath, info);
}

// 从文件读取 PID
function loadPidFromFile(sessionId: string): StreamPidInfo | null {
  const filePath = getPidFilePath(sessionId);
  if (fs.existsSync(filePath)) {
    try {
      const data = fs.readFileSync(filePath, "utf-8");
      return JSON.parse(data);
    } catch {
      return null;
    }
  }
  return null;
}

// 删除 PID 文件
function removePidFile(sessionId: string) {
  const filePath = getPidFilePath(sessionId);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    console.log("Removed PID file:", filePath);
  }
}

export function addStream(sessionId: string, info: StreamInfo) {
  activeStreams.set(sessionId, info);

  // 同时保存到文件
  if (info.process.pid) {
    savePidToFile(sessionId, {
      pid: info.process.pid,
      hlsDir: info.hlsDir,
      sessionId: info.sessionId,
      startTime: info.startTime,
    });
  }
}

export function getStream(sessionId: string): StreamInfo | undefined {
  return activeStreams.get(sessionId);
}

// 获取 PID 信息（从内存或文件）
export function getStreamPid(sessionId: string): StreamPidInfo | null {
  // 先从内存查找
  const memStream = activeStreams.get(sessionId);
  if (memStream && memStream.process.pid) {
    return {
      pid: memStream.process.pid,
      hlsDir: memStream.hlsDir,
      sessionId: memStream.sessionId,
      startTime: memStream.startTime,
    };
  }

  // 从文件查找
  return loadPidFromFile(sessionId);
}

export function removeStream(sessionId: string): boolean {
  // 从内存和文件都删除
  removePidFile(sessionId);
  return activeStreams.delete(sessionId);
}

export function hasStream(sessionId: string): boolean {
  return activeStreams.has(sessionId) || loadPidFromFile(sessionId) !== null;
}

export function getAllStreams(): Map<string, StreamInfo> {
  return activeStreams;
}

// 获取所有 PID 文件中的信息
export function getAllStreamPids(): StreamPidInfo[] {
  ensurePidDir();
  const files = fs.readdirSync(PID_DIR).filter((f) => f.endsWith(".json"));
  const pids: StreamPidInfo[] = [];

  for (const file of files) {
    try {
      const data = fs.readFileSync(path.join(PID_DIR, file), "utf-8");
      pids.push(JSON.parse(data));
    } catch {
      // 忽略解析错误
    }
  }

  return pids;
}
