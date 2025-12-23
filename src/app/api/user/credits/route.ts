import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { credits: true },
  });

  return NextResponse.json({ credits: user?.credits ?? 0 });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  const userId = session.user.id;
  const { amount, type, description } = await req.json();

  if (!amount || !type) {
    return NextResponse.json({ error: "缺少参数" }, { status: 400 });
  }

  // 如果是消费（扣减积分），需要检查余额是否足够
  if (amount < 0) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { credits: true },
    });

    const currentCredits = user?.credits ?? 0;
    const requiredCredits = Math.abs(amount);

    if (currentCredits < requiredCredits) {
      return NextResponse.json(
        {
          error: "积分不足",
          error_code: "INSUFFICIENT_CREDITS",
          message: `积分不足，当前余额 ${currentCredits}，需要 ${requiredCredits} 积分，请先充值`,
          currentCredits,
          requiredCredits,
        },
        { status: 402 }
      );
    }
  }

  const result = await prisma.$transaction(async (tx) => {
    await tx.creditRecord.create({
      data: { userId, amount, type, description },
    });

    return tx.user.update({
      where: { id: userId },
      data: { credits: { increment: amount } },
      select: { credits: true },
    });
  });

  return NextResponse.json({ credits: result.credits });
}
