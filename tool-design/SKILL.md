---
name: tool-design
description: >
  AI Agent 工具接口设计指南。用于设计或审查 MCP tools、OpenAI function calling / Apps SDK tools、
  AI plugin/tool schema，使工具对模型更易选择、更易正确调用、更易恢复。
  触发场景：MCP server、tool schema、function calling、Apps SDK、工具数量太多、batch 设计、
  参数 schema、structured output、分页、长任务、错误恢复、tool result 设计。
  如果现有接口只是把人类 CRUD API 原样暴露给 agent，或描述不清、返回过大、错误不可恢复，必须重设计。
---

# AI Agent Tool Design

设计目标：降低 agent 完成任务的总协调成本 —— 容易选对、容易生成合法参数、容易从结果继续推理、容易失败恢复、不浪费 context window。

## 思考立场：客观、第三人称

设计和审查工具时，必须以第三人称视角推演，禁止代入「我是这个工具的作者」立场。

- 用「agent」「模型」「调用方」作为主语，不要用「我」「我们」
- 每个判断都要问：**一个不了解这份代码的模型，能否只靠 name/description/schema 做出正确决策？**
- 不要为自己写的 API 找理由；要以「陌生审查者」的立场承认它在 agent 视角下的缺陷
- 触发词模板：
  - 「agent 看到这个 description 会怎么理解？」
  - 「模型无法访问代码，仅凭 schema 能否生成合法参数？」
  - 「返回结果对下一步推理是否足够？」
- 避免主观合理化：「这个字段熟悉的人一看就懂」「模型应该知道」→ 直接判为设计缺陷

## 边界

处理：MCP tools、OpenAI function calling / Apps SDK tools、其他面向 LLM 的工具 schema；工具粒度、参数结构、结果结构、错误语义、分页/长任务设计。

不处理：业务逻辑正确性、后端实现细节、UI 视觉、权限体系架构重构。

输出物：新工具方案 / 现有 schema 审查结论 / CRUD → agent-friendly 重构建议。

## 核心原则

### 1. 先按任务设计，再按接口实现

从 agent 要完成的任务出发，不从数据库表或 REST 路由出发。

- agent 真实要完成的任务是什么？
- 哪些步骤总是一起发生 / 必须原子执行 / 失败后需单独重试？

若工具名听起来像数据库操作而非任务动作，粒度通常太底层（`create_node` / `update_node` → `batch_edit_canvas`）。

### 2. 默认「任务级工具」，避免两头极端

- 一个操作一个 tool → 大量 round-trip
- 一个万能 mega-tool → DSL 过大，模型难以稳定生成

**合并为一个工具**：多步骤总是一起用 / 需原子性或共享校验 / 中间状态无意义 / 合并明显减少调用次数。

**拆成多个工具**：权限或副作用不同 / 输入结构差异大 / 返回类型差异大 / 常见路径明显分叉 / 某步经常需单独重试或分页。

目标不是「工具越少越好」，而是「完成常见任务的调用次数和认知负担都尽量低」。

### 3. Tool selection 和执行成本同样重要

`name` / `description` / annotations 必须写清：解决什么任务、何时用、何时不用、是否只读、是否有副作用、关键字段是哪些、成功后通常下一步。

工具名体现任务而非实现：`run_operation` / `node_mutation` → `batch_edit_canvas` / `search_orders` / `start_export_report`。

平台支持时使用行为提示：`readOnlyHint` / `destructiveHint` / `idempotentHint` / `openWorldHint`。这些是提示，不是安全边界 —— 权限校验必须在服务端。

### 4. 输入 schema 严格，但不逼模型写没必要的字

- 字段名直接表达业务语义
- 枚举优于自由文本
- `additionalProperties: false`
- 必填项少但关键约束明确
- 可推断值给安全默认值
- 不要求模型重复提供服务端已知上下文

结构化控制参数与大段自由文本要拆开：schema 放结构化部分，高熵文本单独字段。任务本质是代码/查询/长提示词时，允许自由文本字段，不要硬塞进复杂 JSON 嵌套。

### 5. 返回结果为「下一步推理」服务

tool result 不是日志、不是数据库快照。至少帮模型回答：这次成功了吗？产生了哪些关键对象/状态变化？失败在哪？下一步做什么？

**优先返回**：紧凑结构化结果、稳定 ID / handle / cursor / status、必要摘要。

**避免**：大块重复文本、无上限嵌套、调试字段洪水、只有人能读懂的自然语言说明。

平台支持时优先 `outputSchema` / `structuredContent`；组件/前端专用数据放隐藏元数据，不全塞给模型。

### 6. 读取类工具原生支持控量

