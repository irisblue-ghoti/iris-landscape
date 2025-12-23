import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const PAGE_SIZE = 16;

// 获取我的资产列表
export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const type = searchParams.get("type"); // 可选：按类型筛选
  const offset = (page - 1) * PAGE_SIZE;

  const where: any = { userId: session.user.id };
  if (type) {
    where.imageType = type;
  }

  const [items, total] = await Promise.all([
    prisma.history.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: offset,
      take: PAGE_SIZE,
    }),
    prisma.history.count({ where }),
  ]);

  // 转换为前端期望的格式
  const formattedItems = items.map((item) => ({
    id: item.id,
    rawPrompt: item.rawPrompt,
    shouldOptimize: item.shouldOptimize,
    image: {
      base64: item.imageUrl,
      prompt: item.imagePrompt,
      model: item.imageModel,
      status: item.imageStatus as "pending" | "success" | "failed",
      size: item.imageSize,
      type: item.imageType,
    },
    video: item.videoTaskId
      ? {
          taskId: item.videoTaskId,
          prompt: item.videoPrompt || "",
          model: item.videoModel || "",
          duration: item.videoDuration || "",
          status: item.videoStatus as "pending" | "success" | "failed",
          url: item.videoUrl,
          coverUrl: item.videoCoverUrl,
          sourceImageBase64: item.videoSourceImage || "",
        }
      : undefined,
    createdAt: item.createdAt.getTime(),
  }));

  return NextResponse.json({
    items: formattedItems,
    total,
    totalPages: Math.ceil(total / PAGE_SIZE),
    currentPage: page,
  });
}

// 添加我的资产
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  const body = await req.json();
  const { rawPrompt, shouldOptimize, image, video } = body;

  if (!image) {
    return NextResponse.json({ error: "缺少图片信息" }, { status: 400 });
  }

  const history = await prisma.history.create({
    data: {
      userId: session.user.id,
      rawPrompt: rawPrompt || "",
      shouldOptimize: shouldOptimize || false,
      imageUrl: image.base64 || "",
      imagePrompt: image.prompt || "",
      imageModel: image.model || "",
      imageStatus: image.status || "pending",
      imageSize: image.size,
      imageType: image.type,
      // 视频字段
      videoTaskId: video?.taskId,
      videoPrompt: video?.prompt,
      videoModel: video?.model,
      videoDuration: video?.duration,
      videoStatus: video?.status,
      videoUrl: video?.url,
      videoCoverUrl: video?.coverUrl,
      videoSourceImage: video?.sourceImageBase64,
    },
  });

  return NextResponse.json({ id: history.id });
}
