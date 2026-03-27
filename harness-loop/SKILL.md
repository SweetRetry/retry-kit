---
name: harness-loop
description: >
  通用的目标驱动 harness，用于把“定义目标与验收门槛 -> 产出 -> 可执行验证 -> 独立评估 -> 继续迭代”
  变成一个可重复的多轮闭环。仅在用户明确要求“持续迭代直到达标”“像 harness 一样自驱推进”
  “生成和评估分离”“启用 subagent 协作”“跑到通过为止”时触发。
  它不是某个专业领域的 skill，而是包裹目标任务 skill 的 harness controller。
---

# Harness Loop

## 核心职责

把一次性执行改成目标驱动的受控迭代：

1. Loop Controller 冻结目标、边界、验收门槛
2. Generator 产出
3. Verifier 跑可执行验证
4. Evaluator 独立评审
5. Loop Controller 根据证据做 `PASS / CONTINUE / STOP`

不要把它当成专业知识 skill。真正完成任务的能力仍来自目标 skill 或普通执行能力；`harness-loop` 只负责把“目标 -> 产出 -> 验证 -> 评审 -> 续跑”闭环搭起来。

## 何时使用

优先用于：

- 用户明确要求多轮打磨、持续优化、继续迭代
- 用户要求“做到通过为止”“一直迭代直到达标”
- 任务复杂，且明确需要生成/验证/评审分离
- 需要 subagent 协作，或显式要求类似 harness / GEL 的推进方式
- 已经有初稿，希望按反馈持续 refinement

不要用于：

- 单步即可完成的简单任务
- 目标边界还没对齐，继续跑只会放大误解
- 纯事实问答、翻译、简单改字
- 用户只要快速答案，不要持续收敛

## 启动前确认

开始前至少确认：

1. 目标对象是什么
2. 当前起点是什么
3. 达标标准是什么
4. 迭代预算是什么
5. 执行边界是什么
6. 达标证据是什么

如果这些信息会显著影响 mode、rubric、verification plan 或 stop condition，先补最小澄清；不要直接开跑。

## 角色分工

- Loop Controller：定义 `goal contract`、`pass policy`、`verification plan`，编排各角色，做最终决策
- Planner：仅在目标还不够可执行时，把模糊目标扩成轻量 spec
- Generator：产出实际结果，不自评
- Verifier：优先跑测试、脚本检查、页面交互、流程演练等可重复验证
- Evaluator：结合产出与验证结果做独立评审，不替 Generator 补意图

具体执行细则在：

- `agents/loop-controller.md`
- `agents/planner.md`
- `agents/generator.md`
- `agents/verifier.md`
- `agents/evaluator.md`

## 执行模式

### Greenfield

从零开始做首稿。

最少输入：

- `task_prompt`
- `target_skill` 或执行方式
- `goal` 或 `hard_pass_criteria`

### Continue

基于上一轮产出和反馈继续推进。

最少输入：

- `goal-contract.md` 或等价目标契约
- 最近一轮的 `generator-output.md` 或实际产出路径
- 最近一轮的 `verification-report.md`
- 最近一轮的 `evaluator-report.md`
- 最近一轮的 `loop-feedback.md`

续跑规则：

- 默认只续跑最近一个 final decision 为 `CONTINUE` 的 run
- 如果用户明确指定旧 run，可以从指定 run 恢复
- 如果上一个 run 已经 `PASS` 或 `STOP`，除非用户明确要求 reopen，否则不要偷偷继续

### Refinement

只围绕明确问题做局部修复。

最少输入：

- `existing_output`
- `issues`

### Self-Iteration

目标对象就是某个 skill 本身。

最少输入：

- `target_skill_path`
- `focus_area`
- `hard_pass_criteria`

如果优化对象是 skill 本身，必须显式写清本轮允许修改哪些文件。

## Goal Contract

iteration 1 开始前先冻结：

- `goal`
- `scope`
- `hard_pass_criteria`
- `soft_pass_criteria`
- `rubric`
- `verification_plan`
- `pass_policy`
- `max_iterations`

判定原则：

- 所有 `hard_pass_criteria` 都必须满足
- 只要存在可执行验证，`verification_plan` 里的必跑检查就必须通过
- Evaluator 必须给 `PASS`
- 关键维度不得跌破 floor
- 总分达到 `target_score` 时可直接 `PASS`
- 总分未达 target，但落在 `waiver_window` 内且剩余问题都非阻塞时，Loop Controller 才能显式记录一次 `waiver`

如果 `pass_policy` 里启用了 `target_score`、`floor` 或 `waiver_window`，Evaluator 就必须输出数值分和 `weighted_total`，不能只给 `PASS / FAIL`。

推荐默认值：

- `critical_dimension_floor: 80`
- `non_critical_dimension_floor: 75`
- `target_score: 85`
- `waiver_window: 3`

## Workspace / Artifact 契约

每次 run 固定保存到：

```text
.harness-workspace/<run-id>/
  goal-contract.md
  spec.md                  # 可选，仅在复杂任务需要
  handoff.md               # 可选，仅在长时续跑需要
  iteration-1/
    setup.md
    iteration-contract.md
    generator-output.md
    verification-report.md
    evaluator-report.md
    loop-feedback.md
  iteration-2/
    ...
  final-report.md
```

最低要求：

