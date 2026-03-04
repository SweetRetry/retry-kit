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

查询接口必须至少提供一种返回量控制机制（如 `readDepth` / `limit` / `cursor` / `fields`）——LLM 的 context window 是稀缺资源，无控制的全量嵌套返回会撑爆上下文。

## 原则三：滑动窗口（Sliding Window）优先

Agent 不是一次性读完全部上下文，而是「分块读取 → 局部推理 → 必要时继续读取」。tool 需要原生支持这种工作流。

```
# 反模式 — 一次性全量读取，token 爆炸
batch_get(parentId="root", readDepth=99)

# 正确 — 滑动窗口增量读取
batch_get(
  parentId="root",
  cursor="",
  limit=50,
  readDepth=2,
  sortBy="updatedAt",
  sortOrder="desc"
) -> {items:[...], nextCursor:"abc"}

batch_get(
  parentId="root",
  cursor="abc",
  limit=50,
  readDepth=2
) -> {items:[...], nextCursor:"def"}
```

设计要点：
- **稳定排序 + cursor 分页**：避免 offset 翻页导致漏读/重读
- **窗口可回放**：返回 `nextCursor`/`hasMore`，让 agent 可中断后续跑
- **局部摘要友好**：每页字段尽量精简，支持 `fields` 参数只取必要信息
- **窗口大小可调**：`limit` 可按任务复杂度动态缩放（如 20/50/100）

## 原则四：参数即 DSL

batch 参数不是扁平 key-value，而是小型 DSL：

```javascript
sidebar=I("parent", {type: "ref", ref: "SidebarComp", width: 240})
content=I("parent", {type: "frame", layout: "vertical", gap: 24})
card=I(content, {type: "ref", ref: "CardComp"})
U(card+"/titleText", {content: "Dashboard"})
G(card+"/heroImage", "stock", "modern office workspace")
```

操作符语义：

| 操作符 | 全称 | 语义 |
|--------|------|------|
| I | Insert | 创建新节点，返回 binding ref |
| U | Update | 更新已有节点的属性 |
| D | Delete | 删除节点 |
| R | Replace | 替换节点内容（保留位置与 ID） |
| M | Move | 移动节点到新父级 |
| C | Copy | 复制节点（含子树） |
| G | Generate | 触发 AI 生成（图片/内容等） |

关键机制：
- **binding 变量**（`card=I(...)`）— 操作间引用，无需等返回 ID 再发下一个 call
- **路径表达式**（`card+"/titleText"`）— 嵌套结构访问
- **单字母操作符**（`I/U/D/R/M/C/G`）— LLM 容易生成也容易校验
- **合理默认值** — 省略可推断参数（如 position、size），减少 LLM 显式指定量；默认值变更视为 breaking change
- **顺序执行、失败回滚** — 原子性保证

## 原则五：契约稳定性（Schema + Retry + Observability）

高质量 tool 不仅要快，还要「可重试、可演进、可诊断」。

- **严格 schema**：每个字段类型、必填项、枚举值明确；拒绝模糊字符串协议
- **幂等重试**：写操作支持 `idempotencyKey`，网络抖动重试不产生重复副作用
- **版本兼容**：通过 `version`/`capabilities` 渐进升级，避免一次性 breaking changes
- **可观测性**：返回 `operationId`、耗时、失败步骤，便于 agent 自愈和回退

### 最小 Schema 模板（可直接落到 OpenAPI/JSON Schema）

