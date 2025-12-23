"use client";

import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { isAuthPath } from "@/utils/path";

export default function AuthLoadingGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const { status } = useSession();
  const pathname = usePathname();

  // 如果正在加载且不在认证页面，显示加载状态
  if (status === "loading" && !isAuthPath(pathname)) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
