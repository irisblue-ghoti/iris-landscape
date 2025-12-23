import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { getObsClient, isObsConfigured, generateShareUrls } from "@/lib/obs-client";
import { env } from "@/env";

// 有效期选项（秒）
const EXPIRES_OPTIONS = {
  "1h": 60 * 60,
  "24h": 24 * 60 * 60,
  "7d": 7 * 24 * 60 * 60,
  "30d": 30 * 24 * 60 * 60,
} as const;

type ExpiresOption = keyof typeof EXPIRES_OPTIONS;

/**
 * 创建批量分享（聚合链接）
 * POST /api/share/batch
 */
export async function POST(request: NextRequest) {
  try {
    if (!isObsConfigured()) {
      return NextResponse.json(
        { error: "华为云 OBS 未配置", message: "分享功能需要配置华为云 OBS" },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { urls, expires = "7d" } = body;

    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return NextResponse.json(
        { error: "请求参数错误", message: "请提供 urls 数组" },
        { status: 400 }
      );
    }

    const expiresInSeconds = EXPIRES_OPTIONS[expires as ExpiresOption] || EXPIRES_OPTIONS["7d"];
    const expiresAt = new Date(Date.now() + expiresInSeconds * 1000);

    // 生成签名 URL
    const signedUrls = await generateShareUrls(urls, expiresInSeconds);

    // 创建聚合分享数据
    const shareId = nanoid(10);
    const shareData = {
      id: shareId,
      urls: signedUrls,
      expiresAt: expiresAt.toISOString(),
      createdAt: new Date().toISOString(),
    };

    // 将聚合数据上传到 OBS
    const client = getObsClient();
    const { HUAWEI_OBS_BUCKET, HUAWEI_OBS_PATH_PREFIX } = env;
    const sharePath = HUAWEI_OBS_PATH_PREFIX
      ? `${HUAWEI_OBS_PATH_PREFIX}/shares/${shareId}.json`
      : `shares/${shareId}.json`;

    await client.putObject({
      Bucket: HUAWEI_OBS_BUCKET!,
      Key: sharePath,
      Body: JSON.stringify(shareData),
      ContentType: "application/json",
    });

    // 生成聚合页面链接
    const baseUrl = request.headers.get("origin") || "";
    const sharePageUrl = `${baseUrl}/share/${shareId}`;

    return NextResponse.json({
      success: true,
      shareUrl: sharePageUrl,
      shareId,
      count: signedUrls.length,
      expiresAt: expiresAt.toISOString(),
      expiresIn: expires,
      message: `成功创建包含 ${signedUrls.length} 张图片的分享链接`,
    });
  } catch (error) {
    console.error("创建批量分享失败:", error);
    return NextResponse.json(
      { error: "创建分享失败", message: error instanceof Error ? error.message : "未知错误" },
      { status: 500 }
    );
  }
}

/**
 * 获取批量分享数据
 * GET /api/share/batch?id=xxx
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const shareId = searchParams.get("id");

    if (!shareId) {
      return NextResponse.json(
        { error: "请求参数错误", message: "请提供分享 ID" },
        { status: 400 }
      );
    }

    if (!isObsConfigured()) {
      return NextResponse.json(
        { error: "华为云 OBS 未配置" },
        { status: 500 }
      );
    }

    const client = getObsClient();
    const { HUAWEI_OBS_BUCKET, HUAWEI_OBS_PATH_PREFIX } = env;
    const sharePath = HUAWEI_OBS_PATH_PREFIX
      ? `${HUAWEI_OBS_PATH_PREFIX}/shares/${shareId}.json`
      : `shares/${shareId}.json`;

    const result = await client.getObject({
      Bucket: HUAWEI_OBS_BUCKET!,
      Key: sharePath,
    });

    if (result.CommonMsg.Status !== 200) {
      return NextResponse.json(
        { error: "分享不存在或已过期" },
        { status: 404 }
      );
    }

    // 读取数据
    const chunks: Buffer[] = [];
    for await (const chunk of result.InterfaceResult.Content) {
      chunks.push(Buffer.from(chunk));
    }
    const shareData = JSON.parse(Buffer.concat(chunks).toString("utf-8"));

    // 检查是否过期
    if (new Date(shareData.expiresAt) < new Date()) {
      return NextResponse.json(
        { error: "分享已过期" },
        { status: 410 }
      );
    }

    return NextResponse.json({
      success: true,
      ...shareData,
    });
  } catch (error) {
    console.error("获取分享数据失败:", error);
    return NextResponse.json(
      { error: "获取分享失败", message: error instanceof Error ? error.message : "未知错误" },
      { status: 500 }
    );
  }
}