```json
{
  "batch_write.request": {
    "type": "object",
    "required": ["version", "context", "operations"],
    "properties": {
      "version": { "type": "string", "enum": ["2026-01-01"] },
      "context": {
        "type": "object",
        "required": ["actor", "tenantId", "scopes"],
        "properties": {
          "actor": { "type": "string", "minLength": 1 },
          "tenantId": { "type": "string", "minLength": 1 },
          "scopes": {
            "type": "array",
            "items": { "type": "string" },
            "minItems": 1
          },
          "resourcePolicyVersion": { "type": "string" }
        },
        "additionalProperties": false
      },
      "idempotencyKey": { "type": "string", "minLength": 8 },
      "operations": {
        "type": "array",
        "minItems": 1,
        "maxItems": 200,
        "items": {
          "type": "object",
          "required": ["op"],
          "properties": {
            "op": { "type": "string", "enum": ["I", "U", "D", "R", "M", "C", "G"] },
            "target": { "type": "string" },
            "payload": { "type": "object" },
            "operationKey": { "type": "string", "minLength": 8 }
          },
          "additionalProperties": false
        }
      },
      "capabilities": { "type": "array", "items": { "type": "string" } }
    },
    "additionalProperties": false
  }
}
```

```json
{
  "batch_read.request": {
    "type": "object",
    "required": ["version", "context"],
    "properties": {
      "version": { "type": "string", "enum": ["2026-01-01"] },
      "context": {
        "type": "object",
        "required": ["actor", "tenantId", "scopes"],
        "properties": {
          "actor": { "type": "string" },
          "tenantId": { "type": "string" },
          "scopes": { "type": "array", "items": { "type": "string" } }
        },
        "additionalProperties": false
      },
      "nodeIds": { "type": "array", "items": { "type": "string" }, "maxItems": 500 },
      "patterns": { "type": "array", "items": { "type": "object" }, "maxItems": 50 },
      "cursor": { "type": "string" },
      "limit": { "type": "integer", "minimum": 1, "maximum": 200 },
      "readDepth": { "type": "integer", "minimum": 0, "maximum": 5 },
      "fields": { "type": "array", "items": { "type": "string" }, "maxItems": 100 }
    },
    "additionalProperties": false
  }
}
```

## 原则六：错误语义规范（Retryable vs Non-Retryable）

Agent 不是人类。错误信息必须机器可判定、可分流、可恢复，而不是只返回一段自然语言。

推荐返回结构：

```json
{
  "ok": false,
  "error": {
    "code": "RATE_LIMITED",
    "message": "Too many requests",
    "retryable": true,
    "retryAfterMs": 1200,
    "hint": "reduce_batch_size",
    "operationIndex": 3
  },
  "operationId": "op_7f9c"
}
```

HTTP / Transport 映射建议（避免 message 文本驱动逻辑）：
- `400`：`VALIDATION_ERROR` / `SCHEMA_MISMATCH`（不可重试）
- `401`：`AUTH_UNAUTHORIZED`（不可重试，需重新认证）
- `403`：`AUTH_FORBIDDEN` / `AUTH_SCOPE_MISSING`（不可重试，需提权）
- `404`：`NOT_FOUND`（通常不可重试）
- `409`：`CONFLICT_RETRY`（可重试）
- `429`：`RATE_LIMITED`（可重试，必须带 `retryAfterMs`）
- `500/503`：`TEMPORARY_UNAVAILABLE` / `TIMEOUT`（可重试）

错误分层建议：
- **可重试（retryable=true）**：`RATE_LIMITED`、`TIMEOUT`、`CONFLICT_RETRY`、`TEMPORARY_UNAVAILABLE`
- **不可重试（retryable=false）**：`VALIDATION_ERROR`、`AUTH_FORBIDDEN`、`NOT_FOUND`、`SCHEMA_MISMATCH`
- **部分成功**：batch 内允许 `results[]` 标记逐项状态，并明确失败项索引

设计要点：
- **错误码稳定且枚举化**：避免 agent 依赖 message 文本做脆弱解析
- **重试指令显式化**：给 `retryAfterMs`、`maxSuggestedRetries`、`hint`
- **定位信息完整**：返回 `operationIndex`/`path`/`field` 便于最小修复
- **批处理可恢复**：支持失败后只重放失败子集，而非整批重做

部分成功标准结构（必须固定）：

