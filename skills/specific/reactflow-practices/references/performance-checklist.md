# React Flow 性能检查清单

> 用途：把官方 performance guide 变成可执行检查表。
> 基准：官方 `Performance` 文档 + state management guide + relevant examples。

## 1. 必查项

- [ ] `nodeTypes` / `edgeTypes` 保持稳定引用
- [ ] 传给 `<ReactFlow />` 的 callback 用 `useCallback`
- [ ] 传给 `<ReactFlow />` 的 object / array props 用 `useMemo` 或稳定常量
- [ ] 自定义节点 / 边组件用 `React.memo`
- [ ] nodes / edges 更新保持不可变
- [ ] 没有在高频组件里直接订阅整个 `nodes` / `edges`

---

## 2. 最常见的性能坑

### 坑 1：在组件里直接拿整个 `nodes`

```tsx
// ❌ 每次拖拽、平移、缩放都可能导致依赖方重渲染
const nodes = useStore((state) => state.nodes);
const selectedIds = nodes.filter((node) => node.selected).map((node) => node.id);
```

更好的方向：

- 单独维护派生状态
- 或只订阅必要 slice
- 一次性读取则改用 `useReactFlow().getNodes()`

### 坑 2：每次 render 都创建新 props

典型对象：

- `nodeTypes`
- `edgeTypes`
- `snapGrid`
- `defaultEdgeOptions`
- `proOptions`

### 坑 3：重型节点内容和 Flow 外壳绑在一起

如果节点里有表格、图表、富文本、复杂表单：

- 把重型部分拆成独立 `memo` 子组件
- 避免让它随着节点位置变化一起做无意义重渲染

---

## 3. 大图优化方向

官方 performance 文档明确提到两件事：

1. Collapse large node trees
2. Simplify node and edge styles

可执行化后：

- [ ] 可以折叠的子树使用 `hidden`
- [ ] 非关键节点减少阴影、渐变、持续动画
- [ ] 节点内部不要在 render 阶段做大数组遍历
- [ ] 只在真正需要时才渲染重型内容

---

## 4. 状态设计与性能是同一个问题

如果你发现“图一大就卡”，不要只盯着 React memo。
优先检查是不是状态模型本身让太多组件订阅了频繁变化的数据。

优先级：

1. 先减订阅范围
2. 再稳定 props
3. 最后才是局部 memo 补丁

---

## 5. 建议的排查流程

1. 用 React DevTools Profiler 录制拖拽一个节点
2. 看是否大量无关节点一起重渲染
3. 如果是：
   - 查 `nodeTypes` / callbacks / object props 是否稳定
   - 查是否读了整个 `nodes` / `edges`
   - 查 selector 是否返回新对象 / 新数组
4. 如果不是：
   - 查节点内部是否有重型 UI
   - 查样式成本

---

## 6. 什么时候不要乱给数字

除非你手里有当前项目的真实 profiling 证据，否则不要写：

- “这个改动能把 FPS 提升到多少”
- “100 个节点一定会怎样”
- “500 个节点一定要上某个方案”

官方 performance 文档给的是方向和模式，不是你的项目基准测试结果。

---

## 7. 一句话原则

- 稳定引用
- 最小订阅
- 不可变更新
- 重型内容隔离
- 样式尽量轻
