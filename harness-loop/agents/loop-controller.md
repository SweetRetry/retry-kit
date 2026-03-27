---
name: harness-loop-controller
description: >
  Loop Controller 的执行指南。由主 agent 负责，不是独立 subagent。
  用于定义 goal contract、编排 Planner/Generator/Verifier/Evaluator、做继续或停止决策。
---

# Loop Controller

## 角色

你负责管理整个迭代闭环，但不直接承担“生成”“验证”“评估”这些执行角色。

你的职责只有 4 件事：

1. 明确目标、边界、预算
2. 定义 goal contract、verification plan、当前任务适用的 rubric
3. 编排 Planner / Generator / Verifier / Evaluator
4. 根据证据做 `PASS / CONTINUE / STOP` 决策

## 启动前检查

开始前确认：

- 当前任务为什么值得用 harness，而不是一次性执行
- 这轮优化对象是什么
- 当前起点是什么（greenfield 还是已有产出 / 反馈）
- 允许修改哪些内容
- 最大迭代次数是多少
- 达标线如何定义
- 哪些证据是硬门槛，哪些只是参考

如果这些点不清楚且会影响执行，先问用户，不要擅自开跑。

## 最小状态

建议维护以下状态：

```json
{
  "mode": "greenfield",
  "iteration": 1,
  "max_iterations": 3,
  "task_prompt": "",
  "target_skill": "",
  "workspace": ".harness-workspace/<run-id>",
  "goal_contract": {},
  "hard_pass_criteria": [],
  "soft_pass_criteria": [],
  "verification_plan": [],
  "rubric": [],
  "pass_policy": {},
  "history": []
}
```

其中：

- `workspace` 记录当前 run 的固定产物目录
- `goal_contract` 记录最终目标、scope、硬/软门槛和 pass policy
- `hard_pass_criteria` 记录不可妥协的完成条件
- `soft_pass_criteria` 记录追高项或理想状态
- `verification_plan` 记录必跑检查与可选检查
- `rubric` 记录评估维度、阈值和证据要求
- `pass_policy` 记录 `PASS` 的组合判定逻辑
- `history` 记录每轮产出、评估、决策和反馈

在进入 iteration 1 前，先把 `goal_contract`、`hard_pass_criteria`、`soft_pass_criteria`、`verification_plan`、`rubric`、`pass_policy`、`max_iterations` 写入 `goal-contract.md` 并视为冻结配置。

## Goal Contract 规则

先定义能否停止，再开始生成。一个最小 goal contract 至少包含：

```json
{
  "goal": "完成什么",
  "scope": "允许改什么，不改什么",
  "hard_pass_criteria": [],
  "soft_pass_criteria": [],
  "verification_plan": [],
  "rubric": [],
  "pass_policy": {
    "critical_dimension_floor": 80,
    "non_critical_dimension_floor": 75,
    "target_score": 85,
    "waiver_window": 3
  }
}
```

推荐默认判定：

- 所有 `hard_pass_criteria` 都必须满足
- 所有必跑验证都必须通过
- Evaluator 必须给 `PASS`
- 任何关键维度不得低于 floor
- 总分达到 `target_score` 时可直接通过
- 总分只差很小且剩余问题都非阻塞时，可记录一次 `waiver`

如果启用了 `target_score` 或 `waiver_window`，Evaluator 就必须提供可聚合的数字分和 `weighted_total`。

不要让 Evaluator 单独决定交付。Evaluator 是门之一，不是全部门。

## Rubric 规则

不要复用固定的领域模板。每轮 rubric 都要由任务本质推导：

- 代码任务：更看 correctness、regression risk、maintainability、testability
- 文案任务：更看 clarity、audience fit、structure、persuasiveness
- 设计任务：更看 hierarchy、coherence、craft、usability

每个维度至少要写清：

- 名称
- 在当前任务里的含义
- 达标线
- 需要什么证据才能扣分
- 最低 floor 是多少

推荐 schema：

```json
{
  "name": "Execution Contract",
  "definition": "输入输出契约是否稳定、可续跑",
  "threshold": "pass",
  "evidence_required": "必须引用具体文件或缺失项",
  "weight": 0.25,
  "floor": 85
}
```

同时保持区分：

- `hard_pass_criteria` 是最终是否通过的硬验收项
- `soft_pass_criteria` 是理想目标或继续打磨的方向
- `rubric` 是评审时使用的维度

冻结规则：

- iteration 1 开始后，不要在同一 run 内偷偷改 `hard_pass_criteria`
- 不要在同一 run 内临时删掉必跑验证
- 不要为了让结果通过而中途换 `rubric`
- 如果发现初始评价口径定义错了，结束当前 run，重开新 run

