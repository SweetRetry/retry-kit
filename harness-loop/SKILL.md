---
name: harness-loop
description: >
  用于指导 Codex / Claude Code 在长程开发任务里围绕单一目标持续 build -> verify -> evaluate -> iterate，
  直到应用、功能或原型真正达到可交付状态。核心对齐 Anthropic 2026-03-24 的
  Harness design for long-running application development：先冻结完成标准，用有边界的 sprint 推进，
  分离 generator 与 evaluator，优先可执行验证，并在任务过长时使用 structured handoff。
  它是工作方法 skill，不是 runtime/controller 规范，不要求固定 artifact 目录、评分模板或文件树。
---

# Harness Loop

## 定位

这个 skill 只回答一件事：

- 当目标很大、实现时间很长、且 agent 容易半路跑偏时，Codex / Claude Code 应该如何持续朝目标推进，直到真的完成。

它不是：

- 某个垂直领域的专业知识 skill
- 固定的 harness runtime 说明书
- 强制要求 `.harness-workspace/`、`goal-contract.md`、量化打分表的协议集合

如果一个任务可以一次完成，就不要启这个 skill。它只适合“长程、容易漂移、需要反复验证”的任务。

## 为什么需要它

对齐 Anthropic 文章，这个 skill 主要解决两个根因：

1. 长任务容易失去 coherence。
   同一个 agent 连续工作太久后，容易 scope 漂移、提前收尾、忽略旧约束，或者因为上下文越来越脏而做出错误判断。
2. agent 不擅长给自己的结果做严格评审。
   让生成者自己判断“是不是已经够好了”，通常会过度乐观，尤其在“看起来像完成了”的任务里。

因此，这个 skill 的核心不是“多角色本身”，而是下面这些不变量。

## 核心不变量

### 1. 先冻结 finish line，再开始写

开始实现前，先明确：

- `goal`：最终要交付什么
- `scope`：这次允许做什么，不做什么
- `hard acceptance`：必须满足的完成条件
- `verification plan`：用什么方式证明已完成
- `budget`：大概允许跑几轮，或在什么条件下停止

这些内容可以是一段短 note，不要求固定文件名；关键是它们要在本轮开始前被说清楚。

### 2. 用有边界的 sprint 推进

不要直接把“做完整个应用”交给一次生成。把它拆成能被检查的小步：

- 当前这一轮只解决 1 到 3 个问题
- 当前这一轮结束时，必须能验证 done / not done
- 当前这一轮不要偷偷扩 scope

文章里强调 “one feature at a time” 和 sprint contract，本 skill 保留这个思想，但不把它固化成某个固定模板。

### 3. 生成和评审必须分离

`generator` 负责产出，`evaluator` 负责挑错。不要让生成者在同一个思维状态里给自己判 `PASS`。

如果能用 subagent，就分开。
如果不能用 subagent，也要显式切换角色：

- 先完成实现
- 再基于实际产物和验证结果重读一遍
- 只按证据评审，不按“我记得我做过”评审

### 4. 优先真实验证，不信口头完成

验证优先级：

1. 自动化测试
2. 构建 / lint / typecheck / 项目定义的检查
3. 页面交互或 CLI 流程验证
4. 文件或接口契约检查
5. 人工可核对证据

只要存在可执行验证能力，就不要直接根据自述放行。

### 5. 任务过长时，使用 handoff / reset

当上下文开始变脏，或者任务已经长到当前会话不再可靠时，不要硬撑着继续。

改用 structured handoff，把下面这些状态交给下一轮：

- 当前目标和 hard acceptance
- 已完成什么
- 哪些验证通过了，哪些没过
- 当前阻塞点是什么
- 下一轮只该做什么

这里的重点是“结构化交接”，不是固定目录结构。

## 何时使用

优先用于：

- 用户明确要求“持续迭代直到达标”
- 要做完整应用、小游戏、全流程功能、可运行 demo
- 初稿可以很快做出来，但真正完成需要多轮修正
- 需要把实现、验证、评审拆开，避免 agent 自我感觉良好
- 任务长到一轮上下文很难稳定覆盖全部约束

不要用于：

- 简单单文件修改
- 纯知识问答
- 只需要给建议，不需要落地产出
- 目标边界明显没对齐的任务

## 最小启动条件

在开跑前，Loop Controller 至少要回答：

- 我们到底要交付什么？
- 什么算真正完成？
- 这次明确不做什么？
- 怎么验证它不是“看起来像完成”？
- 如果当前方向不工作，下一轮怎么收敛，而不是无限重试？

如果这些问题的答案会显著改变做法，就先补最小澄清，不要直接开写。

## 标准循环

### Step 1. 冻结本轮目标

先写清楚本轮 finish line。最小可以只有 5 项：

- `goal`
- `scope`
- `out_of_scope`
- `hard_acceptance`
- `verification_plan`

如果用户 prompt 已经很清楚，就保持简短；不要为了“工程化”硬写长 spec。

### Step 2. 需要时才做轻量 planning

当用户只说“做个贪吃蛇小游戏”“做个任务管理器”这种高层目标时，先补一个轻量 plan：

- 最终交付物是什么
- 分几轮推进
- 每轮结束时如何验证
- 哪些功能这次先不做

Planner 要高层、可执行、不过度指定技术细节。文章里的 planner 也是把短 prompt 扩成可推进的 spec，而不是提前写死所有实现。

