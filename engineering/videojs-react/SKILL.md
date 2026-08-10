---
name: videojs-react
description: >-
  Video.js v10 (@videojs/react) React 播放器开发与排障，覆盖 player lifecycle、Provider、hooks、preset、feature、official skin、自定义 controls、track 与平台集成。Use when 代码 import `@videojs/react`，或用户明确使用 Video.js v10 React API 构建、迁移或排查播放器；旧版 video.js、原生 video 和其他播放器库不触发。
---

# Video.js React

> 基准：`@videojs/react` 当前官方仓库主线、Video.js 官网首页 React 示例、`videojs/v10` 仓库源码。
> 如果本 skill 与官方源码 / 官网示例冲突，优先以官方为准。

## 1) 这个 skill 的职责

这个 skill 不是旧版 Video.js 或 `video-react` 的通用说明书，而是专门面向 `@videojs/react` 的**官方对齐执行技能**。触发后优先做三件事：

1. 先判断用户问题属于哪一类：
   - 快速开始 / 组件搭建
   - `createPlayer` 与 Context
   - `usePlayer` / selectors / feature state
   - 官方 skins 与自定义 UI
   - 缩略图 / text track
   - 平台集成 / Next.js
   - 故障排查
2. 用最接近问题的**官网示例或仓库源码**校准判断
3. 在输出中明确区分：
   - **官方源码 / package 事实**
   - **官网示例推荐**
   - **本 skill 的工程化归纳**

配套参考：

- 官方对齐：`references/official-alignment.md`
- 导出 / hooks / selectors / features：`references/api-reference.md`
- 平台、媒体源与缩略图：`references/streaming-and-platform.md`

---

## 2) 触发边界

### 必须触发

- 用户代码 import 了 `@videojs/react`
- 用户在做：
  - 视频播放器
  - 音频播放器
  - 背景视频播放器
  - 官方 skin 扩展
  - 自定义 controls / tooltip / slider / popover
- 用户遇到：
  - `usePlayer` / Provider / Container 相关错误
  - 样式或 skin 导入问题
  - preset / feature / selector 选型问题
  - 缩略图 / track / captions 相关问题

### 不适用

- 旧版 `video.js` v8/v9 API
- `video-react`
- 纯原生 `<video>`、其他播放器库（Vidstack、Plyr、react-player 等）

---

## 3) 官方资料优先级

每次回答或改代码前，按这个顺序取证：

1. `videojs.org` 官网首页与官方可见文档
2. `videojs/v10` 仓库源码与 `packages/react/package.json`
3. 官方 README / discussions / roadmap 文本

取舍规则：

- API 导出、方法名、selector、feature、preset，以源码与 package exports 为准
- 快速开始和推荐组合方式，以官网首页 React 示例为准
- beta / GA / roadmap 这类信息是**时效信息**，只能按“当前官方这样写”描述，不能写成永久事实

---

## 4) 启动检查清单

只要开始处理 `@videojs/react` 任务，先检查：

1. 包是否真的是 `@videojs/react`
2. 使用的是哪条 preset 路径：
   - `@videojs/react/video`
   - `@videojs/react/audio`
   - `@videojs/react/background`
3. 对应 CSS 是否导入正确：
   - `skin.css`
   - `minimal-skin.css`
4. 是否存在 `<Player.Provider>`
5. 自定义布局时是否有 `Container`
6. `usePlayer` / `useMedia` 是否在 Provider 子树内
7. 是否把旧稿里那些已知错误心智模型带进来了：
   - 只知道 `Player.usePlayer`
   - 把 `features.pictureinpicture` 当成真实导出
   - 把 background preset 当成“完整播放器 preset”

---

## 5) 最佳实践

### 5.1 把播放器拆成四层心智模型

最稳的理解方式不是“一个黑盒播放器组件”，而是四层：

1. `createPlayer(...)`
   - 生成带 feature 组合的 player factory
2. `Provider`
   - 初始化 store，并把 `media/container` attach 到 player
3. `Container`
   - 绑定容器 DOM
4. 媒体与 UI 组件
   - `Video` / `Audio` / `BackgroundVideo`
   - `VideoSkin` / `AudioSkin` / `BackgroundVideoSkin`
   - `PlayButton` / `TimeSlider` / `Tooltip` 等

如果用户的问题是 “播放器为什么没状态 / 全屏为什么不对 / UI 为什么不工作”，先判断是哪一层出了问题。

### 5.2 `createPlayer` 优先保持稳定引用，但不要把它写成神话

**官方事实**

- 官网示例把 `createPlayer({ features: ... })` 放在模块级
- `createPlayer` 源码返回 `Provider`、`Container`、`usePlayer`、`useMedia`

**工程化归纳**

- 默认优先模块顶层定义，避免每次 render 重建 factory
- 如果必须依赖运行时参数，至少用稳定 memo 包住

不要写成：

- “只能在模块顶层调用”

更准确的说法是：

- **默认把 factory 做成稳定引用；模块顶层是最简单、最安全的默认值**

### 5.3 `usePlayer` 有两条合法路径

当前官方资料支持两种访问方式：

1. 顶层导出：
   - `import { usePlayer } from '@videojs/react'`
2. `createPlayer()` 返回的 typed hook：
   - `const Player = createPlayer(...)`
   - `Player.usePlayer(...)`

官网首页“Take full control”示例主要使用的是**顶层 `usePlayer`**，不是只有 `Player.usePlayer` 一条路。

因此执行时要这样判断：

- 需要最接近官网示例的写法：优先顶层 `usePlayer`
- 需要和某个 factory 绑定、希望拿到更具体的 typed store：可以用 `Player.usePlayer`

