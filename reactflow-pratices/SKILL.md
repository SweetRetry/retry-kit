---
name: reactflow-pratices
description: >
  React Flow (@xyflow/react v12+) 节点图编辑器开发技能。覆盖节点/边/Handle 数据结构与持久化、
  自定义组件开发、状态管理模式（controlled/uncontrolled/Zustand）、
  连接验证、性能优化和 TypeScript 类型设计。

  触发场景：(1) 使用 React Flow 构建流程图/节点编辑器/工作流可视化，
  (2) 遇到 React Flow 性能问题、无限重渲染、边不显示等常见故障，
  (3) 设计自定义节点/边/Handle 组件，(4) 需要持久化/序列化流程图数据，
  (5) 用户代码中出现 @xyflow/react 的 import。

  Triggers: react flow, reactflow, xyflow, node editor, flow diagram, workflow builder,
  node graph, custom nodes reactflow, @xyflow/react.
---

# React Flow 开发规范

> `@xyflow/react` v12+。所有 import 均从 `@xyflow/react`。

核心原则：

1. **稳定引用** —— nodeTypes/edgeTypes/handlers 永远不在渲染中重建
2. **不可变更新** —— 节点/边状态只通过新对象替换，不直接修改
3. **按需订阅** —— 用 selector 取最小状态，而非整个 nodes/edges 数组
4. **先验证再连接** —— 所有业务规则在 isValidConnection 中前置校验

---

## 1) 触发边界

### 必须触发

- 用户代码 import 了 `@xyflow/react`
- 用户要构建流程图、节点编辑器、工作流可视化、DAG 编辑器
- 用户遇到 React Flow 相关 bug（边不显示、无限重渲染、Handle 失灵等）
- 用户要做自定义节点/边，或需要持久化流程图数据

### 不适用

- 纯数据可视化图表（ECharts/D3 图表），非节点-边交互场景
- 用户未使用 React Flow 且不打算使用

---

## 2) 启动检查清单

每次开始 React Flow 相关工作前，先验证：

1. **包名**：`@xyflow/react`（非旧包名 `reactflow`）
2. **样式导入**：全局 CSS 中有 `@import '@xyflow/react/dist/style.css'`
3. **容器尺寸**：ReactFlow 父容器有明确的 width + height（CSS）
4. **Provider**：使用 hooks 的组件被 `<ReactFlowProvider>` 包裹（且 Provider 在外层）
5. **nodeTypes/edgeTypes**：定义在组件外部或用 `useMemo` 包裹

---

## 3) 节点、边与自定义组件

> 完整 API、Handle 进阶、辅助组件、主题样式见 `references/custom-components.md`
> Hooks 与工具函数见 `references/api-reference.md`

### 3.1 Node 数据结构

```tsx
const node: Node = {
  id: 'node-1',              // 唯一标识（必需）
  position: { x: 0, y: 0 },  // 画布坐标（必需）
  data: { label: 'Hello' },   // 自定义数据，传给节点组件（必需）
  type: 'custom',             // 匹配 nodeTypes 的 key（可选，默认 'default'）
};
```

⚠️ `width`/`height` 是运行时只读计算值，控制节点尺寸用 CSS `style`/`className`。

内置节点类型：`'default'`（双向）、`'input'`（仅输出）、`'output'`（仅输入）、`'group'`（容器）

### 3.2 Edge 数据结构

```tsx
const edge: Edge = {
  id: 'edge-1',       // 唯一标识（必需）
  source: 'node-1',   // 起始节点 id（必需）
  target: 'node-2',   // 目标节点 id（必需）
  type: 'smoothstep',  // 可选，默认 'default'（贝塞尔）
};
```

内置边类型：`'default'`（贝塞尔）、`'straight'`、`'step'`、`'smoothstep'`、`'simplebezier'`

### 3.3 自定义节点

自定义节点 = 普通 React 组件 + Handle。React Flow 自动注入 `NodeProps<T>`。

```tsx
type MyNode = Node<{ label: string; value: number }, 'myNode'>;

function MyNodeComponent({ data, id, selected }: NodeProps<MyNode>) {
  return (
    <div className={`my-node ${selected ? 'selected' : ''}`}>
      <Handle type="target" position={Position.Top} />
      <div className="nodrag"><span>{data.label}</span></div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
export default memo(MyNodeComponent);
```

**注册**（组件外定义，绝对禁止在渲染函数内创建）：

```tsx
const nodeTypes = { myNode: MyNodeComponent };
<ReactFlow nodeTypes={nodeTypes} ... />
```

**检查项**：

- [ ] `React.memo()` 包裹
- [ ] TypeScript 用 `Node<Data, Type>` + `NodeProps<T>` 泛型
- [ ] 可交互元素加 `className="nodrag"`
- [ ] Handle 有正确的 `type` 和 `position`
- [ ] 多 Handle 时每个有唯一 `id`
- [ ] `type` 字符串与 nodeTypes key **大小写完全一致**

