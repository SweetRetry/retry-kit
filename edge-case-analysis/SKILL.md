---
name: edge-case-analysis
description: >
  系统性边界与异常场景（Edge Case）分析与决策 skill。
  聚焦硬件/节点重启（如 AIGC Worker 丢失状态）、高并发与幂等设计、大模型语言未对齐等高风险边界。
  核心方法论：通过“业界最强实践（Strong Practice） -> 复杂度与 ROI 评估 -> 实用性决策（Decision）”的决策链条，
  产出既不漏掉关键边界、又不陷入过度工程的 Pragmatic 编码方案。
  本 skill 适合所有编码设计、架构评审、PR Review 以及复杂逻辑重构任务。
---

# Systematic Edge Case & Boundary Analysis

本 Skill 用于引导 Agent 在面对任何复杂的编码与系统设计任务时，**主动发现隐藏的边界与异常场景（Edge Cases）**，并通过一套**标准化的三段式决策框架（业界方案 -> 复杂度与 ROI -> 落地决策）**，提供既健壮又符合实际业务阶段（不盲目过度设计）的落地代码。

---

## 何时使用

本 Skill 适合应用于所有编码领域，但在以下场景时**必须**强制触发：

- **异步与后台任务设计**：如 AIGC 任务调度、音视频处理、批处理任务、长连接消费。
- **Agent 与大模型应用开发**：如多轮对话 Chat 上下文限制、用户语言偏置、多 Agent 并发。
- **高并发与接口设计**：如敏感接口（支付、发券、提交申请等）的重复请求防重与幂等处理。
- **数据一致性与持久化**：如多表写事务、外部 I/O 混合操作的异常流防脏写。
- **核心逻辑重构与 Code Review**：在评估他人代码时，审视异常流与恢复路径。

---

## 核心执行原则

### 1. 拒绝盲目乐观（Assume Failure & Bad UX）
默认假设一切外部系统都会失败，也假设用户会进行各种异常操作：网络会超时、节点会重启、用户会疯狂点击按钮、大模型会输出错误的语言或格式。

### 2. 避免过度工程（Pragmatic Trade-off）
根据当前的业务阶段、发生概率以及失败代价，客观分析 **ROI (投资回报率)**。
- 允许在 MVP 阶段选择“Do Nothing + Monitoring”，但必须是**知情同意（Informed Decision）**，而不是“不知道有这个 bug”。

### 3. 三段式决策链（The Decision Chain）
对于发现的每一个核心边界问题，必须完整走完以下三个步骤，缺一不可：
1. **业界 Strong 做法**：这个领域最成熟、最无可挑剔的架构/设计/交互方案是什么？
2. **复杂度与 ROI 分析**：实现这个方案需要多少工作量？会带来多少复杂度？如果出了问题，损失有多大？
3. **最终决策**：做还是不做？如果做，是实现 Full Strong 方案，还是退而求其次用一个 Low Cost 的 Mitigating 方案？怎么写代码？

---

## 分析工作流

### Step 1: 发现边界 (Brainstorm & Identify)
针对要编写或 Review 的代码，从以下几个维度主动推演异常边界：
1. **生命周期与状态丢失**：Worker 执行到一半突然重启，未完成的状态是否会永久丢失？
2. **并发与幂等**：同一请求并发到达时，是否会产生并发冲突？下游重试时，逻辑是否幂等？
3. **产品与语言偏置**：多语言环境下，AI 的回复是否偏离了用户的语种？Markdown 是否闭合？

### Step 2: 检索业界成熟实践 (Strong Practices)
分析业界在解决此类异常时的强规范或模式（如可见性超时、Idempotency-Key、语言检测注入等）。

### Step 3: 进行复杂度与 ROI 评估
利用 **ROI 决策数学模型** 评估开发收益比，避免过度设计。

### Step 4: 给出决策与代码实现
依据项目当前生命周期（MVP vs. 生产级），决定是“不做仅告警”、“提供低成本缓解方案 (Mitigation)” 还是 “实现业界 Strong 方案 (Full Standard)”，并编写落地代码。

---

## Pragmatic ROI 决策数学模型

在评估一个边界场景是否值得修补时，使用以下公式进行定性与定量分析：