### 5.4 `Container` 不是装饰品

**官方事实**

- `createPlayer` 返回 `Container`
- `context.tsx` 中 `Container` 会把容器 ref attach 给 player context
- 官网完整自定义示例使用了顶层导出的 `Container`

**工程化归纳**

- 用官方 skin 时，skin 内部通常已经包好了 `Container`
- 自定义布局时，不要随手省略 `Container`，除非你明确知道当前功能不依赖容器

当前 skill 最常见的错误，不是“忘记写 Provider”，而是**自定义布局时以为只有 Provider 就够了**。

### 5.5 selectors 和 feature 名称必须精确

官方源码目前明确暴露了这些 selectors：

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

官方短名 feature 也是精确的：

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

不要继续沿用旧稿里的错误名字：

- `features.pictureinpicture`
- `selectPip`
- `selectSubtitles`
- `setMuted`
- `requestPip`

### 5.6 presets 不是都在同一个成熟度上

当前源码给出的 preset 事实：

- `videoFeatures`：完整视频播放器所需 feature 组合
- `audioFeatures`：音频播放器 feature 组合
- `backgroundFeatures`：当前源码中是空数组

因此：

- `VideoSkin` / `MinimalVideoSkin` / `AudioSkin` / `MinimalAudioSkin` 可以当成成熟默认起点
- `BackgroundVideoSkin` 当前更像轻量外壳，不要把它写成“和视频/音频 preset 同成熟度的完整 player preset”

### 5.7 官方 skins 是最强基线，不要发明“eject”承诺

官方资料目前清楚展示了两种路线：

1. 直接使用官方 skin
2. 参考官网 “Take full control” 示例与仓库 preset 源码，自行组合 UI

但当前官方资料并没有给你一个稳定承诺的 “CLI eject workflow”。
所以更稳妥的说法是：

- **需要完全控制时，以官网自定义示例和仓库 preset 源码为基线手工组合**

不要写成：

- “未来一定会提供官方 eject CLI”

### 5.8 缩略图能力和 text track 强相关

当前官方源码里：

- `Thumbnail` 组件支持直接传 `thumbnails`
- 如果没有传 `thumbnails`，它会从 `selectTextTrack` 里拿 `thumbnailCues`
- `textTrackFeature` 会把 `kind="metadata"` 且 `label === 'thumbnails'` 的 track 识别为缩略图轨道

所以更准确的实践是：

- 想要 hover 缩略图，优先基于官方 `Thumbnail` / `Slider.Thumbnail` 和 thumbnail text track
- 不要把“前端自动截帧”写成内置能力

### 5.9 版本状态要写成“当前官方状态”

当前官方可见资料显示：

- 官网首页把 v10 标记为 `Beta`
- README 写的是 `Beta - close to stable. Experimental adoption in real projects.`
- `packages/react/package.json` 当前版本是 `10.0.0-beta.11`

所以实践建议应该这样写：

- **当前官方主线仍处于 beta 阶段，适合按当前官方状态保守评估**

不要写成：

- “绝不能用于真实项目”
- “生产迁移必须等待官方迁移指南”

因为当前官方 README 的口径已经是“可以在真实项目中做实验性采用”。

### 5.10 Next.js / 平台边界要保守表达

更稳妥的说法：

- 在 Next.js App Router 中，封装播放器的组件通常应是 Client Component
- 官网 React 示例持续使用 `playsInline`
- 自动播放、内联播放、全屏、PiP、音量控制都仍然受到浏览器与平台能力约束

更不稳妥的说法：

- “Next page 里绝对不能 import 某某”
- “availability 的 `unavailable` 一定就等于 iframe 限制”

除非你手里有当前源码或官网明确证据。

---

## 6) 故障排查顺序

### 6.1 样式/外观异常

先查：

1. preset 路径和 CSS 路径是否一致
2. 用的是 `skin.css` 还是 `minimal-skin.css`
3. 是否混用了官方 skin 与自定义布局

### 6.2 `usePlayer` / Context 报错

先查：

1. `usePlayer` 是否在 Provider 子树内
2. 用的是顶层 `usePlayer` 还是 `Player.usePlayer`
3. 是否把 player factory 放进了不稳定的 render 路径

### 6.3 自定义 UI 不工作

先查：

1. 自定义布局里是否有 `Container`
2. 是否引入了对应 feature
3. 是否用了正确 selector / method 名称

### 6.4 缩略图 / 字幕 / track 问题

先查：

1. `textTrack` feature 是否存在
2. 缩略图 track 是否满足：
   - `kind="metadata"`
   - `label="thumbnails"`
3. 是用 `Thumbnail` / `Slider.Thumbnail`，还是误把它当成自动截图组件

---

## 7) 触发后建议输出格式

用这个 skill 回答用户时，优先给：

1. **问题归类**
2. **官方事实**
3. **当前最可能的错位点**
4. **最小修复**
5. **如果要重构，怎么沿着官方结构重构**
6. **验证方式**

如果在改代码：

- 先修导出/Context/feature 选型错误
- 再修 skin / layout / track 组合问题
- 最后才是局部 UI 细节

---

## 8) 你应该主动回看的参考

- `references/official-alignment.md`
- `references/api-reference.md`
- `references/streaming-and-platform.md`

当问题涉及具体 API 时，优先回到源码级 reference，而不是只依赖 skill 概述。

---

## 9) 明确禁止

- 不要把 roadmap 写成稳定事实
- 不要创造不存在的 feature / selector / method 名称
- 不要把 background preset 写成完整播放器 preset
- 不要把官网示例中的某种实现写成唯一合法做法
- 不要在没有当前官方证据时继续复述 SPF/HLS/DRM/广告支持矩阵
