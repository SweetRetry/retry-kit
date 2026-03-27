# Deep Debug 外部对齐清单

> 用途：维护 `deep-debug` 时，先看这份文件，避免把经验性 debugging 建议写成无证据的硬规则。

## 1. 资料优先级

1. 当前仓库内可执行证据
2. `The Debugging Book`
3. GitHub / OpenAI 官方 agentic coding 与 evaluation 文档
4. 研究校准（如 Agentless）
5. 本 skill 的工程化归纳

结论规则：

- 根因结论必须以仓库内 evidence 为准
- 调试顺序与方法论，优先看 `The Debugging Book`
- agent 工作方式与验证口径，优先看官方文档
- 研究论文只用于校准策略，不反向覆盖仓库内事实

---

## 2. 维护时必须复核的页面

调试方法论：

- `https://www.debuggingbook.org/beta/Intro_Debugging.html`
- `https://www.debuggingbook.org/html/Assertions.html`
- `https://www.debuggingbook.org/html/DeltaDebugger.html`

Agent 实践：

- `https://docs.github.com/en/copilot/using-github-copilot/using-copilot-coding-agent-to-work-on-tasks/best-practices-for-using-copilot-to-work-on-tasks`
- `https://docs.github.com/copilot/how-tos/copilot-cli/cli-best-practices`
- `https://developers.openai.com/api/docs/guides/evaluation-best-practices`

研究校准：

- `https://arxiv.org/abs/2407.01489`

---

## 3. 最容易漂移的知识点

每次更新这个 skill，都要优先复核：

1. `symptom contract` 是否仍然是启动前置条件
2. `hypothesis -> prediction -> experiment -> result` 链路是否还完整
3. root cause 是否仍然要求解释 `incorrectness + causality`
4. 是否仍然强调 failure reduction / minimal repro
5. 是否仍然把 verification 对准原始症状和 blast radius
6. 是否把 vendor 文档里的经验建议写成了绝对规则

---

## 4. 修改前先问自己

- 这条说法是外部来源直接支持的，还是我自己的工程归纳？
- 这句话是不是把“优先 / 默认”写成了“必须 / 永远”？
- 我写的是调试方法，还是已经越权成具体技术栈建议？
- 这个 skill 是在帮助 agent 找证据，还是只是在写看起来正确的术语？

---

## 5. 允许写入的工程化归纳

可以写，但要克制：

- “优先稳定复现”
- “默认先做 localization”
- “更稳妥的顺序”
- “当 symptom 不稳定时”

不要写成：

- “只能”
- “必须永远”
- “官方要求每次都这样”

除非你真的能在外部来源里找到强约束。

---

## 6. 维护动作清单

每次更新这个 skill，至少做：

1. 重新核对上面的核心页面
2. 搜索文档里是否残留：
   - 无证据的绝对化措辞
   - 没有 experiment 的 hypothesis
   - 只有“修法”没有“根因与证据”的段落
3. 检查 references 与主 `SKILL.md` 是否互相矛盾
4. 若新增“最佳实践”，标明它属于：
   - 调试方法论直接支持
   - 官方 agent 文档支持
   - 本 skill 的工程化归纳
