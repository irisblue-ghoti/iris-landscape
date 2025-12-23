import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// 更新我的资产
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();
  const { rawPrompt, shouldOptimize, image, video } = body;

  // 验证记录属于当前用户
  const existing = await prisma.history.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!existing) {
    return NextResponse.json({ error: "记录不存在" }, { status: 404 });
  }

  const updateData: any = {};

  if (rawPrompt !== undefined) updateData.rawPrompt = rawPrompt;
  if (shouldOptimize !== undefined) updateData.shouldOptimize = shouldOptimize;

  if (image) {
    if (image.base64 !== undefined) updateData.imageUrl = image.base64;
    if (image.prompt !== undefined) updateData.imagePrompt = image.prompt;
    if (image.model !== undefined) updateData.imageModel = image.model;
    if (image.status !== undefined) updateData.imageStatus = image.status;
    if (image.size !== undefined) updateData.imageSize = image.size;
    if (image.type !== undefined) updateData.imageType = image.type;
  }

  if (video) {
    if (video.taskId !== undefined) updateData.videoTaskId = video.taskId;
    if (video.prompt !== undefined) updateData.videoPrompt = video.prompt;
    if (video.model !== undefined) updateData.videoModel = video.model;
    if (video.duration !== undefined) updateData.videoDuration = video.duration;
    if (video.status !== undefined) updateData.videoStatus = video.status;
    if (video.url !== undefined) updateData.videoUrl = video.url;
    if (video.coverUrl !== undefined) updateData.videoCoverUrl = video.coverUrl;
    if (video.sourceImageBase64 !== undefined)
      updateData.videoSourceImage = video.sourceImageBase64;
  }

  await prisma.history.update({
    where: { id },
    data: updateData,
  });

  return NextResponse.json({ success: true });
}

// 删除我的资产
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  const { id } = await params;

  // 验证记录属于当前用户
  const existing = await prisma.history.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!existing) {
    return NextResponse.json({ error: "记录不存在" }, { status: 404 });
  }

  await prisma.history.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
