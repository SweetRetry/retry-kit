---
name: reactflow-practices
description: >-
  使用 @xyflow/react v12+ 实现、迁移或排查节点编辑器。仅用于当前任务涉及 React Flow 的代码或行为，不用于其他图形库或通用流程图。
---

# React Flow Practices

面向 `@xyflow/react` v12+，依据当前官方资料完成实现、迁移与排障。API 名称、参数和 deprecated 状态以 API Reference 为准；工程判断与官方事实分开表述。

## 按任务读取 reference

- hooks、utils、状态模式、事件、图遍历、序列化或 v12 migration：读取 [api-reference.md](references/api-reference.md)。
- 自定义 node、edge、Handle、utility class、sub flow 或样式：读取 [custom-components.md](references/custom-components.md)。
- 重渲染、拖拽卡顿、大图或订阅范围：读取 [performance-checklist.md](references/performance-checklist.md)。
- 判断版本、deprecated、官方推荐或维护本 skill：读取 [official-alignment.md](references/official-alignment.md)，并复核其中列出的当前官方页面。

只读取当前问题涉及的 reference。具体实现仍以项目已安装版本的类型定义和当前官方文档为准。

## 工作方式

先确认包名、安装版本、受影响路径与可复现行为，再检查与问题直接相关的基础条件：样式、画布尺寸、Provider 边界、node/edge type 注册和状态所有权。沿实际数据流或交互路径定位根因，不用通用 checklist 替代证据。

保持这些非直觉约束：

- 传给 `<ReactFlow />` 的类型映射、回调和对象属性保持稳定引用；nodes 与 edges 更新保持不可变。
- 高频组件订阅完成渲染所需的最小状态；一次性读取与持续订阅分开。
- 多 Handle、动态 Handle、连接规则和自定义 edge 按对应 reference 的 contract 实现。
- 父子节点、拖拽边界和持久化结构作为同一数据模型处理；运行时测量与瞬时交互状态不充当业务真相。

修改代码时先修复已证实的 contract 或状态模型错误，再处理表现层。完成后用原复现路径验证业务行为、交互和持久化结果，而不只检查组件是否渲染。

## 输出

先给根因与最小修复，再说明必要依据和验证结果。只有用户需要追溯时才区分官方 API 事实、官方示例和工程归纳；不把示例写法包装成唯一合法实现。
