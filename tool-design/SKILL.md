---
name: tool-design
description: AI Agent 工具接口设计哲学与实践指南。指导如何为 LLM/Agent 设计高效的工具接口——核心主张是用 batch 复合操作替代细粒度 CRUD 原语，减少 round-trip、降低 token 开销、提升 agent 自主性。适用于 MCP Server tool schema 设计、Function Calling 接口设计、AI Plugin 接口设计。触发场景：(1) 用户要设计或审查 AI Agent 的工具接口/tool schema，(2) 用户提到 "MCP tool"、"function calling"、"tool design"、"工具设计"、"接口设计"，(3) 用户在构建 MCP Server 并需要决定 tool 的粒度和参数结构，(4) 用户的工具设计出现了过度细粒度（一个操作一个 tool）的反模式，(5) 用户需要评审现有 tool schema 是否对 LLM 友好。
---

# AI Agent Tool Design

人类用 GUI 逐个点击，LLM 用 tool call 批量编排。为人类设计的 CRUD API 直接移植为 agent 工具 = 灾难性低效。每次 tool call = LLM 推理 + 网络往返 + token 消耗，所以 round-trip 数量是 tool 设计的第一性原则。

## 原则一：Batch Over Granular — 写操作

```
# 反模式 — 5 次 round-trip，中间状态不一致
canvas_add_node(type, props)      # call 1
canvas_add_node(type, props)      # call 2
canvas_add_edge(from, to)         # call 3
canvas_update_node(id, props)     # call 4
canvas_delete_node(id)            # call 5

# 正确 — 1 次 round-trip，原子执行，失败回滚
batch_design(operations=[
  I("parent", {type: "frame", ...}),
  U("nodeId", {content: "hello"}),
  D("nodeId2"),
  M("nodeId3", "newParent"),
])
```

## 原则二：Batch Over Granular — 读操作

```
# 反模式 — 4 次 round-trip
get_node(id="A")        # call 1
get_node(id="B")        # call 2
get_children(id="A")    # call 3
search_by_type("text")  # call 4

# 正确 — 1 次调用，多种查询聚合
batch_get(
  nodeIds=["A", "B"],                           # 按 ID 批量读
  patterns=[{type: "text"}, {reusable: true}],  # 按模式搜索
  readDepth=2                                    # 控制返回深度
)
```

`readDepth`/`limit`/`filter` 是必选参数——LLM 的 context window 是稀缺资源，无深度控制的查询返回完整嵌套树会撑爆上下文。

## 原则三：参数即 DSL

batch 参数不是扁平 key-value，而是小型 DSL：

```javascript
sidebar=I("parent", {type: "ref", ref: "SidebarComp", width: 240})
content=I("parent", {type: "frame", layout: "vertical", gap: 24})
card=I(content, {type: "ref", ref: "CardComp"})
U(card+"/titleText", {content: "Dashboard"})
G(card+"/heroImage", "stock", "modern office workspace")
```

关键机制：
- **binding 变量**（`card=I(...)`）— 操作间引用，无需等返回 ID 再发下一个 call
- **路径表达式**（`card+"/titleText"`）— 嵌套结构访问
- **单字母操作符**（`I/U/D/R/M/C/G`）— LLM 容易生成也容易校验
- **合理默认值** — 减少 LLM 需要显式指定的参数量
- **顺序执行、失败回滚** — 原子性保证

## 参考架构：Pencil MCP Tool 拓扑

```
┌─────────────────────────────────────────┐
│              查询层 (Read)               │
│  batch_get          — 批量读+模式搜索    │
│  snapshot_layout    — 布局快照           │
│  get_screenshot     — 视觉验证           │
│  get_variables      — 变量/主题读取       │
│  get_editor_state   — 编辑器状态          │
├─────────────────────────────────────────┤
│              变更层 (Write)              │
│  batch_design       — 批量 IUDRMCG 操作  │
│  set_variables      — 变量写入            │
│  replace_all_matching — 批量属性替换      │
├─────────────────────────────────────────┤
│              辅助层 (Utility)            │
│  find_empty_space   — 空间查找            │
│  get_guidelines     — 按 topic 加载指南   │
│  get_style_guide    — 风格参考            │
│  open_document      — 文档管理            │
└─────────────────────────────────────────┘
```

架构洞察：
- **写操作集中到 1 个核心 tool**（`batch_design`），不拆成 7 个独立的 add/update/delete/move/copy/replace/generate
- **读操作 1 个通用 + N 个语义专用**：`batch_get` 覆盖通用数据查询，专用 tool 仅在返回类型本质不同时存在（结构数据 vs 像素截图 vs 布局坐标）
- **辅助 tool 按需加载**：`get_guidelines(topic=...)` 按 topic 返回相关子集，不一次性灌入全部上下文

## 检查清单

| # | 检查项 | 通过标准 |
|---|--------|---------|
| 1 | Round-trip 数 | 典型用户意图 ≤3 次 tool call 完成 |
| 2 | 操作原子性 | 相关变更在一次 call 中原子完成，无中间不一致状态 |
| 3 | 查询聚合 | 支持批量 ID + 模式匹配，不存在只能单 ID 查询的 tool |
| 4 | 返回量可控 | 有 depth/limit/filter 参数防止撑爆 context |
| 5 | 操作间引用 | batch 内 binding 变量机制，前序结果可被后续引用 |
| 6 | 错误粒度 | 单操作级精确错误信息，非整个 batch 黑盒失败 |
| 7 | 幂等性 | update 操作天然幂等，LLM 重试不产生副作用 |

## 反模式速查

| 症状 | 诊断 | 修复 |
|------|------|------|
| `create_X`, `read_X`, `update_X`, `delete_X` 四件套 | CRUD 直译 | 合并为 `batch_X(operations=[...])` |
| `get_node(id)` 只能一次读一个 | 无批量查询 | 支持 `nodeIds=[...]` + `patterns` 模式搜索 |
| 查询返回完整嵌套树，context 频繁溢出 | 无深度控制 | 加 `readDepth`/`limit` 参数 |
| 复杂操作用 20 个平铺参数 | 扁平参数 | 设计结构化 DSL，用对象/数组组织 |
| batch 内操作不能引用彼此结果，必须拆成多次 call | 无跨操作引用 | 引入 binding 变量机制 |
| `get_by_id`, `get_by_name`, `get_by_type`, `search` 各一个 tool | 查询 tool 碎片化 | 统一为 `batch_get(nodeIds, patterns)` |
