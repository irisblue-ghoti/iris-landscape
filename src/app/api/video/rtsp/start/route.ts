import { NextRequest, NextResponse } from "next/server";
import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import { addStream, hasStream, removeStream } from "@/lib/stream-manager";

/**
 * RTSP 转 HLS API - 启动流
 *
 * 工作原理：
 * 1. 使用 FFmpeg 将 RTSP 流转换为 HLS (m3u8 + ts 片段)
 * 2. 将 HLS 文件保存到 public/hls 目录
 * 3. 返回 HLS 播放地址给前端
 * 4. 前端使用 hls.js 播放
 *
 * 依赖要求：
 * - 系统需要安装 FFmpeg: brew install ffmpeg (macOS) 或 apt-get install ffmpeg (Linux)
 */

export async function POST(request: NextRequest) {
  try {
    const { rtspUrl, sessionId } = await request.json();

    console.log("Starting RTSP stream:", { rtspUrl, sessionId });

    // 验证 RTSP URL
    if (!rtspUrl || !rtspUrl.startsWith("rtsp://")) {
      return NextResponse.json(
        { error: "Invalid RTSP URL. Must start with rtsp://" },
        { status: 400 }
      );
    }

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID is required" },
        { status: 400 }
      );
    }

    // 检查是否已经有相同的流在运行
    if (hasStream(sessionId)) {
      console.log("Stream already active:", sessionId);
      return NextResponse.json({
        hlsUrl: `/hls/${sessionId}/stream.m3u8`,
        sessionId,
        message: "Stream already running",
      });
    }

    // 创建 HLS 输出目录
    const hlsDir = path.join(process.cwd(), "public", "hls", sessionId);
    if (!fs.existsSync(hlsDir)) {
      fs.mkdirSync(hlsDir, { recursive: true });
    }

    const outputPath = path.join(hlsDir, "stream.m3u8");

    // 启动 FFmpeg 进程转换 RTSP 到 HLS
    console.log("Starting FFmpeg conversion...");

    const ffmpegProcess = spawn("ffmpeg", [
      "-rtsp_transport", "tcp",      // 使用 TCP 传输（更稳定）
      "-i", rtspUrl,                  // 输入 RTSP URL
      "-c:v", "copy",                 // 直接复制视频流（不重新编码，更快）
      "-c:a", "aac",                  // 音频编码：AAC
      "-b:a", "128k",                 // 音频比特率
      "-f", "hls",                    // 输出格式：HLS
      "-hls_time", "2",               // 每个 TS 片段 2 秒
      "-hls_list_size", "10",         // 保留最近 10 个片段
      "-hls_flags", "delete_segments", // 自动删除旧片段
      "-start_number", "0",           // 从 0 开始编号
      "-hls_segment_filename", path.join(hlsDir, "segment%03d.ts"),
      outputPath,
    ]);

    // 监听 FFmpeg 输出
    ffmpegProcess.stdout?.on("data", (data) => {
      console.log(`FFmpeg stdout: ${data}`);
    });

    ffmpegProcess.stderr?.on("data", (data) => {
      console.log(`FFmpeg stderr: ${data}`);
    });

    ffmpegProcess.on("error", (error) => {
      console.error("FFmpeg process error:", error);
      removeStream(sessionId);
    });

    ffmpegProcess.on("exit", (code, signal) => {
      console.log(`FFmpeg process exited with code ${code}, signal ${signal}`);
      removeStream(sessionId);

      // 清理 HLS 文件
      try {
        if (fs.existsSync(hlsDir)) {
          fs.rmSync(hlsDir, { recursive: true, force: true });
        }
      } catch (err) {
        console.error("Failed to cleanup HLS directory:", err);
      }
    });

    // 保存进程引用
    addStream(sessionId, {
      process: ffmpegProcess,
      hlsDir,
      sessionId,
      startTime: Date.now(),
    });

    // 等待 HLS 文件生成（最多等待 30 秒）
    console.log("Waiting for HLS playlist to be generated...");
    let attempts = 0;
    const maxAttempts = 150; // 30 秒 (150 * 200ms)

    while (attempts < maxAttempts) {
      // 检查是否生成了 m3u8 文件（FFmpeg 会先创建 .tmp 再重命名）
      if (fs.existsSync(outputPath)) {
        console.log("HLS playlist file found!");
        break;
      }

      // 检查 FFmpeg 进程是否还在运行
      if (ffmpegProcess.exitCode !== null) {
        throw new Error(`FFmpeg process exited unexpectedly with code ${ffmpegProcess.exitCode}`);
      }

      await new Promise((resolve) => setTimeout(resolve, 200));
      attempts++;

      // 每 5 秒打印一次进度
      if (attempts % 25 === 0) {
        console.log(`Still waiting for HLS playlist... (${attempts * 200 / 1000}s elapsed)`);
      }
    }

    if (!fs.existsSync(outputPath)) {
      throw new Error("Failed to generate HLS playlist within 30 seconds. FFmpeg may need more time or there's an issue with the RTSP stream.");
    }

    console.log("FFmpeg started successfully, HLS available at:", `/hls/${sessionId}/stream.m3u8`);

    return NextResponse.json({
      hlsUrl: `/hls/${sessionId}/stream.m3u8`,
      sessionId,
      message: "RTSP stream started successfully",
    });
  } catch (error) {
    console.error("RTSP start error:", error);
    return NextResponse.json(
      {
        error: "Failed to start RTSP stream",
        details: error instanceof Error ? error.message : String(error),
        hint: "Make sure FFmpeg is installed: brew install ffmpeg (macOS) or apt-get install ffmpeg (Linux)"
      },
      { status: 500 }
    );
  }
}