$$\text{ROI} = \frac{\text{发生概率} \times \text{单次故障损失 (Cost of Failure)}}{\text{建设与维护成本 (Cost of Implementation)}}$$

### 1. 发生概率 (Probability)
- **高 (High)**：$\ge 1\%$。日常流量下，每天或每百次请求必然遇到（如用户双击、LLM 语种偏离）。
- **中 (Medium)**：$0.01\% \sim 1\%$。特定高频操作或系统发布时触发（如滚动发布时 Worker 重启）。
- **低 (Low)**：$< 0.01\%$。极端物理故障下发生（如 Redis 宕机、网络彻底崩溃）。

### 2. 故障损失 (Cost of Failure / Bad UX)
- **灾难性 (Catastrophic)**：资损、核心数据损坏污染、安全漏洞。
- **严重 (Severe)**：单次任务永久失败（用户付费但无产出），或者严重的体验异常（中文用户收到长篇英文回复，或界面卡死），引起大量客诉。
- **轻微 (Mild)**：对用户体验影响极小，用户手动“刷新/重试”即可自行修复。

### 3. 建设与维护成本 (Cost of Implementation)
- **高 (High)**：需要引入新的基础设施组件（如 Temporal），或者重构大规模数据表。
- **中 (Medium)**：需要编写较复杂的并发控制代码（如自研 Redis 锁、大模型语种检测与 Prompt 动态注入）。
- **低 (Low)**：只需几行防御性代码（如增加 `if` 校验、添加 DB `UNIQUE KEY` 约束、Prompt 中增加显式语言约束、前端按钮点击置灰）。

---

## 核心边界场景详解与代码样本

### 场景 1. [技术边界] AIGC / 异步任务 Worker 重启导致任务丢失

- **场景描述**: Worker 执行耗时任务时突然被杀死（如 OOM、滚动发布）。DB 中状态永远为 `PROCESSING`，用户无限 Loading，任务悬挂丢失。
- **业界 Strong 做法**: 带心跳与可见性超时的分布式队列（如 BullMQ, asynq）。Worker 抢占任务后有可见性超时且定期发送心跳；若超时未 ACK 或心跳中断，队列自动回收任务重新分配。
- **决策指导**:
  - **MVP/轻量级**: `Mitigation` 方案（扫描数据库中超时任务并自动重置/失败）。
  - **生产级/高频**: `Full` 方案（使用 BullMQ/asynq 等队列的自动超时重入队机制）。

#### Go 示例（Mitigation：轻量级数据库超时扫表重置逻辑）
```go
package main

import (
	"log"
	"time"
	"gorm.io/gorm"
)

type Task struct {
	ID        uint      `gorm:"primaryKey"`
	Status    string    `gorm:"index"` // "pending", "processing", "completed", "failed"
	UpdatedAt time.Time
	RetryCount int
}

func SweepOrphanTasks(db *gorm.DB) {
	threshold := time.Now().Add(-10 * time.Minute)
	var tasks []Task

	// 找出所有超时的 processing 任务
	if err := db.Where("status = ? AND updated_at < ?", "processing", threshold).Find(&tasks).Error; err != nil {
		log.Printf("Failed to scan orphan tasks: %v", err)
		return
	}

	for _, task := range tasks {
		if task.RetryCount >= 3 {
			db.Model(&task).Updates(map[string]interface{}{"status": "failed", "updated_at": time.Now()})
			log.Printf("Task %d failed permanently after max retries", task.ID)
		} else {
			db.Model(&task).Updates(map[string]interface{}{
				"status":      "pending",
				"retry_count": task.RetryCount + 1,
				"updated_at":  time.Now(),
			})
			log.Printf("Re-queued timed-out task %d (retry: %d)", task.ID, task.RetryCount+1)
		}
	}
}
```

---

### 场景 2. [技术边界] 并发冲突与幂等性实现

- **场景描述**: 用户多击按钮同时发出两个扣款请求，或者 MQ 重试发送了两次扣款消息。由于服务端缺乏并发锁，导致重复扣款。
- **业界 Strong 做法**: 客户端携带 `Idempotency-Key` (UUID)；服务端使用 Redis 原子操作 `SET NX PX` 加锁防重，处理成功后将 Response 结果缓存于 Redis 中。下次遇到相同 Key，若还在处理则报 409 Conflict，若已成功直接返回缓存的 Response。
- **决策指导**:
  - 核心资损/敏感接口：**强制**实现基于 Redis 的防重锁，以及数据库层面的唯一约束索引（`UNIQUE INDEX`）。

