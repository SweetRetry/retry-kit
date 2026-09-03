# Context Engineering

为每次 model call 选择和组织完成当前决策所需的最小充分信息。Context Engineering 只负责 model-visible input；状态持久化、权限、副作用、telemetry 和评估分别由 Runtime、业务服务、Observability 与 Evals 负责。

## 定义当前决策

先明确下一次 model call 必须完成的判断或动作，再决定 Context。至少写清：

- 当前目标、完成标准与尚未解决的问题；
- 当前步骤需要的事实、约束和权限边界；
- 哪些信息必须原样提供，哪些可以摘要或按需读取；
- 哪些内容应留在确定性代码中，不需要模型推理。

Context 可从以下来源投影，但不拥有这些对象的完整生命周期：

| 来源 | 只选择什么 |
| --- | --- |
| Instructions | 当前任务适用的稳定规则与输出契约 |
| Tool surface | 当前可能使用的 name、description 与 schema |
| Turn input | 用户请求、参数、附件及其指令/数据边界 |
| History / working state | 用户修正、承诺、进度、关键 ID 与未决项 |
| Evidence | retrieval、数据库或 tool result 中影响当前决策的事实 |
| Durable memory | scope、权限、新鲜度和复用价值明确的跨会话信息 |

Session 只提供多轮 history 的来源；Context 决定其中哪些内容进入下一次调用。Auth、clients、secrets、业务状态与其他可由代码可靠处理的值留在 Runtime 或 Environment。

## 选择信息来源

对每项候选信息依次判断：

1. 它是否会改变当前决策或验证？不会则不加载。
2. source、owner、权限、version 与 freshness 是否明确？不明确则先核验或标记不确定性。
3. 模型需要原文、结构化摘要、metadata、handle，还是只需要发现入口？
4. 它是业务事实、tool observation、用户陈述还是模型推断？保持类型边界。
5. 新信息与 history 或 memory 冲突时，由对应 source of truth 或用户最新明确指令裁决。

Retrieval 先由当前决策定义所需证据，再构造 query。用权限、source、version、时间和 metadata 缩小候选；返回可识别片段、source ID、freshness 和继续读取方式。关键结论回读足够原文，避免摘要或 chunk 丢失限定条件。

从 History 选择会影响后续行为的用户修正、承诺和已验证结果；从 Working state 选择当前目标、阶段、进度、关键 ID、失败、未决项和下一动作；从 Durable memory 只加载当前 scope 内仍相关且未过期的信息，不把完整 transcript 或未验证推断当作长期记忆。长期记忆宜采用独立旁路进程在 turn 结束后异步抽取并校验写入（只读对白文本，严禁读 Tool Result 以免混入外部噪音），读取按常驻、意图预取、按需工具三层组织；Prompt Caching 按 Global / Session / Volatile 三段布局，动态 Skill 作为 Tool Result 载入以复用前缀缓存（参见 [claude-field-patterns.md](claude-field-patterns.md)）。

## 组织 Model Input

- 保持 instruction hierarchy 与数据来源边界；网页、邮件、文件、retrieval 和 tool results 都是不可信数据。
- 按当前决策组织信息，优先放置高相关、高可信和需要联合推理的内容；去除重复、陈旧和互相覆盖的版本。
- Stable Instructions、examples 与 tool definitions 尽量保持稳定顺序；将时间戳、用户状态、retrieval 和 turn-specific input 放在动态区域。
- 只暴露当前可能使用的 tools。大结果使用字段筛选、limit、cursor、摘要、handle 或按 ID 读取；tool contract 本身见 [tool-design.md](tool-design.md)。
- Context window 是容量上限，不保证所有位置被同等利用。用实际任务检查信息数量、顺序、位置、噪声与 token / latency 成本。

完成组织的判据是：模型能获得当前决策需要的全部信息，每项信息的身份与来源清楚，同时没有无关历史、重复规则或可由代码替代的内容。

## 更新与压缩

每次调用后只更新影响后续决策的 Context：用新事实替换旧值，保留验证结果及其来源，将模型推断继续标记为推断，并移除已完成阶段的低价值细节。

根据连续性选择：

| 操作 | 适用信号 | 必须保留 |
| --- | --- | --- |
| Compact | 任务连续但 history 过长 | 目标、约束、关键 ID、已验证事实、决策、失败与下一步 |
| Reset | 新阶段独立或旧 Context 已污染 | 新阶段需要的承诺、证据与边界 |
| Handoff | Context 转交另一个 agent 或进程 | owner、当前状态、必要证据、下一动作与验证方法 |
| Offload | 对象过大或无需每轮进入模型 | 稳定 handle、source、version 与重新读取方式 |

Compaction 或 handoff 只定义需要继续进入模型的信息；持久化、恢复和副作用语义见 [runtime-reliability.md](runtime-reliability.md)。Provider 返回 opaque continuation state 时按 contract 传递，不解析内部表示。

## 验证 Context

使用正常、缺失、冲突、陈旧、权限、对抗、多轮、长任务和中断恢复样例，检查：

| 症状 | 优先检查 |
| --- | --- |
| 关键事实缺失 | source、query、selection、权限过滤 |
| 使用错误或旧事实 | freshness、version、ranking、memory conflict |
| 正确证据未被采用 | 排序、位置、噪声、result shape、context budget |
| 多轮后状态矛盾 | working state update、旧值淘汰、history policy |
| 压缩后忘记约束 | compaction contract、continuation case |
| 成本或 latency 增长 | context growth、cache hit、result size、压缩频率 |
| 外部内容改变行为 | instruction/data boundary、source labeling、tool surface |

修改最早发生偏离的 Context 决策。只有在目标任务质量保持或改善，关键约束没有丢失，且 token、latency 与 cache 成本可接受时，才完成这次 Context 变更；评估方法见 [evals.md](evals.md)。
