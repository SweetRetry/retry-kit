# 调研记录：Vercel AI Agent Harness 38 讲全体系深度萃取与 Claude 生产实战

- **调研问题**：现代通用 AI Agent Harness 的完整工程分层与生产陷阱为何？如何体系化解决工具死循环震荡、Bash 引力、上下文线性膨胀、沙盒生命周期腐化与虚假验证？
- **记录日期**：2026-09-09
- **来源范围**：
  1. Vercel Academy: *Build Your Own AI Coding Agent Harness* (11 Modules, 38 Lessons 全系列, 2026)
  2. Anthropic Engineering: *Building effective agents* (Erik Schluntz & Barry Zhang, 2024)
  3. Anthropic Cookbook & Claude Code 生产实战：Tool Use, Loop Breakers & Agentic Coding Practices (2025-2026)
- **事实／推断／建议边界**：
  - **事实（一手工件与代码证据）**：
    - Vercel 38 讲构建了完整的 `TeensyCode` 原型，涵盖 11 个因果递进的模块；
    - 执行层门禁（Execute-level gates）必须在工具执行内部强制阻断，不能依赖模型可见的 `needsApproval` 属性（模型会遗忘或绕过）；
    - 状态机中“轮询状态”（Polling status）若被误算为活跃操作，会导致沙盒永远无法进入空闲休眠（Inactivity timeout），产生巨额账单；
    - 重连沙盒时句柄虽然存活但底层会话可能已断，必须在重连后以 `echo probe` 快速探针验证；
    - 纯 FIFO 消息剪枝（`before-last-3-messages`）会引发后向失忆，导致模型重复调用只读工具；
    - 模型在遇到空查询或报错时，极易陷入同一参数反复调用的震荡死循环（Tool Thrashing）。
  - **推断**：
    - Harness（工程外壳/挽具）是系统可靠性的唯一确定性防线，模型仅作为概率推断引擎；
    - 必须采用“Harness 强控制面 + 正交工具契约 + 双轨制工作记忆保活”架构。
  - **建议**：
    - 将 11 个模块提炼为 6 个高内聚正交 References；
    - 在运行时中补齐 Claude 的调用指纹哈希与滑动窗口熔断器；
    - 在生命周期中融入 Vercel 的 5 大 Hard-won Gotchas 与 Chaos 测试模式。

---

## 1. Vercel Academy "Build an AI Agent Harness" 11 模块 38 讲全景全解析

### 核心立意与因果链条 (Causal Sequence)
> *"A tool loop with three tools is a demo. The problems start when you try to use it for real work. You read a 5,000-line file and it stays in context forever. You give it bash and it runs rm -rf. You ask it to refactor a module and it explains how to refactor a module. One long task fills the context window and the agent loses its own instructions."*
每一个模块的诞生都是因为前一个模块遇到了工程崩溃点：
- 加 `read` 是因为 Chatbot 看不到文件；加 `grep` 是因为不能高效检索；加 `bash` 是因为需要跑命令但立刻遇到了 `rm -rf`；加 5 段式描述是因为遇到了 **Bash Gravity**；加截断与剪枝是因为遇到上下文线性爆炸；加 Subagent 是因为单代理在 30 步后必定焦点漂移与误操作。

---

### 模块全景详细剖析

#### Module 1: The Agent Loop (第 1-3 讲)
- **1.1 From Chat to Agent**：从普通 Chat 升级为 `ToolLoopAgent`，单工具让 Chatbot 变为自主 Agent；引入 `stepCountIs(15)` 作为硬性终止约束；
- **1.2 Your First Tools**：工具描述不是文档，而是**模型路由的 Prompt API**；引入 `grep` 50 条匹配上限；
- **1.3 Completing the Toolbox**：引入 `bash`。**核心辩析：为什么不能用模型可见的 `needsApproval`？** 如果依赖模型决定何时申请审批，模型会忘记或自行脑补授权；必须使用**执行层门禁（Execute-level gate）**，在工具底层根据安全命令前缀白名单（Safe Prefix Allowlist）无条件阻断。

