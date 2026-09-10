# AI Agent Context & Memory Management 实战指南

工具结果在被压缩或移除前会占用上下文。**治理的核心信条：预防优于清理（Prevention over Cleanup）；剪枝必须配合结构化工作记忆保活以对抗失忆反噬。**

---

## 核心指导与引导原则 (Guiding Principles)

### 原则 1：输出有界截断（预防优于清理） (Prevention over Cleanup via Bounded Caps)

* **【真实翻车 Case】**：
  模型执行了一个未加筛选的 `git diff` 或 `cat large_file.json`，终端一次性喷出 4,000 行、超过 30,000 tokens 的原始日志。当前轮的上下文瞬间被占满，导致模型产生严重的大海捞针注意力溃散（Needle In A Haystack），彻底丧失代码修改能力。
* **【核心指导原则】**：
  按工具输出和当前任务设置预算，不把固定行数或字符数作为所有任务的通用限制。
  - 文件读取提供位置和分页入口；搜索先限定范围，截断时说明已显示范围及如何继续。
  - 日志保留退出码、相关错误摘要及必要首尾；错误不一定在尾部，不能只保留尾部并宣称证据完整。
  - 截断结果应提供受原权限约束的分页或完整日志入口。必要证据缺失时定向补读，而不是重复输出整份日志。

---

### 原则 2：双轨工作记忆对抗剪枝失忆 (Dual-Track Memory against Pruning Amnesia)

* **【真实翻车 Case】**：
  为了控制上下文长度，系统引入了简单的 FIFO 消息剪枝（剥离前序消息）。结果模型在第 2 轮读取的配置文件内容在第 7 轮被剪掉，模型突然“失忆”，在第 8 轮又重新调用 `read` 去读同一个配置文件，陷入“剪枝 $\to$ 失忆 $\to$ 重读 $\to$ 再剪枝”的恶性死循环。
* **【核心指导原则】**：
  纯粹的会话滑动剪枝是危险的。上下文必须设计为**双轨制**：
  1. **瞬态历史轨（Ephemeral Conversation History）**：工具调用的原始细节、调试过程日志，按 FIFO 积极剪枝；
  2. **持久状态轨（Durable Working State / Todo）**：已确认的关键架构事实（如已发现的文件路径、关键端口、设计决策）与 Todo 进度，强制沉淀于结构化工作状态中，每轮随 System Prompt 完整保活。
* **【契约与代码原型】**：
  ```ts
  export function injectWorkingState(basePrompt: string, memory: Record<string, string>): string {
    const facts = Object.entries(memory).map(([k, v]) => `- ${k}: ${v}`).join("\n");
    return `${basePrompt}\n\n# Persistent Working State (Survives Pruning)\n${facts || "(None)"}`;
  }
  ```

---

### 原则 3：动态消息滑动剪枝 (Message Pruning via `prepareCall`)

* **【真实翻车 Case】**：
  随着多轮工具交互进行，输入 Tokens 线性递增，每次模型推理的费用和首字延迟成倍增加，直到触碰到模型窗口上限报错中断。
* **【核心指导原则】**：
  在请求送入模型前，通过 Harness 的 `prepareCall` 钩子剥离中间轮次堆积的陈旧工具调用对，使输入 Token 曲线收敛平盘。
* **【契约与代码原型】**：
  ```ts
  const agent = new ToolLoopAgent({
    // ...
    prepareCall: async (options) => ({
      ...options, // 必须先展开 options，防止丢失 model/tools 等元配置
      messages: options.messages
        ? pruneMessages({
            messages: options.messages,
            toolCalls: "before-last-3-messages", // 保留最近 3 条与初始 Prompt，剪除中间工具历史
          })
        : undefined, // 边界防护：首轮 messages 为 undefined 时安全透传
    }),
  });
  ```
* **【反直觉踩坑 (Gotcha)】**：
  调用 `pruneMessages` 时，**必须展开 `...options`**；如果不展开，会导致 options 中的其他系统元参数被直接吞掉。同时必须判断 `options.messages` 是否为空，防范第 1 轮启动崩溃。

---

### 原则 4：前缀缓存物理布局 (Prompt Caching Physical Layout)

* **【真实翻车 Case】**：
  开发者在 System Prompt 开头拼接了当前时间戳（`Current Time: 2026-09-09 23:18:00`）。由于每次调用时间戳都在变，大模型供应商的前缀缓存（KV Cache）完全被击穿，调用费用比预期高出 10 倍，响应延迟增加了 3 秒。
* **【核心指导原则】**：
  严格按照**静态程度由高到低**从头到尾组织 Prompt，使模型服务商的 Prompt Cache 命中率最大化（降低 90% 边际计费与延迟）。
* **【物理三段排布规范】**：
  ```
  Block 1: 绝对静态区 (Prompt Caching 命中率 100%)
    - 角色定义与核心 Rules / Guardrails
    - 工具定义与必要约束（保持稳定顺序）
  Block 2: 阶段持久区 (Durable Working State)
    - 结构化 Todo 任务看板
    - 已确认的系统关键架构事实 (Architecture Facts)
  Block 3: 动态滑动区 (Dynamic Ephemeral Context)
    - 用户的初始输入
    - 经过 pruneMessages 剪枝后的最近 3 轮工具调用对
  ```
