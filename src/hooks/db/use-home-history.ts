import { createScopedLogger } from "@/utils/logger";
import { useLiveQuery } from "dexie-react-hooks";

import { db } from "@/db";
import { History } from "@/db/types";
import { useCallback } from "react";
import { AddHistory } from "@/db/types";

const logger = createScopedLogger("use-gen-history");
const PAGE_SIZE = 18;

export const useHomeHistory = (page = 1, pageSize = PAGE_SIZE) => {
  const offset = (page - 1) * pageSize;

  const history = useLiveQuery(async () => {
    const [items, total] = await Promise.all([
      db.history
        .orderBy("createdAt")
        .reverse()
        .offset(offset)
        .limit(pageSize)
        .toArray(),
      db.history.count(),
    ]);

    return {
      items,
      total,
      totalPages: Math.ceil(total / pageSize),
      currentPage: page,
    };
  }, [page, pageSize, offset]);

  const addHistory = useCallback(async (history: AddHistory) => {
    const id = crypto.randomUUID();
    await db.history.add({
      ...history,
      id,
      createdAt: Date.now(),
    });
    return id;
  }, []);

  const updateHistory = useCallback((id: string, history: Partial<History>) => {
    db.history.update(id, history);
  }, []);

  const deleteHistory = useCallback((id: string) => {
    db.history.delete(id);
  }, []);

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
      await db.history
        .where("id")
        .equals(historyId)
        .modify((history: History) => {
          history.image = image;
        });
    },
    []
  );

  const updateHistoryImageStatus = useCallback(
    async (
      historyId: string,
      index: number,
      status: "pending" | "success" | "failed"
    ) => {
      await db.history
        .where("id")
        .equals(historyId)
        .modify((history: History) => {
          history.image.status = status;
        });
    },
    []
  );

  return {
    history,
    addHistory,
    updateHistory,
    deleteHistory,
    updateHistoryImage,
    updateHistoryImageStatus,
  };
};
