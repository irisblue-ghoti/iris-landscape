"use client";

import { usePathname, useRouter } from "@/i18n/routing";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

// 简化的认证守卫
// 只处理：未登录跳转登录页，已登录在登录页跳转首页
const SimpleAuthGuard = () => {
  const router = useRouter();
  const { status } = useSession();
  const pathname = usePathname();

  const isAuthPage = pathname.includes("/auth");

  useEffect(() => {
    if (status === "loading") return;

    if (status === "authenticated" && isAuthPage) {
      router.replace("/");
    } else if (status === "unauthenticated" && !isAuthPage) {
      router.push("/auth");
    }
  }, [status, isAuthPage, router, pathname]);

  return null;
};

export default SimpleAuthGuard;
