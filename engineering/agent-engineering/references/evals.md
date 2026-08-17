# Agent Evals

用可重复证据判断 agent 是否完成真实任务，并定位最早偏离。默认评估 outcome；只有安全、权限、成本、业务约束或失败归因依赖路径时才检查 trajectory。

## 评估对象

| Eval | 判断 |
| --- | --- |
| Capability | 能否完成目标任务 |
| Regression | 已稳定能力是否保持 |
| Safety | 权限与高风险副作用是否受控 |
| Change | Candidate 是否优于固定 baseline |
| Production | 真实分布中的质量与安全是否持续 |

从任务契约导出 outcome、必要 execution invariants 和效率指标。路径不承载约束时允许不同解法；trace 只提供必要的路径证据，见 [observability.md](observability.md)，不充当 grader。

## 任务集与 Harness

- 覆盖正常、缺失、冲突、陈旧、权限、对抗、多轮、中断和未知副作用，并包含正负例。
- 冻结 model、sampling、Instructions、tools、retrieval、policy 与 build；尽量复用 production runtime，隔离 trial 状态。
- 主观任务预定义 rubric 并校准 grader；高风险或高方差 case 重复运行，保留分歧与最坏结果。
- 版本化任务、意图与来源；held-out 不参与 candidate 设计，也不泄露预期修复或评分偏好。

原始失败回放只证明已知问题是否改变；Mock、静态断言和单次 candidate 运行不能证明泛化或真实下游效果。

## Forward Validation

1. 写明目标行为、保持能力、风险和证伪条件。
2. 冻结 production baseline 与 candidate，用未参与设计的 held-out 覆盖变化轴。
3. 在 fresh context 中保持模型、工具、参数和输入一致；按风险与方差决定重复运行。
4. 运行前冻结目标、保持、资源指标，hard failures 与结论规则；主观任务优先 blind pairwise。
5. 条件允许时验证真实 runtime、工具、生成结果、返工率或用户行为。
6. 只有目标改善、核心能力无回退、无新增高严重度失败，且收益未被不可接受的 cost / latency 抵消时才保留 candidate。

Safety 与不可逆副作用是 hard gate，不用加权总分掩盖。未满足任何 gate 即不保留 candidate。

## 指标与判断

- Outcome：verified success、correctness、completeness、false success 和 partial completion。
- Safety：unauthorized action、approval bypass、wrong target、duplicate / irreversible action。
- Execution：tool selection、arguments、result usage、recovery、stop、loop 和人工接管。
- Efficiency / stability：token、cost per task / success、latency、repeated pass、`pass@k`、all-runs-pass 和 variance。

冻结指标定义、分子、分母、数据来源和聚合窗口；口径变化视为 eval 变化。

- 用业务 source of truth、确定性断言或校准 grader 验证 outcome；agent 自述不计入 verified success。
- 将 `step` 拆成 model、tool、retry 等原子计数；把失败、重试与验证计入资源成本，并报告尾部与最坏 hard failure。
- 区分 `pass@k` 的能力上限与 all-runs-pass 的重复可靠性。
- Baseline 与 candidate 按同任务、同重复编号配对。任务数与重复数由风险、方差、目标差值、统计功效和预算决定；重复运行不算独立任务。结论精度不得超过样本证据。

先过 outcome 与 hard failure 门槛，再比较效率。

## 证据边界

| 证据 | 可支持的结论 |
| --- | --- |
| 结构校验 | 格式或 schema 合法 |
| Forward smoke | 未立即发现明显问题 |
| Held-out 对照 | 在该任务集和统计口径下的差异 |
| 真实下游 A/B | 该实验中的下游差异 |
| Canary / production | 改善在真实分布中持续且无新关键失败 |

Tool call、命令回执或 agent 自述只证明局部执行；业务 outcome 需要独立验证。

## 运行与反馈

- Baseline 使用当前 production 配置；按风险安排 smoke、regression、全量或 canary，并归档配置、原始运行和报告。
- 将 production failure、人工接管、denial、rollback、异常 cost 和用户纠正转成 regression cases。
- 记录 dataset owner、provenance、访问、retention、删除、敏感信息和训练边界。
- 从 outcome 与必要 trajectory 定位最早偏离后做最小修改；任务集、judge 或 rubric 改变时版本化并回放历史失败。
