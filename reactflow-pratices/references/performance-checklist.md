# React Flow 性能检查清单

## 必须项（所有项目）

- [ ] `nodeTypes` / `edgeTypes` 定义在组件外部（不是 useMemo，是直接在模块顶层）
- [ ] 所有事件 handler 用 `useCallback` 包裹，依赖数组稳定
- [ ] 自定义节点/边组件用 `React.memo()` 包裹
- [ ] 传给 ReactFlow 的 object/array props（`defaultEdgeOptions`, `snapGrid` 等）用 `useMemo`
- [ ] 状态更新使用不可变模式（`{ ...node, data: { ...node.data } }`）

## 按需订阅（避免雪崩重渲染）

**核心问题**：`nodes`/`edges` 数组在拖拽/缩放时每帧都变。
在自定义节点或 UI 面板中直接引用整个数组 = 每帧重渲染所有消费者。

```tsx
// ❌ 在自定义节点中用 useNodes() —— 任何节点拖拽都触发所有节点重渲染
const nodes = useNodes();

// ❌ selector 返回新数组引用 —— 同样的问题
const selected = useStore(s => s.nodes.filter(n => n.selected));

// ✅ 取标量 —— 引用天然稳定
const nodeCount = useStore(s => s.nodes.length);

// ✅ 在 store 中维护独立派生状态
// store 内: selectedNodeIds: string[]，在 selection change 时更新
const selectedIds = useStore(s => s.selectedNodeIds);

// ✅ 返回数组时用 useShallow
import { useShallow } from 'zustand/react/shallow';
const [a, b] = useFlowStore(useShallow(s => [s.propA, s.propB]));
```

**或者在 store 层面启用 shallow 比较**：

```tsx
import { createWithEqualityFn } from 'zustand/traditional';
import { shallow } from 'zustand/shallow';

const useFlowStore = createWithEqualityFn<FlowState>(
  (set, get) => ({ /* ... */ }),
  shallow // 所有 selector 自动 shallow 比较
);
```

## 中型图（100-500 节点）

- [ ] 自定义节点内不要直接读 `useNodes()` / `useEdges()`
- [ ] Zustand selector 返回对象/数组时用 `useShallow` 或 store 级 shallow 比较
- [ ] 减少 CSS `box-shadow` / `gradient` / `animation`
- [ ] 自定义节点内避免复杂计算，尤其不要在 render 中做数组遍历

## 大型图（500+ 节点）

- [ ] 嵌套子图用 `hidden: true` 折叠不可见部分
- [ ] 重型节点内容（表格、图表等）隔离为独立 `React.memo()` 子组件
- [ ] 考虑 CSS `contain: layout paint` 减少重排
- [ ] 考虑分区加载 —— 只创建可见区域的节点

## 性能调试流程

1. React DevTools Profiler → 添加 30+ 节点 → 录制 → 拖拽单个节点数秒 → 查看火焰图
2. **优化后**：只有被拖拽的节点和关联边高亮（深灰 = 未渲染）
3. **未优化**：大量节点在单次拖拽中被标记为重渲染
4. 检查 "Why did this render?" —— 定位是 props 变化还是 parent re-render

## 官方基准参考

| 场景 | 未优化 | 优化后 |
|------|--------|--------|
| 100 个默认节点拖拽 | ~10 FPS | 60 FPS |
| 100 个重型节点（内嵌 DataGrid） | ~2 FPS | 35-40 FPS |

优化手段：`React.memo` + `useCallback` + selector 隔离 + 重型内容独立 memo。
