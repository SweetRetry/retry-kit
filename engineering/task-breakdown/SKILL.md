---
name: task-breakdown
description: >-
  基于已确认需求或契约，拆解为 docs/tasks/{taskfolder}/** 任务文档包。支持长任务上下文基座、子任务自含上下文、务实批判性审查(Critical Review)、Git Worktree 隔离、预算熔断、变更记录与历史包袱留档。仅供用户显式调用。
disable-model-invocation: true
---

# Task Breakdown

把已讨论好的需求、RFC 或接口契约，拆解为结构化、可独立执行、且适合多 Agent 协作的工程任务文档（保存在 `docs/tasks/{taskfolder}/**`）。

## 1. 核心原则 (Core Principles)

- **总览必须写清业务上下文与规则 (Context in Overview)**：
  - 长任务容易遗忘背景或发生理解偏差，`00-overview.md` 不能只是空洞的任务清单；
  - 必须完整写清：业务现状与目标、核心实体与数据结构、绝对不能破坏的业务规则（Invariants）、流程时序图、统一术语表与关键技术决策（ADR）。
- **子任务必须自含“任务上下文” (Task Context in Subtasks)**：
  - 子任务切片绝不能只有干瘪的 Checklist，否则子 Agent 会陷入盲人摸象；
  - 每个 `0X-phase-*.md` 必须自含 **`## 任务上下文 (Task Context)`** 核心章节：
    1. **业务意图与具体场景 (Scenario & Intent)**：解决什么用户交互或数据流；
    2. **上游输入与前置契约 (Inputs & Upstream Contract)**：输入参数、依赖的上游产物与类型；
    3. **下游交付与消费方 (Outputs & Downstream Handoff)**：产出什么、暴露什么接口或文件、谁会消费；
    4. **参考实现与先例 (Reference Code Paths)**：现有代码库中哪个模块有类似写法的最佳典范（供 Agent 模仿）；
    5. **前置假设与约束 (Assumptions & Constraints)**。
- **务实的批判性审查 (Pragmatic Critical Review)**：
  - Reviewer 既不是“无脑点赞的走过场者”，也不是“吹毛求疵阻碍交付的杠精”，而是**客观务实的质量守门员**；
  - **严守 4 类硬红线 (BLOCKER)**：
    1. **排查作弊与偷懒**：检查测试 diff 是否偷改断言、降低判定条件、加 `.skip`，是否写死假数据（Hardcoded mock），是否用空 catch 吞异常；一经发现作弊，一票否决；
    2. **破坏核心规则**：代码是否违反了 `00-overview.md` 中白纸黑字的系统业务规则（Invariants）；
    3. **真实可达缺陷**：只针对真实可达的空指针、死锁、并发竞态卡关，不为虚无缥缈的极端理论假设阻塞进度；
    4. **审查老代码妥协**：严查 Agent 是否拿老代码当偷懒写垃圾代码的借口；
  - **务实支持快速交付**：
    - 普通代码坏味道、代码风格差异或微小优化，**一律作为建议记入 `issues.md`，直接给 `PASS` 放行**，绝不无端阻塞开发流水线；
    - 打回时必须给出明确的“最小修复建议”，建设性协同。
- **变更只追加记录，不覆盖旧文档 (`changes.md`)**：
  - 开发过程中发生需求调整、接口修改或方案变轨时，**严禁直接修改原有文档假装没变过**；
  - 所有变动追加记录到 `changes.md`，写清“旧要求 $\to$ 新要求”、为什么改、改了哪些文件以及由谁确认，确保历史可追溯。
- **开发中途修改契约的同步流程 (Contract Changes during Development)**：
  - 若在多任务并行中途必须修改公共接口或类型：
    1. 暂停所有并行的子 Agent；
    2. 在主干分支提交新的契约代码并打 Git Tag；
    3. 对所有正在开发的 Worktree 分支执行 `git rebase` 对齐最新契约；
    4. 在 `changes.md` 记录变更，然后再恢复并行开发。严禁子 Agent 局部私自改动公共契约。
- **使用 Git Worktree 隔离并行开发 (Git Worktree Isolation)**：
  - 每个并行的子任务分配独立的 `git worktree`（或 `Workspace: 'share'` 模式）；
  - 独立物理目录作业，避免多个 Agent 争抢同一个 Git 仓库导致 `.git/index.lock` 冲突或文件覆盖；开发完成后 `git worktree remove` 一键清理。
- **限制子 Agent 轮次与重试，防止死循环 (Agent Limits & Circuit Breaker)**：
  - 每个子任务明确限制工具调用轮次（如 ≤ 12 轮），防止 Agent 在复杂代码中无限游走；
  - 单测修复连续失败 2 次，**立即停止盲目重试**，将任务标记为 `Blocked` 并退出，交由主控或人工排查。
- **防止 Agent 篡改测试用例 (Test Protection)**：
  - 核心验收测试对子 Agent 设为只读（Read-Only）；
  - 严禁 Agent 偷改已有测试断言，Reviewer 必查测试 diff。
- **遇到历史包袱时，拒绝盲目妥协 (Handling Legacy Code)**：
  - Agent 在实现功能时撞上老代码的坏味道，必须按三步处理，拒绝默认全盘迁就：
    1. **顺手重构 (Boy Scout Rule)**：改动小、风险低时，顺手改好；
    2. **防腐隔离 (Anti-Corruption Layer)**：老代码改不动时，封装一层干净接口，新代码不模仿脏逻辑；
    3. **受控妥协 (Compromise with Record)**：确实没办法时才写 workaround，必须记录到 `legacy-burdens.md` 并附还款计划。
- **单任务 = 原子 Commit / 小 PR (Small Batches)**：
  - 每个子任务完成后必须通过单测并提交独立的原子 Commit（≤ 4 个文件，≤ 300 行）。
- **微观异步推进，宏观屏障拦截 (Micro-Async with Wave Barrier Gate)**：
  - **切片内不阻塞**：单测通过后直接 commit 往下走，Reviewer 在后台异步只读该 Commit 快照进行审查；
  - **跨波次强卡关**：上游波次向下一波次流转或合并回主干前，必须在 Wave Barrier 集中核验审查看板；若存在 `BLOCKER`，强制阻断进入下一阶段，防止脏状态级联雪崩。
- **保存断点状态，方便中断后继续 (Pipeline Checkpoint & Resume)**：
  - 在 `00-overview.md` 末尾记录当前运行状态（当前波次、活跃 Worktree、下一步恢复指令），中断后新 Agent 秒级接手。

## 2. 目录规范 (File Structure)

生成的任务文档存放在项目的 `docs/tasks/{taskfolder}/` 目录下（目录名使用 kebab-case，如 `cart-refactor`）。

标准任务包包含 5 个核心文档（模板见 [references/templates.md](references/templates.md)）：

1. **`00-overview.md`（任务总览与上下文基座）**：
   - 业务现状、痛点与目标态对比；
   - 核心实体与系统业务规则（Invariants）；
   - 端到端核心时序图（Mermaid）；
   - 统一术语表（Glossary）；
   - 架构决策与选型权衡（Mini-ADRs）；
   - 波次依赖拓扑图、子 Agent 预算表、当前断点快照（Checkpoint）与全局完成定义（DoD）。
2. **`01-phase-{slug}.md`, `02-phase-{slug}.md`...（分阶段子任务）**：
    - 🤖 **紧凑派发提示词**（含工具轮次上限与重试熔断配置）；
    - 🔍 **务实批判的 Reviewer 提示词**（严查作弊与硬规则，普通建议挂单放行）；
    - 🧭 **任务上下文 (Task Context)**：业务场景、上游输入、下游消费方、参考代码路径；
    - 独占写入路径与只读测试路径；
    - Worktree 路径与分支名；
    - 执行步骤清单与自动化测试验证命令；
    - 局部暂存区（暂存过程中发现的问题与老代码包袱）。
3. **`issues.md`（未决问题清单）**：
    - 需求未明确的边界问题、外部依赖故障、Review 提出的建议。
4. **`legacy-burdens.md`（历史包袱发现与处置记录）**：
   - 记录 Agent 为了达成目标撞上的老代码包袱；
   - 记录：目标、老代码问题、Agent 打算怎么妥协、最终裁决（顺手重构 / 防腐隔离 / 暂写 workaround）、后续治理建议。
5. **`changes.md`（需求与方案变更记录）**：
   - 记录开发中途发生的需求微调、接口变更与方案调整；
   - 记录：旧要求 $\to$ 新要求、为什么改、改动范围、受影响分支的 rebase 状态与确认人。

## 3. 拆分与执行流程 (Workflow)

### 步骤 1：梳理总览上下文与系统规则
- 提炼核心实体、时序流、不可破坏的业务规则（Invariants）与统一术语表，写入 `00-overview.md`；
- 规划子 Agent 的模型、轮次上限与重试熔断阈值。

### 步骤 2：按依赖关系划分批次 (Execution Waves)
- **Wave 0 (基础契约)**：定义公共接口、类型与核心验收测试（单 Agent 串行完成）；
- **Wave 1 (并行切片)**：互无依赖的功能模块，多个子 Agent 在独立 Worktree 并行开发；
- **Wave 2 (汇聚集成)**：合并分支，跑通端到端集成测试与全量回归；
- 在 Wave 1 与 Wave 2 之间设立检查点（Wave Barrier）。

### 步骤 3：编写子任务文档与任务上下文
- 为每个切片创建 `0X-phase-{slug}.md`；
- **充实任务上下文 (Task Context)**：写清上游谁调我、下游谁消费、代码参考哪里的最佳实践；
- 划分好文件读写范围，验收测试设为只读，写好验证命令、派发配置与务实批判性审查标准。

### 步骤 4：初始化账本文档
- 创建 `issues.md`、`legacy-burdens.md` 和 `changes.md`；在总览中记录初始断点（Checkpoint）。

### 步骤 5：隔离开发、过程管控与现场包袱拦截
- 在独立 Worktree 中派发 Agent 执行，控制在轮次预算内；
- 单测修复连续失败 2 次立即停止并挂单；
- 遇到老代码包袱，先评估能否顺手重构或防腐隔离，不准直接写脏补丁；
- 中途改契约时，先暂停并行，主干更新后通过 `git rebase` 同步各分支，并在 `changes.md` 留痕。

### 步骤 6：务实批判的异步 Review 与收敛合并
- 单测通过后生成 Commit，主流程继续推进；
- **Reviewer** 在后台客观审查 Commit（严查测试作弊、核对核心 Invariants、排查真实 bug，普通建议挂单入 issues.md 放行）；
- 波次结束时集中核验 Review 结果，清理 Worktrees，合并分支进入下一波次。

## 4. 纪律红线 (Prohibitions)

- **严禁写没有上下文的空洞子任务**：每个子任务必须交代清晰的业务场景、上下游依赖与参考代码路径。
- **严禁走过场式点赞，也严禁吹毛求疵阻碍交付**：Reviewer 必须客观严谨，既不无脑放过作弊与规则破坏，也不为假想的极端理论风险无端卡流程。
- **严禁带病跨越波次屏障**：在 Wave Barrier 处若存在未解决的 `BLOCKER`，严禁强行进入下一批次或合并到主干。
- **严禁直接覆盖旧文档**：需求或方案变更必须在 `changes.md` 记录，不准静默修改。
- **严禁篡改测试用例**：严禁私自修改已有测试断言、降低判定标准或给测试加 `.skip`。
- **严禁并发阶段安装新依赖**：Wave 1 并发开发期间禁止私自修改 `package.json` 或升级依赖。
- **严禁写空洞总览**：总览必须提供清晰的实体模型、业务规则与时序图。
- **严禁不设上限派发 Agent**：必须声明轮次上限与单测重试上限，防止死循环。
- **严禁滥用历史包袱借口**：遇到老代码必须先评估童子军重构或防腐层隔离，严禁未经审查直接写脏补丁甩锅。
- **严禁在同一目录内并发修改代码**：并发任务必须使用 Git Worktree 物理隔离。

## 5. 输出规范

初始化任务拆分完成时，向用户汇报：
1. 任务文档路径（`docs/tasks/{taskfolder}/`）；
2. 核心业务规则、实体抽象与时序简述；
3. 波次划分、Worktree 路径与子任务清单（含任务上下文与参考路径）；
4. 初始断点状态（Checkpoint）；
5. 准备启动的第一阶段（Wave 0 或 Wave 1）派发与 Review 配置。