#### TypeScript 示例（基于 Redis 的高可靠防重幂等实现）
```typescript
import Redis from 'ioredis';
const redis = new Redis();

async function checkAndLockIdempotency(key: string, ttlSeconds: number = 60) {
  const redisKey = `idempotency:${key}`;
  const acquired = await redis.set(redisKey, 'processing', 'EX', ttlSeconds, 'NX');
  if (acquired === 'OK') return { isDuplicate: false, status: 'PENDING' };

  const currentStatus = await redis.get(redisKey);
  if (currentStatus === 'processing') return { isDuplicate: true, status: 'PENDING' };
  if (currentStatus && currentStatus.startsWith('success:')) {
    return { isDuplicate: true, status: 'SUCCESS', cachedResponse: JSON.parse(currentStatus.substring(8)) };
  }
  return { isDuplicate: true, status: 'PENDING' };
}

async function saveIdempotencyResult(key: string, response: any, ttlSeconds: number = 3600) {
  await redis.set(`idempotency:${key}`, `success:${JSON.stringify(response)}`, 'EX', ttlSeconds);
}
```

---

### 场景 3. [产品/UX 边界] Chat 语言未对齐（LLM Chat Language Alignment Defect）

- **场景描述**: 用户使用中文提问，但由于系统提示词（System Prompt）偏置为英文，或者 LLM 强行使用默认英文回复，导致回复语种不匹配，引起用户体验崩塌。
- **业界 Strong 做法**: 
  1. 在 System Prompt 最底部注入强制对齐指令（如 `"You must reply in the exact language used by the user"`）。
  2. 动态语种探测（Language Detection）：前端或网关分析用户输入语种，作为变量动态拼入 System Prompt（如 `Respond in: ${detectedLanguage}`）。
- **决策指导**: 
  - **通用**: 在 Prompt 模板的底部（权重最高的位置）增加显式对齐指令（例如：`[IMPORTANT] Reply in the same language as the user's input`）。

#### TypeScript 示例（大模型 Prompt 动态语种注入）
```typescript
import { franc } from 'franc';

function getLanguageName(msg: string): string {
  const langCode = franc(msg);
  switch (langCode) {
    case 'cmn': return 'Chinese (Simplified)';
    case 'eng': return 'English';
    case 'jpn': return 'Japanese';
    default: return 'the same language as the user used';
  }
}

async function prepareAgentPayload(userMessage: string, chatHistory: any[]) {
  const detectedLang = getLanguageName(userMessage);
  const systemInstruction = 
    `You are a helpful coding assistant. \n` +
    `[IMPORTANT DIRECTION]\n` +
    `The user is speaking in ${detectedLang}. You MUST write your response entirely in ${detectedLang}.`;

  return [
    { role: 'system', content: systemInstruction },
    ...chatHistory,
    { role: 'user', content: userMessage }
  ];
}
```

---

## 边界分析输出协议

在分析具体代码或方案的边界条件时，必须使用以下 Markdown 模板向用户呈现：

```md
### 🔍 发现边界: [边界场景名称]

- **场景描述**: [简述触发条件，以及当前 Happy Path 在异常时会发生什么]
- **影响评估**: 发生概率: `[高/中/低]` | 故障影响: `[灾难性/严重/轻微]`

#### 1. 业界 Strong 做法
> [说明业界最成熟、最可靠的无损解决方案与核心机制]

#### 2. 复杂度与 ROI 分析
- **开发与维护复杂度**: [说明要引入的依赖、开发工作量和后续维护成本]
- **ROI 评估**: [对比 发生损失 vs. 建设成本，说明选择/不选择 full 方案的逻辑]

#### 3. 最终决策与落地代码
- **决策**: `[Do Nothing + Alert / Mitigation 缓解方案 / Full Standard 完整方案]`
- **决策依据**: [简短说明选择这个方案的 Pragmatic 理由]
- **落地实现**:
  ```[language]
  // 编写完整、严谨且带错误处理的代码
  ```
- **验证与测试建议**:
  - [如何手工模拟或单元测试该异常流？]
```
