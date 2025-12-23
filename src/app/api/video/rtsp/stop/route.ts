import { NextRequest, NextResponse } from "next/server";
import { getStream, removeStream } from "@/lib/stream-manager";
import fs from "fs";

/**
 * RTSP 转换 API - 停止流
 */

export async function POST(request: NextRequest) {
  try {
    const { sessionId } = await request.json();

    console.log("Stopping RTSP stream:", sessionId);

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID required" },
        { status: 400 }
      );
    }

    // 获取流信息
    const streamInfo = getStream(sessionId);

    if (!streamInfo) {
      console.log("Stream not found:", sessionId);
      return NextResponse.json({
        success: true,
        message: "Stream not running or already stopped",
      });
    }

    // 终止 FFmpeg 进程
    try {
      streamInfo.process.kill("SIGTERM");
      console.log("FFmpeg process terminated for session:", sessionId);
    } catch (error) {
      console.error("Failed to kill FFmpeg process:", error);
    }

    // 清理 HLS 文件
    try {
      if (fs.existsSync(streamInfo.hlsDir)) {
        fs.rmSync(streamInfo.hlsDir, { recursive: true, force: true });
        console.log("Cleaned up HLS directory:", streamInfo.hlsDir);
      }
    } catch (error) {
      console.error("Failed to cleanup HLS directory:", error);
    }

    // 从管理器中移除
    removeStream(sessionId);

    return NextResponse.json({
      success: true,
      message: "RTSP stream stopped successfully",
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
