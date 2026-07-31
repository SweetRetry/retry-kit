# React Flow 自定义节点 / 边 / Handle / 样式

> 用途：处理自定义组件实现细节。
> 基准：官方 `Custom Nodes`、`Custom Edges`、`Handles`、`Utility Classes`、`Theming` 与相关 examples。

## 1. 自定义节点

### 最小正确心智模型

自定义节点本质上就是一个普通 React 组件，React Flow 会向它注入 `NodeProps`。

优先关注这些字段：

- `id`
- `data`
- `selected`
- `dragging`
- `isConnectable`
- `width`
- `height`
- `sourcePosition`
- `targetPosition`
- `parentId`
- `dragHandle`

### 容易写错的地方

1. 把 `width` / `height` 当成业务可控字段
2. 没给交互元素加 `nodrag`
3. 动态 Handle 后忘了刷新 internals
4. 在 render 中重建 `nodeTypes`

### 推荐骨架

```tsx
import { memo, type NodeProps, Handle, Position } from '@xyflow/react';

type CounterNode = Node<{ label: string; count: number }, 'counter'>;

function CounterNodeComponent({ data, selected }: NodeProps<CounterNode>) {
  return (
    <div className={selected ? 'node selected' : 'node'}>
      <Handle type="target" position={Position.Top} />
      <button className="nodrag">{data.label}</button>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

export default memo(CounterNodeComponent);
```

### `nodeTypes` 注册原则

- 静态配置：模块顶层定义
- 动态配置：`useMemo`
- `type` 字符串必须和 `nodeTypes` 的 key 完全一致

如果 type 不匹配，官方 common errors 文档说明会回退到默认节点。

---

## 2. 自定义边

### 推荐路径

官方 custom edges guide 的常见路径是：

1. 用 path util 生成 path
2. 用 `<BaseEdge />` 渲染
3. 需要 label 时使用 `<EdgeLabelRenderer />`

### 典型骨架

```tsx
import {
  BaseEdge,
  getSmoothStepPath,
  type Edge,
  type EdgeProps,
} from '@xyflow/react';

type LabeledEdge = Edge<{ label?: string }, 'labeled'>;

export function LabeledEdgeComponent(props: EdgeProps<LabeledEdge>) {
  const [path] = getSmoothStepPath({
    sourceX: props.sourceX,
    sourceY: props.sourceY,
    targetX: props.targetX,
    targetY: props.targetY,
    sourcePosition: props.sourcePosition,
    targetPosition: props.targetPosition,
  });

  return <BaseEdge id={props.id} path={path} />;
}
```

### 需要特别记住

- 自定义边通常用 `<BaseEdge />`，但特殊 path 允许自行构造
- 若边与 Handle 对接角度异常，优先检查有没有传 `sourcePosition` / `targetPosition`
- 多 Handle 时，边对象里的 `sourceHandle` / `targetHandle` 要和 Handle `id` 对上

---

## 3. Handle

### 官方约束

- 多个同类型 Handle 时，要有唯一 `id`
- 隐藏 Handle 不要用 `display: none`
- 需要局部连接约束时，优先用 Handle props

### 推荐排查项

1. `type` 是否正确
2. `position` 是否正确
3. 同类型多 Handle 是否都有 `id`
4. 动态改 Handle 后是否调用 `useUpdateNodeInternals()`

### 推荐写法

```tsx
<Handle
  type="source"
  id="success"
  position={Position.Right}
  isConnectable
/>
```

### 关于连接数量限制

官方 docs 的 Handle API 重点在 `isConnectable` / `isConnectableStart` / `isConnectableEnd` / `isValidConnection`。
如果要实现“按连接数限制”的更复杂策略，优先参考官方 `Connection Limit` example，不要凭记忆臆造 `<Handle />` 的回调签名。

---

## 4. Utility Classes

优先使用官方 utility classes 处理交互冲突：

### `nodrag`

适用：

- `input`
- `button`
- `select`
- 任何节点内部可点击控件

作用：

- 防止点击控件时触发节点拖拽

### `nopan`

适用：

- 边标签
- 浮层
- 节点内固定区域

作用：

- 防止拖拽该元素时带动画布平移

### `nowheel`

适用：

- 节点内可滚动容器

作用：

- 滚轮只滚动当前内容，不触发画布平移

---

## 5. 动态 Handle 与计算型节点

这些问题要一起考虑：

- 连接关系订阅
- 节点数据订阅
- internals 刷新

常用组合：

- `useNodeConnections()` 读取连接
- `useNodesData()` 读取相关节点 `data`
- `useUpdateNodeInternals()` 在 Handle 结构变化后刷新

如果是“输入节点影响输出节点”的计算型场景，优先参考官方 computing flows 思路，而不是用大范围订阅硬算整张图。

---

## 6. Node Resizer / Edge Label / 其它内置组件

### `NodeResizer`

适合：

- 需要用户直接拖拽调整节点尺寸

注意：

- 节点本身仍应通过样式控制尺寸表现
- 调整尺寸后若你的业务数据也要同步，需要自己定义同步逻辑

### `EdgeLabelRenderer`

适合：

- HTML label
- 可点击操作按钮

常见要求：

- 绝对定位
- `pointerEvents: 'all'`
- 常搭配 `nodrag nopan`

---

## 7. 样式与主题

### 样式文件

- 默认优先：`@xyflow/react/dist/style.css`
- 高度定制时：`@xyflow/react/dist/base.css`

### `colorMode`

官方支持：

- `'light'`
- `'dark'`
- `'system'`

### CSS 变量

React Flow 提供了节点、边、Handle、controls、minimap、selection、background 等一组 CSS variables。
当你只是做主题定制时，优先 CSS 变量，而不是直接覆盖大量内部类名。

---

## 8. 容易误导用户的说法

- “自定义边必须自己写 `<path>`”
- “所有 Handle 逻辑都要在 `isValidConnection` 里做”
- “隐藏 Handle 没区别，`display: none` 也行”
- “自定义节点天然自带默认样式”
- “type 不匹配会直接抛错”
