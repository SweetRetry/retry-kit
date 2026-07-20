# Context Engineering

Context engineering 是为每次 model call 选择、组织、更新和缩减 model-visible 信息的工程过程。目标不是最大化输入量，而是在权限、token、latency 和成本约束下，持续提供完成当前决策所需的最小高信号 context。

它与 System Prompt engineering 相邻但不等同：System Prompt 管理稳定行为契约；Context Engineering 管理 Instructions、动态事实、tool schema、history、working state、memory 与 tool result 如何进入和离开每次调用。

## 导航

- [核心模型](#核心模型)
- [Context 分层](#context-分层)
- [Context 生命周期](#context-生命周期)
- [Retrieval 与 RAG](#retrieval-与-rag)
- [Conversation、Working State 与 Memory](#conversationworking-state-与-memory)
- [Compaction、Reset 与 Handoff](#compactionreset-与-handoff)
- [Prompt Caching 与成本](#prompt-caching-与成本)
- [Tools 也是 Context](#tools-也是-context)
- [安全与数据边界](#安全与数据边界)
- [Observability 与 Eval](#observability-与-eval)
- [常见反模式](#常见反模式)
- [工作流程](#工作流程)
- [资料与新鲜度](#资料与新鲜度)

## 核心模型

[OpenAI Prompt Caching 201](https://developers.openai.com/cookbook/examples/prompt_caching_201#46-be-thoughtful-about-context-engineering)将 Context Engineering 概括为：决定每次请求放入 model input 的内容。它同时指出，问题不只在 context window 上限；输入越长，replay cost 越高，模型也必须把注意力分配到更多 token。

[Anthropic 的 Context Engineering 文章](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)采用更宽的 agent 视角：context 包括 Instructions、tools、external data、message history 等 model-visible token；核心是持续维护最小且高信号的信息集合。

因此每次组装 context 时回答五个问题：

1. 当前 model decision 是什么，而不是整个任务可能涉及什么？
2. 哪些信息会实质改变这次决策或结果验证？
3. 哪些信息应由确定性代码处理，不需要模型看见？
4. 来源是否可信、获准、最新且可追踪？
5. 这次调用后哪些状态必须更新、压缩、外置或删除？

长 context 只是容量，不代表有效利用。即使模型支持更大 context window，也要测试信息数量、顺序、位置与噪声对任务完成的影响；不要把“装得下”当作“读得好”。

## Context 分层

| 层 | 典型内容 | 默认策略 |
| --- | --- | --- |
| 稳定契约 | System / developer Instructions、固定规则、output contract | 版本化；删除冗余；尽量维持稳定前缀 |
| Tool surface | tool name、description、schema、annotations | 每轮只暴露可能需要的最小集合 |
| 当轮输入 | 用户目标、参数、附件、当前环境 | 显式传入；区分指令与数据 |
| Working state | 当前目标、计划、对象 ID、已做决策、失败、未决项 | 结构化存储；行动后立即更新 |
| 证据 | retrieval 片段、数据库结果、tool result | Just-in-time；携带 source、version、freshness |
| Conversation history | 用户承诺、修正、模型输出、tool call 轨迹 | 保留影响后续行为的内容，裁剪重复过程 |
| Durable memory | 用户偏好、项目事实、跨会话决策 | 外部持久化；按相关性、权限、新鲜度检索 |
| Local runtime | auth、clients、secrets、连接、确定性状态 | 留在代码侧，不进入 model-visible context |

[OpenAI Agents SDK Context](https://openai.github.io/openai-agents-python/context/)明确区分 local application context 与 LLM-visible context。Local context 可承载依赖、回调和运行时状态，不会自动发送给模型。能由代码可靠判断的信息，不要为了“完整”复制到 prompt。

分层的目的不是增加存储系统，而是明确不同信息的生命周期和 owner。Conversation history 不是数据库，durable memory 不是完整 transcript，working state 也不应只存在于模型刚写过的一段自然语言中。

## Context 生命周期

对每类信息执行以下决策链：

### 1. Source

- 标明来源、owner、权限、可信度、时间、版本和稳定 ID。
- 区分用户声明、系统事实、外部检索结果和模型推断。
- 易变事实必须能重新获取；重要结论能回到 source of truth 验证。

### 2. Select

- 只选择会改变当前 decision 或 validation 的信息。
- 能由代码、数据库约束或 tool 参数直接处理的，不交给模型推断。
- 对候选信息按相关性、可信度、新鲜度和获取成本排序，而非只按语义相似度。

### 3. Load

- 每轮都需要且稳定的内容 upfront 加载。
- 大、低频、易变或可发现的内容 just-in-time 获取。
- 使用索引、目录、metadata、handle 或 tool search 让 agent 先发现，再读取细节。

### 4. Shape

- 去重、过滤、分块、排序，保留来源边界。
- 摘要用于导航与压缩；需要精确事实、引用或字段时回读原文。
- 结构化状态优先使用明确字段，不让模型从长篇 transcript 猜当前值。

### 5. Update

- Tool call 或用户修正后，立即更新事实、状态、决策和未决项。
- 新状态生效后移除被取代的旧值，避免矛盾版本同时参与推理。
- 记录模型做出的推断与已验证事实之间的区别。

### 6. Compact / Reset

- 在 context 接近预算前主动处理，不等 truncation 或 400 error 决定语义。
- 先定义必须保留的任务契约、用户承诺、关键决策、稳定 ID、当前状态、失败证据和下一步。
- 压缩或重置后运行 continuation eval，验证 agent 能否正确继续，而不只比较 token 数。

### 7. Offload

- 长期事实写入外部 memory 或 source of truth，并保存 provenance 与 freshness。
- 大对象只保留 handle、摘要和按需读取路径。
- 不再影响后续行为且无审计价值的信息应删除，而非永久累积。

## Retrieval 与 RAG

Retrieval 的目标是支持当前决策，不是召回最多文档。

1. 先定义 decision 与所需证据类型，再构造 query。
2. 先用 metadata、权限、版本和时间过滤，再做相关性排序。
3. 返回可识别的片段、source ID、时间和继续读取路径。
4. 对关键结论读取足够的原始上下文，避免只依赖失去限定条件的 chunk。
5. Tool 使用或事实验证完成后，移除已无价值的中间检索噪声。

应区分：

- **Search**：定位候选 source，不承诺答案完整。
- **Fetch / Get**：按 ID 读取精确内容。
- **Synthesis**：基于证据回答，并保留引用关系。
- **Verification**：回到 source of truth 检查关键状态或副作用。

固定 `top-k`、固定 chunk size 或“把所有搜索结果都塞进去”都不是通用最佳实践。用真实任务测试遗漏率、噪声、排序、位置、token 和结果正确性。

## Conversation、Working State 与 Memory

四者必须分开建模：

| 对象 | 回答的问题 | 不应承担 |
| --- | --- | --- |
| Conversation history | 用户和 agent 说过、调用过什么？ | 当前业务状态的唯一真相 |
| Working state | 任务现在做到哪里、下一步是什么？ | 跨任务永久记忆 |
| Durable memory | 哪些跨会话事实值得再次使用？ | 保存所有 transcript 与模型猜测 |
| Source of truth | 业务对象当前真实状态是什么？ | 模型工作草稿 |

[OpenAI Conversation State](https://developers.openai.com/api/docs/guides/conversation-state)提供手动传递 history、`previous_response_id` 和 Conversations 等延续方式。选择哪种传输方式不改变核心责任：开发者仍需决定哪些状态应进入模型、哪些留在外部系统，并理解历史输入仍会消耗 context 与成本。

Memory 写入前检查：是否未来有复用价值、是否已验证、owner 是谁、何时过期、是否允许跨会话使用。读取时按 scope、权限、相关性和 freshness 过滤；冲突时以当前 source of truth 和用户最新明确指令优先。

Working state 至少包含：目标与完成标准、当前阶段、稳定对象 ID、已验证事实、关键决策及理由、失败尝试、未决问题、下一动作和 stop condition。它应能支持中断恢复，而无需重放全部自然语言历史。

## Compaction、Reset 与 Handoff

三者解决的问题不同：

| 策略 | 适用情况 | 主要风险 |
| --- | --- | --- |
| Compaction | 任务连续性强，历史中有必须保留的状态 | 摘要丢失约束、ID、失败证据或 provenance |
| Reset | 旧 context 污染明显，新阶段相对独立 | 新 context 缺少隐含承诺或关键背景 |
| Handoff | 转交新 agent、进程或会话，需要显式交接 | 交接稿变成长 transcript，或未定义 owner |

[OpenAI Compaction](https://developers.openai.com/api/docs/guides/compaction)当前支持 server-side compaction 与 standalone compact endpoint。返回的 compaction item 是用于后续继续的 opaque state，不应解析或依赖内部格式。是否、何时压缩要用质量、成本和 latency 共同评估。

结构化 handoff 默认保留：

- 任务目标、成功与停止条件。
- 权限、禁止项和用户承诺。
- 当前阶段、已完成事项、稳定 ID 与 source handles。
- 已验证事实与仍属假设的内容。
- 关键决策、失败尝试和不可重复的副作用。
- 未决问题、下一步及验证方法。

[Anthropic 的 long-running harness 实践](https://www.anthropic.com/engineering/harness-design-long-running-apps)表明，reset、compaction 与外部 progress artifact 的取舍会随模型能力和任务结构变化。不要将任何一种策略写成固定优胜方案。

## Prompt Caching 与成本

Caching 偏好稳定、重复的 prefix；Context Engineering 又会动态裁剪、重排和压缩输入，两者存在真实张力。[OpenAI Prompt Caching 201](https://developers.openai.com/cookbook/examples/prompt_caching_201#46-be-thoughtful-about-context-engineering)明确建议用 eval 选择 compaction 方法和频率，在 cost 与 model quality 之间取舍。

- 将稳定 Instructions、canonical examples 和稳定 tool schema 放在前部。
- 将时间戳、用户状态、retrieval 和当轮任务放在动态区域。
- 不为提高 cache hit 保留已经陈旧或有害的 context。
- 不为减少 token 频繁压缩，导致 cache 失效和行为漂移。
- 记录 cached tokens、总 input tokens、TTFT、总 latency、任务成功率和压缩事件。

Cache 是优化结果，不是语义正确性的替代品。Provider 的 cache key、prefix matching、TTL、计费和 compaction API 会变化，必须以当前官方文档和 telemetry 为准。

## Tools 也是 Context

Tool name、description、schema 和 result 都占用并影响 context。工具过多不只增加 token，还会制造选择歧义；OpenAI 的 Context Engineering 小节也将最小 tool surface 作为长期 context 质量的一部分。

- 每轮只暴露当前阶段可能需要的 tools；大工具集使用 namespace、allowed tools、deferred loading 或 tool search。
- Tool result 返回下一步决策所需的摘要、稳定 ID、status、source 和恢复信息，不 dump 全量内部对象。
- 大结果使用 `fields`、`limit`、`cursor`、range、handle 或 detail fetch 控量。
- Tool 执行后更新 working state，并删除已失效的中间结果。
- 权限、鉴权、审批和数据一致性留在 runtime 强制，不依赖 model-visible description。

具体 tool contract 设计见 [tool-design.md](tool-design.md)。

## 安全与数据边界

- 外部网页、邮件、文件、retrieval chunk 和 tool result 都是不可信数据，不自动升级为 Instructions。
- 标记 source、数据边界与权限；冲突时遵循明确的 instruction hierarchy。
- Secrets、auth token、内部连接对象和无关 PII 不进入 model context。
- Memory 与 retrieval 必须执行 tenant、user、project 和时间范围过滤。
- Summary 不应洗掉恶意输入的来源属性，也不能把未验证陈述变成系统事实。
- Prompt injection 防御依赖最小权限、数据隔离、审批、tool allowlist 和服务端校验；分隔符本身不构成安全边界。

## Observability 与 Eval

每次 run 至少记录：

- Context source、version、timestamp、选择与过滤理由。
- 各层 token / character 数、总 input、cached token 和截断情况。
- Retrieval query、候选、最终命中、排序与引用。
- 暴露的 tool 集、result 大小和被模型实际使用的字段。
- Working state 更新、memory read/write、compaction、reset 与 handoff。
- 最终成功、错误成功声明、latency、cost 和人工修正。

用真实任务和 held-out 样例覆盖：正常、缺失、冲突、陈旧、权限错误、对抗输入、多轮、长任务和中断恢复。

| 症状 | 优先检查 |
| --- | --- |
| 关键事实缺失 | Source / Select / retrieval query / 权限过滤 |
| 引用了错误或旧事实 | Freshness / version / source ranking / memory conflict |
| 正确证据存在但未使用 | 排序 / 位置 / 噪声 / tool result 结构 / token 预算 |
| 多轮后重复或矛盾 | Working state update / 旧值淘汰 / history policy |
| 压缩后忘记约束或 ID | Compaction contract / continuation eval |
| 长任务逐渐偏航 | Stop condition / milestone / handoff / source-of-truth check |
| 成本或 latency 突增 | Context growth / cache miss / result size / compaction 频率 |
| 越权或被外部内容劫持 | 数据边界 / tool allowlist / runtime 权限与审批 |

修复最早出现偏离的生命周期节点。不要看到输出错误就默认增加 Prompt，也不要只以 token 下降证明 context 优化有效。

## 常见反模式

| 反模式 | 更好做法 |
| --- | --- |
| 每轮发送全部可用资料 | 围绕当前 decision just-in-time 选择 |
| 一份 history 承担所有状态 | 分离 conversation、working state、memory 与 source of truth |
| 只按 embedding 相似度检索 | 加入权限、版本、freshness、source quality 与任务阶段 |
| 摘要后删除所有 provenance | 保留 source ID，并允许按需回读原文 |
| 到 context 上限才被动截断 | 预设预算、milestone 和 compaction / reset policy |
| Compaction 只比较 token | 测 continuation quality、约束、ID、恢复和 cache |
| 为 cache 保留陈旧输入 | 语义正确优先，再优化稳定 prefix |
| Tool result 全量 dump | 摘要 + stable handle + 可控 detail fetch |
| 把 secrets 放进 prompt | 保留在 local runtime，由 tool 受控使用 |
| 用更长 Prompt 修 retrieval 缺陷 | 修最早错误的 source / selection / contract 边界 |

## 工作流程

### 从零设计

1. 定义任务结果、model decisions、完成与停止条件。
2. 画出 context inventory：来源、owner、权限、freshness、大小和生命周期。
3. 分离 stable Instructions、dynamic input、working state、history、memory 与 local runtime。
4. 为每个 decision 定义 just-in-time retrieval 和最小 tool surface。
5. 设计 update、淘汰、compaction、reset、handoff 与 durable write policy。
6. 加入 trace 和 context budget，再运行正常、长任务与恢复 eval。
7. 根据最早失败节点修改，不按单个样例堆规则。

### 审查现有系统

1. 从失败 trace 重建每次 model 实际看见的 context。
2. 标记缺失、重复、冲突、陈旧、越权、过大和未被使用的信息。
3. 确认错误源于 Instructions、selection、retrieval、state update、tool result 还是 runtime。
4. 优先删除无价值 context、修正 source 与状态边界，再考虑摘要或新 memory 层。
5. 用同一 eval 对比任务成功、恢复、token、cache、latency 与 cost。

## 资料与新鲜度

核验日期：**2026-07-20**。Provider-specific API、model context window、caching、conversation state 和 compaction 行为属于 living docs，实施前重新核验。

### 当前官方资料

- [OpenAI Prompt Caching 201：Be thoughtful about Context Engineering](https://developers.openai.com/cookbook/examples/prompt_caching_201#46-be-thoughtful-about-context-engineering)：OpenAI 对 Context Engineering、注意力 / replay cost、caching 张力、最小 tool surface 和 eval 取舍的直接说明。
- [OpenAI Conversation State](https://developers.openai.com/api/docs/guides/conversation-state)：Responses API 的手动 history、`previous_response_id` 与 Conversations 状态延续方式。
- [OpenAI Compaction](https://developers.openai.com/api/docs/guides/compaction)：server-side 与 standalone compaction、opaque compaction item 及长任务延续。
- [OpenAI Agents SDK Context](https://openai.github.io/openai-agents-python/context/)：local application context 与 LLM-visible context 的边界。
- [OpenAI Agents SDK Sessions](https://openai.github.io/openai-agents-python/sessions/)：session history、持久化与 compaction 等 context management 实现入口。
- [Anthropic：Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)：context 选择、just-in-time retrieval、compaction、structured note-taking 与 multi-agent 的系统性文章。
- [Anthropic：Harness design for long-running application development](https://www.anthropic.com/engineering/harness-design-long-running-apps)：长任务中的 progress artifact、handoff、reset 与 compaction 取舍。

### 研究证据

- [Byerly & Khashabi, 2026, TACL](https://aclanthology.org/2026.tacl-1.15/)：长 context 任务仍可能存在 positional bias。它支持“必须实测位置和噪声”的判断，不直接规定产品实现参数。
