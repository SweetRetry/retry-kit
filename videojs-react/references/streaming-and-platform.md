# 流媒体配置与平台兼容性

> Video.js v10 + `@videojs/react` Beta

---

## 1. HLS 流媒体

### 基本配置

```tsx
<Video
  src="https://example.com/stream.m3u8"
  type="application/x-mpegURL"
  playsInline
/>
```

**MIME 类型**：`application/x-mpegURL`（标准）或 `video/mp4`（部分 CDN）

### SPF（内置流媒体引擎）

Video.js v10 引入 SPF（Streaming Processor Framework）：
- 简单 HLS 场景体积仅为 v8 的 **19%**
- 不支持高级场景（DRM、服务端广告插入 SSAI）
- 高级场景继续使用 HLS.js 等外部引擎

---

## 2. DASH 流媒体

```tsx
<Video
  src="https://example.com/manifest.mpd"
  type="application/dash+xml"
  playsInline
/>
```

---

## 3. iOS 兼容性

### 关键配置

```tsx
// iOS 强制内嵌播放（不触发系统全屏）
<Video src={src} playsInline />

// 自动播放（iOS 要求同时静音）
<Video src={src} autoPlay muted playsInline />
```

### 平台限制说明

| 限制 | 原因 | 处理方式 |
|------|------|---------|
| 无法控制系统音量 | iOS 不暴露音量 API | 检查 `volumeAvailability === 'unsupported'`，隐藏音量控件 |
| 自动播放需静音 | 浏览器自动播放策略 | 先 `muted`，用户交互后取消静音 |
| 全屏行为不同 | iOS Safari 的全屏实现 | 使用 `fullscreenAvailability` 判断后再展示全屏按钮 |
| HLS 原生支持 | Safari 原生支持 HLS | 无需额外配置，直接传 `.m3u8` |

### 音量控件 iOS 适配示例

```tsx
function VolumeControl() {
  const availability = Player.usePlayer((s) => s.volumeAvailability);
  const volume = Player.usePlayer((s) => s.volume);
  const store = Player.usePlayer();

  if (availability === 'unsupported') return null;

  return (
    <input
      type="range"
      min={0} max={1} step={0.01}
      value={volume}
      disabled={availability === 'unavailable'}
      onChange={(e) => store.setVolume(Number(e.target.value))}
    />
  );
}
```

---

## 4. 浏览器自动播放策略

现代浏览器阻止带声音的自动播放。推荐方案：

```tsx
// 方案一：静音自动播放 + 展示取消静音按钮
<Video src={src} autoPlay muted playsInline />

// 方案二：等待用户交互
function Player() {
  const store = Player.usePlayer();
  return (
    <>
      <Video src={src} playsInline />
      <button onClick={() => store.play()}>点击播放</button>
    </>
  );
}
```

---

## 5. Next.js App Router 配置

```tsx
// components/video-player.tsx
'use client';  // 必须，播放器依赖浏览器 API
import '@videojs/react/video/skin.css';
import { createPlayer } from '@videojs/react';
import { videoFeatures, VideoSkin, Video } from '@videojs/react/video';

const Player = createPlayer({ features: videoFeatures });

export function VideoPlayer({ src }: { src: string }) {
  return (
    <Player.Provider>
      <VideoSkin>
        <Video src={src} playsInline />
      </VideoSkin>
    </Player.Provider>
  );
}
```

```tsx
// app/page.tsx（Server Component）
import { VideoPlayer } from '@/components/video-player';

export default function Page() {
  return <VideoPlayer src="https://..." />;
}
```

**注意**：不要在 `app/page.tsx` 中直接 import CSS 或 `createPlayer`，必须隔离到 Client Component。

---

## 6. 版本状态与迁移

| 状态 | 时间 |
|------|------|
| Alpha | 2026 年 1-2 月 |
| Beta（当前） | 2026 年 3 月 |
| GA | 预计 2026 年中 |

**迁移原则**：
- 旧版 Video.js（v8/v9）API 与 v10 **完全不兼容**，不要混用
- 官方会在 GA 前提供迁移指南，生产应用**等待迁移指南再动**
- 广告支持（SSAI/CSAI）计划在 2026 年 GA 后提供
