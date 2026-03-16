# React Flow 自定义组件详解

> 所有 import 均从 `@xyflow/react`

## 1. 自定义节点 —— 完整 API

### NodeProps（React Flow 自动注入）

| 属性 | 类型 | 说明 |
|------|------|------|
| `id` | `string` | 节点 id |
| `data` | `T` | 用户自定义数据 |
| `type` | `string` | 节点类型 |
| `selected` | `boolean` | 是否选中 |
| `dragging` | `boolean` | 是否正在拖拽 |
| `isConnectable` | `boolean` | 是否可连接 |
| `positionAbsoluteX` | `number` | 绝对 X 坐标 |
| `positionAbsoluteY` | `number` | 绝对 Y 坐标 |
| `width` | `number` | 渲染宽度（只读） |
| `height` | `number` | 渲染高度（只读） |
| `sourcePosition` | `Position` | 默认源 Handle 方位 |
| `targetPosition` | `Position` | 默认目标 Handle 方位 |
| `dragHandle` | `string` | CSS 选择器，限制拖拽区域 |
| `parentId` | `string` | 父节点 id |
| `zIndex` | `number` | 层级 |
| `draggable` | `boolean` | 是否可拖拽 |
| `selectable` | `boolean` | 是否可选中 |
| `deletable` | `boolean` | 是否可删除 |

### 交互元素处理

```tsx
// className="nodrag" 阻止拖拽冲突
<input className="nodrag" onChange={handleChange} />

// 限制只有特定区域可拖拽
const node = { id: '1', dragHandle: '.drag-handle', ... };
```

### 节点内更新数据

```tsx
// 方式一：useReactFlow（适合 Controlled / Uncontrolled）
const { updateNodeData } = useReactFlow();
updateNodeData(id, { color: '#ff0000' });

// 方式二：Zustand store action
const updateColor = useFlowStore(s => s.updateNodeColor);
updateColor(id, '#ff0000');
```

---

## 2. 自定义边 —— 完整 API

### EdgeProps（React Flow 自动注入）

| 属性 | 类型 | 说明 |
|------|------|------|
| `id` | `string` | 边 id |
| `source` | `string` | 起始节点 id |
| `target` | `string` | 目标节点 id |
| `type` | `string` | 边类型 |
| `data` | `T` | 用户自定义数据 |
| `animated` | `boolean` | 是否动画 |
| `selected` | `boolean` | 是否选中 |
| `style` | `CSSProperties` | 样式 |
| `sourceX`, `sourceY` | `number` | 起点坐标 |
| `targetX`, `targetY` | `number` | 终点坐标 |
| `sourcePosition` | `Position` | 起点方位 |
| `targetPosition` | `Position` | 终点方位 |
| `sourceHandleId` | `string \| null` | 起点 Handle id |
| `targetHandleId` | `string \| null` | 终点 Handle id |
| `label` | `ReactNode` | 标签 |
| `markerStart` | `string` | 起点标记 |
| `markerEnd` | `string` | 终点标记 |
| `interactionWidth` | `number` | 不可见点击热区宽度 |
| `pathOptions` | `object` | 路径参数 |

### 路径函数

```tsx
// 所有路径函数返回: [path, labelX, labelY, offsetX, offsetY]
const [edgePath, labelX, labelY] = getBezierPath({
  sourceX, sourceY, targetX, targetY,
  sourcePosition, targetPosition,
  curvature: 0.25, // getBezierPath 特有
});

const [edgePath] = getSmoothStepPath({
  sourceX, sourceY, targetX, targetY,
  sourcePosition, targetPosition,
  borderRadius: 5, offset: 25,
});
```

### EdgeLabelRenderer 用法

```tsx
<EdgeLabelRenderer>
  <div
    style={{
      position: 'absolute',
      transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
      pointerEvents: 'all',
    }}
    className="nodrag nopan"
  >
    {data?.label}
  </div>
</EdgeLabelRenderer>
```

必须用 `position: absolute` + `transform` 定位，加 `pointerEvents: 'all'` 使可交互，加 `nodrag nopan` 防冲突。

---

## 3. Handle 进阶

### 自定义外观

```tsx
<Handle
  type="source"
  position={Position.Right}
  style={{ background: 'none', border: 'none', width: '1em', height: '1em' }}
>
  {/* 子元素必须加 pointer-events: none */}
  <ArrowIcon style={{ pointerEvents: 'none', position: 'absolute', left: 0 }} />
</Handle>
```