#### Module 2: Tool Design (第 4-6 讲)
- **2.1 Descriptions That Work**：五段式描述契约（`Summary`、`WHEN TO USE`、`WHEN NOT TO USE`、`DO NOT USE FOR`、`USAGE & EXAMPLES`）。**Bash 万有引力（Bash Gravity）**：全能工具对模型具有本能的退化引力，必须用**双重否定（WHEN NOT TO USE + DO NOT USE FOR）**强行压制；
- **2.2 Shell Execution with Safety**：工厂模式（Factory Pattern）解耦：Schema 声明与执行后端完全分离；
- **2.3 Approval Gates**：审批门禁三阶演化：`Boolean`（全开全关） $\to$ `Function`（`(cmd) => boolean`） $\to$ `Discriminated Union`（`interactive` 阻断等待、`background` 异步审计、`delegated` 子代理免审）。

#### Module 3: The System Prompt (第 7-10 讲)
- **3.1 Structuring Agent Instructions**：系统指令分区化：Role Line $\to$ `# Agency`（使用工具、Act Don't Explain、行动优于空想） $\to$ `# Guardrails`（最小改动、不乱引入依赖）；
- **3.2 Dynamic Prompt Construction**：`buildSystemPrompt(context)` 动态注入运行路径、git 分支、沙盒类型；
- **3.3 Verification Gates**：在 Prompt 中固化验证纪律；
- **3.4 Project Context**：自动发现并动态拼装项目根目录下的 `AGENTS.md`。

#### Module 4: The Sandbox Abstraction (第 11-15 讲)
- **4.1 Designing the Interface**：统一 `Sandbox` 抽象接口（`readFile`, `writeFile`, `exec`, `stop`），工具禁止直接访问宿主 `child_process`；
- **4.2 Local Implementation**：基于 Node fs 与 child_process 的本地沙盒；
- **4.3 In-Memory Implementation**：基于 `just-bash` 的内存虚拟文件系统（Copy-on-Write, COW），无物理副作用；
- **4.4 Cloud Implementation**：远程隔离微虚拟机（MicroVM），分析延迟、持久化与网络开销；
- **4.5 Lifecycle Hooks**：沙盒生命周期三钩子：`afterStart`（初始化目录与权限）、`beforeStop`（清理与持久化检查）、`onTimeout`（超时自毁保护）。

#### Module 5: Context Management (第 16-19 讲)
- **5.1 The Problem**：实测单轮线性增长曲线，揭示 30 步后模型注意力严重稀释与丢指令；
- **5.2 Pruning Old Results**：在 `prepareCall` 钩子中使用 `pruneMessages({ toolCalls: "before-last-3-messages" })` 动态剪枝中间的冗长工具调用对，保留首尾；
- **5.3 Tool Output Design**：**预防优于清理（Prevention over Cleanup）**。工具底层强制有界截断（read 500 行、grep 50 条、bash 尾部 5000 字符保留报错堆栈），并携带截断量通知；
- **5.4 Cache Control**：提供商级 Prompt Caching 标记（`cacheControl: { type: "ephemeral" }`），降低 90% 重复上下文计费与延迟。

#### Module 6: Subagent Delegation (第 20-23 讲)
- **20 Why Delegate**：单代理三大死因：**Context Pollution（上下文污染）**、**Lost Focus（焦点漂移）**、**Over-broad Capabilities（权限过宽误伤代码）**；
- **21 Explorer Subagent**：只读权限（read/grep）、廉价轻量模型（Haiku/Flash）、隔离上下文，只向父代返回紧凑事实；
- **22 Executor Subagent**：全量权限、高阶模型（Sonnet/Pro）、定向目标与充足步数预算；
- **23 Task Tool**：通过统一的 `task` 工具进行角色路由，实现模型分级（Model per role）与权限硬隔离。

