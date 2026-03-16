# React Flow Hooks & 工具函数速查

> 所有 import 均从 `@xyflow/react`

## 1. 状态管理 Hooks

### useNodesState

```tsx
useNodesState<NodeType>(initialNodes: NodeType[]): [
  nodes: NodeType[],
  setNodes: Dispatch<SetStateAction<NodeType[]>>,
  onNodesChange: OnNodesChange<NodeType>
]
```

管理节点状态 + 内置 change handler。适合原型和中小项目；复杂应用推荐 Zustand。

### useEdgesState

```tsx
useEdgesState<EdgeType>(initialEdges: EdgeType[]): [
  edges: EdgeType[],
  setEdges: Dispatch<SetStateAction<EdgeType[]>>,
  onEdgesChange: OnEdgesChange<EdgeType>
]
```

管理边状态 + 内置 change handler。同上。

### useReactFlow

```tsx
useReactFlow<NodeType, EdgeType>(): ReactFlowInstance<NodeType, EdgeType>
```

获取实例方法：`fitView`, `getZoom`, `setCenter`, `getNodes`, `setNodes`, `getEdges`, `setEdges`, `updateNodeData`, `screenToFlowPosition`, `flowToScreenPosition`, `toObject` 等。

⚠️ **不会因状态变化重渲染**——调用方法时才查询最新状态。在 `useEffect`/`useCallback` 中需将返回值加入依赖数组（首次渲染时未初始化）。

### useViewport

```tsx
useViewport(): { x: number; y: number; zoom: number }
```

获取当前视口状态。视口变化时触发重渲染。

### useNodes / useEdges

```tsx
useNodes(): Node[]
useEdges(): Edge[]
```

⚠️ **高频变化**——拖拽/缩放时每帧都变。自定义节点中慎用，优先用 `useStore(selector)` 取标量值。

---

## 2. 连接与查询 Hooks

### useConnection

```tsx
useConnection<SelectorReturn>(
  connectionSelector?: (connection: ConnectionState) => SelectorReturn
): SelectorReturn | ConnectionState
```

跟踪拖拽中的连接状态。传 selector 可避免无关属性变化导致重渲染。无连接时所有属性为 null。

典型用途：根据连接有效性动态改变 Handle 颜色。

### useNodeConnections

```tsx
useNodeConnections(options?: {
  id?: string;              // 节点 id，自定义节点内自动填充
  handleType: 'source' | 'target';
  handleId?: string;        // 多 Handle 时按 id 过滤
  onConnect?: (connections: HandleConnection[]) => void;
  onDisconnect?: (connections: HandleConnection[]) => void;
}): NodeConnection[]
```

获取节点的连接列表。支持 `onConnect`/`onDisconnect` 回调。

### useHandleConnections（已废弃）

```tsx
useHandleConnections(options: {
  type: 'source' | 'target';
  id?: string | null;
  nodeId?: string;
  onConnect?: (connections: Connection[]) => void;
  onDisconnect?: (connections: Connection[]) => void;
}): HandleConnection[]
```

⚠️ **已废弃**，请用 `useNodeConnections()` 替代。

### useNodesData

```tsx
// 单节点
useNodesData<NodeType>(nodeId: string): Pick<NodeType, 'id' | 'type' | 'data'> | null
// 多节点
useNodesData<NodeType>(nodeIds: string[]): Pick<NodeType, 'id' | 'type' | 'data'>[]
```

订阅指定节点的 `data` 变化。单节点不存在时返回 `null`。

### useNodeId

```tsx
useNodeId(): string | null
```

在自定义节点内获取当前节点 id，避免 prop drilling。

---

## 3. 交互与生命周期 Hooks

### useOnSelectionChange

```tsx
useOnSelectionChange(params: {
  onChange: (params: { nodes: NodeType[]; edges: EdgeType[] }) => void;
}): void
```

⚠️ **onChange 必须 memoize**（`useCallback`），否则 hook 行为不正确。

### useOnViewportChange

```tsx
useOnViewportChange(callbacks: {
  onStart?: (viewport: Viewport) => void;
  onChange?: (viewport: Viewport) => void;
  onEnd?: (viewport: Viewport) => void;
}): void
```

分阶段监听视口变化：开始、进行中、结束。

### useKeyPress

```tsx
useKeyPress(keyCode: string | string[], options?: {
  target?: Window | Document | HTMLElement | ShadowRoot | null;  // 默认 document
  actInsideInputWithModifier?: boolean;  // 默认 true
  preventDefault?: boolean;
}): boolean
```

检测键盘按键。支持组合键（`'a+d'`）和多键（`['a', 'd+s']`）。不依赖 ReactFlowInstance，可在任意组件使用。

### useUpdateNodeInternals

```tsx
useUpdateNodeInternals(): (nodeId: string | string[]) => void
```

返回更新函数。动态增减 Handle 后必须调用，支持批量传入节点 id 数组。

### useNodesInitialized

```tsx
useNodesInitialized(options?: { includeHiddenNodes?: boolean }): boolean
```

所有节点完成首次测量（有 width/height）后返回 `true`。节点数组为空时始终返回 `false`。

用于布局计算时机：等此值为 `true` 后再执行自动布局。

