# AI Agent Context & Memory Management 实战指南

每次工具调用的结果都会永久停留在会话上下文里。**治理的核心信条：预防优于清理（Prevention over Cleanup）；剪枝必须配合结构化工作记忆保活以对抗失忆反噬。**

---

## 核心指导与引导原则 (Guiding Principles)

### 原则 1：预防优于清理原则 (Prevention over Cleanup via Bounded Caps)
- **指导准则**：单次工具吐出数千 tokens 时，当轮认知污染已造成；事后剪枝无法挽救当轮注意力的溃散。工具输出必须在发生源头施加硬性截断。
- **决策边界与截断标准**：
  1. **`read` 截断 500 行**：提供 `offset` 与 `limit` 参数，截断时提示 `... (truncated: showing lines 1-500 of N. Use offset=501 to read more)`；
  2. **`grep` 截断 50 条匹配**：截断时提示 `... (N total matches, showing first 50. Narrow your regex)`；
  3. **`bash` 截断尾部 5,000 字符**：**必须截取尾部（Tail）**，因为编译报错、测试挂掉的堆栈与退出码永远在输出最后面。
- **契约原型**：
  ```ts
  const MAX_BASH_CHARS = 5000;
  const cappedStdout = rawStdout.length > MAX_BASH_CHARS
    ? `... (truncated, showing last ${MAX_BASH_CHARS} chars):\n` + rawStdout.slice(-MAX_BASH_CHARS)
    : rawStdout;
  ```

---

### 原则 2：动态消息滑动剪枝原则 (Message Pruning via `prepareCall`)
- **指导准则**：在请求送入模型前，通过 Harness 的 `prepareCall` 钩子剥离中间轮次堆积的陈旧工具交互，使输入 Token 曲线收敛平盘。
- **实施规范**：必须先展开 `options`，保护 `messages` 首轮为 undefined 的边界，使用 `toolCalls: "before-last-3-messages"`。
- **契约原型**：
  ```ts
  const agent = new ToolLoopAgent({
    // ...
    prepareCall: async (options) => ({
      ...options, // 展开保证 model, tools, system 等元配置不丢失
      messages: options.messages
        ? pruneMessages({
            messages: options.messages,
            toolCalls: "before-last-3-messages", // 保留最近 3 条与初始 Prompt，剪除中间工具历史
          })
        : undefined,
    }),
  });
  ```

---

### 原则 3：双轨制记忆保活原则 (Dual-Track: Ephemeral History vs. Durable State)
- **指导准则**：纯粹的 FIFO 剪枝会导致模型忘掉第 2 步读到的配置事实，进而在第 6 步重新调工具读取，诱发死循环重查。
- **决策模型**：
  1. **流动轨迹（Ephemeral History）**：工具调用原始日志与过程，按 FIFO 积极剪枝；
  2. **持久状态（Durable State）**：关键工程事实（如端口、路径、中间结论）与任务进度，强制写入结构化工作记忆，随系统提示词每轮长效保活。
- **契约原型**：
  ```ts
  export function injectWorkingState(basePrompt: string, memory: Record<string, string>): string {
    const facts = Object.entries(memory).map(([k, v]) => `- ${k}: ${v}`).join("\n");
    return `${basePrompt}\n\n# Persistent Working State (Survives Pruning)\n${facts || "(None)"}`;
  }
  ```

---

### 原则 4：前缀缓存物理布局原则 (Prompt Caching Physical Layout)
- **指导准则**：严格按照静态程度从高到低组织 Context，使大模型提供商的前缀缓存（Prompt Cache）命中率最大化（降低 90% 边际计费与延迟）。
- **物理三段排布**：
  ```
  Block 1: 绝对静态区 (Prompt Caching 命中率 100%)
    - 角色与 Agency / Guardrails 核心规则
    - 所有工具的 5 段式描述 Schema
  Block 2: 阶段持久区 (Durable State)
    - 结构化 Todo 任务看板
    - 已确认的系统关键架构事实 (Architecture Facts)
  Block 3: 动态滑动区 (Dynamic Ephemeral Context)
    - 初始 User Prompt
    - 经过 pruneMessages 剪枝后的最近 3 轮工具调用对
  ```