### Step 3. 选择当前 sprint

当前 sprint 只做最重要的下一步。一个好 sprint 应该：

- 边界明确
- 能独立验证
- 对最终目标有直接贡献

如果一个 sprint 做完后仍然无法判断是否前进了，那说明它太大或太模糊。

### Step 4. Generator 实现当前 sprint

Generator 的要求：

- 只解决当前 sprint 承诺的问题
- 落地产物，不给空口承诺
- 为后续验证留入口
- 不偷改 finish line

生成阶段结束时，应该已经能回答：

- 具体改了什么
- 产物在哪里
- 哪些地方仍然未完成或有风险

### Step 5. Verifier 跑证据

Verifier 不负责“整体评价”，只负责证明：

- 哪些检查确实通过了
- 哪些检查失败了
- 哪些检查没有跑，以及为什么

如果任务本质上可测试，就跑测试。
如果任务本质上是 UI / 流程，就跑交互验证。
如果这轮没有任何可执行验证，也要显式记录这是一个风险。

### Step 6. Evaluator 做独立评审

Evaluator 基于三样东西做判断：

- 目标
- 实际产物
- 验证结果

它要回答的是：

- 现在是否已经满足 hard acceptance
- 是否还存在 blocking issue
- 下一轮最值钱的改进是什么

Evaluator 不负责补实现，也不应该因为“这轮努力很多”就降低标准。

### Step 7. 决策：PASS / CONTINUE / HANDOFF / STOP

推荐决策含义：

- `PASS`：hard acceptance 满足，必跑验证通过，没有阻塞问题
- `CONTINUE`：离目标更近了，但还没完成；下一轮该做什么已经清楚
- `HANDOFF`：任务本身应继续，但当前上下文已不适合继续，需要结构化交接后再开新轮
- `STOP`：预算、边界或环境限制使继续推进不再合理；必须把未完成事实说清楚

不要为了“看起来在推进”而无限 `CONTINUE`。每一轮都要能解释，为什么继续是值得的。

## 心智分工

这个 skill 不需要 `agents/` 目录来承载角色文件；下面这些只是工作时的心智分工。

- `Loop Controller`
  守住目标、边界、停止条件，决定当前该开哪一轮。
- `Planner`
  仅在目标过于模糊时，把它压缩成可执行的 plan。
- `Generator`
  实现当前 sprint，不自评。
- `Verifier`
  跑可执行验证，把“感觉完成”变成“哪些检查过了”。
- `Evaluator`
  独立判断是否已达标，以及下一轮优先级。

最低要求只有一条：

- `generator` 和 `evaluator` 不要是同一个未经隔离的思维动作。

## 对 Codex / Claude Code 的使用建议

如果可以启 subagent：

- 用 `planner` 扩规格
- 用 `generator` 实现
- 用 `verifier` 跑检查
- 用 `evaluator` 做独立评审

如果不能启 subagent：

- 主 agent 先以 generator 身份完成本轮
- 写一段短 handoff note
- 清空“我已经做过什么”的主观预期
- 再以 verifier / evaluator 身份只读产物和证据做判断

关键不是角色数量，也不是有没有单独的角色文件，而是避免“边写边给自己过审”。

## 最小 handoff 建议

不要求固定路径，但 handoff 至少要带上：

- 当前目标和 hard acceptance
- 当前代码 / 产物状态
- 已跑过的验证及结果
- 当前 blocker
- 下一轮只做什么

下一轮要能在不依赖旧上下文记忆的情况下继续推进。

## 停止原则

默认只有在下面这些条件同时成立时才应 `PASS`：

- hard acceptance 全部满足
- 本轮承诺的关键验证已通过
- 不存在已知 blocking issue
- 剩余问题只是非阻塞的 polish，且继续迭代的边际收益已经很低

如果做不到 `PASS`，就诚实地给 `CONTINUE`、`HANDOFF` 或 `STOP`，不要把“还差一点”包装成完成。

## 贪吃蛇示例

如果目标是“做一个贪吃蛇小游戏”，一个合理的 harness loop 可能这样启动：

- `goal`：交付一个本地可运行的贪吃蛇小游戏
- `hard acceptance`：
  - 方向键控制移动
  - 吃到食物会增长并加分
  - 撞墙或撞自己会 game over
  - 可以 restart
  - 本地启动成功，核心流程已验证
- `out_of_scope`：
  - 排行榜
  - 皮肤系统
  - 移动端适配

然后按 sprint 推进：

1. 先做可玩的核心 loop，并验证能移动、刷新、吃食物
2. 再补 collision、game over、restart，并验证完整流程
3. 最后补 UI polish 和回归检查，确认没有把核心玩法改坏

如果第二轮后上下文已经很脏，就写 handoff，再开下一轮，而不是在同一会话里越改越乱。

## 常见反模式

- 没有 finish line 就直接开写
- 一轮里同时做太多事，最后无法验证
- generator 自己宣称“差不多完成”
- 有测试能力却不跑测试
- 把固定 artifact 模板误当成 harness 的本质
- 任务已经明显失控，却不 handoff / reset
- 为了迭代而迭代，没有明确的下一轮价值

## 一句话原则

把大任务拆成可验证的小 sprint，让产出者和评审者分离，用真实证据决定是否继续，而不是让 agent 靠记忆和自信一路写到失真。
