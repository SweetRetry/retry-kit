# Agent 调试实践基线

> 用途：把当前可公开引用的 agentic coding / evaluation 实践，转译成 `deep-debug` 的工作约束。

## 1. 权威 / 高可信来源

官方文档：

- GitHub Copilot coding agent best practices
- GitHub Copilot CLI best practices
- OpenAI evaluation best practices

研究校准：

- Agentless（software engineering agents / bug-fixing）

核心页面：

- `https://docs.github.com/en/copilot/using-github-copilot/using-copilot-coding-agent-to-work-on-tasks/best-practices-for-using-copilot-to-work-on-tasks`
- `https://docs.github.com/copilot/how-tos/copilot-cli/cli-best-practices`
- `https://developers.openai.com/api/docs/guides/evaluation-best-practices`
- `https://arxiv.org/abs/2407.01489`

---

## 2. 这些来源支持的 agent 调试原则

### 2.1 把问题切成 well-scoped debugging task

GitHub 文档反复强调：任务越清晰、上下文越具体，agent 成功率越高。

对 `deep-debug` 的含义：

- 不要把“整个系统最近有点怪”直接丢给 agent
- 先压缩成：
  - 具体 symptom
  - 最小 repro
  - 明确环境
  - 明确验证方式

这也是为什么 skill 要先冻结 `symptom contract`。

### 2.2 focused session 比长对话里持续漂移更可靠

GitHub CLI best practices 明确建议保持 focused sessions，并在需要时回看日志 / session history。

对 `deep-debug` 的含义：

- 一次调试只追一个主症状
- 当理论已经被证据推翻，不要在同一条思路上越补越乱
- 如果上下文已经污染，就重新建立当前结论和证据台账

### 2.3 agent 不是靠“更复杂”自动变强

OpenAI evaluation best practices 的核心是：让评估贴近真实使用，包括工具调用与副作用；不要用不反映真实任务的轻飘指标骗自己。

Agentless 这类 bug-fixing 研究也显示：先把 localization、repair、validation 做清楚，往往比盲目堆更复杂的 agent loop 更稳。

对 `deep-debug` 的含义：

- 先把定位、实验、验证协议做扎实
- 不默认引入多 agent / 复杂 orchestration
- 如果问题还没 localized，就不要急着 patch

### 2.4 输出必须可验证，而不是只看解释是否“像那么回事”

官方 evaluation 文档强调 functional correctness、tool use、side effects、error handling 都应进入评估。

对 `deep-debug` 的含义：

- 验证里要写清命令、路径、日志、断言
- “看起来合理”不算通过
- 修复后的副作用和回归面也要进入验证

---

## 3. 转译成 `deep-debug` 的执行约束

### 3.1 先做 localization，再做 patch generation

最少要定位到：

- 哪个模块 / 文件 / 状态边界最可疑
- 为什么它比其他位置更可疑
- 下一步观察点在哪里

如果这些都还没有，不要进入编辑阶段。

### 3.2 每轮只推进一个 blocking uncertainty

调试卡住时，不要同时追五个方向。更稳的动作是：

1. 列出当前最大不确定点
2. 设计一个能排除最多 hypothesis 的实验
3. 执行后重排

### 3.3 verification 要覆盖原始问题和相邻 blast radius

至少写清：

- 原始 repro 怎么验证通过
- 哪些最近邻路径值得顺手复核
- 有没有补 test / assertion / guard

### 3.4 session 漂移时，回到证据台账

当调试回合变长时，优先复核：

- 当前确认过的事实
- 被排除的 hypothesis
- 还没解决的唯一核心问题

不要用更长的解释掩盖更弱的证据。

---

## 4. 不要写成官方定论的地方

- GitHub / OpenAI 文档支持“任务聚焦、验证真实、上下文具体”，不支持某个固定调试模板永远最优
- Agentless 之类研究支持“先定位后修复更稳”，不支持“永远不该用 agent loop”

因此这份 skill 中凡是流程化建议，都应写成：

- “优先”
- “默认”
- “更稳妥”
- “当上下文复杂时”

不要写成：

- “官方规定必须这么调”
- “这就是唯一正确的 agent 调试法”

---

## 5. 维护时要复核的点

1. skill 是否仍然强调 well-scoped symptom，而不是宽泛求助
2. 是否仍然要求 localization 先于 patch
3. 是否仍然要求验证覆盖真实副作用，而不是只看编译
4. 是否不小心把研究结论写成了官方 API 事实
