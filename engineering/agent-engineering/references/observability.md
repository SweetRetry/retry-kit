# Agent Observability

让 agent 运行可监测、可调试、可审计，但不把 telemetry 当作业务状态、Session 或 Eval。通用告警、sampling、retention 与访问控制沿用既有服务基线。

## 对象边界

| 对象 | Owner | 用途 | 不保证 |
| --- | --- | --- | --- |
| Session | application / session runtime | 多轮连续性 | 完整运行历史 |
| Run | Runtime | 一次 agent 执行的状态与终态 | 长期记忆 |
| Business state | Environment / 业务服务 | 业务真相 | 解释模型行为 |
| Trace | Observability | 关联 Run 的 spans 与 events | 业务权威、恢复或 Eval 结论 |
| Eval record | Evals | 保存任务、grader 与证据 | Runtime 实时状态 |
| Client activity | Application / Client | 解释进度与动作 | Artifact、业务状态或原始 Trace |

物理存储可复用，但 owner、schema projection、访问、删除和 retention 必须分开。不要假设 Session 是 event log，也不为统一存储强制 event sourcing。

## Telemetry Contract

Runtime 在 run、model、context、tool、state、approval、retry、handoff 和 verification 边界发出：

- `session_id`、`run_id`、`trace_id`、父子 span、`attempt_id`，以及必要的 `operation_id` / `idempotency_key`；
- agent、model、Instructions、tool、context / retrieval、policy 与 build 版本；
- 实际调用、结果摘要、状态转换、重试或停止依据、错误类别与业务验证；
- token、latency、cost、compaction 和 retry。

采集失败不得改变业务执行或异常传播；telemetry 状态与业务结果分离；事件 schema 可版本化并标注数据分类。Span lifecycle、context propagation 和 adapter 复用现有 observability stack，不在 agent contract 中固定实现。

Telemetry 记录运行事实，不以模型自述替代。采集失败、丢失或延迟不得影响业务提交、权限、重试或恢复。

## Trajectory 与归因

Trajectory 从 telemetry 重建输入来源、决策边界、tool 结果、状态转换和最终验证，不包含 hidden chain-of-thought。各 ID 保持单一职责：Session 关联连续性，Run 标识执行，Trace 关联信号，Attempt 区分重试，Operation 标识业务意图，Idempotency key 约束重复副作用。

从 outcome 或告警追到 exemplar trace，再找最早偏离：

| 症状 | 检查 |
| --- | --- |
| 误解任务或选错工具 | 任务契约、Instructions、tool contract |
| 缺证据或未使用结果 | retrieval、freshness、result shape、context |
| 重复调用或长任务偏航 | loop state、working state、compaction、handoff |
| 越权或危险副作用 | Runtime 权限、approval、幂等与服务端校验 |

Trace 只解释偏离，不承担业务提交、权限、恢复或安全不变量。

## 监测与 Client Projection

监测 verified / false success、tool error / retry / loop、recovery、denied、approval anomaly、人工接管、tail latency、token、cost 和不可逆副作用。每个信号定义阈值、窗口、owner 和动作；高风险失败、`denied`、`indeterminate` 与 approval anomaly 保留不可采样的最小安全或审计事件。需要判断能力时，将 exemplar 交给 [evals.md](evals.md)。

| 可见性 | 内容 |
| --- | --- |
| User-visible | approval、外部影响、长等待、失败与恢复 |
| Summarized | 搜索、读取、批量处理和阶段进度 |
| Internal | retry、cache、routing、retrieval chunk、tool plumbing |
| Restricted | secrets、敏感 payload、security / audit-only 事件 |

Client activity 是受治理的解释性投影，不是 Trace、业务状态或结果资产。

## 数据治理

只记录结构化事实和必要摘要，不保存 hidden chain-of-thought、secrets 或不必要的敏感 payload。不可信输入保留 source 与校验结果，写入前执行 redaction。无法满足数据边界时减少字段或保存受控引用；未采样到失败不证明失败不存在。