```json
{
  "ok": false,
  "operationId": "op_7f9c",
  "results": [
    { "index": 0, "ok": true },
    {
      "index": 1,
      "ok": false,
      "error": {
        "code": "AUTH_FORBIDDEN",
        "retryable": false,
        "path": "operations[1].target",
        "field": "target"
      }
    }
  ],
  "summary": { "total": 2, "success": 1, "failed": 1 }
}
```

## 原则七：安全与授权契约（AuthN/AuthZ/Tenant Isolation）

AI Agent tool 默认按公网生产系统要求设计，安全约束不是可选项。

- **调用上下文强制字段**：每次请求必须带 `context.actor`、`context.tenantId`、`context.scopes`、`resourcePolicyVersion`
- **租户隔离不变式**：任一 `operation.target` 若跨 tenant，整项拒绝并返回 `AUTH_FORBIDDEN` 或 `TENANT_BOUNDARY_VIOLATION`
- **批内逐项鉴权**：按 `results[index]` 返回授权结果，不允许只给整批失败
- **最小权限**：`scopes` 必须与操作符绑定（如 `tool.write.node`, `tool.read.node`, `tool.generate.asset`）
- **审计可追踪**：日志至少落 `operationId`、`actor`、`tenantId`、`deniedScope`、`operationIndex`
- **游标隔离**：`cursor` 与 `tenantId + actor + queryHash` 绑定，防止越权重放

## 参考架构

### 通用三层拓扑

```
查询层：batch_read(ids, filters, depth, cursor, limit)  — 所有读操作的唯一入口
变更层：batch_write(operations=[I/U/D/...])             — 所有写操作的唯一入口
辅助层：get_context(topic)                              — 按需加载领域知识子集
```

判断是否需要拆出专用 tool 的标准：**返回类型本质不同**（结构化 JSON vs 二进制图像 vs 流式输出），而非业务语义不同。

唯一入口原则的例外边界（避免过度集中）：
- **权限边界不同**：需要不同 scope/审计策略时，应拆为独立 tool
- **SLO 差异显著**：实时流式与离线批处理延迟模型不同，应拆分
- **资源模型不同**：例如图像二进制上传/下载与结构化查询应分离
- **隔离级别不同**：跨租户管理面与租户内数据面必须隔离

### 实例参考：Pencil MCP Tool 拓扑

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
| 1 | Round-trip 数 | 单一用户意图（如"创建一个带标题的卡片"、"批量更新所有节点颜色"）≤3 次 tool call 完成 |
| 2 | 操作原子性 | 相关变更在一次 call 中原子完成，无中间不一致状态 |
| 3 | 查询聚合 | 支持批量 ID + 模式匹配，不存在只能单 ID 查询的 tool |
| 4 | 返回量可控 | 有 depth/limit/filter 参数防止撑爆 context |
| 5 | 操作间引用 | batch 内 binding 变量机制，前序结果可被后续引用 |
| 6 | 错误粒度 | 单操作级精确错误信息，非整个 batch 黑盒失败 |
| 7 | 幂等性 | update 操作天然幂等，LLM 重试不产生副作用 |
| 8 | 滑动窗口 | 查询支持 cursor/limit，agent 可增量读取，不依赖全量加载 |
| 9 | 契约稳定性 | schema 严格、支持 idempotencyKey、可版本化演进 |
| 10 | 可观测性 | 返回 operationId/耗时/失败步骤，便于诊断与自动恢复 |
| 11 | 错误语义 | 错误码可枚举、区分 retryable，并含 retryAfter/operationIndex |
| 12 | 安全契约 | 请求含 actor/tenant/scopes，批内逐项鉴权，可审计可追踪 |
| 13 | 传输语义 | 错误码与 HTTP 状态映射稳定，部分成功响应结构固定 |
| 14 | 非幂等控制 | `I/G/C` 支持 `idempotencyKey` 或 `operationKey` 去重语义 |

