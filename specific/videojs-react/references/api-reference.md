# Video.js React API / 导出 / Feature 速查

> 用途：当你已经知道问题属于 `createPlayer`、`usePlayer`、selectors、feature/preset 或 UI 组件时，用它做精确校准。
> 基准：`videojs/v10` 仓库 `packages/react` 与 `packages/core/src/dom/store/*` 源码。

## 1. `createPlayer`

`createPlayer` 当前源码返回：

- `Provider`
- `Container`
- `usePlayer`
- `useMedia`

也就是说，当前旧稿里“只返回 `Provider / Container / usePlayer`”是不完整的。

### 源码形态

```tsx
createPlayer(config): {
  Provider,
  Container,
  usePlayer,
  useMedia,
}
```

### `Provider` 做什么

- 创建 store
- 跟踪 `media`
- 跟踪 `container`
- 在 `media/container` 就位后执行 `store.attach(...)`

### `Container` 做什么

- 把容器 DOM 通过 context attach 给 player

### `useMedia`

- 从 Provider context 中读取当前 media 实例

---

## 2. `usePlayer` 有两条合法路径

### 顶层导出

```tsx
import { usePlayer } from '@videojs/react';
```

特点：

- 官网“Take full control”示例采用这一条
- 适合跟官方示例保持一致

### factory 返回的 typed hook

```tsx
const Player = createPlayer({ features: videoFeatures });
const paused = Player.usePlayer((s) => s.paused);
```

特点：

- 与当前 player factory 绑定
- 类型通常更具体

### 使用原则

- 想贴近官网示例：优先顶层 `usePlayer`
- 想拿到与特定 factory 绑定的 typed store：可用 `Player.usePlayer`

---

## 3. 顶层导出里最重要的东西

`packages/react/src/index.ts` 当前明确 re-export：

### Context / hooks

- `Container`
- `useContainer`
- `useContainerAttach`
- `useMedia`
- `useMediaAttach`
- `useOptionalPlayer`
- `usePlayer`
- `usePlayerContext`
- `createPlayer`

### 常用 UI primitives

- `AlertDialog`
- `BufferingIndicator`
- `CaptionsButton`
- `Controls`
- `FullscreenButton`
- `MuteButton`
- `PiPButton`
- `PlayButton`
- `PlaybackRateButton`
- `Popover`
- `Poster`
- `SeekButton`
- `Slider`
- `Thumbnail`
- `Time`
- `TimeSlider`
- `Tooltip`
- `VolumeSlider`

### Store helpers / selectors

- `createSelector`
- `shallowEqual`
- `useSelector`
- `useStore`
- 以及 `@videojs/core/dom` 的 selector / feature 导出

---

## 4. selectors 精确列表

当前 `packages/core/src/dom/store/selectors.ts` 暴露：

- `selectBuffer`
- `selectControls`
- `selectError`
- `selectFullscreen`
- `selectPiP`
- `selectPlayback`
- `selectPlaybackRate`
- `selectSource`
- `selectTextTrack`
- `selectTime`
- `selectVolume`

不要再写成：

- `selectPip`
- `selectSubtitles`

---

## 5. 每个 selector 现在大致包含什么

### `selectPlayback`

来自 `playbackFeature`：

- `paused`
- `ended`
- `started`
- `waiting`
- `play()`
- `pause()`

### `selectTime`

来自 `timeFeature`：

- `currentTime`
- `duration`
- `seeking`
- `seek(time)`

### `selectVolume`

来自 `volumeFeature`：

- `volume`
- `muted`
- `volumeAvailability`
- `setVolume(volume)`
- `toggleMuted()`

### `selectFullscreen`

来自 `fullscreenFeature`：

- `fullscreen`
- `fullscreenAvailability`
- `requestFullscreen()`
- `exitFullscreen()`

### `selectPiP`

来自 `pipFeature`：

- `pip`
- `pipAvailability`
- `requestPictureInPicture()`
- `exitPictureInPicture()`

### `selectPlaybackRate`

来自 `playbackRateFeature`：

