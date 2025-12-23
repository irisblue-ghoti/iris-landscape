import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { getObsClient, generateShareUrl, generateShareUrls, isObsConfigured } from "@/lib/obs-client";
import { env } from "@/env";

// 有效期选项（秒）
const EXPIRES_OPTIONS = {
  "1h": 60 * 60,           // 1 小时
  "24h": 24 * 60 * 60,     // 24 小时
  "7d": 7 * 24 * 60 * 60,  // 7 天
  "30d": 30 * 24 * 60 * 60 // 30 天
} as const;

type ExpiresOption = keyof typeof EXPIRES_OPTIONS;

/**
 * 生成带时效的分享链接（使用分享落地页）
 * POST /api/share
 *
 * Body:
 * - url: string (单个 URL)
 * - expires: "1h" | "24h" | "7d" | "30d" (可选，默认 7d)
 */
export async function POST(request: NextRequest) {
  try {
    // 检查 OBS 是否已配置
    if (!isObsConfigured()) {
      return NextResponse.json(
        {
          error: "华为云 OBS 未配置",
          message: "分享功能需要配置华为云 OBS",
        },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { url, expires = "7d" } = body;

    if (!url) {
      return NextResponse.json(
        {
          error: "请求参数错误",
          message: "请提供 url 参数",
        },
        { status: 400 }
      );
    }

    // 验证过期时间
    const expiresInSeconds = EXPIRES_OPTIONS[expires as ExpiresOption] || EXPIRES_OPTIONS["7d"];
    const expiresAt = new Date(Date.now() + expiresInSeconds * 1000);

    // 生成签名 URL
    const signedUrl = await generateShareUrl(url, expiresInSeconds);

    // 创建分享数据
    const shareId = nanoid(10);
    const shareData = {
      id: shareId,
      urls: [signedUrl], // 单个图片也使用数组格式，保持与批量分享一致
      expiresAt: expiresAt.toISOString(),
      createdAt: new Date().toISOString(),
    };

    // 将分享数据上传到 OBS
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

    // 生成分享页面链接
    const baseUrl = request.headers.get("origin") || "";
    const sharePageUrl = `${baseUrl}/share/${shareId}`;

    return NextResponse.json({
      success: true,
      shareUrl: sharePageUrl,
      shareId,
      originalUrl: url,
      expiresAt: expiresAt.toISOString(),
      expiresIn: expires,
      message: "分享链接生成成功",
    });
  } catch (error) {
    console.error("生成分享链接失败:", error);
    return NextResponse.json(
      {
        error: "生成分享链接失败",
        message: error instanceof Error ? error.message : "未知错误",
      },
      { status: 500 }
    );
  }
}
