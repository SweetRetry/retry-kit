# AI Agent Harness Runtime & Loop 实战指南

大模型是非确定性的概率推断引擎，**所有关于安全性、步数预算、沙盒隔离、死循环熔断与审批门禁的硬性保证，必须 100% 由 Harness 代码层强制实施，严禁依赖模型自律**。

---

## 核心指导与引导原则 (Guiding Principles)

### 原则 1：沙盒面向接口抽象 (Sandbox Abstraction First)

* **【真实翻车 Case】**：
  工具实现直接写死 `import { exec } from "node:child_process"` 和 `node:fs`。当需要将执行环境搬移到远程安全沙盒（如 MicroVM / 云容器）以防破坏宿主系统时，发现所有工具的实现都与本地 OS 紧耦合，必须全量重构。
* **【核心指导原则】**：
  所有工具代码严禁直接操作宿主磁盘或进程，必须统一面向 `Sandbox` 抽象接口编程。底层按需在 Local、In-Memory COW、Cloud VM 间无缝切换，上层工具契约无需改动。
* **【契约与代码原型】**：
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
* **【反直觉踩坑 (Gotcha)】**：
  本地实现时必须做路径穿越防护（Path Traversal）。如果仅使用 `path.join(root, inputPath)`，输入 `../../etc/passwd` 会直接逃逸出沙盒；路径检查需比较规范化路径的目录边界，并处理符号链接及检查到使用之间的变化；字符串 `startsWith(root)` 无法证明目录包含关系。文件与进程访问的最终限制由执行环境强制实施。

---

### 原则 2：工具死循环指纹熔断 (Fingerprint Hashing & Circuit Breaker)

* **【真实翻车 Case】**：
  模型调用 `grep` 搜索某个函数名返回空，它并没有停下来思考为什么没搜到，而是微调参数或在两个参数间来回震荡，连续发起了 8 次无效的 grep 调用，直到烧光了全局 15 步预算后抛出异常崩溃。
* **【核心指导原则】**：
  保留运行时步数与重试预算，同时结合规范化调用参数、执行结果、资源版本和进展判断重复。连续两次相同调用且失败或无增量时阻断该重试思路并给出诊断；不是仅凭参数重复就停止整个任务。
  正常状态轮询、环境变化后的复查及有明确重试条件的暂时故障按对应契约处理。诊断后可改用有依据的新策略；权限拒绝不得以换工具、换参数重试绕过。
  只读结果只有在相关资源版本与权限范围可确认未变时才复用；无法证明未变时不得用陈旧缓存冒充新结果。

---

### 原则 3：重连轻量探针检测 (Probe on Reconnect)

* **【真实翻车 Case】**：
  在长时间任务或网络抖动后，宿主进程保留了沙盒对象的内存引用（Handle），认为连接依然完好。然而远端容器内部的会话实际上已被宿主终止或挂死，模型发送的后续写入指令全部陷入永久挂起（Hang）。
* **【核心指导原则】**：
  严禁盲信本地缓存的句柄存活状态。在断线重连、长时间空闲唤醒或状态恢复后，首次调用前必须通过轻量、只读的 `echo probe` 探测真实连通性。
* **【契约与代码原型】**：
  ```ts
  const probe = await sandbox.exec("echo probe", { timeoutMs: 2000 }).catch(() => null);
  if (!probe || probe.exitCode !== 0 || probe.stdout.trim() !== "probe") {
    // 句柄已失效，强制从最近快照拉起新沙盒或重建连接
    sandbox = await restoreFromSnapshot(lastSnapshotId);
  }
  ```
* **【反直觉踩坑 (Gotcha)】**：
  探测超时时间必须设短（如 2000ms），绝不能使用默认长超时，否则会把死锁时间延长到无法接受。

---

### 原则 4：排他性活跃统计防账单泄漏 (Activity Tracking Exclusion)

* **【真实翻车 Case】**：
  系统设计了“10 分钟无操作自动休眠”以节约云端沙盒成本。但运维在前端配置了每 30 秒轮询一次沙盒状态，结果沙盒认为“一直有活动”，通宵保持开机，产生了天价闲置账单。
* **【核心指导原则】**：
  沙盒采用双时钟机制：**硬性生命周期（Hard Expiry，如 2 小时强制销毁）** 与 **空闲休眠时钟（Inactivity Window，如 10 分钟休眠）**。
  **状态轮询（Polling Status）、心跳探针与指标采集严禁刷新活跃时间**；只有真实发生的用户输入、工具调用或文件改动，才允许重置空闲计时器。
* **【反直觉踩坑 (Gotcha)】**：
  云端时钟与客户端时钟存在网络漂移（Clock Drift）。判断沙盒是否过期必须以沙盒宿主返回的权威时间戳为准，严禁使用本地 `Date.now()` 做强断言。

---

### 原则 5：沙盒五态机与自动恢复防风暴 (State Machine & Auto-Resume Defense)

* **【真实翻车 Case】**：
  沙盒唤醒失败后，Harness 捕获到异常并无退避地反复重试恢复，瞬间触发了数百次云容器创建请求，导致 API 配额被打爆并引发系统雪崩。
* **【核心指导原则】**：
  沙盒生命周期必须严格受控于确定性五态机：
  $$\text{Provisioning} \longrightarrow \text{Active} \longrightarrow \text{Hibernating} \longrightarrow \text{Hibernated} \longrightarrow \text{Expired}$$
  快照恢复必须具备幂等保护：
  1. 快照保存期间禁止写入操作；
  2. 恢复时若沙盒已处于 `Active` 状态，直接 Attach 而非重复恢复；
  3. 自动恢复失败必须进入指数退避，最大重试不超过 2 次，失败即终止并向用户报错。

---

### 原则 6：生命周期事件总线 (Lifecycle Extension Points)

* **【真实翻车 Case】**：
  安全审计、操作日志和敏感文件拦截逻辑散落在每个工具的 `execute` 代码中。一旦新增工具或修改安全策略，就需要改动多处代码，极易遗漏。
* **【核心指导原则】**：
  通过统一的生命周期事件总线实施横切治理。定义 5 大确定性挂载点：
  1. `session_start`：会话初始化与环境预检；
  2. `tool_call`：调用前鉴权、安全白名单拦截与参数改写；
  3. `tool_result`：结果脱敏、超大内容截断；
  4. `session_before_compact`：上下文压缩前，将关键事实持久化到工作记忆；
  5. `session_shutdown`：资源清理与沙盒停止。
* **【事件处理三态契约】**：
  - **Pass-through**：无返回值，用于旁路监控与记录；
  - **Block**：返回 `{ block: true, reason }`，Harness 阻断执行并将 reason 伪装为工具失败回传模型，引导其修正行为；
  - **Modify**：返回 `{ modify: { ... } }`，在运行时无感重写参数或过滤输出。
