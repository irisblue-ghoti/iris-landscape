import { NextRequest, NextResponse } from "next/server";
import { uploadImageToObs, uploadImagesToObs, isObsConfigured } from "@/lib/obs-client";

/**
 * 上传图片到华为云 OBS
 * POST /api/upload/obs
 */
export async function POST(request: NextRequest) {
  try {
    // 检查 OBS 是否已配置
    if (!isObsConfigured()) {
      return NextResponse.json(
        {
          error: "华为云 OBS 未配置",
          message: "请在 .env.local 中配置华为云 OBS 相关环境变量",
        },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { images, image } = body;

    // 单张图片上传
    if (image) {
      const url = await uploadImageToObs(image);
      return NextResponse.json({
        success: true,
        url,
        message: "图片上传成功",
      });
    }

    // 批量图片上传
    if (images && Array.isArray(images)) {
      const urls = await uploadImagesToObs(images);
      return NextResponse.json({
        success: true,
        urls,
        count: urls.length,
        message: `成功上传 ${urls.length} 张图片`,
      });
    }

    return NextResponse.json(
      {
        error: "请求参数错误",
        message: "请提供 image（单张）或 images（多张）参数",
      },
      { status: 400 }
    );
  } catch (error) {
    console.error("上传到 OBS 失败:", error);
    return NextResponse.json(
      {
        error: "上传失败",
        message: error instanceof Error ? error.message : "未知错误",
      },
      { status: 500 }
    );
  }
}

/**
 * 检查 OBS 配置状态
 * GET /api/upload/obs
 */
export async function GET() {
  const configured = isObsConfigured();

  return NextResponse.json({
    configured,
    message: configured
      ? "华为云 OBS 已配置"
      : "华为云 OBS 未配置，图片将保存为 base64 格式",
  });
}
