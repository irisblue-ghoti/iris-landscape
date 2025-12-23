import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import type { VideoSource, CapturedFrame } from "../types";

// 视频源列表（持久化存储配置）
export const videoSourcesAtom = atomWithStorage<VideoSource[]>(
  "underwater-video-sources",
  []
);

// 当前激活的视频源 ID
export const activeSourceIdAtom = atom<string | null>(null);

// 截图帧队列
export const capturedFramesAtom = atom<CapturedFrame[]>([]);

// 添加视频源
export const addVideoSourceAtom = atom(
  null,
  (get, set, newSource: Omit<VideoSource, "id" | "status">) => {
    const sources = get(videoSourcesAtom);
    const source: VideoSource = {
      ...newSource,
      id: `source-${Date.now()}`,
      status: "disconnected",
    };
    set(videoSourcesAtom, [...sources, source]);
    set(activeSourceIdAtom, source.id);
    return source.id;
  }
);

// 更新视频源
export const updateVideoSourceAtom = atom(
  null,
  (get, set, id: string, updates: Partial<VideoSource>) => {
    const sources = get(videoSourcesAtom);
    set(
      videoSourcesAtom,
      sources.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );
  }
);

// 删除视频源
export const removeVideoSourceAtom = atom(null, (get, set, id: string) => {
  const sources = get(videoSourcesAtom);
  const activeId = get(activeSourceIdAtom);

  set(
    videoSourcesAtom,
    sources.filter((s) => s.id !== id)
  );

  if (activeId === id) {
    const remaining = sources.filter((s) => s.id !== id);
    set(activeSourceIdAtom, remaining.length > 0 ? remaining[0].id : null);
  }
});

// 添加截图帧
export const addCapturedFrameAtom = atom(
  null,
  (get, set, frame: CapturedFrame) => {
    const frames = get(capturedFramesAtom);
    set(capturedFramesAtom, [...frames, frame]);
  }
);

// 删除截图帧
export const removeCapturedFrameAtom = atom(null, (get, set, id: string) => {
  const frames = get(capturedFramesAtom);
  set(
    capturedFramesAtom,
    frames.filter((f) => f.id !== id)
  );
});

// 清空所有截图
export const clearAllFramesAtom = atom(null, (get, set) => {
  set(capturedFramesAtom, []);
});

// 切换截图选中状态
export const toggleFrameSelectionAtom = atom(
  null,
  (get, set, id: string) => {
    const frames = get(capturedFramesAtom);
    set(
      capturedFramesAtom,
      frames.map((f) => (f.id === id ? { ...f, selected: !f.selected } : f))
    );
  }
);

// 获取已选中的截图
export const selectedFramesAtom = atom((get) => {
  const frames = get(capturedFramesAtom);
  return frames.filter((f) => f.selected);
});
