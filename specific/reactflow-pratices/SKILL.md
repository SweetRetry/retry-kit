---
name: reactflow-pratices
description: >-
  React Flow (@xyflow/react v12+) 节点编辑器开发与排障，覆盖节点、边、Handle、状态管理、连接校验、性能、持久化和 sub flow。Use when 代码 import `@xyflow/react`，或用户明确使用 React Flow 构建、迁移或排查节点图；D3、ECharts、其他 node graph 库及未选定技术栈的通用流程图任务不触发。
---

# React Flow Practices

> 基准版本：`@xyflow/react` v12+
> 若本 skill 与官方资料冲突，始终以 React Flow 官方 docs / API Reference / examples / migration guide 为准。

## 1) 这个 skill 的职责

这个 skill 不是“React Flow 常识合集”，而是一个**官方对齐的执行技能**。被触发后，你要优先做三件事：

1. 先判断用户问题属于哪一类：
   - 基础搭建
   - 自定义节点/边/Handle
   - 状态管理 / 持久化
   - 性能 / 重渲染
   - 连接校验 / cycles
   - TypeScript
   - sub flow / parentId
   - 故障排查
2. 用最接近问题的官方页面校准判断，不要凭印象回答
3. 在输出里明确区分：
   - **官方 API 事实**
   - **官方 example 展示的推荐用法**
   - **本 skill 的工程化归纳**

配套参考：

- 官方对齐：`references/official-alignment.md`
- API / hooks / utils：`references/api-reference.md`
- 自定义节点 / 边 / Handle / 样式：`references/custom-components.md`
- 性能检查：`references/performance-checklist.md`

---

## 2) 触发边界

### 必须触发

- 用户代码 import 了 `@xyflow/react`
- 用户在做流程图、节点编辑器、DAG/workflow builder、可视化编排器
- 用户遇到 React Flow 典型问题：
  - 边不显示
  - 无限重渲染
  - Handle 连接不上
  - provider / zustand ancestor 报错
  - 自定义节点内交互冲突
- 用户要做：
  - 自定义节点 / 自定义边 / 自定义 Handle
  - 连接校验
  - Zustand / Redux 等外部状态集成
  - 保存 / 恢复 / 序列化

### 不适用

- 纯图表库问题（ECharts、D3 图表），不是节点-边编辑器
- 用户没有使用 React Flow，也没有计划采用 React Flow

---

## 3) 官方资料优先级

每次回答或动手前，按这个顺序取证：

1. `reactflow.dev` 的 API Reference / Learn / Troubleshooting
2. `reactflow.dev` 官方 examples
3. 官方 migration guide
4. 官方 GitHub 仓库 `xyflow/xyflow` 与官方 discussions 的公开实现线索

取舍规则：

- API 事实以 API Reference 为准
- 设计建议与排查方式以 Learn / Troubleshooting 为准
- 具体实现手法可以参考 examples，但**不要把 example 的某种写法误写成唯一合法方式**
- 仓库源码、discussion、release 说明只作为补充上下文，不反向覆盖 docs/API

---

## 4) 启动检查清单

只要开始处理 React Flow 任务，先检查这几项：

1. 包名是否为 `@xyflow/react`
2. 是否导入了样式：
   - 通常用 `@xyflow/react/dist/style.css`
   - 仅在完全自定义样式时才考虑 `base.css`
3. React Flow 父容器是否有明确的 `width` 和 `height`
4. 使用 hooks 的组件是否位于 `<ReactFlow />` 或 `<ReactFlowProvider />` 内部
5. `nodeTypes` / `edgeTypes` 是否保持稳定引用
6. 是否把运行时测量字段当成可持久化业务字段使用

如果这些前置项没过，不要直接跳到复杂排查。

---

## 5) 最佳实践

### 5.1 稳定引用优先

**官方事实**

- React Flow 官方 performance 文档明确要求：传给 `<ReactFlow />` 的组件、函数、数组、对象都要尽量保持稳定引用。
- 常见重渲染来源不是“图太大”，而是你每次 render 都在重建 props。

**执行规则**

