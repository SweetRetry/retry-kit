---
name: agent-engineering
description: >
  设计、审查和改进 AI Agent，涵盖 System Prompt、context engineering、
  retrieval / memory / compaction、MCP 或 function tools、agent loop、orchestration、
  observability（trace、metrics、logs）、guardrails 与 eval。仅当任务对象是 AI Agent 本身时使用，例如构建 agent、诊断
  instruction 或 context 问题、设计 tool contract、控制 agent 的 token / latency，
  设计运行监测或评估 single-agent / multi-agent 架构。当前 agent 仅代用户执行普通开发、CLI、
  部署、运维、授权或 E2E 流程时不触发；除非问题明确属于 agent 的行为或架构。
---

# Agent Engineering

围绕任务结果设计 agent。将 Model、Instructions、Context、Tools、Runtime、Environment、Observability 和 Evals 视为协作边界，不用其中一层补偿另一层的缺陷。同一规则只放在能执行或验证它的最小责任层；仅在 eval 证明持续遗漏时增加跨层提醒。

## 读取 references

- 处理 Instructions 或 System Prompt 时，读取 [system-prompt-engineering.md](references/system-prompt-engineering.md)。
- 处理 retrieval、history、memory、compaction、handoff 或 prompt caching 时，读取 [context-engineering.md](references/context-engineering.md)。
- 处理 MCP、function calling 或 tool schema 时，读取 [tool-design.md](references/tool-design.md)。
- 处理状态权威、副作用、重试、并发、approval、安全或恢复时，读取 [runtime-reliability.md](references/runtime-reliability.md)。
- 处理 trace、trajectory monitoring、metrics、logs、告警、sampling 或 telemetry visibility policy 时，读取 [observability.md](references/observability.md)。
- 处理评估集、grader、regression、forward validation 或上线判断时，读取 [evals.md](references/evals.md)。
- 设计完整 agent 时读取六份；局部任务只读取相关 reference。Framework-specific 实现另外核验当前官方文档，通用结论保持 SDK-neutral。

## 建立任务契约

先明确会影响设计的约束：

- 用户需要的结果与可观察成功标准
- 输入、状态、外部依赖和副作用
- 可读、可写、需审批和禁止触碰的边界
- 完成、澄清、等待、失败和停止条件
- 质量、延迟、成本与风险预算

信息不足时，只澄清会改变方案的部分。

## 选择执行形态

| 形态 | 适用信号 |
| --- | --- |
| 确定性代码 | 规则与输出可可靠编码 |
| Workflow | 路径已知，模型只处理局部判断 |
| Agent loop | 下一步依赖中间结果，需要动态选路或选工具 |
| Multi-agent | 独立 context、权限隔离、并行探索或专业分工能覆盖协调成本 |

选择满足任务的最小形态。根据任务结构决定是否拆 agent，不预设固定数量。

并行执行相互独立的调用或工作轨道，依赖前序结果的步骤保持串行。仅在独立 context、并行收益或权限隔离足以覆盖协调、重复探索和汇报成本时使用 multi-agent；委派后不要在主 agent 重做同一工作。

## 划分责任

| 层 | 主要责任 |
| --- | --- |
| Model | 推理能力、可用接口、latency、cost 与行为基线 |
| Instructions | 稳定行为、领域规则、工具使用原则、输出契约 |
| Context | 当前决策需要的事实、证据、历史与工作状态 |
| Tools | 获取信息或执行动作的模型可见 contract |
| Runtime | loop、状态、权限、审批、重试、预算与持久化 |
| Environment | 数据库、文件、外部 API、sandbox 与业务 source of truth |
| Observability | 关联 run 的 trace、metrics 与 logs，支撑监测、调试和审计 |
| Evals | 用 outcome 与必要的 trajectory evidence 判断能力、回归和安全 |

将鉴权、数据一致性和不可逆副作用留给 runtime 与业务服务强制；将易变事实留给动态 context 或 tools。

## 设计运行循环

可使用 `observe → decide → act → verify → update → stop` 作为检查框架，并根据任务调整：

- 在 action 后验证业务效果，而非只检查 tool call 是否返回。
- 在授权范围内完成用户预期的完整 scope；先推进不受影响的部分，仅在不同假设会导致实质不同、危险或无效的结果时澄清。
- 更新 working state 和 model-visible context，移除已失效信息。
- 为可重试、需审批、需用户输入和终止失败提供可区分状态。
- 长任务保留稳定 ID、关键状态和恢复入口。
- 按风险设置 turn、时间、成本、并发与重试边界。

## 连接运行、观测与评估

不要让 Session、Run、Trace 和 Eval 共用一个含混 contract；它们可以共用物理存储，但必须保留不同的 owner、保留策略和消费者：

1. Session 提供多轮连续性的边界；Context 只负责将其中必要的 history 投影到下一次 model call，不拥有 Session 的存储或展示语义。
2. Runtime 管理一次 Run 的状态、权限、副作用和恢复，并在关键边界发出 telemetry；Environment 继续拥有业务真相。
3. Observability 将 telemetry 关联为 trace、metrics 和 logs，面向监测、调试、审计，并只向 client 提供经过 visibility policy 过滤的信号。
4. Evals 默认从任务 outcome 判断能力；只有 execution invariant 或失败归因需要检查路径时，才消费 trajectory evidence。

完成分层的判据是：每份状态、规则和证据都有唯一 owner，跨层接口明确，且没有用 Prompt 或 Trace 补偿 Runtime 与业务服务必须强制的约束。

## 输出

只交付用户请求的层及其必要接口。先说明结果，再说明必要的架构、取舍与验证；明确区分已完成、失败、跳过和未验证项。具体格式随任务和消费方调整。

## 资料新鲜度

资料核验日期：**2026-07-20**。实现 provider-specific model、cache、compaction、tool schema 或安全能力前，重新查看对应 reference 中的官方 living docs。
