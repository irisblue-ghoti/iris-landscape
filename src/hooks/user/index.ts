import { useAtom } from "jotai";
import { userAtom } from "@/stores";
import { useSession } from "next-auth/react";
import { useEffect, useCallback, useRef } from "react";

// 全局状态：追踪已为哪些用户获取过积分
const fetchedUsers = new Set<string>();
let isFetching = false;

// 清除获取缓存（供登出时调用）
export function clearCreditsCache() {
  fetchedUsers.clear();
  isFetching = false;
  console.log("[useCredits] Cache cleared");
}

export function useUser() {
  const [user, setUser] = useAtom(userAtom);
  const { data: session, status } = useSession();
  const prevStatusRef = useRef<string>(status);
  const prevUserIdRef = useRef<string | null>(null);

  useEffect(() => {
    // 只在 status 实际变化时执行
    const statusChanged = prevStatusRef.current !== status;
    prevStatusRef.current = status;

    if (status === "authenticated" && session?.user) {
      const sessionUserId = session.user.id as string;
      const sessionUserEmail = session.user.email || null;
      const sessionUserName = session.user.name || null;

      // 只在 user.id 实际变化时更新
      if (prevUserIdRef.current !== sessionUserId) {
        prevUserIdRef.current = sessionUserId;
        // 如果是新用户登录（用户ID变化），清除之前的缓存
        clearCreditsCache();
        setUser((prev) => ({
          ...prev,
          id: sessionUserId,
          email: sessionUserEmail,
          name: sessionUserName,
        }));
      }
    } else if (status === "unauthenticated" && statusChanged) {
      // 只在状态变化时清空用户信息
      if (prevUserIdRef.current !== null) {
        prevUserIdRef.current = null;
        // 用户登出时清除缓存
        clearCreditsCache();
        setUser({
          id: null,
          email: null,
          name: null,
          credits: 0,
        });
      }
    }
  }, [session?.user?.id, status, setUser]);

  return { user, isLoading: status === "loading" };
}

export function useCredits() {
  const [user, setUser] = useAtom(userAtom);
  const userIdRef = useRef(user.id);

  // 保持 ref 更新
  useEffect(() => {
    userIdRef.current = user.id;
  }, [user.id]);

  const fetchCredits = useCallback(
    async (userId?: string) => {
      const targetUserId = userId || userIdRef.current;
      if (!targetUserId) {
        console.warn("[useCredits] No user ID, skipping fetch");
        return;
      }

      // 如果已经为这个用户获取过，跳过
      if (fetchedUsers.has(targetUserId)) {
        console.log(
          "[useCredits] Already fetched for user",
          targetUserId,
          "skipping"
        );
        return;
      }

      // 如果正在获取中，跳过
      if (isFetching) {
        console.warn("[useCredits] Already fetching, skipping");
        return;
      }

      isFetching = true;
      fetchedUsers.add(targetUserId);
      console.log("[useCredits] fetchCredits START for user", targetUserId);

      try {
        const res = await fetch("/api/user/credits");
        if (res.ok) {
          const data = await res.json();
          console.log("[useCredits] Got credits:", data.credits);
          setUser((prev) => ({ ...prev, credits: data.credits }));
        }
      } catch (error) {
        console.error("Failed to fetch credits:", error);
        // 失败时从集合中移除，允许重试
        fetchedUsers.delete(targetUserId);
      } finally {
        isFetching = false;
        console.log("[useCredits] fetchCredits END");
      }
    },
    [setUser]
  );

  const updateCredits = async (
    amount: number,
    type: string,
    description?: string
  ): Promise<{
    success: boolean;
    error?: string;
    errorCode?: string;
    currentCredits?: number;
    requiredCredits?: number;
  }> => {
    try {
      const res = await fetch("/api/user/credits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, type, description }),
      });

      const data = await res.json();

      if (res.ok) {
        setUser((prev) => ({ ...prev, credits: data.credits }));
        return { success: true };
      }

      // 处理积分不足的情况
      if (res.status === 402 && data.error_code === "INSUFFICIENT_CREDITS") {
        return {
          success: false,
          error: data.message,
          errorCode: data.error_code,
          currentCredits: data.currentCredits,
          requiredCredits: data.requiredCredits,
        };
      }

      return { success: false, error: data.error || "更新积分失败" };
    } catch (error) {
      console.error("Failed to update credits:", error);
      return { success: false, error: "网络错误，请重试" };
    }
  };

  // 检查积分是否足够（不实际扣除）
  const checkCredits = (
    requiredCredits: number
  ): { sufficient: boolean; currentCredits: number; shortfall: number } => {
    const currentCredits = user.credits;
    const sufficient = currentCredits >= requiredCredits;
    return {
      sufficient,
      currentCredits,
      shortfall: sufficient ? 0 : requiredCredits - currentCredits,
    };
  };

  return { credits: user.credits, fetchCredits, updateCredits, checkCredits };
}
