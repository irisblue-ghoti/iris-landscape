"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTranslations } from "next-intl";
import { User, CreditCard, History, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ProfileSettings } from "./components/profile-settings";
import { CreditHistory } from "./components/credit-history";
import { CreditTestPanel } from "./components/credit-test-panel";
import { DailyCheckIn } from "@/components/profile/daily-checkin";
import { useUser } from "@/hooks/user";

export default function ProfilePage() {
  const t = useTranslations();
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState("profile");
  const isDev = process.env.NODE_ENV === "development";

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="mb-8">
        <Link
          href={"/" as any}
          className="mb-4 inline-flex items-center gap-2 text-sm text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          返回主页
        </Link>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          个人中心
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          管理您的个人信息和积分记录
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>个人资料</span>
          </TabsTrigger>
          <TabsTrigger value="credits" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            <span>积分记录</span>
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="profile">
            <div className="grid gap-6 lg:grid-cols-2">
              <ProfileSettings />
              <DailyCheckIn />
            </div>
          </TabsContent>

          <TabsContent value="credits">
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <CreditHistory />
              </div>
              {isDev && (
                <div>
                  <CreditTestPanel />
                </div>
              )}
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