---

## 4. 高级 Hooks（谨慎使用）

### useStore

```tsx
useStore<StateSlice>(
  selector: (state: ReactFlowState) => StateSlice,
  equalityFn?: (a: StateSlice, b: StateSlice) => boolean
): StateSlice
```

直接访问内部 Zustand store。**必须用 selector**，不取整个 store。`equalityFn` 可用 `zustand/shallow` 防止不必要重渲染。

优先用 `useReactFlow()` / `useViewport()` 等专用 hook，仅在无其他方式时使用。

### useStoreApi

```tsx
useStoreApi(): StoreApi<ReactFlowState>
```

获取 store API，用于命令式读写（`getState()` / `setState()`）。仅高级场景。

### useInternalNode

```tsx
useInternalNode<NodeType>(id: string): InternalNode<NodeType> | undefined
```

获取节点内部数据（含 `internals.positionAbsolute` 等）。⚠️ 任何节点变化都触发重渲染。内部实现细节，API 可能变更。

---

## 5. 工具函数

### 节点/边变更

```tsx
applyNodeChanges<NodeType>(changes: NodeChange<NodeType>[], nodes: NodeType[]): NodeType[]
applyEdgeChanges<EdgeType>(changes: EdgeChange<EdgeType>[], edges: EdgeType[]): EdgeType[]
addEdge<EdgeType>(
  edgeParams: Edge | Connection,
  edges: EdgeType[],
  options?: { getEdgeId?: GetEdgeId }
): EdgeType[]
```

- `applyNodeChanges` / `applyEdgeChanges`：应用 Change 数组到节点/边数组
- `addEdge`：从 Connection 创建新边，自动防重复

### 边操作

```tsx
reconnectEdge<EdgeType>(
  oldEdge: EdgeType,
  newConnection: Connection,
  edges: EdgeType[],
  options?: { shouldReplaceId?: boolean; getEdgeId?: GetEdgeId }
): EdgeType[]

getConnectedEdges<NodeType, EdgeType>(nodes: NodeType[], edges: EdgeType[]): EdgeType[]
```

- `reconnectEdge`：重新连接边（v12 替代 `updateEdge`）。`shouldReplaceId` 默认 `true`
- `getConnectedEdges`：查找与给定节点关联的所有边

### 图遍历

```tsx
getIncomers<NodeType, EdgeType>(
  node: NodeType | { id: string }, nodes: NodeType[], edges: EdgeType[]
): NodeType[]

getOutgoers<NodeType, EdgeType>(
  node: NodeType | { id: string }, nodes: NodeType[], edges: EdgeType[]
): NodeType[]
```

### 类型守卫

```tsx
isNode(element: unknown): element is Node
isEdge(element: unknown): element is Edge
```

### 路径生成（用于自定义边）

所有路径函数返回 `[path: string, labelX: number, labelY: number, offsetX: number, offsetY: number]`。

```tsx
getBezierPath(params: {
  sourceX, sourceY, targetX, targetY: number;
  sourcePosition?: Position;   // 默认 Position.Bottom
  targetPosition?: Position;   // 默认 Position.Top
  curvature?: number;          // 默认 0.25
}): [string, number, number, number, number]

getSimpleBezierPath(params: {
  sourceX, sourceY, targetX, targetY: number;
  sourcePosition?: Position;
  targetPosition?: Position;
}): [string, number, number, number, number]

getSmoothStepPath(params: {
  sourceX, sourceY, targetX, targetY: number;
  sourcePosition?: Position;
  targetPosition?: Position;
  borderRadius?: number;   // 默认 5，设 0 为直角
  offset?: number;         // 默认 20
  centerX?: number;
  centerY?: number;
}): [string, number, number, number, number]

getStraightPath(params: {
  sourceX, sourceY, targetX, targetY: number;
}): [string, number, number, number, number]
```

### 视口

```tsx
getNodesBounds(
  nodes: (string | NodeType | InternalNodeBase)[],
  params?: { nodeOrigin?: NodeOrigin; nodeLookup?: NodeLookup }
): Rect

getViewportForBounds(
  bounds: Rect,
  width: number, height: number,
  minZoom: number, maxZoom: number,
  padding?: Padding
): Viewport  // { x, y, zoom }
```

- `getNodesBounds`：获取节点集合的边界框（旧名 `getRectOfNodes`）
- `getViewportForBounds`：计算适合边界的视口（旧名 `getTransformForBounds`），可用于服务端渲染

---

## 6. Change 类型定义

### NodeChange

```tsx
type NodeChange<NodeType> =
  | { type: 'position'; id: string; position: XYPosition; dragging: boolean }
  | { type: 'dimensions'; id: string; dimensions: { width: number; height: number } }
  | { type: 'select'; id: string; selected: boolean }
  | { type: 'remove'; id: string }
  | { type: 'add'; item: NodeType }
  | { type: 'replace'; id: string; item: NodeType };
```

### EdgeChange

```tsx
type EdgeChange<EdgeType> =
  | { type: 'add'; item: EdgeType }
  | { type: 'remove'; id: string }
  | { type: 'replace'; id: string; item: EdgeType }
  | { type: 'select'; id: string; selected: boolean };
```
