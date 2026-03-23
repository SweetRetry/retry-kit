# Video.js v10 API 速查

> `@videojs/react` v10 Beta。所有示例均基于 React + TypeScript。

---

## 1. createPlayer

```tsx
createPlayer(options: { features: Feature[] }): {
  Provider: React.ComponentType<{ children: React.ReactNode }>;
  Container: React.ComponentType<{ children: React.ReactNode }>;
  usePlayer: UsePlayer;
}
```

**选项**：

| 参数 | 类型 | 说明 |
|------|------|------|
| `features` | `Feature[]` | feature 数组或 preset（如 `videoFeatures`） |

---

## 2. usePlayer

```tsx
// 完整 store（谨慎使用，任何状态变化都重渲染）
const store = Player.usePlayer();

// selector 订阅（推荐）
const paused = Player.usePlayer((s) => s.paused);

// 使用内置 selector
import { selectPlayback } from '@videojs/react';
const { paused, currentTime, duration } = Player.usePlayer(selectPlayback);
```

### 状态属性（按 feature 分组）

**playback feature**：

| 属性 | 类型 | 说明 |
|------|------|------|
| `paused` | `boolean` | 是否暂停 |
| `currentTime` | `number` | 当前播放时间（秒） |
| `duration` | `number` | 总时长（秒） |
| `ended` | `boolean` | 是否播放结束 |
| `seeking` | `boolean` | 是否正在 seek |
| `buffered` | `TimeRanges` | 已缓冲范围 |

**volume feature**：

| 属性 | 类型 | 说明 |
|------|------|------|
| `volume` | `number` | 音量 0-1 |
| `muted` | `boolean` | 是否静音 |
| `volumeAvailability` | `Availability` | 平台可用性 |

**fullscreen feature**：

| 属性 | 类型 | 说明 |
|------|------|------|
| `fullscreen` | `boolean` | 是否全屏 |
| `fullscreenAvailability` | `Availability` | 平台可用性 |

**picture-in-picture feature**：

| 属性 | 类型 | 说明 |
|------|------|------|
| `pip` | `boolean` | 是否画中画 |
| `pipAvailability` | `Availability` | 平台可用性 |

**subtitles feature**：

| 属性 | 类型 | 说明 |
|------|------|------|
| `textTracks` | `TextTrackList` | 所有可用的文本轨道列表 |
| `subtitlesShowing` | `boolean` | 字幕是否显示 |

每个 `TextTrack` 的 `mode`：`'disabled'`（不显示）/ `'hidden'`（已加载不显示）/ `'showing'`（显示中）。同时只能有一个轨道处于 `showing` 状态。

**playbackRate feature**：

| 属性 | 类型 | 说明 |
|------|------|------|
| `playbackRate` | `number` | 当前播放速率（1.0 = 正常） |

### 操作方法

| 方法 | 说明 |
|------|------|
| `store.play()` | 播放 |
| `store.pause()` | 暂停 |
| `store.seek(time: number)` | 跳转到指定时间 |
| `store.setVolume(volume: number)` | 设置音量（0-1） |
| `store.setMuted(muted: boolean)` | 设置静音 |
| `store.requestFullscreen()` | 请求全屏 |
| `store.exitFullscreen()` | 退出全屏 |
| `store.requestPip()` | 请求画中画 |
| `store.exitPip()` | 退出画中画 |
| `store.setPlaybackRate(rate: number)` | 设置播放速率（如 0.5, 1, 1.5, 2） |
| `store.setTextTrackMode(index, mode)` | 设置字幕轨道显示模式 |

### Availability 类型

```tsx
type Availability = 'available' | 'unavailable' | 'unsupported';
// 'available'   — 完全支持
// 'unavailable' — 平台有此 API 但当前不可用（如 iframe 限制）
// 'unsupported' — 平台完全不支持
```

---

## 3. 媒体组件

### Video

```tsx
import { Video } from '@videojs/react/video';

<Video
  src="video.mp4"           // 视频地址
  type="video/mp4"          // MIME 类型（HLS/DASH 时必须填写）
  playsInline               // iOS 必须，避免系统全屏
  autoPlay                  // 自动播放（需 muted）
  muted                     // 静音（自动播放前提）
  loop                      // 循环播放
  poster="thumbnail.jpg"    // 封面图
/>
```

### Audio

```tsx
import { Audio } from '@videojs/react/audio';
<Audio src="audio.mp3" />
```

### BackgroundVideo

```tsx
import { BackgroundVideo } from '@videojs/react/background';
<BackgroundVideo src="bg.mp4" autoPlay muted loop playsInline />
```

---

## 4. 内置 Selector

```tsx
import {
  selectPlayback,      // { paused, currentTime, duration, ended, seeking }
  selectVolume,        // { volume, muted, volumeAvailability }
  selectFullscreen,    // { fullscreen, fullscreenAvailability }
  selectPip,           // { pip, pipAvailability }
  selectSubtitles,     // { subtitlesShowing, textTracks }
  selectPlaybackRate,  // { playbackRate }
} from '@videojs/react';
```

---

## 5. Features 列表

```tsx
import { features } from '@videojs/react';

features.playback        // 播放/暂停/时间/缓冲
features.volume          // 音量/静音
features.fullscreen      // 全屏
features.pictureinpicture // 画中画
features.subtitles       // 字幕/文字轨道
features.playbackRate    // 播放速率
features.autoplay        // 自动播放策略
```

### Preset（features 组合）

```tsx
import { videoFeatures } from '@videojs/react/video';
// 等价于完整视频播放器所需的所有 features

import { audioFeatures } from '@videojs/react/audio';
// 音频播放器 features

import { backgroundFeatures } from '@videojs/react/background';
// 背景视频 features（无控件，无音量）
```

---

## 6. TypeScript 类型

```tsx
import type {
  PlayerState,       // usePlayer 返回的完整 store 类型
  Availability,      // 'available' | 'unavailable' | 'unsupported'
  Feature,           // feature 类型
} from '@videojs/react';
```

---

## 7. CSS 导入路径

| 场景 | 导入路径 |
|------|---------|
| 视频播放器（VideoSkin） | `@videojs/react/video/skin.css` |
| 音频播放器（AudioSkin） | `@videojs/react/audio/skin.css` |
| 背景视频（BackgroundVideoSkin） | `@videojs/react/background/skin.css` |
