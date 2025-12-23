import { NextRequest, NextResponse } from "next/server";
import { getStreamPid, removeStream } from "@/lib/stream-manager";
import { execSync } from "child_process";
import fs from "fs";

/**
 * RTSP 转换 API - 停止流
 */

export async function POST(request: NextRequest) {
  try {
    const { sessionId } = await request.json();

    console.log("=== RTSP STOP API CALLED ===");
    console.log("Session ID:", sessionId);

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID required" },
        { status: 400 }
      );
    }

    // 获取 PID 信息（从内存或文件）
    const pidInfo = getStreamPid(sessionId);

    console.log("PID info found:", pidInfo);

    if (!pidInfo) {
      console.log("Stream PID not found for:", sessionId);
      return NextResponse.json({
        success: true,
        message: "Stream not running or already stopped",
      });
    }

    const { pid, hlsDir } = pidInfo;

    console.log("Found FFmpeg process with PID:", pid);

    // 使用系统 kill 命令强制终止进程
    try {
      console.log("Killing FFmpeg process with PID:", pid);

      // 直接使用 SIGKILL 强制终止
      execSync(`kill -9 ${pid} 2>/dev/null || true`);
      console.log("Sent SIGKILL to PID:", pid);
    } catch (error) {
      console.error("Failed to kill FFmpeg process:", error);
    }

    // 从管理器中移除（同时删除 PID 文件）
    removeStream(sessionId);
    console.log("Removed stream from manager:", sessionId);

    // 清理 HLS 文件（延迟清理，确保进程已完全停止）
    setTimeout(() => {
      try {
        if (fs.existsSync(hlsDir)) {
          fs.rmSync(hlsDir, { recursive: true, force: true });
          console.log("Cleaned up HLS directory:", hlsDir);
        }
      } catch (error) {
        console.error("Failed to cleanup HLS directory:", error);
      }
    }, 1000);

    console.log("=== RTSP STOP COMPLETED ===");

    return NextResponse.json({
      success: true,
      message: "RTSP stream stopped successfully",
      pid,
    });
  } catch (error) {
    console.error("RTSP stop error:", error);
    return NextResponse.json(
      {
        error: "Failed to stop RTSP stream",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
