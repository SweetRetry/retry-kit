# AI Agent Harness Runtime & Loop 实战指南

Harness（运行时套件/外壳）是 Agent 系统的确定性控制面。模型是概率推断内核，**所有关于安全性、步数预算、沙盒隔离、死循环熔断与审批门禁的硬性保证，必须 100% 由 Harness 代码层强制实施，严禁依赖模型自律**。

---

## 核心指导与引导原则 (Guiding Principles)

### 原则 1：沙盒面向接口原则 (Sandbox Abstraction First)
- **指导准则**：工具代码严禁直接 `import child_process` 或操作物理磁盘，必须统一面向 `Sandbox` 接口编程。底层按需在 Local、In-Memory COW、Cloud VM 间无缝切换，上层工具契约无需改动。
- **接口契约原型**：
  ```ts
  export interface ExecutionResult {
    stdout: string;
    stderr: string;
    exitCode: number;
  }

  export interface Sandbox {
    readFile(path: string): Promise<string>;
    writeFile(path: string, content: string): Promise<void>;
    exec(command: string, options?: { timeoutMs?: number; cwd?: string }): Promise<ExecutionResult>;
    stop(): Promise<void>;
  }
  ```

---

### 原则 2：执行层硬拦截原则 (Execute-Level Gates over Model-Facing Flags)
- **指导准则**：危险操作的审批检查绝不能交给模型可见的入参属性（如 `{ needsApproval: boolean }`）。模型会遗忘、绕过或自行脑补授权。
- **决策边界**：审批门禁必须在工具底层的 `execute` 函数内部执行，基于安全命令前缀白名单（Safe Prefix Allowlist）无条件硬拦截。
- **契约原型**：
  ```ts
  export function createSafeBashTool(sandbox: Sandbox, approvalPolicy: (cmd: string) => Promise<boolean>) {
    const SAFE_PREFIXES = ["npm test", "npm run lint", "git status", "git diff", "ls", "echo"];

    return tool({
      description: `Execute a shell command...`,
      inputSchema: z.object({ command: z.string() }),
      execute: async ({ command }) => {
        const isSafe = SAFE_PREFIXES.some((prefix) => command.trim().startsWith(prefix));
        if (!isSafe) {
          const approved = await approvalPolicy(command);
          if (!approved) return "Execution rejected: User denied approval for command: " + command;
        }
        const res = await sandbox.exec(command);
        return res.stdout || res.stderr || "(no output)";
      },
    });
  }
  ```

---

### 原则 3：工具死循环指纹熔断原则 (Fingerprint Hashing & Circuit Breaker)
- **指导准则**：纯步数硬限制（`stepCountIs(15)`）是暴力截断；模型在第 2~3 轮遭遇空查询或错误时，极易陷入同一参数反复调用或工具间震荡（Tool Thrashing）。Harness 必须主动识别指纹并触发干预。
- **判断门槛**：
  1. **指纹计算**：`sha256(tool_name + canonical_sorted_json(args))`；
  2. **只读幂等缓存**：无副作用工具（`read`/`grep`）命中相同指纹，直接返回内存缓存；
  3. **熔断阈值**：滑动窗口内相同入参调用 $\ge 2$ 次且无增量，或检测到 `A -> B -> A -> B` 震荡模式；
  4. **干预动作**：Harness 在底层短路拦截，不向下游调用沙盒，向上下文注入高优先级诊断反思提示：
     `"[HARNESS CIRCUIT BREAKER TRIGGERED]: You have called '${tool_name}' with identical arguments multiple times without progress. STOP repeating this call! Analyze why previous attempts failed, reconsider your assumptions, or change your strategy."`

---

### 原则 4：沙盒活跃度排他原则 (Activity Tracking Exclusion)
- **指导准则**：沙盒双超时机制（Hard Expiry 保底销毁 vs. Inactivity Window 空闲休眠）中，**状态轮询（Polling Status）、心跳探针与账单读取绝对不能刷新活跃时间**。
- **决策边界**：只有真实发生的用户输入、工具调用或文件改动，才允许重置空闲计时器。违反此原则将导致沙盒通宵空转、无法休眠。

---

### 原则 5：重连探针检测原则 (Probe on Reconnect)
- **指导准则**：断线重连后，连接句柄（Handle）可能在内存中存活，但底层会话（Session）已挂死。
- **决策动作**：重连后首次操作必须先执行只读轻量探针：
  ```ts
  const probe = await sandbox.exec("echo probe");
  if (probe.exitCode !== 0 || probe.stdout.trim() !== "probe") {
    // 会话失效，强制从最近快照重新拉起沙盒
    sandbox = await restoreFromSnapshot(lastSnapshotId);
  }
  ```
- **自动恢复约束**：仅在初次进入会话时触发快照恢复；重连时若沙盒已是 Active 状态，直接 Attach，避免无限恢复震荡。

---

### 原则 6：生命周期事件扩展原则 (Extension Event Bus)
- **指导准则**：日志、审计、敏感文件防护与关机存盘等横切关注点，严禁在单个工具代码内堆砌胶水逻辑，必须通过 Harness 生命周期事件总线解耦。
- **核心事件面**：`session_start`, `tool_call`, `tool_result`, `session_before_compact`, `session_shutdown`。
- **处理三态**：
  1. **Pass-through**：无返回值，透传记录日志；
  2. **Block**：返回 `{ block: true, reason }`，Harness 停止调用并将 reason 作为工具结果喂回模型；
  3. **Modify**：返回 `{ modify: { ... } }`，修改入参或在上下文压缩前动态注入安全指令补丁。
