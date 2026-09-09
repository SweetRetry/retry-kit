# AI Agent Subagent Delegation & Topology 实战指南

盲目增加 Agent 数量只会带来死循环踢皮球与账单暴涨。**核心信条：奥卡姆剃刀（工作流优于自主代理）；单代理三大死因隔离；Explorer 与 Executor 二元拓扑。**

---

## 核心指导与引导原则 (Guiding Principles)

### 原则 1：奥卡姆剃刀：工作流优于自主代理 (Simplicity First)
- **指导准则**：严禁无节制创建多 Agent 协作系统。凡是执行路径可预测、步骤依赖明确的工程，优先采用确定性代码工作流：
  1. **Prompt Chaining**：步骤固定时用普通的 async/await 链式调用；
  2. **Routing**：条件明确时走静态代码分类分支；
  3. **Parallelization**：多维度代码审查或测试生成时并行扇出，最后聚合；
  4. **Autonomous Agent Loop**：仅在探索空间完全开放、修改路径未知的长程任务中准入。

---

### 原则 2：单代理三大死因防御 (Defend Single-Agent Failure Modes)
- **指导准则**：在 30 步以上的复杂工程中，单代理必然暴露以下缺陷，必须通过子代理物理隔离解决：
  1. **Context Pollution（上下文污染）**：为了解系统读了 20 个文件，这些无关历史在后续修改时持续占用注意力，稀释核心目标；
  2. **Lost Focus（焦点漂移）**：中途被无关警告或代码格式吸引，顺手重构导致偏离主线任务；
  3. **Over-broad Capabilities（权限过宽）**：在探索阶段手握 `write` 与 `bash` 权限，误改公共代码。

---

### 原则 3：二元角色与模型分级拓扑 (Explorer vs. Executor Topology)
- **指导准则**：将长程任务拆分为“探索”与“执行”两个完全隔离的子代理，并按成本进行模型分级。
- **角色分工矩阵**：
  | 维度 | Parent (主控) | Explorer (探索者) | Executor (执行者) |
  | :--- | :--- | :--- | :--- |
  | **职责** | 状态机维护、任务派发、用户交互 | 跨文件检索、定位符号与定义 | 代码修改、重构、运行验证 |
  | **工具集** | `task`, `todo`, `askUser` | `read`, `grep` (物理切断写与执行) | `read`, `grep`, `edit`, `write`, `bash` |
  | **模型选型** | 旗舰模型 (Sonnet / Opus) | 廉价极速模型 (Haiku / Flash) | 高阶编程模型 (Sonnet / Pro) |
  | **生命周期** | 全局常驻 | 任务完结后**整个上下文物理销毁** | 独立干净沙盒，执行完即销毁 |

---

### 原则 4：父代只收结论不收过程原则 (Synthesized Outcome Only)
- **指导准则**：子代理探索产生的大量中间交互历史，严禁倒灌回父代上下文。Explorer 探索 20 个文件消耗的数万 tokens 随会话直接丢弃，仅向 Parent 回传提炼后的一两句核心结论，确保 Parent 上下文始终保持极度纯净。
- **`task` 工具路由原型**：
  ```ts
  export function createTaskTool(sandbox: Sandbox) {
    return tool({
      description: `Delegate an isolated subtask to a specialized subagent.
  WHEN TO USE:
    - Exploring code across multiple files (use role='explorer' to protect parent context from pollution).
    - Executing a concrete implementation task with clear instructions (use role='executor').
  WHEN NOT TO USE:
    - Simple 1-2 step lookups you can do directly.
    - Making architectural decisions (parent must do that).`,
      inputSchema: z.object({
        role: z.enum(["explorer", "executor"]),
        goal: z.string().describe("Clear, self-contained objective for the subagent"),
      }),
      execute: async ({ role, goal }) => {
        // 模型分级与工具权限物理隔离
        const model = role === "explorer" ? "anthropic/claude-haiku-4-5" : "anthropic/claude-sonnet-4-5";
        const tools = createHarnessTools(sandbox, { readOnly: role === "explorer" });

        // 独立沙盒执行，只回传结构化结论
        const result = await runIsolatedAgentLoop({ model, tools, goal });
        return `[SUBAGENT ${role.toUpperCase()} COMPLETED]:\n${result.summary}`;
      },
    });
  }
  ```