- `playbackRate`
- `playbackRates`
- `setPlaybackRate(rate)`

### `selectSource`

来自 `sourceFeature`：

- `source`
- `canPlay`
- `loadSource(src)`

### `selectTextTrack`

来自 `textTrackFeature`：

- `chaptersCues`
- `thumbnailCues`
- `thumbnailTrackSrc`
- `textTrackList`
- `subtitlesShowing`
- `toggleSubtitles(forceShow?)`

### `selectError`

来自 `errorFeature`：

- `error`
- `dismissError()`

### `selectBuffer`

来自 `bufferFeature`：

- `buffered`
- `seekable`

注意：

- `buffered` / `seekable` 在源码里是**序列化后的 ranges 数组**
- 不要继续写成 `TimeRanges`

---

## 6. `features` 精确短名

当前短名导出来自 `feature.parts.ts`：

- `features.buffer`
- `features.controls`
- `features.fullscreen`
- `features.pip`
- `features.playback`
- `features.playbackRate`
- `features.source`
- `features.textTrack`
- `features.time`
- `features.volume`

错误旧名：

- `features.pictureinpicture`
- `features.subtitles`
- `features.autoplay`

如果官方后续新增这些 feature，再更新 skill；在此之前不要自己发明。

---

## 7. presets 当前事实

### `videoFeatures`

当前源码包含：

- `playback`
- `playbackRate`
- `volume`
- `time`
- `source`
- `buffer`
- `fullscreen`
- `pip`
- `controls`
- `textTrack`
- `error`

### `audioFeatures`

当前源码包含：

- `playback`
- `playbackRate`
- `volume`
- `time`
- `source`
- `buffer`
- `error`

### `backgroundFeatures`

当前源码：

```ts
export const backgroundFeatures: BackgroundFeatures = [];
```

这意味着：

- 当前 background preset 不是“带完整 controls/state 的 video preset”
- 它更像背景媒体壳层的起点

---

## 8. preset 路径与 CSS 导出

### 视频

```tsx
import { Video, VideoSkin, MinimalVideoSkin, videoFeatures } from '@videojs/react/video';
import '@videojs/react/video/skin.css';
import '@videojs/react/video/minimal-skin.css';
```

### 音频

```tsx
import { Audio, AudioSkin, MinimalAudioSkin, audioFeatures } from '@videojs/react/audio';
import '@videojs/react/audio/skin.css';
import '@videojs/react/audio/minimal-skin.css';
```

### 背景

```tsx
import { BackgroundVideo, BackgroundVideoSkin, backgroundFeatures } from '@videojs/react/background';
import '@videojs/react/background/skin.css';
```

---

## 9. 官方 skin 与自定义组合

### 官方 skin 路线

- `VideoSkin`
- `MinimalVideoSkin`
- `AudioSkin`
- `MinimalAudioSkin`
- `BackgroundVideoSkin`

### 完全自定义路线

基于顶层导出 primitives 自己组合：

- `Container`
- `Poster`
- `BufferingIndicator`
- `Controls`
- `PlayButton`
- `SeekButton`
- `TimeSlider`
- `Tooltip`
- `VolumeSlider`
- 等等

如果要做“自定义 controls”，优先参考官网首页 “Take full control” 示例和仓库 preset 源码。

---

## 10. `Thumbnail` 与 `Slider.Thumbnail`

当前源码说明：

- 顶层导出有 `Thumbnail`
- `Slider.Thumbnail` 也存在于官方 skin 组合中

`Thumbnail` 当前支持：

- 直接传 `thumbnails`
- 如果不传，会优先尝试从 `selectTextTrack` 里的 `thumbnailCues` 自动解析

缩略图自动识别依赖：

- `<track kind="metadata" label="thumbnails" ...>`

---

## 11. 当前最常见误用

- 把 `Player.usePlayer` 当成唯一合法入口
- 误写 `features.pictureinpicture`
- 误写 `selectPip`
- 误写 `setMuted` / `requestPip`
- 把 `backgroundFeatures` 当成完整 feature preset
- 把 `buffered` / `seekable` 当 `TimeRanges`
