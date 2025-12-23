import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CREDIT_CONFIG, CREDIT_TYPES } from "@/config/credits";

// 获取今日日期字符串 (YYYY-MM-DD)
function getTodayString(): string {
  const now = new Date();
  return now.toISOString().split("T")[0];
}

// GET: 查询今日签到状态
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "未登录" }, { status: 401 });
    }

    const today = getTodayString();
    const checkIn = await prisma.dailyCheckIn.findUnique({
      where: {
        userId_date: {
          userId: session.user.id,
          date: today,
        },
      },
    });

    return NextResponse.json({
      hasCheckedIn: !!checkIn,
      date: today,
    });
  } catch {
    return NextResponse.json({ error: "查询失败" }, { status: 500 });
  }
}

// POST: 执行签到
export async function POST() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "未登录" }, { status: 401 });
    }

    const userId = session.user.id;
    const today = getTodayString();

    // 检查今天是否已签到
    const existingCheckIn = await prisma.dailyCheckIn.findUnique({
      where: {
        userId_date: {
          userId,
          date: today,
        },
      },
    });

    if (existingCheckIn) {
      return NextResponse.json(
        { error: "今天已签到", alreadyCheckedIn: true },
        { status: 400 }
      );
    }

    // 使用事务执行签到
    const result = await prisma.$transaction(async (tx) => {
      // 创建签到记录
      await tx.dailyCheckIn.create({
        data: {
          userId,
          date: today,
          credits: CREDIT_CONFIG.DAILY_CHECKIN_REWARD,
        },
      });

      // 创建积分记录
      await tx.creditRecord.create({
        data: {
          userId,
          amount: CREDIT_CONFIG.DAILY_CHECKIN_REWARD,
          type: CREDIT_TYPES.DAILY_CHECKIN,
          description: "每日签到奖励",
        },
      });

      // 更新用户积分
      return tx.user.update({
        where: { id: userId },
        data: { credits: { increment: CREDIT_CONFIG.DAILY_CHECKIN_REWARD } },
        select: { credits: true },
      });
    });

    return NextResponse.json({
      success: true,
      credits: result.credits,
      reward: CREDIT_CONFIG.DAILY_CHECKIN_REWARD,
    });
  } catch {
    return NextResponse.json({ error: "签到失败" }, { status: 500 });
  }
}
