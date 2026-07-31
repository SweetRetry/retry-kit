# Video.js React 官方对齐清单

> 用途：维护 `videojs-react` skill 时先看这份文件，避免因为 beta 期 API 漂移或旧稿惯性而失真。

## 1. 官方资料优先级

1. `videojs.org` 官网首页与当前可见文档
2. `videojs/v10` 仓库源码
3. `videojs/v10` README / discussions / roadmap 文本

结论规则：

- API 与导出：看源码和 package exports
- 推荐组合方式：看官网 React 示例
- 时间线与版本状态：看官网首页与 README，但始终当作时效信息处理

---

## 2. 维护时必须复核的页面 / 文件

官网：

- `https://videojs.org/`

仓库：

- `https://github.com/videojs/v10/blob/main/README.md`
- `https://github.com/videojs/v10/blob/main/packages/react/package.json`
- `https://github.com/videojs/v10/blob/main/packages/react/src/index.ts`
- `https://github.com/videojs/v10/blob/main/packages/react/src/player/create-player.tsx`
- `https://github.com/videojs/v10/blob/main/packages/react/src/player/context.tsx`
- `https://github.com/videojs/v10/blob/main/packages/react/src/presets/video/index.ts`
- `https://github.com/videojs/v10/blob/main/packages/react/src/presets/audio/index.ts`
- `https://github.com/videojs/v10/blob/main/packages/react/src/presets/background/index.ts`
- `https://github.com/videojs/v10/blob/main/packages/react/src/presets/video/skin.tsx`
- `https://github.com/videojs/v10/blob/main/packages/react/src/presets/video/minimal-skin.tsx`
- `https://github.com/videojs/v10/blob/main/packages/react/src/presets/audio/skin.tsx`
- `https://github.com/videojs/v10/blob/main/packages/react/src/ui/thumbnail/thumbnail.tsx`
- `https://github.com/videojs/v10/blob/main/packages/core/src/dom/store/selectors.ts`
- `https://github.com/videojs/v10/blob/main/packages/core/src/dom/store/features/feature.parts.ts`
- `https://github.com/videojs/v10/blob/main/packages/core/src/dom/store/features/presets.ts`
- `https://github.com/videojs/v10/blob/main/packages/core/src/dom/store/features/playback.ts`
- `https://github.com/videojs/v10/blob/main/packages/core/src/dom/store/features/time.ts`
- `https://github.com/videojs/v10/blob/main/packages/core/src/dom/store/features/volume.ts`
- `https://github.com/videojs/v10/blob/main/packages/core/src/dom/store/features/fullscreen.ts`
- `https://github.com/videojs/v10/blob/main/packages/core/src/dom/store/features/pip.ts`
- `https://github.com/videojs/v10/blob/main/packages/core/src/dom/store/features/source.ts`
- `https://github.com/videojs/v10/blob/main/packages/core/src/dom/store/features/text-track.ts`

---

## 3. 最容易漂移的知识点

每次更新这个 skill，都要优先复核：

1. `@videojs/react` 当前版本号与 beta/GA 状态
2. `createPlayer` 返回值是否变化
3. 顶层 `usePlayer` / `useMedia` / `Container` 是否仍存在
4. selectors 名称与 feature 短名是否变化
5. presets 是否调整，尤其是 `backgroundFeatures`
6. Thumbnail / text track 路径是否变化
7. 官网首页 React 示例是否换了推荐结构

---

## 4. 修改前先问自己

- 这是当前源码事实，还是旧稿惯性？
- 这句话是不是把“官网示例推荐”写成了“唯一合法做法”？
- 这条版本/路线图信息是否带有日期，需要显式标注“当前官方状态”？
- 这条流媒体或平台结论，当前官方资料真的支持吗？

---

## 5. 允许写入的工程化归纳

可以写，但要保持克制：

- “优先”
- “更稳妥”
- “默认做法”
- “当需要 typed hook 时”

不要写成：

- “只能”
- “永远必须”
- “官方保证一定如此”

除非你能在当前源码或官网示例中直接证明。

---

## 6. 维护动作清单

每次更新这个 skill，至少做：

1. 重新核对上面的关键文件
2. 搜索文档里是否残留：
   - 错误 feature / selector / method 名称
   - 过时时间线
   - 未经证据支持的体积 / 流媒体 / 平台结论
3. 检查 references 之间是否互相冲突
4. 若新增“最佳实践”，标注它属于：
   - 官方源码事实
   - 官网示例推荐
   - 本 skill 的工程化归纳
