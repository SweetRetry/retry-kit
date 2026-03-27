# 平台、媒体源与缩略图边界

> 用途：处理 `playsInline`、Next.js、source、track、thumbnail、availability 这类“播放器之外”的边界问题。
> 基准：官网首页 React 示例 + `sourceFeature` / `textTrackFeature` / `fullscreenFeature` / `pipFeature` / `volumeFeature` 源码。

## 1. 先把“官方明确说了什么”与“我们能安全推断什么”分开

当前官方资料明确支持的事实有：

- 官网 React 示例持续传 `playsInline`
- `sourceFeature` 暴露 `source` / `canPlay` / `loadSource(src)`
- `textTrackFeature` 负责 chapters / thumbnail / subtitles 状态
- `volume` / `fullscreen` / `pip` feature 都暴露了 availability 状态

当前官方资料**没有给出足够强证据**去支持的内容：

- 完整的 HLS / DASH / DRM / SSAI 支持矩阵
- SPF 相对 v8 的细颗粒能力边界
- “哪个平台一定返回 `unavailable` 而不是 `unsupported`” 的完整映射

因此这份 reference 只保留保守、可证实的边界。

---

## 2. 媒体源相关

### `sourceFeature`

当前源码暴露：

- `source`
- `canPlay`
- `loadSource(src)`

这意味着：

- 如果需求是“运行时换源”，先看 `selectSource`
- 不要默认所有换源逻辑都要手动重建 player

### `<Video>` / `<Audio>` 的媒体属性

官网首页示例直接把标准媒体属性传给组件，例如：

- `src`
- `playsInline`
- `autoPlay`
- `muted`
- `loop`

工程化归纳：

- 把它们先视为“媒体组件透传标准 media props”的用法
- 如果问题涉及特殊流媒体类型、MIME、DRM、广告、MSE/EME，必须重新查当前官方资料，不要复用旧稿

---

## 3. `playsInline`、自动播放和 iOS

当前官网 React 示例持续显式传 `playsInline`。
更稳妥的执行建议是：

- 目标含移动端或 iOS 时，优先保留 `playsInline`
- 涉及自动播放时，遵循浏览器媒体策略，通常要配合 `muted`

但不要把下面这种句子写成“Video.js 官方 API 保证”：

- “iOS 一定怎样”
- “某个平台只要加了 `playsInline` 就百分百如何”

这属于浏览器平台行为，不是 `@videojs/react` 单独能承诺的事情。

---

## 4. availability 的正确理解

当前源码里的相关状态：

- `volumeAvailability`
- `fullscreenAvailability`
- `pipAvailability`

当前 feature 源码会把它们初始化为 `unavailable`，attach 后通常根据能力检测改成：

- `available`
- `unsupported`

因此更稳妥的说法是：

- `Availability` 是存在的状态模型
- 但不要凭旧稿把 `unavailable` 强行解释成某个具体平台限制语义，除非当前源码或官网明确说明

---

## 5. 缩略图与 text track

### 当前官方源码支持的路径

1. 直接给 `Thumbnail` 传 `thumbnails`
2. 不传时，由 `textTrackFeature` 自动从 thumbnail track 解析

### thumbnail track 识别条件

当前 `textTrackFeature` 识别：

- `kind === 'metadata'`
- `label === 'thumbnails'`

### 这意味着什么

- 如果 hover 缩略图不工作，先查 track 元信息
- 不要默认这是“播放器自动截帧失败”
- 也不要把“必须先生成 sprite 图 / VTT”写成官方唯一流程，源码只要求最终能给到 `thumbnails` 或符合条件的 thumbnail track

---

## 6. 字幕 / captions

当前 `textTrackFeature` 暴露：

- `textTrackList`
- `subtitlesShowing`
- `toggleSubtitles(forceShow?)`
- `chaptersCues`
- `thumbnailCues`

更稳妥的实践是：

- 先用 `selectTextTrack`
- 如果只是开关字幕，优先 `toggleSubtitles`
- 如果是自定义字幕 UI，再处理 `textTrackList`

不要继续复述旧稿那种“必须通过 index 设置 text track mode”的单一路径，除非你已核对当前官方 API。

---

## 7. Next.js 集成边界

当前包入口 `packages/react/src/index.ts` 本身包含 `'use client';`，而你的封装组件通常也会使用：

- `createPlayer`
- `usePlayer`
- 交互型 UI primitives

更稳妥的建议：

- 在 Next.js App Router 中，把播放器封装组件当作 Client Component 对待
- Page / layout 是否保持 Server Component，要根据你的项目结构决定

不要把“哪一层文件绝对不能 import”写成一刀切规则。

---

## 8. 当前最该删掉的旧说法

- “SPF 简单 HLS 只有 v8 的 19% 体积”
- “高级 DRM/广告场景仍需 HLS.js”
- “生产应用必须等待迁移指南再动”
- “`unavailable` 就是 iframe 限制”
- “缩略图必须先生成 sprite + VTT，别的都不行”
