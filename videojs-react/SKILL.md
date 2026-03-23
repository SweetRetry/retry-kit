---
name: videojs-react
description: >
  Video.js v10 (@videojs/react) React 视频播放器开发技能。覆盖
  createPlayer 工厂模式、features 组合系统、Provider/usePlayer 状态订阅、
  skins 使用与 eject、平台兼容性处理和性能优化。

  触发场景：(1) 使用 @videojs/react 构建视频/音频播放器，
  (2) 遇到 Video.js v10 播放、状态、样式相关问题，
  (3) 需要自定义控制栏或 eject skin，
  (4) 从 Video.js v8/v9 迁移到 v10，
  (5) 用户代码中出现 @videojs/react 的 import。

  Triggers: video.js, videojs, @videojs/react, createPlayer, VideoSkin,
  usePlayer, video player react, videojs v10, videojs react integration.
---

# Video.js v10 React 开发规范

> `@videojs/react` v10 Beta（GA 预计 2026 年中）。**不要在生产环境迁移现有应用，等待官方迁移指南。**

核心原则：

1. **工厂在外** —— `createPlayer()` 永远在模块级别调用，不在组件内
2. **selector 订阅** —— `usePlayer(s => s.xxx)` 取最小状态，不订阅全 store
3. **按需 features** —— 只引入用到的 features，利用 tree-shaking 减小包体积
4. **先检查可用性** —— volume/fullscreen/pip 等 features 有平台限制，先读 `*Availability`

---

## 1) 触发边界

### 必须触发

- 用户代码 import 了 `@videojs/react`
- 用户要构建视频播放器、音频播放器、背景视频
- 用户遇到 Video.js v10 相关问题（播放控制、状态订阅、皮肤定制等）
- 用户要从旧版 Video.js 迁移到 v10

### 不适用

- Video.js v8/v9（旧版 API 完全不同）
- 使用其他播放器库（Plyr、Vidstack、react-player 等）
- 纯 `<video>` 原生标签场景

---

## 2) 启动检查清单

每次开始 Video.js v10 相关工作前，先验证：

1. **包名**：`@videojs/react`（而非旧版 `video.js`）
2. **样式导入**：`import '@videojs/react/video/skin.css'`（按 preset 对应导入）
3. **createPlayer 位置**：在组件**外部**（模块级）调用，不在函数体内
4. **Provider 包裹**：`usePlayer` 必须在 `<Player.Provider>` 的子树内调用
5. **`'use client'`**：Next.js App Router 中播放器组件必须标记为 Client Component

---

## 3) 安装与快速开始

```bash
npm install @videojs/react
# 或 pnpm / yarn / bun
```

最小可运行示例（视频播放器）：

```tsx
// components/player/index.tsx
'use client';
import '@videojs/react/video/skin.css';
import { createPlayer } from '@videojs/react';
import { videoFeatures, VideoSkin, Video } from '@videojs/react/video';

// ✅ 模块级调用，引用永远稳定
const Player = createPlayer({ features: videoFeatures });

export function MyPlayer({ src }: { src: string }) {
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
// app/page.tsx
import { MyPlayer } from '../components/player';

export default function Page() {
  return <MyPlayer src="https://example.com/video.mp4" />;
}
```

---

## 4) createPlayer 与 Features 系统

### 4.1 createPlayer 返回值

```tsx
const Player = createPlayer({ features: [...] });
// Player.Provider   — 状态管理层，初始化 Zustand store，必须包裹整个播放器树
// Player.Container  — 布局容器层（forwardRef div），将 DOM 元素注册给 store
// Player.usePlayer  — 状态订阅 hook
```

**Provider vs Container 的区别**：

| | `Player.Provider` | `Player.Container` |
|--|--|--|
| 职责 | 初始化并分发 store（Context） | 包装 DOM，注册容器引用 |
| display | `contents`（不影响布局） | 正常 `<div>` 布局 |
| 必须用 | ✅ 是 | 视情况而定 |

**何时需要 Container**：使用 VideoSkin 等官方 skin 时，Container 已内置其中，不需要手动写。自定义最小播放器（只要状态，不要标准 UI 布局）时可省略 Container，只保留 Provider。

```tsx
// 完整模式（Provider + Container，VideoSkin 内部已处理）
<Player.Provider>
  <VideoSkin>
    <Video src={src} />
  </VideoSkin>
</Player.Provider>

// 自定义最小化（省略 Container）
<Player.Provider>
  <Video src={src} />
  <MyCustomControls />
</Player.Provider>
```

### 4.2 三种 Preset

| Preset | Features | Skin | 导入路径 |
|--------|----------|------|----------|
| 视频播放器 | `videoFeatures` | `<VideoSkin>`, `<MinimalVideoSkin>` | `@videojs/react/video` |
| 音频播放器 | `audioFeatures` | `<AudioSkin>`, `<MinimalAudioSkin>` | `@videojs/react/audio` |
| 背景视频 | `backgroundFeatures` | `<BackgroundVideoSkin>` | `@videojs/react/background` |

背景视频（无控件、无音量）：