#### Module 7: Sandbox Lifecycle & Durability (第 24-27 讲)
- **24 State Machine**：沙盒五态流转：`Provisioning` $\to$ `Active` $\to$ `Hibernating` $\to$ `Hibernated` $\to$ `Expired`。硬超时（Hard Expiry） vs 空闲超时（Inactivity Window）。**极其致命的陷阱：什么才算活跃操作？只有用户消息、工具调用与文件变更才算；轮询健康状态绝不能重置活跃计时器！**
- **25 Snapshot and Restore**：快照冻结与恢复。防范三大幂等陷阱：1. 重复快照冲突、2. 恢复时沙盒已处于运行中、3. 重复执行 Stop；
- **26 Durable Workflows**：Serverless 下 `setTimeout` 会随进程冻结而丢失；必须使用持久化工作流（如 Vercel Workflow）的持久化 `sleep()` 跨部署等待；
- **27 Hard-Won Lessons（五大生产血泪史）**：
  1. *Stale Handles After Reconnect*：重连后会话已死，必须在首次执行前用 `echo probe` 探测探活；
  2. *Stale Expiry Data*：过期时间必须实时从服务端拉取，禁止使用本地陈旧缓存做控制流决策；
  3. *Polling Resets Inactivity*：轮询误算活跃导致沙盒永不休眠，天价账单；
  4. *Auto-Resume Loops*：重连自动恢复导致无限震荡，必须仅在初始入口执行恢复；
  5. *State Divergence*：以云端 API 为唯一真理源，DB 与客户端仅作展示缓存；
  6. *Chaos Mode*：构建 `--chaos` 测试参数，随机注入断连与句柄失效。

#### Module 8: Human-in-the-Loop (第 28-29 讲)
- **28 Structured Questions**：模型天然讨厌向用户提问（倾向于自己盲猜）。通过 `askUser` 提供 2~4 个选项，配合 `# Handling Ambiguity` 协议强制模型在有歧义时提问；
- **29 Approval Config**：操作模式配置（Interactive / Background / Delegated）与基于事件的可插拔安全策略。

#### Module 9: Planning and Verification (第 30-32 讲)
- **30 Todo Tool**：任务状态机追踪（`pending` $\to$ `in_progress` $\to$ `completed`），强制**单项活跃约束（Single-active-item constraint：任何时刻最多仅允许 1 个任务处于 in_progress）**，抵抗任务漂移；
- **31 Fast Context Understanding**：探索纪律：`grep` 先行，仅 `read` 确定要修改的代码，结合并行 Read 减少轮次；
- **32 Verification Contract**：动态探测 `package.json` 中的命令并按 `typecheck` $\to$ `lint` $\to$ `test` $\to$ `build` 顺序递进执行。**Scoped Claims 诚信声明契约**：明确区分“我引起的失败”与“存量历史既有失败”，杜绝虚假全通谎言。

#### Module 10: Surfaces & Rendering (第 33-35 讲)
- **33 CLI Entry Point**：参数解析、沙盒工厂、以及利用 `finally` 块确保沙盒资源 100% 安全释放；
- **34 Streaming and Tool Rendering**：终端实时流式文字输出与工具调用动态卡片渲染；
- **35 Web Surface**：Headless Agent 服务于 Web 界面：持久化存储、HTTP 流式、断点续流（Resumable Streams）与工具调用渲染为交互式组件。

