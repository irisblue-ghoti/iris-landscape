"use client";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";

interface Props {
  onAdd: (config: {
    name: string;
    protocol: "webrtc" | "rtsp";
    url: string;
  }) => void;
  disabled?: boolean;
}

export function VideoSourceConfig({ onAdd, disabled }: Props) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [protocol, setProtocol] = useState<"webrtc" | "rtsp">("webrtc");
  const [url, setUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !url) return;

    onAdd({ name, protocol, url });

    // 重置表单
    setName("");
    setUrl("");
    setProtocol("webrtc");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" disabled={disabled}>
          <Plus className="mr-2 h-4 w-4" />
          添加视频源
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>添加视频源</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">名称</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="如：主摄像头、左舷摄像头"
              required
            />
          </div>

          <div>
            <Label>协议</Label>
            <div className="flex gap-4 mt-2">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={protocol === "webrtc"}
                  onChange={() => setProtocol("webrtc")}
                />
                WebRTC
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={protocol === "rtsp"}
                  onChange={() => setProtocol("rtsp")}
                />
                RTSP
              </label>
            </div>
          </div>

          <div>
            <Label htmlFor="url">地址</Label>
            <Input
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder={
                protocol === "webrtc"
                  ? "webrtc://example.com/stream"
                  : "rtsp://192.168.1.100:554/stream"
              }
              required
            />
            <p className="text-xs text-muted-foreground mt-1">
              {protocol === "webrtc"
                ? "WebRTC 视频流地址"
                : "RTSP 视频流地址（需要服务器支持转码）"}
            </p>
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1"
            >
              取消
            </Button>
            <Button type="submit" className="flex-1">
              添加
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