## 反模式速查

| 症状 | 诊断 | 修复 |
|------|------|------|
| `create_X`, `read_X`, `update_X`, `delete_X` 四件套 | CRUD 直译 | 合并为 `batch_X(operations=[...])` |
| `get_node(id)` 只能一次读一个 | 无批量查询 | 支持 `nodeIds=[...]` + `patterns` 模式搜索 |
| 查询返回完整嵌套树，context 频繁溢出 | 无深度控制 | 加 `readDepth`/`limit` 参数 |
| 用 `offset + limit` 分页，大数据下漏读/重读 | 分页不稳定 | 改为 `cursor + stable sort` 滑动窗口 |
| 复杂操作用 20 个平铺参数 | 扁平参数 | 设计结构化 DSL，用对象/数组组织 |
| batch 内操作不能引用彼此结果，必须拆成多次 call | 无跨操作引用 | 引入 binding 变量机制 |
| `get_by_id`, `get_by_name`, `get_by_type`, `search` 各一个 tool | 查询 tool 碎片化 | 统一为 `batch_get(nodeIds, patterns)` |
| 写接口重试后重复创建资源 | 缺少幂等键 | 增加 `idempotencyKey` 并在服务端去重 |
| 错误只返回自然语言，agent 无法判断是否重试 | 错误语义缺失 | 返回稳定 error code + retryable + retryAfterMs |
| batch 无身份上下文，默认信任调用方 | 缺少鉴权契约 | 强制 `context.actor/tenantId/scopes` 并逐项鉴权 |
| 只支持整批失败或整批成功 | 缺少部分成功语义 | 固定 `results[index]` 结构并支持失败子集重放 |

## 非幂等操作约束（I/G/C 必读）

`U/D/R/M` 在同一目标上通常天然幂等；`I/G/C` 默认非幂等，必须附加去重键。

- **请求级幂等键**：`idempotencyKey` 作用于整批写请求
- **操作级去重键**：`operationKey` 作用于单条 `I/G/C`，用于子集重放
- **去重窗口**：服务端至少保留 24h 去重索引（`tenantId + actor + key`）
- **冲突行为**：命中去重键时返回首次执行结果，不重复创建资源
- **重放边界**：只允许重放失败项，禁止在未知状态下整批盲重试

## 迁移 Runbook（可执行模板）

1. **盘点与分层**
   - 输出当前 tool 清单，标注读/写/辅助、返回类型、权限范围、调用频次
2. **定义目标契约**
   - 冻结 `batch_read` / `batch_write` schema、错误枚举、HTTP 映射、auth context
3. **双写与影子流量**
   - 旧接口继续服务；新 batch 接口接影子请求，仅比对结果不生效
4. **灰度切换**
   - 按租户或流量 5% -> 25% -> 50% -> 100% 迁移，观察错误码分布与重试率
5. **回滚点**
   - 任一阶段若 `VALIDATION_ERROR` 或 `AUTH_*` 激增超过阈值，立即回切旧接口
6. **收口与下线**
   - 固化迁移后 schema 版本，发布废弃窗口，最终下线碎片化 CRUD 工具

推荐观测指标（灰度期间）：
- round-trip/tool call per task
- retry success rate 与平均重试次数
- partial success 占比与失败类型分布
- auth 拒绝率（按 scope/tenant 维度）

## 输出契约（评审结果格式）

当使用本 skill 评审 tool 设计时，输出固定为 4 段：

1. **现状拓扑**：现有 tool 列表与职责分层（读/写/辅助）。
2. **反模式清单**：按严重级别列出问题（含 round-trip、原子性、返回量控制、错误语义）。
3. **目标 schema 草案**：给出 batch 接口与错误结构建议（含 retryable、operationIndex、idempotencyKey）。
4. **迁移步骤**：按迭代顺序给出最小可落地改造路径与回滚点。
