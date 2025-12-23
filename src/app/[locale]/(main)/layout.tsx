"use client";
import AppFooter from "@/components/global/app-footer";
import { useAtom } from "jotai";
import { appConfigAtom } from "@/stores";
import {
  Globe,
  Settings,
  Moon,
  Sun,
  User,
  LogOut,
  Coins,
  Video,
  Upload,
  History,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useUser, useCredits } from "@/hooks/user";
import { signOut } from "next-auth/react";
import { useEffect, useRef } from "react";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [config, setConfig] = useAtom(appConfigAtom);
  const locale = useLocale();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const t = useTranslations();
  const { user, isLoading } = useUser();
  const { credits, fetchCredits } = useCredits();
  const fetchCreditsRef = useRef(fetchCredits);
  const pathname = usePathname();
  const isMainPage = pathname === `/${locale}` || pathname === `/${locale}/`;

  // 保持 ref 更新
  useEffect(() => {
    fetchCreditsRef.current = fetchCredits;
  }, [fetchCredits]);

  // 只在 user.id 或 isLoading 变化时触发
  useEffect(() => {
    console.log(
      "[MainLayout] Effect run - user.id:",
      user.id,
      "isLoading:",
      isLoading
    );
    if (user.id && !isLoading) {
      console.log("[MainLayout] Will fetch credits");
      fetchCreditsRef.current();
    }
  }, [user.id, isLoading]);

  const switchLocale = (newLocale: string) => {
    const currentPath = window.location.pathname;
    const newPath = currentPath.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath as any);
  };

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push(`/${locale}/auth`);
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-slate-50 to-blue-50 dark:from-slate-950 dark:to-slate-900">
      {/* 顶部导航栏 */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md dark:bg-slate-950/80">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          {/* Logo区域 */}
          <div className="flex items-center gap-8">
            <Link href={`/${locale}`} className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-sky-500 to-cyan-500 shadow-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6 text-white"
                >
                  <path d="M2 12a5 5 0 0 0 5 5 8 8 0 0 1 5 2 8 8 0 0 1 5-2 5 5 0 0 0 5-5V7h-5a8 8 0 0 0-5 2 8 8 0 0 0-5-2H2Z" />
                  <path d="M6 11c1.5 0 3 .5 3 2-2 0-3 0-3-2Z" />
                  <path d="M18 11c-1.5 0-3 .5-3 2 2 0 3 0 3-2Z" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-slate-900 dark:text-white">
                  水下照片处理
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  专业潜艇摄影工具
                </span>
              </div>
            </Link>

            {/* 导航链接 */}
            <nav className="hidden items-center gap-1 md:flex">
              <Link
                href={`/${locale}?tab=live`}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
              >
                <Video className="h-4 w-4" />
                实时视频
              </Link>
              <Link
                href={`/${locale}?tab=upload`}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
              >
                <Upload className="h-4 w-4" />
                批量处理
              </Link>
              <Link
                href={`/${locale}?tab=history`}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
              >
                <History className="h-4 w-4" />
                历史记录
              </Link>
            </nav>
          </div>

          {/* 右侧工具栏 */}
          <div className="flex items-center gap-2">
            {/* 用户信息和积分 */}
            {user.id && (
              <div className="mr-2 flex items-center gap-3 rounded-lg border bg-white/50 px-3 py-1.5 dark:border-slate-700 dark:bg-slate-800/50">
                <div className="flex items-center gap-1.5">
                  <Coins className="h-4 w-4 text-amber-500" />
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                    {credits}
                  </span>
                </div>
              </div>
            )}

            {/* 用户菜单 */}
            {user.id && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-9 w-9">
                    <User className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <div className="px-2 py-1.5 text-sm">
                    <p className="font-medium">
                      {user.name || t("user.auth.guest")}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => router.push(`/${locale}/profile`)}
                  >
                    <User className="mr-2 h-4 w-4" />
                    个人中心
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    {t("user.auth.logout")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* 语言切换 */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Globe className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => switchLocale("zh")}>
                  🇨🇳 简体中文
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => switchLocale("en")}>
                  🇺🇸 English
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => switchLocale("ja")}>
                  🇯🇵 日本語
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* 主题切换 */}
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
          </div>
        </div>
      </header>

      {/* 主内容区 */}
      <main className="flex flex-1 flex-col">{children}</main>

      <AppFooter />
    </div>
  );
}
