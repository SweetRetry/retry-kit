---
name: videojs-react
description: >-
  使用 @videojs/react v10 实现、迁移或排查播放器。仅用于当前任务涉及该 React API 的代码或行为，不用于旧版 video.js、原生 video 或其他播放器库。
---

# Video.js React

面向 `@videojs/react` v10 当前官方主线完成实现、迁移与排障。该 API 仍可能变化；导出、selector、feature、preset 和版本状态只从当前源码、package exports 与官网确认。

## 按任务读取 reference

- `createPlayer`、Provider、Container、hooks、selectors、features、presets、skins 或 UI primitives：读取 [api-reference.md](references/api-reference.md)。
- media source、track、thumbnail、availability、浏览器能力或 Next.js：读取 [streaming-and-platform.md](references/streaming-and-platform.md)。
- 判断版本状态、roadmap、官方推荐或维护本 skill：读取 [official-alignment.md](references/official-alignment.md)，并复核其中列出的当前官方来源。

只读取当前问题涉及的 reference。项目已安装版本的源码与类型定义优先于本 skill 的概述。

## 工作方式

先确认用户使用的是 `@videojs/react`、具体版本、preset 路径和复现行为，再沿 player factory、Provider、Container、media、feature 与 UI 的真实组合定位责任层。

保持这些非直觉约束：

- player factory 保持稳定引用；Provider 提供状态边界，Container 承担容器绑定，二者不互相替代。
- selector、feature、method 与 export 使用当前源码中的精确名称，不从旧版 Video.js 或其他播放器迁移同名假设。
- 官方 skin 是默认组合，自定义 UI 需要显式满足其依赖的 container、feature、track 与平台 contract。
- 自动播放、内联播放、全屏、PiP、音量、媒体源与 track 的最终行为受浏览器和平台能力约束；availability 只按当前 contract 解释。
- beta、roadmap 和支持矩阵属于时效事实，输出时标明依据与核验时间，不推断永久承诺。

修改代码时先修复导出、Context、feature 或 preset 组合错误，再处理布局与局部 UI。完成后用原媒体、平台和交互路径验证实际播放状态，不只验证组件挂载。

## 输出

先给根因与最小修复，再说明必要的官方依据、平台限制和验证结果。没有当前官方证据的能力边界保持未知，不用历史印象补齐。