### 3.4 自定义边

自定义边 = SVG 路径组件。用内置路径函数生成 path，用 `<BaseEdge>` 渲染。

```tsx
type MyEdge = Edge<{ color: string }, 'myEdge'>;

function MyEdgeComponent({ sourceX, sourceY, targetX, targetY, ...props }: EdgeProps<MyEdge>) {
  const [edgePath] = getSmoothStepPath({ sourceX, sourceY, targetX, targetY });
  return <BaseEdge path={edgePath} {...props} />;
}
export default memo(MyEdgeComponent);
```

**规则**：

- 始终用 `<BaseEdge>` 渲染路径，不要自己写 `<path>`
- 用内置路径函数：`getBezierPath` / `getSmoothStepPath` / `getStraightPath` / `getSimpleBezierPath`
- 路径函数返回 `[path, labelX, labelY, offsetX, offsetY]`
- 边上 label 用 `<EdgeLabelRenderer>` 组件（HTML 渲染）
- 不要手写 SVG path 命令，除非有极特殊的曲线需求

### 3.5 Handle

Handle = 节点上的连接点（DOM div，非 SVG）。

| 规则 | 原因 |
|------|------|
| 多个同类型 Handle 必须给唯一 `id` | 否则边无法区分连接哪个 Handle |
| 隐藏用 `opacity: 0` 或 `visibility: hidden` | `display: none` 破坏内部尺寸计算 |
| 动态增减 Handle 后调 `useUpdateNodeInternals()` | 否则位置不刷新 |
| Handle 子元素加 `pointer-events: none` | 否则子元素拦截连接拖拽事件 |

### 3.6 持久化：该存什么，不该存什么

用 `rfInstance.toObject()` 获取完整快照：`{ nodes, edges, viewport }`

**必须持久化**：`id`, `position`, `data`, `type`, `style`, `className`, `parentId` 等用户配置属性

**不要持久化**（运行时瞬态）：`selected`, `dragging`, `resizing`, `measured`, `width`, `height`

Zustand persist 骨架：

```tsx
persist(storeCreator, {
  name: 'flow-storage',
  partialize: (state) => ({
    nodes: state.nodes.map(({ selected, dragging, resizing, measured, ...rest }) => rest),
    edges: state.edges.map(({ selected, ...rest }) => rest),
    viewport: state.viewport,
  }),
});
```

---

## 4) 核心规则

### 4.1 类型注册 —— 组件外定义

```tsx
// ✅ 组件外部定义，引用永远稳定
const nodeTypes = { custom: CustomNode, number: NumberNode };
const edgeTypes = { special: SpecialEdge };

function FlowEditor() {
  return <ReactFlow nodeTypes={nodeTypes} edgeTypes={edgeTypes} ... />;
}
```

**绝对禁止**在组件内部直接写 `nodeTypes={{ custom: CustomNode }}`——每次渲染创建新对象，全量卸载并重挂载所有节点。

### 4.2 事件处理 —— useCallback 包裹

```tsx
const onNodesChange = useCallback(
  (changes: NodeChange[]) => setNodes(nds => applyNodeChanges(changes, nds)),
  []
);
const onEdgesChange = useCallback(
  (changes: EdgeChange[]) => setEdges(eds => applyEdgeChanges(changes, eds)),
  []
);
const onConnect = useCallback(
  (conn: Connection) => setEdges(eds => addEdge(conn, eds)),
  []
);
```

不用 useCallback → 100 节点 FPS 从 60 降到 10。

### 4.3 不可变状态更新

```tsx
// ✅ node 和 node.data 都创建新对象
setNodes(nds => nds.map(n =>
  n.id === id ? { ...n, data: { ...n.data, value: newVal } } : n
));

// ❌ 直接修改 —— React Flow 检测不到变化
node.data.value = newVal;
```

### 4.4 连接验证

业务规则在 `isValidConnection` 中前置校验：

```tsx
const isValidConnection = useCallback((conn: Connection) => {
  if (conn.source === conn.target) return false;
  const outgoers = getOutgoers(conn.source, nodes, edges);
  return !outgoers.some(n => n.id === conn.target);
}, [nodes, edges]);
```

连接数量限制：

```tsx
<Handle type="target" isConnectable={(connections) => connections.length < 2} />
```

---

## 5) 性能优化

> 详细检查清单见 `references/performance-checklist.md`

**策略一：memo 一切传给 ReactFlow 的东西**

| 传入类型 | 方法 |
|----------|------|
| 自定义节点/边组件 | `React.memo()` |
| 事件回调 | `useCallback` |
| object/array props | `useMemo` 或组件外定义 |
| nodeTypes / edgeTypes | 组件外定义 |

**策略二：按需订阅**

