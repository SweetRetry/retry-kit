# AI Agent Tool Contracts & Design 实战指南

工具描述（Description）不是写给人看的 API 文档，而是**直接参与模型推断路由的 Prompt**。工具的返回值不是随便打印的日志，而是**下一轮模型决策的上下文输入**。

---

## 核心指导与引导原则 (Guiding Principles)

### 原则 1：双重否定对抗万能工具引力 (Fighting Bash Gravity via Doubled-Up Negatives)
- **指导准则**：万能通用工具（如 `bash`）对模型具有本能的退化引力（Bash Gravity）。在面临稍微模糊的任务时，模型倾向于跳过专用工具（`read`/`grep`），直接在终端里用 `cat`、`find` 甚至 `sed`。
- **决策约束**：必须在工具描述中同时声明**软重定向（WHEN NOT TO USE）**与**硬边界（DO NOT USE FOR）**。在模型实测中，单写软建议会被忽略，双重否定才能形成确定性的阻断。

---

### 原则 2：五段式描述契约标准 (The 5-Section Contract)
- **指导准则**：进入 Harness 的每个工具必须严格具备 5 个结构块，消除路由歧义。
- **契约原型**：
  ```ts
  const grep = tool({
    description: `Search file contents using regular expressions. Returns matching lines with file paths.

  WHEN TO USE:
    - Finding patterns across multiple files (e.g. function definitions, imports, TODOs, error messages).
    - Locating where a symbol is referenced across the project.

  WHEN NOT TO USE:
    - Reading the full contents of a known file (use read instead).
    - Running terminal scripts or system commands (use bash instead).

  DO NOT USE FOR:
    - Reading files (use read).
    - Listing directories (use bash).
    - Modifying code (use edit).

  USAGE:
    - pattern: standard regex string.
    - glob: file filter pattern (e.g. "*.ts").
    - Output is capped at 50 matches to protect context.

  EXAMPLES:
    - Find TODOs: pattern "TODO" glob "*.ts"
    - Find function: pattern "function handleLogin" glob "src/**/*.ts"`,
    inputSchema: z.object({ /* ... */ }),
    execute: async ({ /* ... */ }) => { /* ... */ },
  });
  ```

---

### 原则 3：错误指令化原则 (Instructions over Error Codes)
- **指导准则**：Tool Result 本质是给大模型下一轮做决策的 Prompt 输入。模型面对异常时，需要的不是技术堆栈或裸数字码，而是**明确的自然语言行动指引（Actionable Hint）**。
- **决策边界**：工具执行失败严禁返回 `404`、`500` 或空字符串，必须指出失败根因并提供建议尝试的下一步动作。
- **契约原型**：
  ```ts
  export function createActionableError(reason: string, nextAction: string): string {
    return JSON.stringify({
      status: "failed",
      error: reason,
      instruction: nextAction, // 模型读到本指令，下一轮会按指引纠错而非盲目重试
    });
  }

  // 示例：文件未找到时的错误契约
  if (!exists) {
    return createActionableError(
      `Path '${path}' does not exist.`,
      `请不要用完全相同的路径重复调用 read！请先使用 grep 搜索相关文件名，确认正确路径后再读取。`
    );
  }
  ```

---

### 原则 4：工具工厂与角色权限解耦原则 (Tool Factory Decoupling)
- **指导准则**：工具定义不应硬编码为全局单例，必须通过工厂函数组装，依据角色类型（如 Explorer 只读子代理 vs. Executor 执行子代理）实施物理级权限切断。
- **契约原型**：
  ```ts
  export interface ToolFactoryOptions {
    readOnly?: boolean;
    approvalPolicy?: (command: string) => Promise<boolean>;
  }

  export function createHarnessTools(sandbox: Sandbox, options: ToolFactoryOptions = {}) {
    const tools: Record<string, any> = {
      read: createReadTool(sandbox),
      grep: createGrepTool(sandbox),
    };

    // 针对只读子代理，物理切断写工具，彻底隔绝越权修改风险
    if (!options.readOnly) {
      tools.edit = createEditTool(sandbox);
      tools.write = createWriteTool(sandbox);
      tools.bash = createSafeBashTool(sandbox, options.approvalPolicy);
    }

    return tools;
  }
  ```
