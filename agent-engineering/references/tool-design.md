# AI Agent Tool Design

设计目标：降低 agent 完成任务的总协调成本——容易选对、容易生成合法参数、容易从结果继续推理、容易失败恢复、不浪费 context window。

## 导航

- [思考立场与边界](#思考立场与边界)
- [核心原则](#核心原则)
- [设计流程](#设计流程)
- [输出模板](#输出模板)
- [常见反模式](#常见反模式)
- [平台对齐](#平台对齐)

## 思考立场与边界

以不了解实现的第三方 agent 为审查对象，不代入工具作者视角。

- Agent 只能看到 name、description、schema 和 result；不能靠阅读实现补全契约。
- 每个判断都问：只靠 contract 能否选对、传对、理解结果并从失败恢复？
- “熟悉系统的人一看就懂”“模型应该知道”直接视为接口缺陷。

处理：MCP tools、function calling、Apps SDK tools、AI plugin/tool schema；工具粒度、参数、结果、错误、分页、batch、长任务与副作用契约。

不处理：业务逻辑本身是否正确、后端内部实现、UI 视觉或权限体系整体重构。发现这些问题时指出边界，不用 tool schema 补丁掩盖。

## 核心原则

### 1. 先按任务设计，再按接口实现

从 agent 要完成的真实任务出发，不从数据库表、REST route 或 service method 出发。

- 用户希望完成什么结果？
- 常见调用路径是什么？
- 哪些步骤总是一起发生、必须原子执行或需要共享校验？
- 哪些步骤需要独立审批、重试或分页？

若工具名更像内部 CRUD 而非任务动作，粒度通常过低，例如 `create_node` / `update_node` 可被更高内聚的任务级编辑工具取代。

### 2. 默认任务级工具，避免两头极端

- 一个 endpoint 一个 tool：round-trip 多，模型需要理解内部编排。
- 一个万能 mega-tool：DSL 过大，参数组合与错误恢复不稳定。

**合并**：多步总是一起用、需原子性或共享校验、中间状态无意义，或合并明显减少调用成本。

**拆分**：权限或副作用不同、输入/返回差异大、路径明显分叉、某步需独立审批，或经常单独重试/分页。

目标不是“工具越少越好”，而是常见任务的调用次数和认知负担都足够低。

### 3. Tool selection 与执行成本同样重要

`name`、`description` 与 annotations 写清：解决什么任务、何时用、何时不用、前置条件、是否只读、是否有副作用、成功后的状态，以及与相似工具的边界。

工具名体现任务，不暴露模糊实现名：`run_operation` / `node_mutation` 不如 `batch_edit_canvas` / `search_orders` / `start_export_report`。

Tool schema 会进入 context。暴露当前任务需要的最小集合；工具面过大时考虑 namespace、deferred loading 或 tool search，并用 eval 判断 token 与误选是否真的改善。

### 4. 输入 schema 严格，但不逼模型重复信息

- 字段名直接表达业务语义；`user_id` 优于 `user`，具体名词优于 `data`。
- 枚举优于无约束字符串；范围、格式、单位、默认值和互斥关系明确。
- 必填项少而必要；runtime 已知值不要求模型重复提供。
- 结构化控制参数与长文本分开，避免深层 JSON DSL。
- 安全默认值由服务端提供；没有安全默认就设为必填。
- 平台支持时使用 strict schema，但遵守该平台当前支持的 JSON Schema 子集。

OpenAI-specific：当前 Function Calling strict mode 要求 object schema 使用 `additionalProperties: false`，并通过 required / nullable 表达字段约束。不要把这一实现细节硬套到其他 provider。

### 5. 返回结果为下一步推理服务

Tool result 不是日志或数据库快照。它至少回答：成功了吗、哪些对象或状态改变、证据在哪里、失败在哪、下一步是什么。

**优先返回**：紧凑 structured result、稳定 ID / handle / cursor / status、必要摘要、来源与新鲜度、局部失败状态、恢复建议。

**避免**：重复全文、无上限嵌套、调试字段洪水、只有人能懂的报错，或把 UI 专用大对象全部暴露给模型。

平台支持时使用 output schema / structured content；模型不需要的组件数据放隐藏 metadata。

### 6. 读取类工具原生支持控量

大结果提供 `filter`、`fields`、`limit`、`cursor`、`range`、`sort` 或等价能力，并给安全默认值。

- 数据集会变化时，cursor 通常比 offset 更稳。
- 大对象拆成轻量 search/list 与按 ID get/detail。
- 截断时返回 `truncated`、剩余范围和继续方式。
- 可再次获取的大 resource 返回 handle/link，不默认内嵌全部内容。

### 7. 写操作考虑原子性、幂等性与恢复

检查：是否需要原子执行 / 回滚、idempotency key、冲突检测、局部重试、逐项结果与显式 approval。

**适合 batch**：一个用户动作引发多对象变更、需要共享校验、或中间状态没有业务意义。

**不适合 batch**：单项成本高、失败代价大、每步可能独立审批，或每步结果需要 agent 判断后才继续。

Batch 必须返回逐项 status 与错误位置，不能只返回 `partial failure`。

### 8. 长任务不要伪装成同步工具

可能超时、排队或依赖外部系统的操作使用：

`start_* → get_*_status → get_result / cancel_*`

返回 job ID、当前 status、建议轮询时间和最终结果位置。支持中断恢复，并避免让 agent 通过重复启动来猜任务是否完成。

### 9. 错误必须机器可分流

至少包含：稳定 error code、`retryable`、失败字段 / path / operation index、用户可见影响和恢复动作。

- Validation、权限、资源不存在、schema 不匹配通常不可原样重试。
- 限流、暂时不可用、冲突和超时是否可重试由服务端明确返回。
- Batch 局部失败返回逐项结果，不让模型重猜整批。

### 10. 审批和服务端约束不交给模型自觉

破坏性、不可逆或跨权限操作：description 明确风险，平台支持时标记 destructive，服务端强制鉴权与二次校验，需要人工确认时设计显式 approval。

Annotations 和 Prompt 都只是提示，不是安全边界。租户隔离、rate limit、输入验证、数据最小化与副作用约束必须由 runtime 执行；tool result 与第三方 resource 视为不可信数据。

## 设计流程

### Step 1：建立 Task Model

列出 3–5 个真实任务与常见路径。已有接口列表时，先反推回用户任务，不直接美化现有 CRUD。

### Step 2：决定 Tool Surface

逐个判断合并/拆分、batch、分页、异步、approval、权限和重试路径，并说明理由。

### Step 3：定义 Contract

为每个 tool 定义：name、description、input schema、output schema、error、side effects、read-only / destructive / idempotent 等行为提示，以及 runtime 强制边界。

### Step 4：模拟 Agent Loop

1. 只靠 description 能否选对？
2. 能否稳定生成合法参数？
3. Result 能否支持下一步判断？
4. 失败后是否知道改参、重试、换工具、询问用户还是停止？
5. 任务完成后是否有明确 stop signal？

任一步需要猜，contract 就不完整。

### Step 5：用 Trace 迭代

用真实任务与 held-out 样例统计 tool selection、invalid args、冗余调用、result 利用率、恢复、越权、token 与 latency。正确答案若通过错误或越权路径获得，仍判失败。

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

## Tool Contracts
- Name / description
- Input / output / error
- Side effects / approval / idempotency

## Runtime Guardrails
- 权限 / 校验 / retry / stop

## Evaluation
- 任务 / trace / 指标

## Next Changes
- 先改什么 / 后补什么
```

## 常见反模式

| 反模式 | 更好做法 |
| --- | --- |
| 直接暴露 CRUD tool | 暴露任务级工具 |
| 万能 mega-tool | 拆成少量高内聚工具 |
| Description 只有一句功能 | 写清使用/禁用时机、边界和副作用 |
| Schema 太松 | 明确业务字段、枚举、格式与平台 strict 约束 |
| Result 全量 dump | 摘要 + ID/handle + cursor |
| 所有操作都同步 | `start_*` + `status_*` + result/cancel |
| 只返回自然语言错误 | 稳定 code + retry hint + 定位信息 |
| 安全寄托给模型 | 服务端校验 + approval + 幂等 |

## 平台对齐

- **MCP**：依据当前 specification 使用 input/output schema、structured content、annotations 与 pagination；annotations 来自不可信 server 时不可作为授权依据。
- **OpenAI Function Calling / Agents SDK**：按当前文档使用 strict schema、allowed tools、tool search、namespaces 与 hosted/local tools；不要凭记忆固定 SDK 行为。
- **OpenAI Apps SDK**：区分模型可见 structured content 与组件专用 metadata，不把 UI 数据全部塞进 model context。
- **Anthropic Tool Use**：按当前文档区分 client tools、server tools、tool search、strict schema 与 tool result loop。

## 判断纪律

- 不机械要求 batch、cursor、multi-agent 或固定工具数量。
- 不为了优雅把 tool surface 做成作者独懂的 DSL。
- 已有接口优先给最小可行重构，不无理由推倒重来。
- 平台相关建议明确标注 provider-specific，不伪装成通用铁律。

## 资料新鲜度

核验日期：**2026-07-20**。执行平台实现时重新核验 living docs：

- [OpenAI Function Calling](https://developers.openai.com/api/docs/guides/function-calling)
- [OpenAI Agents SDK Tools](https://openai.github.io/openai-agents-python/tools/)
- [MCP Tools Specification 2025-11-25](https://modelcontextprotocol.io/specification/2025-11-25/server/tools)
- [Claude Platform Tool Use](https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview)
