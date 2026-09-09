# AI Agent Verification & Scoped Claims 实战指南

大模型不会恶意欺骗，但在“讨好用户”的预训练驱动下，容易对测试失败视而不见。**核心信条：毫秒级先错先停；Scoped Claims 诚信声明契约；Todo 单在办任务硬约束。**

---

## 核心指导与引导原则 (Guiding Principles)

### 原则 1：毫秒级先错先停门禁原则 (Millisecond-First Gate Sequence)
- **指导准则**：门禁命令必须严格按照**报错反馈耗时由快到慢**递进执行，禁止一上来就运行耗时数分钟的完整构建打包。
- **执行顺规**：
  $$\text{1. Typecheck (150ms 暴露语法与类型接口错误)} \longrightarrow \text{2. Lint (规范检测)} \longrightarrow \text{3. Test (功能回归)} \longrightarrow \text{4. Build (全量构建)}$$
- **动态探测契约原型**：
  ```ts
  export async function discoverGates(sandbox: Sandbox): Promise<string[]> {
    const raw = await sandbox.readFile("package.json").catch(() => "{}");
    const scripts = JSON.parse(raw).scripts || {};
    const gates: string[] = [];

    // 1. 类型检查置顶 (先错先停)
    if (scripts.typecheck || scripts["type-check"]) gates.push("npm run typecheck");
    else gates.push("npx tsc --noEmit");

    // 2. 静态规范
    if (scripts.lint) gates.push("npm run lint");
    // 3. 单元测试
    if (scripts.test) gates.push("npm test");
    // 4. 全量打包
    if (scripts.build) gates.push("npm run build");

    return gates;
  }
  ```

---

### 原则 2：Scoped Claims 诚信声明原则 (The Scoped Claims Contract)
- **指导准则**：严禁在存在失败或未运行测试时宣称“全部通过”。模型必须严格将汇报拆分为“本次改动范围”与“历史既有缺陷”两部分。
- **契约规范**：
  ```markdown
  # Verification & Scoped Claims Policy
  When reporting results, you MUST follow this template:
  1. Commands Executed: List exact commands run and exit codes.
  2. Scoped Attribution:
     - New Changes: Explicitly confirm whether your modifications passed typecheck and tests.
     - Pre-existing Failures: If any tests fail, inspect git diff / failure traces to determine if they were already present before your changes.
  3. Prohibition: NEVER report "all tests pass" if any gate threw errors or if you did not execute the gate.
  ```
- **合格交付示例**：
  > 1. 执行 `npx tsc --noEmit`：0 错误，类型检查完全通过。  
  > 2. 执行 `npm test`：共 50 个用例，48 个通过，2 个失败。  
  > 3. **归因说明**：本次修改针对 `src/auth.ts`，对应的 `tests/auth.test.ts` 全部通过；失败的 2 个测试位于 `tests/billing.test.ts`，属于既有存量缺陷，与本次改动无关。

---

### 原则 3：单在办任务硬约束原则 (Single-Active-Item Constraint)
- **指导准则**：在多步复杂工程中，模型容易将多个子任务同时标记为 `in_progress` 导致注意力涣散。Todo 工具在底层**强制施加只能有 1 个任务在办的硬约束**。
- **契约原型**：
  ```ts
  export function createTodoTool(onUpdate?: (todos: any[]) => void) {
    let todos: any[] = [];

    return tool({
      description: `Track task progress. WHEN TO USE: tasks with 3+ steps.`,
      inputSchema: z.object({
        todos: z.array(z.object({
          id: z.string(),
          title: z.string(),
          status: z.enum(["pending", "in_progress", "completed"]),
        })),
      }),
      execute: async ({ todos: newTodos }) => {
        // 核心硬门禁：单在办任务约束（Single-Active-Item Constraint）
        const activeCount = newTodos.filter(t => t.status === "in_progress").length;
        if (activeCount > 1) {
          return "ERROR: 任何时刻最多只能有 1 个任务处于 'in_progress' 状态！请专心做好眼前这一件事，先把上一个任务结案（completed）或挂起（pending）。";
        }

        todos = newTodos;
        onUpdate?.(todos);
        const board = todos.map(t => `[${t.status === "completed" ? "x" : t.status === "in_progress" ? ">" : " "}] ${t.title}`).join("\n");
        return `Current Task Board:\n${board}`;
      },
    });
  }
  ```
