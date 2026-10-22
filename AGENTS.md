# 仓库结构

- `skills/<领域>/<skill>/`：可单独安装的 skill。下文「Skill 独立」与「Skill 反馈闭环」只约束这里。
- `design/`：Retry 个人设计语言，不是 skill。`DESIGN.md` 只记决策，值与资源放 `brand-kit/`。修改颜色、字号等取值时改 `brand-kit/tokens.json`，再运行 `python3 design/brand-kit/generate-globals.py` 重新生成 `globals.css`，不手改生成物。
- `guidelines/`：技术选型与工程约定，不是 skill。每篇写清选什么与适用边界，同一能力只留一个方案；视觉取值归 `design/`，不在这里重复。
- skill 内不引用 `design/` 与 `guidelines/`：skill 单独安装后看不到它们。

# 指令设计

只保留会改变模型决策的指令；删除默认行为、重复语义、可由环境直接查得的事实和非必要示例。

# Skill 独立

每个 skill 单独安装、单独触发，description、正文与 reference 都不提及其他 skill。需要另一项能力的步骤时，把用到的部分写进本 skill；划定范围时只写排除的任务，不写交给谁。

# Commit 约定

提交信息使用 Conventional Commits 英文格式，`<type>(<scope>): <subject>`，type 取 feat / fix / docs / refactor / perf / test / build / ci / chore / style / revert。scope 取 skill 名、`design`、`guidelines` 或 `repo`；subject 小写开头、祈使句、不超过 72 字符、不加句号；正文与 subject 之间空一行，每行不超过 100 字符。`sweet-mode：动效规则独立为 motion.md` 这类中文提交会被 `.githooks/commit-msg` 拒绝。

每个新 clone 执行一次 `git config core.hooksPath .githooks`。

`.githooks/pre-commit` 对暂存的 Markdown 运行 markdownlint-cli2（规则见 `.markdownlint-cli2.jsonc`），并拒绝超过 500 行的 `SKILL.md`；超出的细节移入 reference 文件。

# Skill 反馈闭环

用户修正 skill 输出时，先判断反馈是否揭示可复用的决策缺口：当次素材、审美或交付偏好只用于修正当前输出；可复用缺口同时进入以下 loop：

1. **定位**：找到产生问题的决策步骤及其现有判断依据。
2. **抽象**：把可复用反馈改写为判断原则、决策顺序或质量门槛；不得把当次案例的题材、角色、时长或数量直接固化为通用规则。
3. **对齐**：抽象方向存在多种解释时，先用一句话向用户复述核心再写入；用户已明确确认时直接执行。
4. **回写**：把原则放到对应 `SKILL.md` 的真实决策点，使用最小改动，避免新建重复章节，保留工作树中无关改动。
5. **验证**：使用已有校验器检查改动；行为规则变更时，用触发反馈的原始任务和一个无关任务做决策级检查，前者必须改变错误决策，后者不得复制本次答案。仅在验收需要时运行完整任务。
6. **再迭代**：验证仍暴露同一决策缺口时，回到“定位”；同一思路失败两次即停止该修补思路并说明卡点；继续可独立完成的当前输出，不绕过批准或重复无增量尝试。
