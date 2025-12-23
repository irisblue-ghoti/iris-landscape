import { NextRequest, NextResponse } from "next/server";

/**
 * WebRTC 信令代理 API
 * 用于绕过浏览器 CORS 限制
 */
export async function POST(request: NextRequest) {
  try {
    // 获取目标 URL 和 SDP
    const { url, sdp } = await request.json();

    if (!url || !sdp) {
      return NextResponse.json(
        { error: "URL and SDP are required" },
        { status: 400 }
      );
    }

    console.log("Proxying WebRTC signaling to:", url);

    // 通过服务器端转发请求到腾讯云
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/sdp",
      },
      body: sdp,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Signaling failed:", response.status, errorText);
      return NextResponse.json(
        {
          error: `Signaling failed: ${response.status} ${response.statusText}`,
          details: errorText,
        },
        { status: response.status }
      );
    }

    // 返回 SDP Answer
    const answerSdp = await response.text();
    console.log("Signaling successful, received SDP answer");

    return new NextResponse(answerSdp, {
      status: 200,
      headers: {
        "Content-Type": "application/sdp",
      },
    });
  } catch (error) {
    console.error("Proxy error:", error);
    return NextResponse.json(
      {
        error: "Failed to proxy WebRTC signaling",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