```tsx
// ❌ 任何节点变化都重渲染
const nodes = useNodes();

// ✅ 只取需要的值
const nodeCount = useStore(s => s.nodes.length);

// ✅ Zustand 返回数组时用 useShallow
const [a, b] = useFlowStore(useShallow(s => [s.propA, s.propB]));
```

**策略三：大图优化**

| 规模 | 措施 |
|------|------|
| 100+ 节点 | 简化 CSS（去 box-shadow / gradient / animation） |
| 500+ 节点 | 嵌套子图用 `hidden: true` 折叠 |
| 重型节点 | 将重型内容隔离到独立 `memo` 子组件 |

---

## 6) 状态管理

### 6.1 三种模式

**Uncontrolled**：`defaultNodes`/`defaultEdges`，React Flow 内部管理。适合简单展示。

**Controlled**：用 `useNodesState`/`useEdgesState` 管理状态 + `onNodesChange`/`onEdgesChange`/`onConnect` 回调。

**Zustand Store（推荐复杂应用）**：

```tsx
const useFlowStore = create<FlowState>((set, get) => ({
  nodes: [],
  edges: [],
  onNodesChange: (changes) => set({ nodes: applyNodeChanges(changes, get().nodes) }),
  onEdgesChange: (changes) => set({ edges: applyEdgeChanges(changes, get().edges) }),
  onConnect: (connection) => set({ edges: addEdge(connection, get().edges) }),
  updateNodeData: (nodeId, data) =>
    set({ nodes: get().nodes.map(n =>
      n.id === nodeId ? { ...n, data: { ...n.data, ...data } } : n
    ) }),
}));
```

### 6.2 选型条件

- IF 简单展示/原型 → Uncontrolled
- IF 需要从节点内部更新状态 → Controlled 或 Zustand
- IF 外部状态联动 / 持久化 / 复杂验证 → Zustand store
- IF 项目已用 Redux → Redux + selector 隔离

### 6.3 输入框状态与 node.data 分离

⚠️ 不要用 `node.data` 直接驱动 input value，会光标跳动。

```tsx
function InputNode({ data, id }: NodeProps) {
  const [localValue, setLocalValue] = useState(data.savedValue ?? '');
  const { updateNodeData } = useReactFlow();
  return (
    <input
      className="nodrag"
      value={localValue}
      onChange={(e) => setLocalValue(e.target.value)}
      onBlur={() => updateNodeData(id, { savedValue: localValue })}
    />
  );
}
```

### 6.4 读取关联节点数据

```tsx
function ComputeNode({ id }: NodeProps) {
  const connections = useHandleConnections({ type: 'target' });
  const sourceData = useNodesData(connections.map(c => c.source));
  const sum = sourceData.reduce((acc, d) => acc + (d.data?.value ?? 0), 0);
  return <div>Sum: {sum}</div>;
}
```

---

## 7) TypeScript 类型设计

模式：定义节点类型 → Union → 泛型传递 → 类型守卫

```tsx
type NumberNode = Node<{ number: number }, 'number'>;
type TextNode = Node<{ text: string }, 'text'>;
type AppNode = NumberNode | TextNode;

const { getNodes } = useReactFlow<AppNode, AppEdge>();

function isNumberNode(node: AppNode): node is NumberNode {
  return node.type === 'number';
}
```

事件处理泛型：`OnNodeDrag<AppNode>`, `OnConnect` 等均支持泛型参数。

---

## 8) 故障排查速查

| 症状 | 最可能原因 | 修复 |
|------|-----------|------|
| 边不显示 | 缺少 CSS 导入 | `@import '@xyflow/react/dist/style.css'` |
| 无限重渲染 | nodeTypes/edgeTypes 在渲染中重建 | 移到组件外 |
| "zustand provider" 报错 | ReactFlowProvider 位置不对 | Provider 包在 hooks 组件**外层** |
| 画布空白 | 容器无尺寸 | CSS width + height |
| Handle 连不上 | 多 Handle 缺少 id | 给唯一 id |
| Handle 位置偏移 | 动态 Handle 后未更新 | `updateNodeInternals(nodeId)` |
| 节点类型不生效 | type 大小写不匹配 | node.type 与 nodeTypes key 完全一致 |
| 拖拽时输入框失焦 | 未阻止拖拽 | `className="nodrag"` |
| 输入光标跳动 | node.data 直接驱动 input | 分离本地 state（6.3） |
| 拖拽卡顿 | 未 memo / 订阅整个数组 | 见第 5 节 |
| CSS 库覆盖边样式 | 外部 CSS 优先级更高 | RF 样式最后加载 |
| Zustand 重复版本 | monorepo 多版本 | `npm ls @xyflow/react` |

---

## 9) 子流程与嵌套节点

- 子节点 `parentId` 指向父节点 id
- **父节点必须在 nodes 数组中排在子节点之前**
- `extent: 'parent'` 限制子节点不能拖出父节点
- 子节点边设合适 `zIndex` 确保渲染在父节点之上
