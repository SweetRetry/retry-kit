# AI Agent System Prompt & HITL 实战指南

系统提示词（System Prompt）是 Agent 的操作准则。**核心信条：拒绝名牌式空洞声明；强制行动优于解释；确立搜索先行与人机协同仲裁纪律。**

---

## 核心指导与引导原则 (Guiding Principles)

### 原则 1：指令策略分区原则 (Role + Agency + Guardrails)
- **指导准则**：系统提示词不能仅停留在角色声明（“You are a coding agent”），必须显式划分为职责、行动权限（Agency）与安全红线（Guardrails）。
- **契约原型**：
  ```markdown
  You are an expert engineering agent operating in '${cwd}'.

  # Agency
  - USE YOUR TOOLS. Read files, search code, run commands, then respond.
  - Do NOT explain what you WOULD do or write hypothetical implementation plans. ACT and deliver real changes.
  - Search before reading: use `grep` first, then `read` ONLY the files you will inspect or change.
  - Available tools: ${toolNames.join(", ")}.

  # Guardrails
  - Keep changes minimal and focused. Do not refactor unrelated code or touch styling.
  - Search before creating: always reuse existing project patterns and utilities.
  - Never install new third-party dependencies without asking.
  ```

---

### 原则 2：行动优于解释原则 (Act, Don't Explain)
- **指导准则**：大模型训练数据充满解答型对话，天然倾向于“向用户解释我打算怎么做”而非直接调工具。提示词必须使用强引导词明确禁止口头清谈，强制工具先行。

---

### 原则 3：搜索先行探索原则 (Search-First Exploration)
- **指导准则**：严禁“通读全库”式的漫无目的漫游。在处理未明确指定文件路径的任务时，必须严格执行：
  $$\text{1. 用 grep/正则搜索关键符号} \longrightarrow \text{2. 仅针对命中的目标文件调用 read 验证} \longrightarrow \text{3. 实施修改}$$
- **收益门槛**：实测显示该纪律可将探索阶段的步数从数十步压缩至 4 步以内，Token 开销压降 80%。

---

### 原则 4：模糊性仲裁三步走原则 (Search $\to$ Ask $\to$ Act)
- **指导准则**：模型在开发者语料中吸收了过度自信，面对模糊指令宁愿瞎猜也不愿提问。必须在提示词与工具层同时建立仲裁协议。
- **执行时序**：
  1. **Search first (代码事实优先)**：先用 grep/read 调研；若代码已有明确约定，按既有约定直接执行；
  2. **Ask second (结构化提问)**：代码无约定且涉及关键架构取舍时，调用 `askUser` 提出具备 2~4 个互斥选项的选择题；
  3. **Act third (即刻执行)**：用户选定后立即动手，不再拖延。
- **`askUser` 工具契约原型**：
  ```ts
  export function createAskUserTool() {
    return tool({
      description: `Ask the user a multiple-choice question when facing architectural trade-offs.
  WHEN TO USE: scoping ambiguous tasks after searching code yielded multiple valid implementations.
  WHEN NOT TO USE: you can find the answer in the codebase (search first!).
  DO NOT USE FOR: rhetorical chit-chat.`,
      inputSchema: z.object({
        question: z.string().describe("Specific question for the user"),
        options: z.array(z.string()).min(2).max(4).describe("2 to 4 mutually exclusive options"),
      }),
      execute: async ({ question, options }) => {
        const list = options.map((opt, i) => `${i + 1}. ${opt}`).join("\n");
        return `Asked user: "${question}"\nOptions:\n${list}\n(Awaiting user decision)`;
      },
    });
  }
  ```

---

### 原则 5：动态组装与项目上下文注入原则 (Dynamic Context & AGENTS.md)
- **指导准则**：提示词不应硬编码为纯静态文本，必须在 Harness 启动时动态感知当前工作路径、git 分支、沙盒类型与可用门禁命令，并自动拼接项目根目录下的 `AGENTS.md`，实现工程定制与通用套件的无缝结合。
