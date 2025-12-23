"use client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Check, Trash2 } from "lucide-react";
import Image from "next/image";
import type { CapturedFrame } from "../types";

interface Props {
  frames: CapturedFrame[];
  onToggleSelection: (id: string) => void;
  onRemove: (id: string) => void;
  onClearAll: () => void;
  onProcess: () => void;
}

export function FrameQueue({
  frames,
  onToggleSelection,
  onRemove,
  onClearAll,
  onProcess,
}: Props) {
  const selectedCount = frames.filter((f) => f.selected).length;

  if (frames.length === 0) {
    return null;
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">
            📸 截图队列 ({frames.length} 张)
          </h3>
          <p className="text-sm text-muted-foreground">
            已选中 {selectedCount} 张
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onClearAll}>
            <Trash2 className="mr-1 h-4 w-4" />
            清空
          </Button>
          <Button
            size="sm"
            onClick={onProcess}
            disabled={selectedCount === 0}
            className="bg-gradient-to-r from-sky-500 to-cyan-500"
          >
            处理 {selectedCount > 0 && `(${selectedCount})`}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {frames.map((frame) => (
          <div
            key={frame.id}
            className={`group relative aspect-video overflow-hidden rounded-xl border-2 transition-all ${
              frame.selected
                ? "border-sky-500 shadow-lg"
                : "border-slate-200 dark:border-slate-700"
            } hover:scale-105 hover:shadow-xl cursor-pointer`}
            onClick={() => onToggleSelection(frame.id)}
          >
            <Image
              src={frame.dataUrl}
              alt={`${frame.sourceName} - ${new Date(
                frame.timestamp
              ).toLocaleTimeString()}`}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            />

            {/* 选中标记 */}
            {frame.selected && (
              <div className="absolute top-2 left-2 bg-sky-500 text-white rounded-full p-1">
                <Check className="h-4 w-4" />
              </div>
            )}

            {/* 删除按钮 */}
            <Button
              size="icon"
              variant="destructive"
              className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                onRemove(frame.id);
              }}
            >
              <X className="h-4 w-4" />
            </Button>

            {/* 信息栏 */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <p className="text-xs text-white truncate">{frame.sourceName}</p>
              <p className="text-xs text-white/70">
                {new Date(frame.timestamp).toLocaleTimeString("zh-CN")}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
