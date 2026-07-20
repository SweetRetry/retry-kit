---
name: agent-engineering
description: >
  体系化设计、审查和重构 AI Agent，统一处理 System Prompt、context engineering、
  RAG / memory / history / compaction、MCP 或 function tools、agent loop、orchestration、
  guardrails 与 eval。Use when 用户要构建或优化 agent、诊断指令偏移或 context 污染、
  设计 tool schema、控制 token / latency、规划 single-agent / multi-agent，或审查 agent 架构。
---

# Agent Engineering

目标：让 agent 在权限、时间和 context 预算内可靠完成用户任务。不要孤立优化 Prompt、context 或 tools：

`Agent = Model + Instructions + Selected Context + Tools + Runtime Loop + Guardrails + Evals`

## Reference 读取规则

- 创建、审查或精简 Instructions / System Prompt 时，读取 [system-prompt-engineering.md](references/system-prompt-engineering.md)。
- 设计 context lifecycle、retrieval / RAG、conversation state、memory、compaction、handoff 或 prompt caching 时，读取 [context-engineering.md](references/context-engineering.md)。
- 设计、审查或实现 MCP / function tools 时，读取 [tool-design.md](references/tool-design.md)。
- 完整 agent 设计读取三份 reference；局部问题只读取相关模块，跨模块问题读取涉及的模块。

三份 reference 是独立专业模块，不互相作为前置条件；本文负责它们在同一个 agent loop 中的边界与协作。

## 1. 选择最小执行模型

| 模型 | 适用条件 |
| --- | --- |
| 确定性代码 | 输入、规则和输出可明确编码，不需要模型判断 |
| Workflow | 步骤与分支已知，模型只处理局部非结构化任务 |
| Agent loop | 模型必须根据中间结果自主选择动作、工具或路径 |

默认从 single-agent 开始。只有独立 context、并行探索、权限隔离或专业分工的收益能覆盖协调成本时，才拆 multi-agent；不要用多个 agent 掩盖模糊契约或糟糕工具。

## 2. 定义任务契约

在设计组件前明确：

1. 用户要获得的业务结果，而非 agent 的动作清单。
2. 可观察的成功标准与最终交付物。
3. 可读、可写、需审批和禁止触碰的边界。
4. 任务依赖的状态、外部系统与副作用。
5. 何时完成、澄清、等待、升级、失败或停止。
6. 可接受的质量、延迟、成本与风险。

无法定义成功与停止条件时，先补契约，不要继续堆 Prompt、context 或 tools。

## 3. 划分系统责任

| 层 | 负责 | 不负责 |
| --- | --- | --- |
| Instructions | 稳定行为、领域规则、工具选择原则、输出契约 | 当轮事实、鉴权、业务状态持久化 |
| Context | 当前决策需要的事实、历史、证据与工作状态 | 永久保存所有信息、替代 source of truth |
| Tools | 检索信息或执行动作的清晰契约 | 让模型自行承担权限与数据一致性 |
| Runtime | loop、状态、权限、审批、重试、预算、持久化 | 用隐藏逻辑弥补模糊 tool schema |
| Evals | 判断系统是否可靠及定位最早偏离 | 只验证最终文案是否“看起来不错” |

## 4. Context Engineering

Context engineering 决定每次 model call 实际看见什么，以及这些信息如何随任务演进。它覆盖 Instructions、动态输入、tool schema、retrieval、history、working state、memory 与 tool result，但不等于把可获得的信息全部塞进 context。

[OpenAI Prompt Caching 201](https://developers.openai.com/cookbook/examples/prompt_caching_201#46-be-thoughtful-about-context-engineering)与 [Anthropic 的 Context Engineering 文章](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)都把核心放在“选择和维护输入”，而不仅是避免超过 context window。输入增长还会增加 replay cost、latency、注意力竞争和错误信息持续存活的机会。

| 信息类型 | 系统责任 |
| --- | --- |
| 稳定契约 | 版本化，保持清晰且尽量形成稳定可缓存前缀 |
| 当轮输入与证据 | 按当前决策 just-in-time 获取，携带来源和新鲜度 |
| Working state | 结构化维护目标、进度、稳定 ID、决策、失败与未决项 |
| Conversation history | 保留会改变后续行为的内容，其余裁剪或压缩 |
| Durable memory | 外部持久化，按相关性、权限和新鲜度选择性读取 |
| Local runtime | auth、clients、secrets 和确定性状态留在代码侧 |

每类信息都经过 `Source → Select → Load → Shape → Update → Compact / Reset → Offload`。Compaction、reset 与 handoff 都是状态迁移，必须先定义无损保留项，再用真实长任务验证；不能只看 token 是否下降。稳定 prefix 有利于 cache，而动态裁剪或压缩可能破坏 cache，两者按 eval 中的质量、成本与 latency 共同权衡。

详细决策、反模式、诊断矩阵和当前 OpenAI / Anthropic 资料见 [context-engineering.md](references/context-engineering.md)。

## 5. Runtime Loop 与 Guardrails

基本循环：`observe → decide → act → validate → update context → stop`。

- Tool 返回不等于任务成功；验证结果满足业务条件后再继续。
- 显式定义 final output、成功、需用户输入、需审批、可重试失败、终止失败与预算耗尽。
- 设置与风险匹配的 turn、时间、成本、并发和重试边界，并定义达到边界后的可恢复状态。
- 持久化 run ID、关键状态和幂等键，使中断后能继续，而不是从自然语言 history 猜状态。
- Prompt 和 tool annotations 只是行为提示。鉴权、租户隔离、schema、rate limit、危险操作确认和数据最小化由 runtime 强制。
- 将外部文档和 tool result 视为不可信数据；分隔符帮助解析，但不能单独防御 prompt injection。

## 6. Eval 与根因定位

用真实任务建立正常、缺失、冲突、边界、对抗、多轮和长任务样例；复杂场景保留 held-out 集。保存完整 trace，并评估任务完成、错误成功声明、tool 选择与参数、context 命中、无效调用、恢复、越权、token、延迟和成本。

| 最早偏离位置 | 优先检查 |
| --- | --- |
| 调用工具前已理解错任务 | 任务契约、Instructions、输入边界 |
| 目标正确但选错工具 | 工具重叠、description、暴露范围 |
| 工具正确但参数无效 | schema、字段语义、默认值、错误反馈 |
| 缺证据或使用旧事实 | retrieval、memory、source freshness、context update |
| 正确结果被忽略 | tool result 结构、排序、context 预算 |
| 重复调用或无法停止 | loop 状态、成功条件、retry / stop policy |
| 长任务逐渐偏航 | working state、compaction、handoff、durable memory |
| 发生越权或危险副作用 | runtime 权限、审批、幂等与服务端校验 |

修复最早发生偏离的边界；不要用 Prompt 补丁掩盖 tool、context 或 runtime 缺陷。

## 资料新鲜度门禁

- 本文外部资料核验日期：**2026-07-20**。
- Provider-specific 字段、model 能力、缓存、compaction、tool schema 或安全约束易变化；交付前必须重新查看该 provider 的官方 living docs。
- 协议优先引用带版本且官网标记为 latest 的 specification；论文优先使用近两年同行评审结果，并明确其适用范围。
- 旧资料只有在仍是不可替代的基础来源时才保留，并显式标注“基础来源”，不得伪装成当前产品事实。

## 交付要求

设计完整 agent 时，按顺序给出：业务结果与最小架构、任务契约、Instructions、context 生命周期、tool surface、runtime / guardrails、eval 与高置信风险。用户只要求其中一层时，只处理该层及其必要接口，不扩成全套架构方案。