#### Module 11: Extensibility (第 36-38 讲)
- **36 Skills System**：技能渐进式披露（Progressive Disclosure）：仅将技能名称与描述注入 Prompt 索引，模型命中时通过 `loadSkill` 按需加载 Markdown 正文；
- **37 Custom Tools**：工具注册中心（Registry），无需 Fork 核心即可自由挂载或包装工具；
- **38 Extension Points (生命周期事件总线)**：
  - 5 大核心事件：`session_start`, `tool_call`, `tool_result`, `session_before_compact`, `session_shutdown`；
  - 处理器支持**通过（Pass-through）、阻断（Block，向模型回传拦截原因）、修改（Modify，如在压缩前注入安全规则）**；
  - 明确链式执行顺序（先日志、后安全检查、最后执行）。

---

## 2. Claude / Anthropic 生产实战精髓与深度互补

### 2.1 工具死循环与重复调用震荡熔断 (Tool Thrashing & Circuit Breaker)
- **Vercel 缺陷**：仅设置了 `stepCountIs(15)` 粗暴硬限制，缺乏对模型“同一参数反复调用”、“空查询原地重试”、“两工具间来回震荡（A $\to$ B $\to$ A $\to$ B）”的动态识别与拦截。
- **Claude 工业级解法**：
  1. **调用指纹哈希（Fingerprint Hashing）**：`sha256(tool_name + canonical_json(args))` 维护在滑动窗口队列中；
  2. **只读幂等缓存**：对于无副作用的 `read`/`grep`，相同指纹直接从 Harness 内存返回结果；
  3. **滑动窗口熔断器（Circuit Breaker）**：
     - 连续 2 次参数相同且无增量或失败：发出警告；
     - 连续 3 次或震荡发生：Harness 强行短路拦截，不再调用沙盒，向 Context 注入高优先级干预诊断指令（Diagnostic Intervention Nudge）：
       `"[HARNESS CIRCUIT BREAKER TRIGGERED]: You have called '${tool_name}' with identical arguments multiple times without new results. STOP repeating this call. Analyze why it failed, review previous outputs, try a completely different approach, or ask the user."`
  4. **Actionable Error 指令化错误契约**：工具失败严禁返回纯数字状态码或空字符串，必须包含自然语言指导指令（`instruction`），告诉模型下一步尝试什么替代路径。

### 2.2 上下文剪枝对冲：结构化记忆双轨保活 (Durable State vs. Ephemeral History)
- **Vercel 缺陷**：`pruneMessages(before-last-3-messages)` 粗暴丢弃历史工具结果，会导致模型在第 6 步忘掉第 2 步读到的配置文件，诱发模型重新调用 `read`，反向恶化工具重复调用。
- **Claude 双轨制解法**：
  - **动态轨迹剪枝（Ephemeral History）**：对对话历史和工具返回过程执行激进剪枝，压降 Token；
  - **结构化记忆保活（Durable Working State）**：将任务看板（Todo）、已确认的关键架构事实（Architecture Facts）沉淀为结构化状态，随静态系统提示词每轮长效携带。

### 2.3 范式准入：工作流优先（Workflows over Autonomous Agents）
- **Anthropic 核心哲学**：*Simplicity First*。
- 能用确定性代码编写的 Prompt Chaining、Routing、Parallelization 或 Evaluator-Optimizer，坚决不启动开放式 Agent 循环。

---

## 3. 落地重构映射结论

1. **全面吸收 Vercel 38 讲架构**：
   - 采用 5 段式描述对抗 Bash 引力；
   - 采用统一 `Sandbox` 抽象与 COW 虚拟沙盒；
   - 落地有界截断（预防优于清理）；
   - 落实 Explorer/Executor 二元子代理；
   - 落实动态 Gate 序列与 Scoped Claims 诚信声明；
   - 引入沙盒生命周期 Hard-won lessons（探活探针、防轮询重置、防恢复死循环）与事件总线扩展机制。
2. **深度融入 Claude 生产级防震荡实践**：
   - 补齐调用指纹哈希与滑动窗口死循环熔断器；
   - 补齐 Todo 结构化记忆双轨保活，消除粗暴剪枝后的失忆重查反噬；
   - 补齐工作流 vs 自主代理准入决策树。