- `goal-contract.md`：最终目标、scope、硬/软门槛、rubric、verification plan、pass policy
- `setup.md`：本轮 mode、iteration、workspace、max_iterations
- `iteration-contract.md`：这一轮只做什么、done 定义、验证方式、禁止事项
- `generator-output.md`：本轮完成内容、产出物、已知限制
- `verification-report.md`：执行过哪些检查、哪些通过/失败、未跑项与原因
- `evaluator-report.md`：rubric 结论、证据、score summary、verdict、下一轮重点
- `loop-feedback.md`：压缩后的下一轮可执行反馈
- `final-report.md`：最终决策、决策依据、产出位置、残余风险

`Continue` 和 `Self-Iteration` 默认从最近一轮的 `generator-output.md`、`verification-report.md`、`evaluator-report.md`、`loop-feedback.md` 续跑，同时必须加载同一个 run 根目录下的 `goal-contract.md`。

## 通用工作流

### Step 0: Optional Planning

如果目标还停留在“做一个 X”而没有可执行边界，先补一个轻量 spec。Planner 只负责回答：

- 这次 run 的最终交付物
- 分几个阶段推进
- 每个阶段如何验证 done
- 哪些内容当前不做

目标已经足够清楚时，不必强行启 Planner。

### Step 1: 写 Iteration Contract

每轮开始前先写 `iteration-contract.md`，至少包含：

- 这一轮只做什么
- done 的判断方式
- 要跑哪些验证
- 明确禁止事项

### Step 2: 启动 Generator

给 Generator 的输入至少包含：

- 当前任务
- 目标 skill 或执行方式
- 当前迭代编号
- `goal-contract.md`
- `iteration-contract.md`
- 上一轮反馈
- 输出路径
- 本轮禁止事项

### Step 3: 启动 Verifier

优先跑可执行验证，再做主观评审。Verifier 至少读取：

- `goal-contract.md`
- `iteration-contract.md`
- 实际产出或产出路径
- 需要执行的 `verification_plan`

如果没有可执行验证，也要显式写明“本轮无可执行验证”。

### Step 4: 启动 Evaluator

给 Evaluator 的输入至少包含：

- 任务目标
- 实际产出
- `verification-report.md`
- 本轮 rubric
- `hard_pass_criteria`
- `soft_pass_criteria`

Evaluator 必须输出：

- 各维度得分与证据
- `weighted_total`
- `below_floor`
- `target_score_met`
- `waiver_eligible`
- blocking issues
- `PASS / CONTINUE / STOP`
- 下一轮最高优先级改进项

### Step 5: 做 Loop Decision

推荐判定顺序：

1. `hard_pass_criteria` 是否全部满足
2. 必跑验证是否全部通过
3. 是否存在 blocking issue
4. 关键维度是否跌破 floor
5. 总分是否达到 `target_score`
6. 若未达到 `target_score`，是否落在 `waiver_window` 内且剩余问题均为非阻塞项

如果使用了 `waiver`，必须显式记录：

- 为什么允许 waiver
- 哪些问题被视为非阻塞
- 为什么继续迭代的收益不值得

不要机械追求“必须满分”。但也不要因为 evaluator 主观觉得“差不多了”就提前停。

## 停止条件

默认按下面顺序判断：

1. 所有硬门槛已满足
2. 必跑验证已通过
3. Evaluator 判定无 blocking issue
4. 评分达到目标，或记录了符合规则的 waiver
5. 下一轮改进的价值低于预计成本
6. 达到 `max_iterations`
7. 命中用户边界或工程约束

## 输出约束

每轮至少保留：

- 本轮任务与 mode
- 本轮 iteration contract
- generator 产出摘要
- verifier 结论
- evaluator 结论
- loop decision
- 给下一轮的具体反馈

`final-report.md` 至少包含：

```md
# Final Report

## Task
- <本轮任务>

## Mode
- <greenfield | continue | refinement | self-iteration>

## Iterations
- <总迭代次数>

## Final Decision
- <PASS | CONTINUE | STOP>

## Why It Passed / Why It Stopped
- <决策依据>

## Pass Policy Satisfaction
- Hard Pass Criteria: <Met | Not Met>
- Verification Plan: <Passed | Failed | Partial>
- Blocking Issues: <None | 列表>
- Weighted Total: <分数或 N/A>
- Target Score: <目标分或 N/A>
- Waiver Used: <No | Yes + 原因>

## Final Output Locations
- <文件路径>

## Residual Risks
- <剩余风险或 None>
```

## Subagent 使用原则

- Generator 与 Evaluator 必须分离
- 有可执行验证时，Verifier 与 Evaluator 也应尽量分离
- 不要让 Evaluator 直接重写结果；它负责找证据、定优先级、给改进方向
- 如果任务很小，宁可不启 subagent，也不要为了形式强行拆分

## 常见失效模式

- 把 harness 写成某个垂直领域的 rubric
- Generator 既产出又自夸，Evaluator 没有真正独立
- 有验证能力却不跑验证
- 每轮反馈太泛，下一轮无法执行
- 把 `PASS` 简化成“总分差不多”或“evaluator 觉得可以”
- 不设停止条件，导致为了迭代而迭代

## Eval 场景

最小评测场景保留在 [evals.json](/Users/zhangzimin/Documents/sweetRetry/skills/harness-loop/evals/evals.json)。至少应覆盖：

- `greenfield-basic`
- `continue-existing-output`
- `self-iteration-skill`
- `general-task-pass-policy`