```tsx
import { createPlayer } from '@videojs/react';
import { backgroundFeatures, BackgroundVideoSkin, BackgroundVideo } from '@videojs/react/background';
import '@videojs/react/background/skin.css';

const Player = createPlayer({ features: backgroundFeatures });

export function HeroBg({ src }: { src: string }) {
  return (
    <Player.Provider>
      <BackgroundVideoSkin>
        <BackgroundVideo src={src} autoPlay muted loop playsInline />
      </BackgroundVideoSkin>
    </Player.Provider>
  );
}
```

### 4.3 按需组合 Features

不用 preset 时，按需选取 features（获得最小包体积）：

```tsx
import { createPlayer, features } from '@videojs/react';

const Player = createPlayer({
  features: [
    features.playback,   // 播放/暂停状态
    features.volume,     // 音量控制
    features.fullscreen, // 全屏
  ],
});
```

> 每个 feature 是一个独立的 Zustand store slice，tree-shaking 可精确移除未引入的代码。

---

## 5) usePlayer —— 状态订阅

### 5.1 基本用法

```tsx
// ❌ 订阅全 store，任何状态变化都重渲染
const store = Player.usePlayer();

// ✅ selector 订阅，只在 paused 变化时重渲染
const paused = Player.usePlayer((s) => s.paused);
```

### 5.2 常用状态与操作

```tsx
function Controls() {
  const paused = Player.usePlayer((s) => s.paused);
  const volume = Player.usePlayer((s) => s.volume);
  const fullscreen = Player.usePlayer((s) => s.fullscreen);
  const store = Player.usePlayer();

  return (
    <div>
      <button onClick={() => (paused ? store.play() : store.pause())}>
        {paused ? '播放' : '暂停'}
      </button>
      <input
        type="range"
        min={0} max={1} step={0.1}
        value={volume}
        onChange={(e) => store.setVolume(Number(e.target.value))}
      />
      <button onClick={() => store.requestFullscreen()}>
        {fullscreen ? '退出全屏' : '全屏'}
      </button>
    </div>
  );
}
```

### 5.3 Feature 预构建 Selector

每个 feature 提供 selector（比手写选择器更稳定）：

```tsx
import { selectPlayback, selectVolume } from '@videojs/react';

const { paused, currentTime, duration } = Player.usePlayer(selectPlayback);
const { volume, muted } = Player.usePlayer(selectVolume);
```

---

## 6) 平台兼容性处理

`volume`、`fullscreen`、`picture-in-picture` 在部分平台不可用（如 iOS Safari 不支持 volume 控制）。

**必须在渲染前检查 availability**：

```tsx
function VolumeControl() {
  const volumeAvailability = Player.usePlayer((s) => s.volumeAvailability);
  const volume = Player.usePlayer((s) => s.volume);
  const store = Player.usePlayer();

  // 'unavailable' = 平台不支持但有 API；'unsupported' = 完全不支持
  if (volumeAvailability === 'unsupported') return null;

  return (
    <input
      type="range"
      disabled={volumeAvailability === 'unavailable'}
      value={volume}
      onChange={(e) => store.setVolume(Number(e.target.value))}
    />
  );
}
```

| Feature | Availability 属性 | 常见限制 |
|---------|------------------|---------|
| volume | `volumeAvailability` | iOS Safari 不支持音量控制 |
| fullscreen | `fullscreenAvailability` | 部分 iframe 限制 |
| picture-in-picture | `pipAvailability` | 非 HTTPS 或老旧浏览器 |

可用值：`'available'` / `'unavailable'` / `'unsupported'`

---

## 7) Skins 与自定义控制栏

### 7.1 两种使用模式

**Packaged（推荐起点）**：直接用官方提供的 Skin 组件，限制定制空间，自动跟随版本更新。

```tsx
<Player.Provider>
  <VideoSkin>          {/* 或 MinimalVideoSkin */}
    <Video src={src} />
  </VideoSkin>
</Player.Provider>
```

**Ejected（完全控制）**：将 Skin 内部组件复制到项目中，获得全部定制能力，手动管理更新。

> 目前 eject = 从文档复制源码到项目。未来会提供 CLI 工具。

### 7.2 VideoSkin eject 后可用的 Primitives

VideoSkin eject 出来包含以下 UI primitive（每个只输出单个 HTML 元素）：

| Primitive | 说明 |
|-----------|------|
| `AlertDialog` | 错误/重要信息对话框 |
| `BufferingIndicator` | 缓冲加载 loading 指示器 |
| `CaptionsButton` | 字幕开关按钮 |
| `Controls` | 控制栏容器 |
| `FullscreenButton` | 全屏按钮 |
| `MuteButton` | 静音按钮 |
| `PiPButton` | 画中画按钮 |
| `PlayButton` | 播放/暂停按钮 |
| `PlaybackRateButton` | 播放速率按钮 |
| `Popover` | 弹出菜单容器 |
| `Poster` | 视频封面 |
| `SeekButton` | 快进/快退按钮 |
| `Slider` | 通用滑块基础组件 |
| `Thumbnail` | 进度条 hover 时的缩略图预览 |
| `TimeSlider` | 进度条（复合组件，见下） |
| `Time` | 时间显示（当前时间/总时长） |
| `Tooltip` | 悬停提示框 |
| `VolumeSlider` | 音量滑块 |

