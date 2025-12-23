import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { CREDIT_CONFIG, CREDIT_TYPES } from "@/config/credits";

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "缺少必填字段" }, { status: 400 });
    }

    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) {
      return NextResponse.json({ error: "邮箱已注册" }, { status: 400 });
    }

    const hashedPassword = await hash(password, 12);

    // 使用事务创建用户和注册奖励记录
    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          credits: CREDIT_CONFIG.REGISTRATION_BONUS,
        },
        select: { id: true, email: true, name: true, credits: true },
      });

      // 创建注册奖励积分记录
      await tx.creditRecord.create({
        data: {
          userId: newUser.id,
          amount: CREDIT_CONFIG.REGISTRATION_BONUS,
          type: CREDIT_TYPES.REGISTRATION,
          description: "注册奖励",
        },
      });

      return newUser;
    });

    return NextResponse.json(user);
  } catch {
    return NextResponse.json({ error: "注册失败" }, { status: 500 });
  }
}