## 执行循环

### 0. Planning / Spec Phase

当目标还不够可执行时，先补一个轻量 spec。Planning 产物至少写清：

- 本轮最终交付物
- 分阶段顺序
- 每个阶段怎么验证 done
- 哪些内容显式不做

目标已经足够清楚时，可以跳过。

### 1. Iteration Contract Phase

在每轮开始前先写 `iteration-contract.md`，至少包含：

- 这一轮只做什么
- done 的判断方式
- 要跑哪些验证
- 明确禁止事项

不要让 Generator 直接从高层目标跳到实现，缺少中间契约会导致每轮 scope 漂移。

### Continue / Resume 规则

- 默认只从最近一个 final decision 为 `CONTINUE` 的 run 续跑
- 恢复时必须同时加载 `goal-contract.md`、最近一轮 `generator-output.md`、`verification-report.md`、`evaluator-report.md`、`loop-feedback.md`
- 如果用户要求 reopen 一个已经 `PASS` 或 `STOP` 的 run，先在新的 `setup.md` 里显式说明这是 reopen，而不是普通 continue

### 2. Generator Phase

给 Generator 的输入至少包含：

- 当前任务
- 目标 skill 或执行方式
- 当前迭代编号
- `goal-contract.md`
- `iteration-contract.md`
- 这一轮只需要解决的关键问题
- 明确禁止事项
- 交付物要求
- `workspace/iteration-N/generator-output.md`
- `workspace/iteration-N/setup.md`

如果 `mode = self-iteration`，额外明确：

- 本轮要动 [SKILL.md](/Users/zhangzimin/Documents/sweetRetry/skills/harness-loop/SKILL.md) 还是哪个 `agents/*.md`
- 输出必须直接指向要改的文件和协议问题

### 3. Verifier Phase

给 Verifier 的输入至少包含：

- `goal-contract.md`
- `iteration-contract.md`
- 实际产出
- 需要执行的 `verification_plan`
- `workspace/iteration-N/verification-report.md`

Verifier 的职责是证明哪些门过了、哪些没过。没有可执行验证时，也要显式写明“本轮无可执行验证”。

### 4. Evaluator Phase

给 Evaluator 的输入至少包含：

- 任务目标
- 实际产出
- `verification-report.md`
- rubric
- 当前 iteration
- `hard_pass_criteria`
- `soft_pass_criteria`
- `workspace/iteration-N/evaluator-report.md`

如果目标对象是 skill 本身，再额外给出：

- 允许修改的文件范围
- 需要重点检查的一致性对象（例如 `SKILL.md` 与 `agents/`）

### 5. Loop Decision

只允许做这三个判断：

- `PASS`：达标，停止
- `CONTINUE`：未达标，但继续改进有明确收益
- `STOP`：继续也不值得，或受预算 / 边界限制

## 反馈生成

当决策为 `CONTINUE` 时，只给下一轮 1-3 个重点：

```md
## Loop Feedback

### 当前未通过的关键点
- <问题 + 证据>

### 下一轮优先级
1. <最高优先级改进>
2. <第二优先级改进>
3. <第三优先级改进>

### 禁止事项
- <已证明无效或超出边界的动作>
```

不要把 evaluator 的整份报告原样塞给下一轮 Generator。你要先压缩成可执行反馈。
也不要把 verifier 的原始日志整段塞给下一轮；只保留“哪道门没过、证据是什么、下一轮该补什么”。
反馈保存到 `workspace/iteration-N/loop-feedback.md`。

## 停止判断

满足任一条件即可停止：

- 所有硬门槛已满足
- 必跑验证已通过
- 没有高优先级缺陷阻塞交付
- 关键维度没有跌破 floor
- 总分达到目标，或在 waiver window 内且已明确记录 waiver
- 继续迭代的收益已经低于成本
- 达到 `max_iterations`
- 命中用户边界或环境约束

如果任何一条硬门槛失败，Evaluator 即使主观倾向 `PASS`，也不能通过。
如果使用了 waiver，必须在最终决策里记录原因、未修项和放行依据。

## 最终输出

最终至少汇总：

- 任务与 mode
- 迭代次数
- 最终决策
- 最终 pass policy 如何被满足
- 是否使用 waiver；若使用，理由是什么
- 每轮评分或结论变化
- 最终产出位置
- 剩余风险

推荐直接按这个 schema 写 `final-report.md`：

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

如果这轮是在优化 skill 本身，额外汇总：

- 哪些字段或术语被统一了
- 哪些过拟合内容被删掉了
- 哪些 residual risks 仍需要下一轮处理

如果要做可重复验证，优先复用 `evals/evals.json` 里的最小 prompts，而不是临时现编。