`TimeSlider` 是复合组件：

```tsx
<TimeSlider.Root>
  <TimeSlider.Track>
    <TimeSlider.Buffer />   {/* 已缓冲区域 */}
    <TimeSlider.Fill />     {/* 已播放区域 */}
  </TimeSlider.Track>
  <TimeSlider.Thumb />      {/* 拖拽把手 */}
</TimeSlider.Root>
```

### 7.3 Thumbnail 组件说明

`Thumbnail` 是进度条 hover 预览缩略图，**不会自动截帧**，需要你提前生成图片资源。

**使用方式**：

```tsx
import { Thumbnail } from '@videojs/react';

// 传入预生成的 thumbnails 数组（优先级最高）
<Thumbnail
  time={hoveredTime}
  thumbnails={[
    { src: 'sprite.jpg', startTime: 0, endTime: 30, x: 0, y: 0, width: 160, height: 90 },
    // ...
  ]}
/>

// 或通过 <Video> 的 <track> 标签提供 VTT 文件（自动解析）
<Video src="video.mp4">
  <track kind="metadata" src="thumbnails.vtt" />
</Video>
```

**图片资源生成**：需在服务端用 FFmpeg 等工具预先截帧，生成 sprite 图或 VTT 文件后传入。

### 7.4 自定义控制栏（基于 usePlayer）

不使用内置 Skin，完全自己构建控制栏：

```tsx
const Player = createPlayer({ features: [features.playback, features.volume] });

function CustomControls() {
  const paused = Player.usePlayer((s) => s.paused);
  const store = Player.usePlayer();
  return (
    <div className="controls">
      <button onClick={() => (paused ? store.play() : store.pause())}>
        {paused ? '▶' : '⏸'}
      </button>
    </div>
  );
}

export function CustomPlayer({ src }: { src: string }) {
  return (
    <Player.Provider>
      <div style={{ position: 'relative' }}>
        <Video src={src} playsInline />
        <CustomControls />
      </div>
    </Player.Provider>
  );
}
```

---

## 8) HLS / DASH 流媒体

### 8.1 Source 类型

```tsx
// HLS（.m3u8）
<Video src="https://example.com/stream.m3u8" type="application/x-mpegURL" playsInline />

// DASH（.mpd）
<Video src="https://example.com/manifest.mpd" type="application/dash+xml" playsInline />
```

### 8.2 SPF（新流媒体引擎）

Video.js v10 内置 SPF（Streaming Processor Framework），针对简单 HLS 场景体积仅为 v8 的 19%。
SPF 尚不替代 HLS.js（高级 DRM/广告场景仍需外部引擎）。

### 8.3 iOS 必备配置

```tsx
// iOS 必须加 playsInline，否则触发系统全屏
<Video src={src} playsInline autoPlay muted />
```

---

## 9) 核心反模式

| 反模式 | 后果 | 正确做法 |
|--------|------|---------|
| `createPlayer()` 在组件内调用 | 每次渲染重建 player 实例 | 移到模块级别 |
| `usePlayer()` 无 selector | 任何状态变化都重渲染 | 传入 selector `(s) => s.xxx` |
| `usePlayer` 在 Provider 外调用 | Context 报错 | 确保在 `<Player.Provider>` 子树内 |
| 未导入 skin.css | 控件显示异常 | `import '@videojs/react/video/skin.css'` |
| 不检查 `*Availability` 直接渲染控件 | iOS 等平台 UI 损坏 | 先读 availability 再决定是否渲染 |
| v10 用于生产迁移 | API 仍在 Beta | 等待 GA（预计 2026 年中） |

---

## 10) 故障排查速查

| 症状 | 最可能原因 | 修复 |
|------|-----------|------|
| 控件无样式/不显示 | 缺少 CSS 导入 | `import '@videojs/react/video/skin.css'` |
| `usePlayer` context 报错 | Provider 未包裹 | `<Player.Provider>` 包在外层 |
| 播放器每次渲染重置 | `createPlayer` 在组件内 | 移到模块级别 |
| iOS 音量控件无效 | 平台不支持 | 检查 `volumeAvailability` |
| iOS 全屏覆盖整个页面 | 缺少 `playsInline` | `<Video playsInline />` |
| Next.js 报错（SSR） | 缺少 `'use client'` | 播放器组件顶部加 `'use client'` |
| HLS 不播放 | 缺少 type 声明 | `type="application/x-mpegURL"` |
| 字幕不显示 | textTrack mode 不对 | `setTextTrackMode(index, 'showing')` |
| Thumbnail 不出现 | 未提供图片资源 | 需预生成 sprite 图或 VTT 文件 |
| 播放速率按钮无效 | 未引入 playbackRate feature | `features: [..., features.playbackRate]` |

---

> 详细 API 见 `references/api-reference.md`
> 流媒体配置与平台兼容性见 `references/streaming-and-platform.md`