- 静态 `nodeTypes` / `edgeTypes`：优先放模块顶层
- 若确实依赖运行时值：用 `useMemo`
- 事件回调：用 `useCallback`
- 传给 `<ReactFlow />` 的 object / array props（如 `snapGrid`、`defaultEdgeOptions`）：用 `useMemo`

**不要写成硬规则的说法**

- 不要说“只能放组件外”
- 更准确的说法是：**静态配置优先模块顶层；动态配置至少要保证稳定引用**

### 5.2 更新 nodes / edges 时必须保持不可变

**官方事实**

- 官方 state management guide 明确强调：更新节点数据时必须返回新对象，React Flow 才能感知变化。

**执行规则**

- 更新 node 时至少替换：
  - `node`
  - 若修改 `data`，也替换 `node.data`
- 不要直接改原对象字段

### 5.3 先选对状态模式，再谈实现细节

官方并没有说“所有复杂项目都必须 Zustand”，但官方 state management guide 明确给出了使用 Zustand 的理由和适用场景。

优先按下面选型：

- `Uncontrolled`
  - 适合简单展示、轻交互 demo、很少从外部同步状态的场景
- `Controlled`
  - 适合大多数编辑器
  - 用 `useNodesState` / `useEdgesState` 起步最快
- 外部 store（Zustand / Redux / Jotai 等）
  - 当节点内部要更新全局图状态
  - 当需要持久化、外部联动、复杂业务动作
  - 当你需要把派生状态与渲染订阅解耦

### 5.4 避免大范围订阅

**官方事实**

- Performance 文档明确指出：直接在组件里读取整个 `nodes` 或 `edges`，是最常见的性能坑之一。
- 官方建议把经常用到的派生结果独立存储，而不是每次从整个数组现算。

**执行规则**

- 不要在高频更新的自定义节点 / 面板中直接依赖整个 `nodes` / `edges`
- 一次性查询：优先 `useReactFlow()` 的实例方法，如 `getNodes()` / `getEdges()`
- 订阅局部状态：优先 selector
- 如果你只关心“选中的节点 id 列表”之类的派生值，优先把它单独维护

### 5.5 连接规则分两层

**官方事实**

- 全局连接合法性由 `isValidConnection` 控制
- Handle 层面可用 `isConnectable`、`isConnectableStart`、`isConnectableEnd` 做局部限制
- 官方 `Preventing Cycles` example 用 `useReactFlow().getNodes()/getEdges()` 来保持 `isValidConnection` callback 稳定

**执行规则**

- 全局业务规则放 `isValidConnection`
- Handle 局部限制放 Handle props
- 要做 cycle 校验时，优先参考官方 `Preventing Cycles` example，不要手写一个每 render 都捕获新 `nodes/edges` 的版本

### 5.6 Handle 相关问题先排查三件事

1. 多个同类型 Handle 是否有唯一 `id`
2. Handle 是否被 `display: none`
3. 是否在程序化增删 Handle 后调用 `useUpdateNodeInternals()`

**官方事实**

- 官方 handles 文档明确说明：隐藏 Handle 不要用 `display: none`，而要用 `visibility: hidden` 或 `opacity: 0`
- common errors 文档说明：多 Handle 找不到或动态增删后未刷新 internals，都会导致连边异常

### 5.7 自定义边通常用 `<BaseEdge />`，但不要把“通常”说成“必须”

**官方事实**

- 官方 custom edges guide 的推荐路径是：路径由工具函数生成，渲染通常使用 `<BaseEdge />`
- 同一页也明确说明：如果你需要其它路径形状，可以自己构造 SVG path

**执行规则**

- 默认优先 `<BaseEdge /> + path utils`
- 遇到特殊几何形状时，允许自己生成 path
- 如果边进入 Handle 的角度异常，优先检查是否把 `sourcePosition` / `targetPosition` 传给 path util

### 5.8 输入类节点优先避免“拖拽/平移/滚轮”冲突

优先使用官方 utility classes：

- `nodrag`
- `nopan`
- `nowheel`

不要把这类冲突全部归因于 React Flow bug；很多时候只是交互类名没加对。

