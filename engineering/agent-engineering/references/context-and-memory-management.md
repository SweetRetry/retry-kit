# AI Agent Context & Memory Management 实战指南

工具结果在被压缩或移除前会占用上下文。限制无关输出，并确保压缩后仍可取得已确认约束、必要事实和未完成工作；优先复用宿主已有的上下文与状态机制。

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
  仅当宿主的压缩或状态机制不能保留任务所需信息时，考虑分离瞬态历史与持久工作状态：
  1. **瞬态历史轨（Ephemeral Conversation History）**：按相关性压缩工具细节与日志，保留必要错误证据及回查入口；
  2. **持久状态轨（Durable Working State / Todo）**：按变化更新关键事实、约束与未完成工作，只提供当前决策所需状态，不要求每轮完整注入 System Prompt。
* **【自建状态摘要的示例】**：
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
  只有存在已测得的上下文增长问题且宿主机制不足时，才自建剪枝。按所用 SDK 的实际接口处理消息，保留工具调用与结果配对，不以固定轮数作为通用窗口。
* **【使用 `prepareCall` 的示例，接口以项目 SDK 为准】**：
  ```ts
  const agent = new ToolLoopAgent({
    // ...
    prepareCall: async (options) => ({
      ...options, // 必须先展开 options，防止丢失 model/tools 等元配置
      messages: options.messages
        ? pruneMessages({
            messages: options.messages,
            toolCalls: "before-last-3-messages", // 示例窗口；实际保留范围由任务证据需求决定
          })
        : undefined, // 边界防护：首轮 messages 为 undefined 时安全透传
    }),
  });
  ```
* **【反直觉踩坑 (Gotcha)】**：
  使用该示例前核对项目 SDK 的回调返回契约、元配置保留方式及首轮 messages 是否可能为空；不要将示例结构作为其他宿主的必需接口。

---

### 原则 4：前缀缓存物理布局 (Prompt Caching Physical Layout)

* **【真实翻车 Case】**：
  开发者在 System Prompt 开头拼接了当前时间戳（`Current Time: 2026-09-09 23:18:00`）。由于每次调用时间戳都在变，大模型供应商的前缀缓存（KV Cache）完全被击穿，调用费用比预期高出 10 倍，响应延迟增加了 3 秒。
* **【核心指导原则】**：
  在供应商支持前缀缓存的接口中，将稳定内容置于易变内容之前；缓存收益以实际指标为准。无需为套用示例重组宿主已有的消息布局。
* **【自建消息布局的示例】**：
  ```
  Block 1: 稳定前缀
    - 角色定义与核心 Rules / Guardrails
    - 工具定义与必要约束（保持稳定顺序）
  Block 2: 阶段持久区 (Durable Working State)
    - 结构化 Todo 任务看板
    - 已确认的系统关键架构事实 (Architecture Facts)
  Block 3: 动态滑动区 (Dynamic Ephemeral Context)
    - 用户的初始输入
    - 按当前证据需求保留的工具调用与结果
  ```
