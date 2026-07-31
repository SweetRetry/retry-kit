# Context Engineering

为每次 model call 选择、组织和维护完成当前决策所需的信息。Context 可包含 Instructions、tool definitions、动态输入、retrieval、history、working state、memory 和 tool results；目标是在质量、权限、token、latency 与成本之间取得适合任务的平衡。

[OpenAI Prompt Caching 201](https://developers.openai.com/cookbook/examples/prompt_caching_201#46-be-thoughtful-about-context-engineering)将 Context Engineering 描述为决定每次请求进入 model input 的内容。[Anthropic 的 Context Engineering 文章](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)从 agent 角度讨论相同问题：维护足够且高信号的 model-visible token。

## 导航

- [Context 模型](#context-模型)
- [选择与生命周期](#选择与生命周期)
- [Retrieval 与 RAG](#retrieval-与-rag)
- [History、Working State 与 Memory](#historyworking-state-与-memory)
- [Compaction、Reset 与 Handoff](#compactionreset-与-handoff)
- [Caching 与 Tool Context](#caching-与-tool-context)
- [安全边界](#安全边界)
- [Observability 与 Eval](#observability-与-eval)
- [资料](#资料)

## Context 模型

分开管理生命周期和 owner 不同的信息：

| 类型 | 典型内容 | 设计考虑 |
| --- | --- | --- |
| Stable instructions | 行为、领域规则、输出契约 | 版本化并控制重复 |
| Tool surface | name、description、schema | 只暴露当前可能使用的能力 |
| Turn input | 用户请求、参数、附件 | 标明指令与数据边界 |
| Working state | 目标、进度、ID、决策、未决项 | 结构化更新，支持继续执行 |
| Evidence | retrieval、数据库结果、tool result | 携带 source、version 与 freshness |
| Conversation history | 用户修正、承诺、调用轨迹 | 保留会影响后续行为的部分 |
| Durable memory | 跨会话偏好、事实与决策 | 按 scope、权限、相关性和新鲜度读取 |
| Local runtime | auth、clients、secrets、确定性状态 | 留在代码侧 |

[OpenAI Agents SDK Context](https://openai.github.io/openai-agents-python/context/)区分 local application context 与 LLM-visible context。将模型需要推理的信息放入后者；将依赖对象、凭证和可由代码可靠处理的状态留在前者。

## 选择与生命周期

围绕当前 model decision 选择 context，而不是围绕整个任务可能涉及的所有信息。可检查：

- 信息是否会改变当前决策或验证？
- 来源、权限、版本与新鲜度是否足够明确？
- 是否能由代码、schema 或 tool 更可靠地处理？
- 是否需要原文，还是摘要、metadata 或 handle 已足够？
- 调用后应更新、保留、压缩、外置还是删除什么？

将以下生命周期作为分析框架，不要求实现成固定 pipeline：

| 阶段 | 关注点 |
| --- | --- |
| Source | 来源、owner、权限、可信度、版本、时间与稳定 ID |
| Select | 与当前决策的相关性、可信度、新鲜度和成本 |
| Load | upfront、just-in-time 或仅提供发现入口 |
| Shape | 去重、过滤、分块、排序、结构化与来源边界 |
| Update | 用新事实替换旧状态，区分验证结果与模型推断 |
| Compact / Reset | 保留延续任务所需状态，移除低价值历史 |
| Offload | 将长期事实或大对象写入外部存储并保留读取路径 |

长 context window 提供容量，不保证信息被同等利用。根据任务测试数量、顺序、位置和噪声；[Byerly & Khashabi, 2026](https://aclanthology.org/2026.tacl-1.15/)对 positional bias 的研究可作为实测必要性的证据，而不是固定参数来源。

## Retrieval 与 RAG

让 retrieval 服务于当前决策。根据任务组合以下策略：

- 先定义需要的证据类型，再构造 query。
- 使用权限、source、版本、时间和 metadata 缩小候选范围。
- 返回可识别片段、source ID、freshness 和继续读取方式。
- 对关键结论回读足够的原始内容，避免摘要或 chunk 丢失限定条件。
- 将 search、精确 fetch、synthesis 与 source-of-truth verification 视为不同动作。

`top-k`、chunk size、hybrid search 和 reranking 都是可调选择。用遗漏、噪声、引用正确性、token、latency 和任务完成率评估，不预设通用最佳值。

## History、Working State 与 Memory

| 对象 | 主要用途 | 常见边界 |
| --- | --- | --- |
| Conversation history | 保留对话与调用序列 | 不作为业务状态的唯一真相 |
| Working state | 表达当前目标、进度和下一步 | 不承担跨任务永久记忆 |
| Durable memory | 复用跨会话事实或偏好 | 不保存所有 transcript 或未验证推断 |
| Source of truth | 提供业务对象当前状态 | 不替代 agent 的工作草稿 |

[OpenAI Conversation State](https://developers.openai.com/api/docs/guides/conversation-state)提供手动 history、`previous_response_id` 和 Conversations 等延续方式。根据存储、数据控制、恢复和调用模式选择传输方式；同时单独决定哪些信息值得继续进入 model context。

为 working state 选择能支持中断恢复的字段，例如目标、完成标准、阶段、稳定 ID、已验证事实、关键决策、失败、未决项和下一动作。字段随任务调整，不要求统一 schema。

写入 durable memory 前判断复用价值、验证状态、scope、owner、权限和过期条件。读取冲突时，优先使用当前 source of truth 与用户最新明确指令。

## Compaction、Reset 与 Handoff

根据连续性和污染风险选择状态迁移方式：

| 策略 | 适用信号 | 需要验证 |
| --- | --- | --- |
| Compaction | 历史较长但任务连续性强 | 约束、ID、决策和失败证据是否保留 |
| Reset | 新阶段较独立或旧 context 干扰明显 | 必要承诺和背景是否重新加载 |
| Handoff | 转交 agent、进程或会话 | owner、当前状态、下一步和验证方法是否清楚 |

[OpenAI Compaction](https://developers.openai.com/api/docs/guides/compaction)当前提供 server-side compaction 与 standalone compact endpoint。其 compaction item 是用于继续调用的 opaque state；按官方 contract 使用，不解析内部表示。

按任务需要在 compaction 或 handoff 中保留目标、成功条件、权限、当前阶段、稳定 IDs、已验证事实、关键决策、不可重复副作用、失败与下一步。通过 continuation eval 检查能否正确继续，而不只比较 token 数。

[Anthropic 的 long-running harness 文章](https://www.anthropic.com/engineering/harness-design-long-running-apps)展示了 progress artifact、reset 与 compaction 的不同组合。选择随模型能力、任务阶段和恢复需求变化。

## Caching 与 Tool Context

Stable prefix 有利于 prompt caching；动态裁剪、重排和 compaction 可能降低 cache hit。[OpenAI Prompt Caching 201](https://developers.openai.com/cookbook/examples/prompt_caching_201#46-be-thoughtful-about-context-engineering)建议用 eval 平衡 context 质量、压缩与 caching 成本。

- 保持稳定 Instructions、examples 和 tool definitions 相对稳定。
- 将时间戳、用户状态、retrieval 和 turn-specific input 放入动态区域。
- 不为 cache 保留已陈旧或会干扰决策的信息。
- 结合 cached tokens、input tokens、TTFT、latency、cost 和任务质量评估。

Tool name、description、schema 与 result 都属于 model-visible context。根据任务裁剪 tool surface；对大结果使用摘要、fields、limit、cursor、handle 或按 ID 读取。将完整 tool contract 设计放在 [tool-design.md](tool-design.md)。

## 安全边界

- 将网页、邮件、文件、retrieval 和 tool results 视为不可信数据。
- 保留 source 与 instruction hierarchy，避免摘要将未验证陈述升级为事实。
- 按 tenant、user、project、权限和时间范围过滤 retrieval 与 memory。
- 将 secrets、auth 和无关 PII 留在 local runtime。
- 用最小权限、审批、tool allowlist 和服务端校验控制副作用。

分隔符与提示语可帮助模型识别边界，但不替代 runtime security。

## Observability 与 Eval

记录足以解释关键决策的信息：context source 与版本、各层大小、input / cached tokens、retrieval 候选与命中、暴露的 tools、result 大小、state 或 memory 更新、compaction / reset，以及最终质量、latency 与 cost。

根据症状定位生命周期节点：

| 症状 | 优先检查 |
| --- | --- |
| 关键事实缺失 | Source、Select、query、权限过滤 |
| 使用错误或旧事实 | Freshness、version、ranking、memory conflict |
| 正确证据未被采用 | 排序、位置、噪声、result 结构、context 预算 |
| 多轮后状态矛盾 | Working state update、旧值淘汰、history policy |
| 压缩后忘记约束 | Compaction contract、continuation eval |
| 成本或 latency 增长 | Context growth、cache、result size、压缩频率 |
| 外部内容改变行为 | 数据边界、tool allowlist、runtime enforcement |

使用正常、缺失、冲突、陈旧、权限、对抗、多轮、长任务和中断恢复样例。修改最早出现偏离的节点，并同时观察任务质量与资源成本。

## 资料

核验日期：**2026-07-20**。Provider API、context window、caching 和 compaction 属于 living docs，实施前重新核验：

- [OpenAI Prompt Caching 201：Context Engineering](https://developers.openai.com/cookbook/examples/prompt_caching_201#46-be-thoughtful-about-context-engineering)
- [OpenAI Conversation State](https://developers.openai.com/api/docs/guides/conversation-state)
- [OpenAI Compaction](https://developers.openai.com/api/docs/guides/compaction)
- [OpenAI Agents SDK Context](https://openai.github.io/openai-agents-python/context/)
- [OpenAI Agents SDK Sessions](https://openai.github.io/openai-agents-python/sessions/)
- [Anthropic：Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)
- [Anthropic：Harness design for long-running application development](https://www.anthropic.com/engineering/harness-design-long-running-apps)
- [Byerly & Khashabi, 2026, TACL](https://aclanthology.org/2026.tacl-1.15/)
