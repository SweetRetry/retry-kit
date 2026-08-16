# Agent Evals

用可重复证据判断 agent 是否完成真实任务、遵守必要执行不变量，并定位最早发生的偏离。Eval 既检查 outcome，也检查只有在安全、权限、成本或业务上必要的路径约束；允许所有满足这些约束的合理 trajectory。

## 导航

- [定义评估对象](#定义评估对象)
- [建立任务集与 Harness](#建立任务集与-harness)
- [Forward Validation](#forward-validation)
- [指标与判断](#指标与判断)
- [证据边界](#证据边界)
- [反馈闭环](#反馈闭环)

## 定义评估对象

先区分目的：

| Eval | 回答的问题 |
| --- | --- |
| Capability | 系统能否完成目标任务 |
| Regression | 已稳定能力是否持续成立 |
| Safety | 权限、越权、对抗与高风险副作用是否受控 |
| Change / forward validation | candidate 相比固定 baseline 是否值得保留 |
| Production / canary evaluation | 真实流量样本中的质量与安全是否持续成立 |

从任务契约导出可观察 outcome 和 execution invariants。可检查任务完成、错误成功声明、tool selection、参数、result 使用、恢复、停止、审批、越权、context 命中、token、latency、cost 和失败率。路径不承载必要约束时，允许多个合理解法。

Outcome eval 不要求 trace。只有 execution invariant、安全边界或失败归因必须检查执行路径时，才使用 [observability.md](observability.md) 提供的 trajectory evidence；trace 是证据输入，不是 grader 或通过标准。

## 建立任务集与 Harness

任务集覆盖正常、缺失、冲突、陈旧、权限、对抗、多轮、长任务、中断恢复和副作用不确定场景，并同时包含“应该做”和“不应该做”的正负例。

- 记录 model snapshot、reasoning / sampling 设置、Instructions、tool schema、retrieval corpus、policy 和 application build。
- 尽量复用 production 的 prompt assembly、tool contract、runtime 状态转换和权限边界。
- 隔离 trial 间的文件、cache、数据库、额度和外部状态。
- 对主观 grader 预先定义 rubric，并用人工样本校准 LLM-as-judge。
- 对关键 case 运行多次，保留分歧、偶发失败和最坏结果。

Mock、stub 和静态断言适合验证 plumbing，但不能证明真实 agent behavior、浏览器交互、持久化或下游可见性。

## Forward Validation

Forward validation 是变更验证程序，不是独立 Agent 架构：

1. 在运行前写明 candidate 希望改善的行为、必须保持的能力、已知风险和证伪条件。
2. 冻结 baseline 与 candidate；用未参与规则设计的 held-out 任务覆盖主要变化轴。
3. 在 fresh context 中只给普通用户请求、待测版本和完成任务所需素材，不泄露预期修复或评分偏好。
4. 保持模型、工具、参数、context 和输入一致；随机性显著时重复运行。
5. 预先定义目标指标、保持指标、回归指标与 hard failures。
6. 主观任务优先 blind pairwise，隐藏版本身份并记录 judge 分歧。
7. 只有目标稳定改善、核心能力无回退、无新增越权或高严重度失败，且收益未被显著 cost / latency 抵消时才保留 candidate。
8. 条件允许时继续验证真实 runtime、工具调用、生成结果、返工率或用户行为。

只运行 candidate 可以提供 smoke evidence，不能支持“比 baseline 更好”。用设计规则时的原始案例回放，只能验证该已知失败是否改变；它不是 held-out 泛化证据。

## 指标与判断

从任务契约选择能改变上线判断的指标；先用 outcome 与 hard failure 建立质量门槛，再比较 trajectory、token、cost 和 latency。常见指标如下：

| 维度 | 指标 | 判断对象 |
| --- | --- | --- |
| Outcome | `verified_task_success_rate`、correctness、completeness | 业务状态或独立 grader 是否证明任务完成 |
| 错误声明 | `false_success_rate`、partial completion | Agent 是否把失败或部分完成报告为成功 |
| Safety | unauthorized action、approval bypass、wrong target、duplicate / irreversible action | 是否越权或造成高风险副作用 |
| Trajectory | loop iterations、model calls、tool calls、replans、clarification turns | 完成任务经过多少决策与交互 |
| Tool | selection accuracy、argument validity、result usage、redundant call rate | 是否选对工具、传对参数并使用结果 |
| Recovery | retry、timeout、stuck / loop、recovery / stop rate | 失败、中断或不确定状态下能否恢复或正确停止 |
| Token / cost | input、output、cached、reasoning tokens；cost per task / success | 包含失败与重试后的资源消耗 |
| Latency | time to first action、tool / verification latency、end-to-end p50 / p95 / p99 | 用户等待和尾部耗时 |
| 稳定性 | repeated pass rate、pass@k、all-runs-pass、variance / confidence interval | 能力上限、重复可靠性和结果波动 |
| 人工依赖 | clarification、handoff、takeover rate | 系统独立完成任务的程度 |

冻结每个指标的定义、分母、数据来源和聚合窗口。特别处理以下口径：

- 用 Environment 的业务状态、确定性断言或校准后的 grader 验证 correctness；Agent 自述成功不计入 `verified_task_success_rate`。
- 将 `step` 拆成 loop iteration、model call、tool call、retry 等原子计数；framework 对 step 的定义不同，未冻结口径时不可横向比较。
- 同时报告 per task 与 per success 的 token、cost 和 latency，并把失败、重试与验证开销计入；只看单次调用会奖励快速失败。
- 同时报告平均表现、p95 / p99 等尾部表现和最坏 hard failure。`pass@k` 表示多次尝试至少一次成功，不能替代多次运行全部通过所衡量的可靠性。

将 Safety 与不可逆副作用设为 hard gate；质量达标后再比较效率。避免用单一加权总分掩盖越权、错误成功声明或少量高严重度失败。小样本单次分差通常只能说明“未观察到明显回退”，不能证明改善；在运行前冻结 rubric、阈值和上线判据。

## 证据边界

按证据强度区分结论：

1. 结构校验：格式、schema 和静态规则合法。
2. Forward smoke：新任务上未立即暴露明显问题。
3. Held-out baseline / candidate：相同任务上的对照结果。
4. 真实下游 A/B：最终运行或消费结果更好。
5. Canary / production：真实分布中的改善持续且没有新失败。

结论强度与证据层级对齐。一个 tool call 成功、命令回执或 agent 自述只证明局部执行，业务 outcome 需要独立验证。

## 反馈闭环

从 outcome、业务验证与必要的 trajectory evidence 找到最早偏离的责任层，再做能解释失败的最小修改。外部方法或案例迁移时，增加换域测试和去来源测试，避免来源域目标长期污染 Instructions 或 Context。

将 production failure、人工接管、denial、rollback、异常 cost 和用户纠正整理为 regression cases。记录 dataset owner、provenance、访问、retention、删除、敏感信息和训练使用边界，避免测试集泄漏或被 candidate 反复拟合。
