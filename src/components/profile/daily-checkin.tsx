"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar, Coins, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { CREDIT_CONFIG } from "@/config/credits";

export function DailyCheckIn() {
  const t = useTranslations();
  const [hasCheckedIn, setHasCheckedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    checkTodayStatus();
  }, []);

  async function checkTodayStatus() {
    try {
      const res = await fetch("/api/user/daily-checkin");
      if (res.ok) {
        const data = await res.json();
        setHasCheckedIn(data.hasCheckedIn);
      }
    } catch (error) {
      console.error("Failed to check status:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCheckIn() {
    setIsChecking(true);
    try {
      const res = await fetch("/api/user/daily-checkin", { method: "POST" });
      const data = await res.json();

      if (res.ok) {
        setHasCheckedIn(true);
        toast.success(t("credits.checkin.success", { reward: data.reward }));
        // 触发积分刷新
        window.dispatchEvent(new Event("credits-updated"));
      } else {
        toast.error(data.error || t("credits.checkin.failed"));
      }
    } catch {
      toast.error(t("credits.checkin.failed"));
    } finally {
      setIsChecking(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          {t("credits.checkin.title")}
        </CardTitle>
        <CardDescription>
          {t("credits.checkin.description", {
            amount: CREDIT_CONFIG.DAILY_CHECKIN_REWARD,
          })}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Button disabled className="w-full">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {t("common.loading")}
          </Button>
        ) : hasCheckedIn ? (
          <Button disabled variant="secondary" className="w-full">
            <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
            {t("credits.checkin.already")}
          </Button>
        ) : (
          <Button
            onClick={handleCheckIn}
            disabled={isChecking}
            className="w-full"
          >
            {isChecking ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Coins className="mr-2 h-4 w-4" />
            )}
            {t("credits.checkin.button")}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
