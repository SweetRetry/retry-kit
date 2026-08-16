# Agent Observability

让 agent 的运行行为可监测、可调试、可审计，同时不把 telemetry 当作业务状态、Session 或 Eval 的替代品。物理存储可以复用；逻辑 contract、owner、访问和 retention 必须按用途分开。

## 导航

- [对象与边界](#对象与边界)
- [信号模型](#信号模型)
- [Trajectory 与关联](#trajectory-与关联)
- [监测与响应](#监测与响应)
- [Client 可见信号](#client-可见信号)
- [数据治理](#数据治理)

## 对象与边界

| 对象 | Owner | 用途 | 不保证 |
| --- | --- | --- | --- |
| Session | application / session runtime | 组织多轮交互、用户 scope 与连续性 | 完整、不可变或可审计的运行历史 |
| Run | Runtime | 表达一次有开始、状态和终态的 agent 执行 | 跨会话长期记忆 |
| Business state | Environment / 业务服务 | 业务对象的当前真相与写入一致性 | 解释模型为什么采取动作 |
| Trace | Observability | 关联一次 Run 的 spans 与 events | 业务状态权威、恢复存档或 Eval 结论 |
| Eval record | Evals | 保存任务、rubric、grader 结果与证据引用 | Runtime 的实时控制状态 |
| Client activity | Application / Client | 向用户解释有意义的进度与动作 | 充当 Artifact、业务状态或原始 Trace |

不要默认 Session 是完整 append-only event log，也不要为了统一存储强制 event sourcing。若同一 event store 同时支持 Session、恢复、Trace 或审计，仍分别定义 schema projection、访问、删除、compaction 和保留策略。

## 信号模型

组合三类信号，不要求一种信号承担全部用途：

| 信号 | 回答的问题 | 主要消费者 |
| --- | --- | --- |
| Trace / span | 这次 Run 经过哪些边界，最早在哪里偏离？ | Debugging、incident、trajectory eval |
| Metrics | 某类行为是否正在恶化或越过预算？ | Dashboard、SLO、capacity、cost control |
| Logs / events | 发生了什么离散且可处置的事件？ | Runbook、audit、security、support |

Runtime 应在 run、model、context、tool、state、approval、retry、handoff 和 verification 边界发出结构化 telemetry。根据用途记录：

- 关联：`session_id`（存在时）、`run_id`、`trace_id`、父子 span、`attempt_id`，以及必要的 `operation_id` / `idempotency_key`；
- 版本：agent、model、Instructions、tool schema、context/retrieval、policy 和 application build；
- 行为：阶段、暴露 tools、结构化调用与参数摘要/哈希、结果摘要、状态转换、重试/停止依据和业务验证；
- 资源：input / output / cached tokens、latency、cost、compaction、retry 和错误类别；
- 治理：data classification、redaction、visibility、sampling、retention 和访问审计。

## Trajectory 与关联

Trajectory 是从 telemetry 重建的执行路径，不是 hidden chain-of-thought。它应足以回答输入来源、关键决策边界、tool 结果、状态转换和最终验证；不要求复原模型未显式输出的内部推理。

区分各 ID 的语义：`session_id` 关联多轮连续性，`run_id` 标识一次执行，`trace_id` 关联观测信号，`attempt_id` 区分重试，`operation_id` 标识业务意图，`idempotency_key` 约束重复副作用。不要用一个 ID 承担所有职责。

Trace 可能被 sampling、丢失或延迟，因此不能作为业务提交、权限、恢复或审计不变量的唯一依据。高风险不变量由 Runtime 与业务服务强制，Observability 负责发现和解释偏离。

发生失败时，从 outcome 或告警追到 exemplar trace，再从最早偏离定位责任层：

| 症状 | 优先检查 |
| --- | --- |
| 调用工具前已理解错任务 | 任务契约、Instructions、输入边界 |
| 选错工具或参数不稳定 | tool surface、description、schema |
| 缺证据、使用旧事实 | retrieval、memory、freshness、context update |
| 正确结果未被使用 | result shape、排序、context budget |
| 重复调用或无法停止 | loop state、success / retry / stop condition |
| 长任务逐渐偏航 | working state、compaction、handoff、durable memory |
| 越权或产生危险副作用 | Runtime 权限、approval、幂等与服务端校验 |

## 监测与响应

从任务契约与运行预算定义 signals：已验证成功、错误成功声明、tool error / retry / loop、恢复、denied、approval anomaly、人工接管、tail latency、token、cost 和不可逆副作用。为每个信号写明 baseline、阈值、窗口、owner 和处置动作。

- 只为能触发调查、降级、暂停、限流或回滚的信号告警。
- 告警关联 exemplar trace、相关版本和 runbook，不只报告原始日志量。
- 根据风险、调查价值、数据边界和成本定义 head / tail sampling。高风险失败、denied、indeterminate 与 approval anomaly 保留不可丢失的最小安全或审计事件；是否保存完整 Trace 另行决定。
- 从 exemplar trace 找最早偏离；需要判断能力或改动时，再将案例交给 [evals.md](evals.md) 形成 regression 或 forward validation。

完成标准是：聚合信号可追到单次 Run，每类告警都有 owner 与动作，高风险事件不因 Trace sampling 静默消失，并能区分模型错误、tool/runtime 故障和真实业务失败。

## Client 可见信号

Observability 只负责提供经过治理的 client activity 信号，不拥有 Artifact、Thread、界面层级或用户控制。按用户影响和解释价值决定 telemetry visibility：

| 级别 | 典型内容 | 展示方式 |
| --- | --- | --- |
| User-visible | approval、外部写入、资金或数据影响、长等待、失败与恢复 | 展示动作、目标、状态和必要依据 |
| Summarized | 搜索、读取、批量处理和阶段进度 | 合并为稳定、易懂的 activity |
| Internal | retry、cache、routing、retrieval chunk、低层 tool plumbing | 不进入普通 client view |
| Restricted | secrets、敏感 payload、security / audit-only 事件 | 按最小权限单独访问 |

“不展示”不等于“必须完整记录”。先做数据最小化，再对确有观测价值的字段应用 visibility policy。Client 使用这些信号解释进度和影响，但不得把 Trace 当作状态权威或结果资产。

## 数据治理

普通 telemetry 记录结构化事实和必要摘要，不记录 hidden chain-of-thought、secrets 或不必要的完整敏感 payload。对网页、文件、retrieval 和 tool result 等不可信输入保留 source 与校验结果，并在写入前执行 redaction。

分别定义采集目的、dataset owner、tenant / user scope、访问、retention、删除、导出、训练使用和 incident hold。未采样到失败不证明失败不存在；无法满足数据边界时，优先减少字段或保存受控引用，而不是复制原始内容。