### 连接视觉反馈

用 `useConnection()` 跟踪拖拽中的连接状态，通过 `connection.inProgress && connection.toNode?.id === id` 判断是否有连接线指向当前节点，据此改变 Handle 样式。

### Handle CSS 状态类

```css
.react-flow__handle.connecting { background: #ff6b6b; }
.react-flow__handle.valid { background: #00c853; }
```

### 连接限制

```tsx
// Handle 级别限制连接数
<Handle type="target" isConnectable={(connections) => connections.length < 1} />

// 全局验证函数
<ReactFlow isValidConnection={(conn) => conn.source !== conn.target} />
```

---

## 4. 内置辅助组件

### NodeResizer

```tsx
function ResizableNode({ selected }: NodeProps) {
  return (
    <>
      <NodeResizer isVisible={selected} minWidth={100} minHeight={50} />
      <div style={{ width: '100%', height: '100%' }}>Resizable content</div>
      <Handle type="source" position={Position.Bottom} />
    </>
  );
}
```

节点需设置 CSS `min-width`/`min-height` 配合。

---

## 5. 注册与匹配规则

```tsx
// 模块顶层定义（组件外）
const nodeTypes = { colorPicker: ColorPickerNode, textEditor: TextEditorNode };
const edgeTypes = { labeled: LabeledEdgeComponent };
```

- `type` 字符串与 nodeTypes/edgeTypes 的 key **大小写完全一致**
- 不匹配时静默降级为 `'default'` 类型，不报错
- 建议统一用 camelCase

---

## 6. 主题与样式

### colorMode

```tsx
<ReactFlow colorMode="dark" />  // 'light' | 'dark' | 'system'
```

启用后根 `.react-flow` 元素添加 `.dark` / `.light` class。

### CSS 变量完整列表

**节点**：
| 变量 | 默认值 |
|------|--------|
| `--xy-node-background-color-default` | `#fff` |
| `--xy-node-border-default` | `1px solid #1a192b` |
| `--xy-node-color-default` | `inherit` |
| `--xy-node-group-background-color-default` | `rgba(240, 240, 240, 0.25)` |
| `--xy-node-boxshadow-hover-default` | `0 1px 4px 1px rgba(0,0,0,0.08)` |
| `--xy-node-boxshadow-selected-default` | `0 0 0 0.5px #1a192b` |

**边与连接线**：
| 变量 | 默认值 |
|------|--------|
| `--xy-edge-stroke-default` | `#b1b1b7` |
| `--xy-edge-stroke-width-default` | `1` |
| `--xy-edge-stroke-selected-default` | `#555` |
| `--xy-connectionline-stroke-default` | `#b1b1b7` |
| `--xy-connectionline-stroke-width-default` | `1` |

**Handle**：
| 变量 | 默认值 |
|------|--------|
| `--xy-handle-background-color-default` | `#1a192b` |
| `--xy-handle-border-color-default` | `#fff` |

**UI 控件**：
| 变量 | 默认值 |
|------|--------|
| `--xy-controls-button-background-color-default` | `#fefefe` |
| `--xy-controls-button-background-color-hover-default` | `#f4f4f4` |
| `--xy-controls-button-border-color-default` | `#eee` |
| `--xy-controls-box-shadow-default` | `0 0 2px 1px rgba(0,0,0,0.08)` |
| `--xy-minimap-background-color-default` | `#fff` |
| `--xy-resize-background-color-default` | `#3367d9` |

**选区与背景**：
| 变量 | 默认值 |
|------|--------|
| `--xy-selection-background-color-default` | `rgba(0, 89, 220, 0.08)` |
| `--xy-selection-border-default` | `1px dotted rgba(0, 89, 220, 0.8)` |
| `--xy-background-pattern-dots-color-default` | `#91919a` |
| `--xy-background-pattern-line-color-default` | `#eee` |

### 样式导入

- `@xyflow/react/dist/style.css` —— 完整默认样式（推荐）
- `@xyflow/react/dist/base.css` —— 仅功能性基础样式，适合完全自定义

### 交互控制 CSS 类

| 类名 | 作用 | 典型场景 |
|------|------|----------|
| `nodrag` | 阻止触发节点拖拽和选中 | input / button / select |
| `nopan` | 阻止触发画布平移 | 边标签、浮动面板 |
| `nowheel` | 阻止触发滚轮缩放 | 节点内可滚动列表 |