至少提供一类：`limit` / `cursor` / `fields` / `depth` / `sort` / `filter`。

默认 **cursor 分页优于 offset**：结果集可能变化时 offset 易漏读或重读。

对象很大时拆成 `search_*`（轻量列表）+ `get_*`（按 ID 取详情）。不要把「搜索 + 全量详情 + 深层子树」绑死在同一默认返回里。

### 7. 写操作考虑原子性、幂等性、恢复

- 是否需要原子执行 / 回滚
- 是否支持 `idempotencyKey`
- 是否支持只重试失败子集
- 是否返回逐步结果索引

**适合 batch**：一个用户动作引发多对象变更 / 需共享校验 / 中间状态无业务意义。

**不适合 batch**：单次成本高、失败代价大 / 每步可能触发独立审批 / 每步结果需模型单独判断后再继续。

批处理必须返回逐项状态，不能只返回一句 "partial failure"。

### 8. 长任务不要伪装成同步工具

可能超时、排队、异步、依赖外部系统的操作，不要强行做成同步一次完成。

模式：`start_*` 返回 `jobId` → `get_*_status` 查询 → `cancel_*`（可选）。

返回必须含 `jobId` / `status` / `pollAfterMs` 或等价提示 / 最终结果读取位置。不要让模型靠重试写工具来猜任务有没有完成。

### 9. 错误必须机器可分流

至少含：稳定错误码、`retryable`、定位信息（字段/路径/operation index）、恢复建议（减小 batch、补权限、稍后重试）。

- **不可重试**：校验错误、权限缺失、资源不存在、schema 不匹配
- **可重试**：限流、暂时不可用、冲突、超时

批处理局部失败必须返回逐项结果，不让模型重猜整批。

### 10. 审批和服务端约束不交给模型自觉

破坏性、不可逆、跨权限边界的操作：description 明确风险、标记 destructive、服务端二次校验、需人工确认时设计显式确认步骤。不要依赖「模型应该知道这很危险」。

## 设计流程

**Step 1**：列出 3-5 个真实任务（如「找符合条件的客户并读详情」「对画布做一组原子编辑」「启动导出并轮询结果」）。已有接口列表则反推回任务。

**Step 2**：为每个任务判断粒度 —— 单工具还是多工具？需 batch？需分页/游标？需 start/status 两段式？明说合并/拆分的原因。

**Step 3**：定义契约 —— `name`、`description`、input schema、关键约束、返回结构、错误结构、只读/destructive/idempotent 标记。若审查现有 schema，指出：工具太多/太少、描述是否够选对、参数是否过底层、返回是否过大或不可继续推理。

**Step 4**：模拟 agent loop：
1. 仅靠 description 能否选对工具？
2. 能否稳定生成合法参数？
3. 返回结果能否支持下一步？
4. 失败后是否知道该重试、改参还是停止？

任一步需要「猜」，接口未设计好。

## 输出模板

```markdown
# Tool Design Review

## Task Model
- 真实任务：
- 常见调用路径：

## Recommended Tool Surface
- Tool 1 / Tool 2 / Tool 3

## Why This Granularity
- 合并原因 / 拆分原因

## Schema Guidance
- 输入 / 输出 / 错误

## Risks and Anti-Patterns
- 风险 1 / 风险 2

## Next Changes
- 先改什么 / 后补什么
```

## 常见反模式

| 反模式 | 更好做法 |
|---|---|
| 直接暴露 CRUD tool | 暴露任务级工具 |
| 万能 mega-tool | 拆成少量高内聚工具 |
| 描述只有一句话 | 写清使用/禁用时机、风险、返回 |
| schema 太松 | 枚举化、严格 schema、禁 additionalProperties |
| 结果全量 dump | 摘要 + cursor + ID + handle |
| 所有操作都同步 | `start_*` + `status_*` |
| 只返回自然语言错误 | 稳定错误码 + retry hint + 定位信息 |
| 安全寄托给提示词 | 服务端强校验 + 显式审批步骤 |

## 平台对齐

- **MCP**：优先用工具注解表达只读/破坏性/幂等；区分模型可见内容与隐藏元数据。
- **OpenAI function calling**：严格 schema，必要时开 strict mode。
- **OpenAI Apps SDK**：同时设计模型可见的 `structuredContent` 和组件专用 `_meta`，不把 UI 所需大对象全塞给模型。
- **Anthropic tool use**：description 足够具体，必要时明确并行调用、调用前提和参数构造方式。

## 判断纪律

- 不机械要求「必须 batch」
- 不为了优雅把工具表面做成作者独懂的 DSL
- 已有现成接口时优先给最小重构路径，不推倒重来
- 平台相关建议明确标注为平台相关，不是通用铁律
