"use client";

import UserAuthForm from "@/components/forms/user-auth";
import { appConfigAtom } from "@/stores";
import { useAtom } from "jotai";
import { Waves, Sparkles, User } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect } from "react";

export default function AuthPage() {
  const t = useTranslations();
  const [{ hideBrand }] = useAtom(appConfigAtom);

  useEffect(() => {
    let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }
    link.href = hideBrand ? "/next.ico" : "/favicon.ico";
  }, [hideBrand]);

  return (
    <div className="flex min-h-screen w-full">
      {/* 左侧 Hero 区域 */}
      <div className="relative hidden flex-1 overflow-hidden bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50 dark:from-slate-900 dark:via-blue-950 dark:to-slate-900 lg:flex lg:flex-col lg:justify-center lg:px-12 xl:px-20">
        {/* 装饰性背景 */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -right-40 -top-40 h-80 w-80 rounded-full bg-sky-400/10 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />
          <Waves className="absolute right-20 top-20 h-20 w-20 text-sky-200/30 dark:text-sky-800/30" />
          <Waves className="absolute bottom-20 left-20 h-16 w-16 text-cyan-200/30 dark:text-cyan-800/30" />
        </div>

        <div className="relative z-10">
          {/* Logo */}
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-cyan-500 shadow-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-7 w-7 text-white"
              >
                <path d="M2 12a5 5 0 0 0 5 5 8 8 0 0 1 5 2 8 8 0 0 1 5-2 5 5 0 0 0 5-5V7h-5a8 8 0 0 0-5 2 8 8 0 0 0-5-2H2Z" />
                <path d="M6 11c1.5 0 3 .5 3 2-2 0-3 0-3-2Z" />
                <path d="M18 11c-1.5 0-3 .5-3 2 2 0 3 0 3-2Z" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-slate-900 dark:text-white">
                水下照片处理
              </span>
              <span className="text-sm text-slate-500 dark:text-slate-400">
                专业潜艇摄影工具
              </span>
            </div>
          </div>

          {/* 标签 */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-sky-100 px-4 py-1.5 text-sm font-medium text-sky-700 dark:bg-sky-900/50 dark:text-sky-300">
            <Sparkles className="h-4 w-4" />
            <span>AI 驱动的专业工具</span>
          </div>

          {/* 主标题 */}
          <h1 className="mb-6 text-4xl font-bold leading-tight xl:text-5xl">
            <span className="bg-gradient-to-r from-sky-600 to-cyan-600 bg-clip-text text-transparent dark:from-sky-400 dark:to-cyan-400">
              专业水下照片
              <br />
              增强处理
            </span>
          </h1>

          <p className="mb-8 max-w-md text-lg text-slate-600 dark:text-slate-300">
            一键还原高清画质，让每个水下瞬间更清晰动人。
            支持批量处理，智能识别，专为潜艇摄影定制。
          </p>

          {/* 特性标签 */}
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <div className="h-2 w-2 rounded-full bg-sky-500" />
              <span>批量处理</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <div className="h-2 w-2 rounded-full bg-cyan-500" />
              <span>一键增强</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <div className="h-2 w-2 rounded-full bg-blue-500" />
              <span>智能去雾</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <div className="h-2 w-2 rounded-full bg-indigo-500" />
              <span>色彩还原</span>
            </div>
          </div>
        </div>
      </div>

      {/* 右侧登录区域 */}
      <div className="flex w-full flex-col items-center justify-center bg-white px-6 py-12 dark:bg-slate-950 lg:w-[480px] lg:px-12 xl:w-[520px]">
        {/* 移动端 Logo */}
        <div className="mb-8 flex items-center gap-3 lg:hidden">
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
          <span className="text-lg font-bold text-slate-900 dark:text-white">
            水下照片处理
          </span>
        </div>

        <div className="w-full max-w-sm">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
              <User className="h-6 w-6 text-slate-600 dark:text-slate-400" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              {t("user.auth.title")}
            </h2>
            <p className="mt-2 text-slate-600 dark:text-slate-400">
              {t("user.auth.description")}
            </p>
          </div>

          <UserAuthForm />
        </div>
      </div>
    </div>
  );
}
