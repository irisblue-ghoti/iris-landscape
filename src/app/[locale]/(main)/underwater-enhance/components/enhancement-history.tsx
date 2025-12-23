"use client";
import { useHistory } from "@/hooks/db/use-gen-history";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Download,
  Eye,
  Trash2,
  Share2,
  Loader2,
  Check,
  X,
  Calendar as CalendarIcon,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { useShare } from "@/hooks/use-share";
import { ShareDialog } from "@/components/shared/share-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

// 格式化日期为 YYYY-MM-DD
function formatDateKey(date: Date): string {
  return date.toISOString().split("T")[0];
}

// 格式化日期显示
function formatDateDisplay(dateKey: string, t: any): string {
  const date = new Date(dateKey);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const todayKey = formatDateKey(today);
  const yesterdayKey = formatDateKey(yesterday);

  if (dateKey === todayKey) {
    return t("underwater.history.today");
  } else if (dateKey === yesterdayKey) {
    return t("underwater.history.yesterday");
  } else {
    return date.toLocaleDateString();
  }
}

export function EnhancementHistory() {
  const t = useTranslations();
  const shareT = useTranslations("share");
  const { history, deleteHistory } = useHistory();
  const { isSharing } = useShare();
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [collapsedDates, setCollapsedDates] = useState<Set<string>>(new Set());
  const [calendarOpen, setCalendarOpen] = useState(false);

  // Share dialog state
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [shareImageUrl, setShareImageUrl] = useState<string>("");
  const [isBatchShare, setIsBatchShare] = useState(false);
  const [shareImageUrls, setShareImageUrls] = useState<string[]>([]);

  const underwaterHistory = useMemo(
    () =>
      history?.items.filter(
        (item) => item.image?.type === "underwater-enhancement"
      ) || [],
    [history]
  );

  // 按日期分组
  const groupedByDate = useMemo(() => {
    const groups: Record<string, typeof underwaterHistory> = {};

    underwaterHistory.forEach((item) => {
      const dateKey = formatDateKey(new Date(item.createdAt));
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(item);
    });

    // 按日期降序排序
    const sortedKeys = Object.keys(groups).sort(
      (a, b) => new Date(b).getTime() - new Date(a).getTime()
    );

    return { groups, sortedKeys };
  }, [underwaterHistory]);

  // 获取有数据的日期集合（用于日历高亮）
  const datesWithData = useMemo(() => {
    return new Set(groupedByDate.sortedKeys);
  }, [groupedByDate]);

  // 根据日期筛选后的数据
  const filteredHistory = useMemo(() => {
    if (!selectedDate) {
      return underwaterHistory;
    }
    const dateKey = formatDateKey(selectedDate);
    return groupedByDate.groups[dateKey] || [];
  }, [selectedDate, underwaterHistory, groupedByDate]);

  // 按日期分组的筛选后数据
  const filteredGroupedByDate = useMemo(() => {
    if (!selectedDate) {
      return groupedByDate;
    }
    const dateKey = formatDateKey(selectedDate);
    return {
      groups: { [dateKey]: groupedByDate.groups[dateKey] || [] },
      sortedKeys: groupedByDate.groups[dateKey] ? [dateKey] : [],
    };
  }, [selectedDate, groupedByDate]);

  // 获取所有成功的图片
  const successItems = filteredHistory.filter(
    (item) => item.image?.base64 && item.image.status === "success"
  );

  // 获取选中的图片 URL
  const selectedImageUrls = successItems
    .filter((item) => selectedIds.has(item.id))
    .map((item) => item.image.base64);

  const handleDelete = (id: string) => {
    if (confirm(t("underwater.history.confirm_delete"))) {
      deleteHistory(id);
    }
  };

  // 切换选择模式
  const toggleSelectMode = () => {
    setIsSelectMode(!isSelectMode);
    if (isSelectMode) {
      setSelectedIds(new Set());
    }
  };

  // 切换单个选择
  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  // 全选/取消全选（当前筛选结果）
  const toggleSelectAll = () => {
    if (selectedIds.size === successItems.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(successItems.map((item) => item.id)));
    }
  };

  // 选择某个日期的所有图片
  const selectDateItems = (dateKey: string) => {
    const dateItems = groupedByDate.groups[dateKey] || [];
    const successDateItems = dateItems.filter(
      (item) => item.image?.base64 && item.image.status === "success"
    );
    const dateItemIds = successDateItems.map((item) => item.id);

    const allSelected = dateItemIds.every((id) => selectedIds.has(id));

    const newSelected = new Set(selectedIds);
    if (allSelected) {
      dateItemIds.forEach((id) => newSelected.delete(id));
    } else {
      dateItemIds.forEach((id) => newSelected.add(id));
    }
    setSelectedIds(newSelected);
  };

  // 批量分享选中的图片
  const handleBatchShare = () => {
    if (selectedImageUrls.length === 0) return;
    setShareImageUrls(
      successItems
        .filter((item) => selectedIds.has(item.id))
        .map((item) => item.image.base64)
    );
    setIsBatchShare(true);
    setIsShareDialogOpen(true);
  };

  // 单个图片分享
  const handleSingleShare = (imageUrl: string) => {
    setShareImageUrl(imageUrl);
    setIsBatchShare(false);
    setIsShareDialogOpen(true);
  };

  // 关闭分享弹窗
  const handleShareDialogClose = () => {
    setIsShareDialogOpen(false);
    if (isBatchShare) {
      setIsSelectMode(false);
      setSelectedIds(new Set());
    }
  };

  // 切换日期折叠状态
  const toggleDateCollapse = (dateKey: string) => {
    const newCollapsed = new Set(collapsedDates);
    if (newCollapsed.has(dateKey)) {
      newCollapsed.delete(dateKey);
    } else {
      newCollapsed.add(dateKey);
    }
    setCollapsedDates(newCollapsed);
  };

  // 清除日期筛选
  const clearDateFilter = () => {
    setSelectedDate(undefined);
  };

  // 日期选择处理
  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setCalendarOpen(false);
  };

  if (underwaterHistory.length === 0) {
    return (
      <Card className="p-12 text-center">
        <p className="text-muted-foreground">
          {t("underwater.history.no_records")}
        </p>
      </Card>
    );
  }

  // 渲染单个图片卡片
  const renderImageCard = (item: any) => {
    const isSuccess = item.image?.base64 && item.image.status === "success";
    const isSelected = selectedIds.has(item.id);

    return (
      <Card
        key={item.id}
        className={cn(
          "overflow-hidden group relative",
          isSelectMode && isSuccess && "cursor-pointer",
          isSelected && "ring-2 ring-primary"
        )}
        onClick={() => {
          if (isSelectMode && isSuccess) {
            toggleSelect(item.id);
          }
        }}
      >
        {/* 选择模式下的复选框 */}
        {isSelectMode && isSuccess && (
          <div className="absolute top-2 left-2 z-10">
            <Checkbox
              checked={isSelected}
              onCheckedChange={() => toggleSelect(item.id)}
              className="h-6 w-6 bg-white/80 border-2"
            />
          </div>
        )}

        <div className="aspect-video relative">
          {item.image.base64 && (
            <Image
              src={item.image.base64}
              alt="增强后"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              unoptimized
            />
          )}
          {/* 悬停时显示删除按钮（非选择模式） */}
          {!isSelectMode && (
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(item.id);
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}

          {/* 选中状态遮罩 */}
          {isSelectMode && isSelected && (
            <div className="absolute inset-0 bg-primary/20 pointer-events-none" />
          )}
        </div>
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-muted-foreground">
              {new Date(item.createdAt).toLocaleTimeString()}
            </p>
            <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded">
              {item.image.model}
            </span>
          </div>

          {/* 非选择模式下显示操作按钮 */}
          {!isSelectMode && (
            <div className="flex gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => setSelectedImage(item)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    {t("underwater.history.view")}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {t("underwater.history.compare_title")}
                    </DialogTitle>
                  </DialogHeader>
                  {selectedImage && (
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium mb-2">
                          {t("underwater.history.enhanced")}
                        </p>
                        <div className="relative w-full aspect-video rounded-lg overflow-hidden border">
                          <Image
                            src={selectedImage.image.base64}
                            alt="增强后"
                            fill
                            className="object-contain"
                            sizes="(max-width: 1200px) 100vw, 80vw"
                            unoptimized
                          />
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p>
                          <span className="font-medium">
                            {t("underwater.history.process_time")}
                          </span>
                          {new Date(selectedImage.createdAt).toLocaleString()}
                        </p>
                        <p>
                          <span className="font-medium">
                            {t("underwater.history.model_used")}
                          </span>
                          {selectedImage.image.model}
                        </p>
                      </div>
                    </div>
                  )}
                </DialogContent>
              </Dialog>

              <Button variant="default" size="sm" className="flex-1" asChild>
                <a
                  href={item.image.base64}
                  download={`underwater_enhanced_${item.id}.png`}
                >
                  <Download className="h-4 w-4 mr-2" />
                  {t("underwater.history.download")}
                </a>
              </Button>

              {/* 分享按钮 */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSingleShare(item.image.base64)}
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </Card>
    );
  };

  return (
    <div className="space-y-4">
      {/* 顶部操作栏 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-medium">
            {t("underwater.history.total", { count: filteredHistory.length })}
          </h3>

          {/* 日期选择器 */}
          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-[200px] justify-start text-left font-normal",
                  !selectedDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate
                  ? selectedDate.toLocaleDateString()
                  : t("underwater.history.filter_date")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                modifiers={{
                  hasData: (date) => datesWithData.has(formatDateKey(date)),
                }}
                modifiersStyles={{
                  hasData: {
                    fontWeight: "bold",
                    textDecoration: "underline",
                    textDecorationColor: "hsl(var(--primary))",
                  },
                }}
                disabled={(date) => {
                  const dateKey = formatDateKey(date);
                  return !datesWithData.has(dateKey);
                }}
              />
            </PopoverContent>
          </Popover>

          {/* 清除筛选按钮 */}
          {selectedDate && (
            <Button variant="ghost" size="sm" onClick={clearDateFilter}>
              <X className="h-4 w-4 mr-1" />
              {t("underwater.history.clear_filter")}
            </Button>
          )}
        </div>

        <div className="flex gap-2">
          {/* 选择模式按钮 */}
          {successItems.length > 0 && (
            <Button
              variant={isSelectMode ? "default" : "outline"}
              onClick={toggleSelectMode}
            >
              {isSelectMode ? (
                <>
                  <X className="h-4 w-4 mr-2" />
                  {shareT("cancel_select")}
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  {shareT("select_share")}
                </>
              )}
            </Button>
          )}

          {/* 选择模式下的操作按钮 */}
          {isSelectMode && (
            <>
              <Button variant="outline" onClick={toggleSelectAll}>
                {selectedIds.size === successItems.length
                  ? shareT("deselect_all")
                  : shareT("select_all")}
              </Button>

              {selectedIds.size > 0 && (
                <Button onClick={handleBatchShare} disabled={isSharing}>
                  {isSharing ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Share2 className="h-4 w-4 mr-2" />
                  )}
                  {shareT("share_selected")} ({selectedIds.size})
                </Button>
              )}
            </>
          )}
        </div>
      </div>

      {/* 按日期分组显示 */}
      <div className="space-y-6">
        {filteredGroupedByDate.sortedKeys.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground">
              {t("underwater.history.no_records_for_date")}
            </p>
          </Card>
        ) : (
          filteredGroupedByDate.sortedKeys.map((dateKey) => {
            const dateItems = filteredGroupedByDate.groups[dateKey];
            const isCollapsed = collapsedDates.has(dateKey);
            const successDateItems = dateItems.filter(
              (item) => item.image?.base64 && item.image.status === "success"
            );
            const selectedCount = successDateItems.filter((item) =>
              selectedIds.has(item.id)
            ).length;

            return (
              <Collapsible
                key={dateKey}
                open={!isCollapsed}
                onOpenChange={() => toggleDateCollapse(dateKey)}
              >
                <div className="flex items-center gap-2 mb-3">
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" className="p-1">
                      {isCollapsed ? (
                        <ChevronRight className="h-5 w-5" />
                      ) : (
                        <ChevronDown className="h-5 w-5" />
                      )}
                    </Button>
                  </CollapsibleTrigger>
                  <h4 className="text-md font-medium text-muted-foreground">
                    {formatDateDisplay(dateKey, t)}
                  </h4>
                  <span className="text-sm text-muted-foreground">
                    ({dateItems.length} {t("underwater.history.images")})
                  </span>

                  {/* 选择模式下显示日期全选按钮 */}
                  {isSelectMode && successDateItems.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => selectDateItems(dateKey)}
                      className="ml-2"
                    >
                      {selectedCount === successDateItems.length ? (
                        <>
                          <X className="h-4 w-4 mr-1" />
                          {shareT("deselect_all")}
                        </>
                      ) : (
                        <>
                          <Check className="h-4 w-4 mr-1" />
                          {shareT("select_all")}
                        </>
                      )}
                    </Button>
                  )}
                </div>

                <CollapsibleContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {dateItems.map((item) => renderImageCard(item))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            );
          })
        )}
      </div>

      {/* 分享弹窗 */}
      <ShareDialog
        isOpen={isShareDialogOpen}
        onClose={handleShareDialogClose}
        imageUrl={shareImageUrl}
        isBatch={isBatchShare}
        imageUrls={shareImageUrls}
      />
    </div>
  );
}