### 5.9 Sub Flow 不是普通分组 div

**官方事实**

- React Flow 用 `parentId` 表示父子节点关系
- `extent: 'parent'` 可限制子节点移动范围
- common errors 明确有 `Only child nodes can use a parent extent`

**执行规则**

- 真正的父子关系用 `parentId`
- 只在 child node 上使用 `extent: 'parent'`
- 处理 group / nested graph 时，把层级、拖拽边界和序列化字段一起考虑，不要只改视觉

### 5.10 TypeScript 要从“节点/边 union”开始

推荐模式：

1. 为每种自定义节点定义 `Node<Data, Type>`
2. 为每种自定义边定义 `Edge<Data, Type>`
3. 组合成 `AppNode` / `AppEdge` union
4. 把 union 传给：
   - `NodeProps`
   - `EdgeProps`
   - `useReactFlow<AppNode, AppEdge>()`
   - 相关 handler 类型

如果项目混用 built-in 和 custom 类型，查官方 TypeScript guide 里的 `BuiltInNode` / `BuiltInEdge` 组合方式，不要自己发明一个半兼容的联合类型。

---

## 6) 持久化与运行时字段

**官方事实**

- `ReactFlowInstance.toObject()` 可以导出 `nodes`、`edges`、`viewport`
- `Node.width` / `Node.height` 是内部计算得到的只读维度
- v12 引入了 `measured` 字段用于测量结果

**执行规则**

- 持久化只保存真正的业务配置与视口
- 对运行时字段保持保守态度，尤其是：
  - `selected`
  - `dragging`
  - `resizing`
  - `measured`
- 不要把 `width` / `height` 当成你自己的主数据源

---

## 7) 故障排查顺序

遇到问题时，按下面顺序排查，不要一上来猜：

### 7.1 画布空白 / 不渲染

先查：

1. 父容器尺寸
2. 样式导入
3. hooks 是否处在 `<ReactFlow />` / `<ReactFlowProvider />` 内

### 7.2 边不显示 / 边显示异常

先查：

1. edge 是否有 `source` 和 `target`
2. Handle id 是否存在
3. 动态 Handle 后是否调用了 `useUpdateNodeInternals()`
4. 自定义边是否正确传入 `sourcePosition` / `targetPosition`
5. 外部 CSS 是否破坏了边样式

### 7.3 无限重渲染 / 拖拽卡顿

先查：

1. `nodeTypes` / `edgeTypes` / callbacks / object props 是否稳定
2. 是否在自定义节点或面板里读了整个 `nodes` / `edges`
3. 重型节点内容是否被拆到独立 `memo` 组件
4. 样式是否过重

### 7.4 provider / zustand ancestor 报错

这类问题优先检查组件层级，不要先怀疑 Zustand 本身。

---

## 8) 触发后建议输出格式

当你用这个 skill 回答用户时，输出优先包含：

1. **问题归类**
   - 这属于搭建、性能、Handle、状态管理还是 sub flow
2. **官方事实**
   - 哪条来自 API / Learn / Troubleshooting / example
3. **根因判断**
   - 不是列十个可能性，而是给最可能的 1-3 个
4. **修复方案**
   - 先最小修复，再必要重构
5. **验证方式**
   - 改完如何确认问题真正消失

如果是在改代码：

- 先修“前置配置错误”
- 再修“状态模型错误”
- 最后才是“局部表现层 workaround”

---

## 9) 你应该主动引用的官方页面

优先查这些：

- `references/official-alignment.md`
- `references/api-reference.md`
- `references/custom-components.md`
- `references/performance-checklist.md`

当问题更具体时，优先回到对应官方页面，而不是只复用 skill 里的总结。

---

## 10) 明确禁止

- 不要把未经官方证据支持的性能数字写成结论
- 不要把某个 example 的写法写成“唯一正确方式”
- 不要把运行时字段当稳定业务字段持久化
- 不要在没有核对官方资料时，自信地下 deprecated / replacement 结论
- 不要看到 React Flow 问题就默认上 Zustand；先判断状态边界
