# React Flow API / Hooks / Utils 速查

> 用途：当你已经知道问题大类，需要快速定位该用哪个 hook、哪个 util、哪些 API 已废弃。
> 基准：React Flow 官方 API Reference + v12 migration guide。

## 1. 状态与实例

### `useNodesState`

适合：

- `controlled` 模式起步
- 中小型编辑器
- 还没引入外部 store

返回：

```tsx
const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
```

典型搭配：

```tsx
const onConnect = useCallback(
  (connection: Connection) => setEdges((eds) => addEdge(connection, eds)),
  [setEdges]
);
```

### `useEdgesState`

与 `useNodesState` 成对使用：

```tsx
const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
```

### `useReactFlow`

适合：

- 命令式读写 flow 状态
- 一次性查询当前图状态
- 视口控制
- 在稳定 callback 中取最新 `nodes/edges`

关键点：

- 它**不会**因为状态变化自动触发组件重渲染
- 如果在 `useCallback` / `useEffect` 里使用，要把返回的 `reactFlow` 实例加入依赖

常用方法：

- `getNodes()`
- `getEdges()`
- `setNodes()`
- `setEdges()`
- `updateNodeData()`
- `fitView()`
- `setCenter()`
- `screenToFlowPosition()`
- `flowToScreenPosition()`
- `toObject()`

### `useViewport`

适合读取当前：

- `x`
- `y`
- `zoom`

它会随视口变化而重渲染。若只是偶发读取视口，不要为了这一点订阅整个 viewport。

---

## 2. 连接、节点数据与动态 Handle

### `useNodeConnections`

优先级高于 `useHandleConnections`。

适合：

- 在自定义节点里读取某个 Handle 或某类连接
- 监听 `onConnect` / `onDisconnect`

### `useHandleConnections`

状态：

- **已废弃**

处理原则：

- 新代码不要再基于它设计
- 旧代码迁移时优先改成 `useNodeConnections`

### `useNodesData`

适合：

- 订阅特定节点的 `data`
- 构建“计算型节点”

注意：

- 它适合精确订阅某几个节点的数据
- 不适合替代整图层面的状态设计

### `useNodeId`

适合在自定义节点内部取当前节点 id，减少 prop drilling。

### `useUpdateNodeInternals`

适合：

- 动态增删 Handle
- 程序化调整 Handle 位置后刷新 internals

如果多 Handle 场景下“看起来 DOM 在，但连边不对”，先想到它。

---

## 3. 事件与生命周期

### `useOnSelectionChange`

关键点：

- 传入的 `onChange` 需要保持稳定引用，通常用 `useCallback`

### `useOnViewportChange`

适合分阶段监听：

- `onStart`
- `onChange`
- `onEnd`

### `useNodesInitialized`

适合：

- 等节点首次测量完成后再做自动布局
- 避免在宽高尚未稳定时提前布局

### `useKeyPress`

适合：

- Flow 内快捷键
- 删除、复制、组合键交互

---

## 4. 直接访问内部 store

### `useStore`

只在下面场景使用：

- 专用 hook 不够用
- 你明确知道要订阅哪个 slice

使用原则：

- 一定要传 selector
- 不要订阅整个 store
- selector 返回对象/数组时要考虑 equality 策略

### `useStoreApi`

适合命令式访问内部 store：

- `getState()`
- `setState()`

不适合把业务状态长期绑定在内部实现细节上。

### `useInternalNode`

用途：

- 读取内部节点数据做调试或高级能力

风险：

- 内部细节耦合更高
- 节点变化时更容易重渲染

若有公开 API，可优先用公开 API。

---

## 5. Utils 该怎么选

### 变更应用

```tsx
applyNodeChanges(changes, nodes)
applyEdgeChanges(changes, edges)
```

适合：

- `onNodesChange`
- `onEdgesChange`

### 新增边

```tsx
addEdge(connection, edges)
```

适合：

- `onConnect`
- 从 `Connection` 或 `Edge` 参数创建边

### 重连边

```tsx
reconnectEdge(oldEdge, newConnection, edges, options?)
```

v12 里优先记住它，而不是旧名字。

关键点：

- `shouldReplaceId` 默认 `true`

### 图遍历

```tsx
getIncomers(node, nodes, edges)
getOutgoers(node, nodes, edges)
getConnectedEdges(nodes, edges)
```

适合：

- cycle 检测
- 依赖传播
- 级联删除 / 选择分析

注意：

- 这些 util 期望拿到 node 或至少带 `id` 的对象，而不是随手传一个字符串

---

## 6. v12 相关高频迁移点

优先记住这些：

- 包名改为 `@xyflow/react`
- `parentNode` 改为 `parentId`
- `onEdgeUpdate` 系列改名为 `onReconnect`
- `updateEdge` 的迁移方向是 `reconnectEdge`
- `width` / `height` 与 `measured` 的语义在 v12 需要区分
- `useHandleConnections` 属于 deprecated 路径

---

## 7. API 选型速决表

| 需求 | 优先 API |
| --- | --- |
| 起步做 controlled flow | `useNodesState` + `useEdgesState` |
| 需要一次性读取最新图状态 | `useReactFlow()` |
| 订阅某个节点或若干节点的数据 | `useNodesData()` |
| 监听当前节点连接关系 | `useNodeConnections()` |
| 动态 Handle 后刷新 internals | `useUpdateNodeInternals()` |
| 应用 nodes/edges 变更 | `applyNodeChanges()` / `applyEdgeChanges()` |
| 新增连边 | `addEdge()` |
| 重连边 | `reconnectEdge()` |
| 遍历上下游 | `getIncomers()` / `getOutgoers()` |

---

## 8. 常见误用

- 用 `useNodes()` / `useEdges()` 代替所有读取需求
- 在 cycle 校验里每次捕获新的 `nodes/edges`
- 继续围绕 `useHandleConnections` 设计新代码
- 误把 `reconnectEdge` 当成普通编辑 edge 数据的通用替代品
- 把内部 store API 当成长期稳定的业务边界
