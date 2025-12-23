import WaterfallGallery from "@/components/ui/gallery/waterfall-gallery";
import { useHistory } from "@/hooks/db/use-gen-history";
import { useMonitorMessage } from "@/hooks/global/use-monitor-message";
import { store } from "@/stores";
import { appConfigAtom } from "@/stores";
import { generationStoreAtom } from "@/stores/slices/generation_store";
import { useAtom } from "jotai";
import { useTranslations } from "next-intl";
import React from "react";

interface HistoryProps {
  pageSize?: number;
}

const History = ({ pageSize }: HistoryProps) => {
  const { history, deleteHistory } = useHistory(1);
  const t = useTranslations();
  const { handleDownload } = useMonitorMessage();
  const [, setGenerationCount] = useAtom(generationStoreAtom);
  const { region } = store.get(appConfigAtom);

  const mediaItems =
    history?.items?.map((history) => {
      let base64Value = history.image.base64 || "";
      // If base64 is a URL and region is 0, replace domain
      if (
        typeof base64Value === "string" &&
        base64Value.includes("file.302.ai") &&
        region === 0
      ) {
        base64Value = base64Value.replace("file.302.ai", "file.302ai.cn");
      }

      return {
        id: history.id,
        desc: history.rawPrompt,
        base64: base64Value,
        url: base64Value,
        historyId: history.id,
        title: history.rawPrompt,
        status: history.image.status,
        type: history.image.type,
      };
    }) || [];

  return (
    <div>
      <WaterfallGallery
        pageSize={pageSize}
        mediaItems={mediaItems}
        title={t("gallery.title")}
        description={t("gallery.description")}
        emptyStateMessage={t("gallery.emptyMessage")}
        insertAtStart
        onDelete={(item) => {
          setGenerationCount((prev) => ({
            ...prev,
            generationCount: Math.max(prev.generationCount - 1, 0),
          }));
          if (item.historyId) {
            deleteHistory(item.historyId);
          }
        }}
        onDownload={async (item) => {
          if (item.base64) {
            handleDownload(item.base64, `${item.desc.slice(0, 30)}_image.png`);
          }
        }}
      />
    </div>
  );
};

export default History;
