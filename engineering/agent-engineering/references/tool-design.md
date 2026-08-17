# AI Agent Tool Design

设计让 agent 容易选择、正确调用、理解结果并从失败继续的 tool contract。以模型实际可见的 name、description、schema 和 result 为准，不依赖实现知识补全语义。

## 导航

- [从任务定义 Tool Surface](#从任务定义-tool-surface)
- [选择契约](#选择契约)
- [输入契约](#输入契约)
- [结果与错误](#结果与错误)
- [数据量、Batch 与长任务](#数据量batch-与长任务)
- [副作用的契约投影](#副作用的契约投影)
- [设计与评估](#设计与评估)
- [平台说明](#平台说明)
- [资料](#资料)

## 从任务定义 Tool Surface

从用户任务和常见调用路径出发，再映射到后端能力。数据库表、REST route 或 service method 可以成为实现边界，但不必直接决定 tool 边界。

根据以下信号选择粒度：

| 选择 | 适用信号 |
| --- | --- |
| 合并 | 操作总是一起发生、共享校验或原子性，中间状态没有独立价值 |
| 拆分 | 权限、副作用、输入输出或恢复路径不同，步骤需要独立判断 |
| 保留细粒度 | Agent 经常单独调用，组合顺序具有业务意义 |
| 提供任务级工具 | 常见任务需要重复编排多个内部操作 |

CRUD tool 与任务级 tool 都可能合理。用调用次数、选择歧义、参数复杂度、审批边界和错误恢复评估，而不是追求固定工具数量。

只暴露当前阶段可能需要的 tools。工具集较大时，可考虑 namespace、allowed tools、deferred loading 或 tool search，并通过 eval 判断收益。

先确定执行边界，再设计模型可见 contract：

| 执行位置 | 适用信号 |
| --- | --- |
| Client / host | 依赖当前 UI、选区、本地草稿或设备能力；效果只影响用户此刻的视图或设备 |
| Server / service | 修改业务 source of truth、跨用户可见、需要事务、鉴权、幂等、审计、配额或 secrets |

同一用户任务可拆成服务端改变真源和客户端投影视图两个动作，由业务 source of truth 裁决跨端状态。执行位置可以随宿主变化；只把会影响选择、权限或恢复的实现差异暴露给模型。

## 选择契约

让 name 和 description 足以区分相似工具：

- 使用体现业务动作的具体名称。
- 说明工具解决的任务、适用条件和不适用边界。
- 标明关键前置条件、只读或写入性质、主要副作用和成功状态。
- 说明与相似工具的差异。
- 将 destructive、idempotent、open-world 等 annotations 视为行为提示，不作为授权依据。

Description 侧重选择信息。将字段细节放入 schema，将完整流程和领域知识放入按需 reference。

Tool-specific 的选择条件、输入、结果和恢复规则由 tool contract 持有；System Prompt 只保留跨工具稳定成立的策略。避免为了强调而在两处维护同一段说明。

## 输入契约

选择模型容易生成、服务端容易验证的最小结构：

| 维度 | 设计考虑 |
| --- | --- |
| 字段 | 使用明确业务名，避免 `data`、`value` 等弱语义名称 |
| 约束 | 在有助于消歧时使用 enum、format、range、unit 和互斥关系 |
| 必填项 | 只要求模型提供 runtime 无法可靠补全的值 |
| 默认值 | 仅提供安全且符合多数任务的默认行为 |
| 结构 | 分离控制字段与长文本，控制嵌套和组合数量 |
| Provider schema | 使用当前平台支持的 JSON Schema 子集与 strict mode |

Runtime 已知的 tenant、user、auth 或内部状态通常无需模型重复传入。复杂关系若无法由 schema 表达，在 description 中说明并由服务端验证。

OpenAI Function Calling 的 strict mode 当前要求 object schema 使用 `additionalProperties: false`，并按当前文档处理 required 与 nullable；不要将该细节推广为所有 provider 的通用规则。

## 结果与错误

围绕下一步决策组织 result。按需返回：

- success、status 和实际发生的状态变化
- 稳定 ID、handle、cursor 或 job ID
- 支持结论的必要摘要、source 与 freshness
- 局部成功或失败位置
- 可执行的恢复信息或下一步

避免重复输入、全量数据库对象、无界嵌套和调试字段。平台支持时使用 output schema 或 structured content；仅供 UI 使用的数据放入模型不可见 metadata。

当恢复依赖错误类型时，提供稳定 error code、`retryable`、失败字段或 operation index，以及可行的恢复动作。根据业务语义区分改参、重试、等待、重新授权、询问用户和停止。

对非幂等写操作，timeout、network error 或 5xx 可能表示响应丢失而不是动作未执行。此时返回 `indeterminate`、operation ID 和状态查询方式；在确认前不要自动重新发起副作用。

拒绝或权限不足应返回可判断的原因。Agent 不应原样重试被拒绝的调用；只有参数、权限或执行条件发生有效变化时才再次尝试。

## 数据量、Batch 与长任务

根据数据规模和交互方式选择能力，不机械加入所有选项：

| 场景 | 可选设计 |
| --- | --- |
| 大结果集 | filter、fields、limit、cursor、range、sort |
| 大对象 | 轻量 search/list + 按 ID get/detail，或返回 handle |
| 动态数据集 | cursor 通常比 offset 更能保持遍历稳定性 |
| 多对象写入 | batch、逐项 status、共享校验、原子或部分成功语义 |
| 长时操作 | start + status + result/cancel，或平台原生 background job |

Batch 适合共享校验、原子用户动作或无意义的中间状态；单项需要独立审批、重试或基于结果继续判断时，分步调用通常更清晰。

为截断结果说明是否完整以及继续读取方式。为异步任务返回状态、建议轮询时机和可恢复的结果位置，避免 agent 通过重复启动猜测进度。

## 副作用的契约投影

Tool contract 只暴露 agent 选择、确认和恢复所需的信息：读写性质、目标与影响范围、关键前置条件、是否需要 approval、实际状态变化、稳定 ID、冲突或 `indeterminate` 状态及恢复入口。Runtime 已知的 operation、identity、version 或 idempotency 信息不要求模型重复提供；只有确需 agent 决策时才进入 schema。

鉴权、租户隔离、approval、去重、并发控制、事务、rate limit 与写入一致性由 Runtime 或业务服务强制，具体语义见 [runtime-reliability.md](runtime-reliability.md)。Annotations、Prompt 和 contract 中的风险说明只帮助模型正确选择，不承担 enforcement。Tool result 与第三方 resource 均作为不可信数据处理。

## 设计与评估

可按任务复杂度组合以下步骤：

1. 列出代表性用户任务与调用路径。
2. 选择 tool surface，并记录关键合并或拆分理由。
3. 定义 name、description、input、output、error 与 side effects。
4. 用真实 agent loop 检查选择、参数、结果利用、恢复和停止。
5. 根据 trace 修改最早出现歧义或失败的 contract。

评估 tool selection、invalid arguments、冗余调用、result 利用率、恢复、越权、token、latency 和任务完成。正确结果若依赖错误或越权路径，仍视为设计问题。

优先修改能解释真实失败的最小边界。保留现有接口还是重构，由收益、迁移成本与风险共同决定。

## 平台说明

- **MCP**：根据当前 specification 使用 input/output schema、structured content、annotations 与 pagination。
- **OpenAI Function Calling / Agents SDK**：根据当前文档选择 strict schema、allowed tools、tool search、namespaces 与 hosted/local tools。
- **OpenAI Apps SDK**：区分模型可见 structured content 与组件专用 metadata。
- **Anthropic Tool Use**：根据当前文档区分 client tools、server tools、tool search、strict schema 与 tool result loop。

平台能力和字段可能变化。将 provider-specific 建议与通用 contract 原则分开表述。

## 资料

核验日期：**2026-07-20**。实现前重新核验对应 living docs：

- [OpenAI Function Calling](https://developers.openai.com/api/docs/guides/function-calling)
- [OpenAI Agents SDK Tools](https://openai.github.io/openai-agents-python/tools/)
- [MCP Tools Specification 2025-11-25](https://modelcontextprotocol.io/specification/2025-11-25/server/tools)
- [Claude Platform Tool Use](https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview)
