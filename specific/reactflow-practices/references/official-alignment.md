# React Flow 官方对齐清单

> 用途：维护这个 skill 时，先看这份文件，避免内容漂移。

## 1. 官方资料优先级

1. API Reference
2. Learn / Troubleshooting
3. Official examples
4. Migration guide
5. `xyflow/xyflow` 官方仓库与官方 discussions

结论规则：

- API 名称、参数、deprecated 状态，以 API Reference 为准
- 推荐模式、排查顺序，以 Learn / Troubleshooting 为准
- example 只用于说明“推荐实现”，不能覆盖 API 事实
- 仓库源码、release 讨论、migration discussion 只提供上下文，不反向覆盖 docs/API

---

## 2. 维护时必须复核的页面

核心页面：

- `https://reactflow.dev/learn/advanced-use/performance`
- `https://reactflow.dev/learn/advanced-use/state-management`
- `https://reactflow.dev/learn/customization/custom-nodes`
- `https://reactflow.dev/learn/customization/custom-edges`
- `https://reactflow.dev/learn/customization/handles`
- `https://reactflow.dev/learn/customization/utility-classes`
- `https://reactflow.dev/learn/customization/theming`
- `https://reactflow.dev/learn/troubleshooting/common-errors`
- `https://reactflow.dev/learn/troubleshooting/migrate-to-v12`

高频 API：

- `https://reactflow.dev/api-reference/types/node`
- `https://reactflow.dev/api-reference/types/edge`
- `https://reactflow.dev/api-reference/hooks/use-react-flow`
- `https://reactflow.dev/api-reference/hooks/use-node-connections`
- `https://reactflow.dev/api-reference/hooks/use-handle-connections`
- `https://reactflow.dev/api-reference/components/handle`
- `https://reactflow.dev/api-reference/utils/add-edge`
- `https://reactflow.dev/api-reference/utils/reconnect-edge`

高频 examples：

- `https://reactflow.dev/examples/nodes/custom-node`
- `https://reactflow.dev/examples/interaction/prevent-cycles`
- `https://reactflow.dev/examples/grouping/sub-flows`
- `https://reactflow.dev/examples/nodes/connection-limit`

官方仓库入口：

- `https://github.com/xyflow/xyflow`

官方 discussions / 发布说明补充入口：

- `https://github.com/xyflow/xyflow/discussions`

---

## 3. 最容易漂移的知识点

每次改 skill 时，都要复核下面这些：

1. deprecated hooks / utils 是否变更
2. `Handle` 相关 props 与限制是否调整
3. `Node.width` / `height` / `measured` 的语义是否变化
4. `reconnectEdge`、`onReconnect` 这类 v12 迁移点是否又有更新
5. Utility classes、CSS variables、`colorMode` 是否新增或调整
6. common errors 里的官方警告文案与解释是否变化

---

## 4. 修改内容前先问自己

- 这是官方 API 事实，还是我自己的工程经验？
- 这句话是不是把“推荐”说成了“必须”？
- 这条性能结论有没有 profiling 证据？如果没有，就不要写数字
- 这条最佳实践是否能在官方 docs / examples 中找到依据？
- 如果官方页面更新，这个 skill 最先会在哪些段落失真？

---

## 5. 允许写入的工程化归纳

可以写，但要保持谦虚表述：

- “优先”
- “通常”
- “更稳妥”
- “当……时更适合”

不要写成：

- “只能”
- “必须一直”
- “绝对禁止”
- “官方就是这么要求的”

除非你能在官方页面中明确找到对应约束。

---

## 6. 维护动作清单

每次更新这个 skill，至少执行：

1. 打开上面的核心页面，核对高风险 API
2. 搜索文档里是否残留：
   - 过时 API 名称
   - 未经证据支持的性能数字
   - 过度绝对化措辞
3. 检查 references 之间是否有重复或互相矛盾
4. 若新增“最佳实践”，在描述里标明它是：
   - 官方事实
   - 官方 example 推荐
   - 本 skill 的工程化归纳
