import { createScopedLogger } from "@/utils/logger";
import { useState, useEffect, useCallback } from "react";
import { History, AddHistory } from "@/db/types";

const logger = createScopedLogger("use-gen-history");
const PAGE_SIZE = 16;

interface HistoryResponse {
  items: History[];
  total: number;
  totalPages: number;
  currentPage: number;
}

export const useHistory = (page = 1, type?: string) => {
  const [history, setHistory] = useState<HistoryResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 获取我的资产
  const fetchHistory = useCallback(async () => {
    try {
      const params = new URLSearchParams({ page: page.toString() });
      if (type) {
        params.set("type", type);
      }

      const res = await fetch(`/api/history?${params}`);
      if (res.ok) {
        const data = await res.json();
        setHistory(data);
      } else {
        logger.error("Failed to fetch history");
      }
    } catch (error) {
      logger.error("Error fetching history:", error);
    } finally {
      setIsLoading(false);
    }
  }, [page, type]);

  // 初始加载和刷新
  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  // 添加我的资产
  const addHistory = useCallback(
    async (historyData: AddHistory): Promise<string> => {
      try {
        const res = await fetch("/api/history", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(historyData),
        });

        if (res.ok) {
          const { id } = await res.json();
          // 刷新列表
          fetchHistory();
          return id;
        } else {
          throw new Error("Failed to add history");
        }
      } catch (error) {
        logger.error("Error adding history:", error);
        throw error;
      }
    },
    [fetchHistory]
  );

  // 更新我的资产
  const updateHistory = useCallback(
    async (id: string, historyData: Partial<History>) => {
      try {
        const res = await fetch(`/api/history/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(historyData),
        });

        if (res.ok) {
          // 刷新列表
          fetchHistory();
        } else {
          logger.error("Failed to update history");
        }
      } catch (error) {
        logger.error("Error updating history:", error);
      }
    },
    [fetchHistory]
  );

  // 删除我的资产
  const deleteHistory = useCallback(
    async (id: string) => {
      try {
        const res = await fetch(`/api/history/${id}`, {
          method: "DELETE",
        });

        if (res.ok) {
          // 刷新列表
          fetchHistory();
        } else {
          logger.error("Failed to delete history");
        }
      } catch (error) {
        logger.error("Error deleting history:", error);
      }
    },
    [fetchHistory]
  );

  // 更新我的资产的图片
  const updateHistoryImage = useCallback(
    async (
      historyId: string,
      index: number,
      image: {
        base64: string;
        prompt: string;
        model: string;
        status: "success" | "failed";
      }
    ) => {
      await updateHistory(historyId, { image });
    },
    [updateHistory]
  );

  // 更新图片状态
  const updateHistoryImageStatus = useCallback(
    async (
      historyId: string,
      index: number,
      status: "pending" | "success" | "failed"
    ) => {
      await updateHistory(historyId, {
        image: { status } as any,
      });
    },
    [updateHistory]
  );

  // 添加视频到我的资产
  const addVideoToHistory = useCallback(
    async (
      historyId: string,
      videoData: {
        taskId: string;
        prompt: string;
        model: string;
        duration: string;
        sourceImageBase64: string;
      }
    ) => {
      await updateHistory(historyId, {
        video: {
          ...videoData,
          status: "pending" as const,
        },
      });
    },
    [updateHistory]
  );

  // 更新视频状态
  const updateVideoStatus = useCallback(
    async (
      historyId: string,
      status: "pending" | "success" | "failed",
      url?: string,
      coverUrl?: string
    ) => {
      await updateHistory(historyId, {
        video: {
          status,
          url,
          coverUrl,
        } as any,
      });
    },
    [updateHistory]
  );

  // 获取待处理的视频（目前返回空数组，后续可添加 API）
  const getPendingVideos = useCallback(async () => {
    // TODO: 添加获取待处理视频的 API
    return [];
  }, []);

  return {
    history,
    isLoading,
    addHistory,
    updateHistory,
    deleteHistory,
    updateHistoryImage,
    updateHistoryImageStatus,
    addVideoToHistory,
    updateVideoStatus,
    getPendingVideos,
    refreshHistory: fetchHistory,
  };
};
