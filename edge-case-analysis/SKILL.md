---
name: edge-case-analysis
description: >
  系统性边界与异常场景（Edge Case）分析与决策 skill。
  聚焦硬件/节点重启（如 AIGC Worker 丢失状态）、数据库状态污染、Agent 上下文超限、高并发与幂等设计等高风险边界。
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
- **数据持久化与一致性保证**：如分布式事务、状态机流转、数据库读写分离下的同步延迟。
- **Agent 与大模型应用开发**：如多轮对话 Chat 上下文限制、长文本输入溢出、多 Agent 协作并发。
- **高并发与接口设计**：如敏感接口（支付、发券、提交申请等）的重复请求防重与幂等处理。
- **核心逻辑重构与 Code Review**：在评估他人代码或进行模块重构时，审视异常流与恢复路径。

---

## 核心执行原则

### 1. 拒绝盲目乐观（Assume Failure）
默认假设一切外部系统都会失败：网络会超时、节点会重启、数据库会死锁、外部 API 会限流、用户会瞬间双击。不要只写 Happy Path。

### 2. 避免过度工程（Pragmatic Trade-off）
知道“最好的方案”是什么，但根据当前的业务阶段、发生概率以及失败代价，客观分析 **ROI (投资回报率)**。
- 允许在 MVP（最小可行性产品）阶段选择“Do Nothing + Monitoring”，但必须是**知情同意（Informed Decision）**，而不是“不知道有这个 bug”。

### 3. 三段式决策链（The Decision Chain）
对于发现的每一个核心边界问题，必须完整走完以下三个步骤，缺一不可：
1. **业界 Strong 做法**：这个领域最成熟、最无可挑剔的架构/设计方案是什么？
2. **复杂度与 ROI 分析**：实现这个方案需要多少工作量？会带来多少运维复杂度？如果出了问题，业务损失有多大？发生概率是多少？
3. **最终决策**：做还是不做？如果做，是实现 Full Strong 方案，还是退而求其次用一个 Low Cost 的 Mitigating 方案？怎么写代码？

---

## 分析工作流

### Step 1: 发现边界 (Brainstorm & Identify)
针对要编写或 Review 的代码，从以下几个维度主动推演异常边界：

1. **生命周期与状态丢失**：Worker 执行到一半突然重启（如 Out Of Memory、Pod 重新调度、进程 Crash），未完成的状态是否会永久丢失？是否会留下数据库悬挂状态？
2. **状态污染与事务隔离**：数据库写入报错时，前面的步骤是否回滚？未加事务的第三方副作用（如发送短信）是否已发生？
3. **资源与上下文超限**：Agent/LLM 的 Context 溢出怎么处理？输入长度超限怎么过滤？内存/文件描述符是否释放？
4. **并发与幂等**：同一请求并发到达时，是否会产生并发冲突（如 Duplicate Key 报错、脏写）？下游重试时，逻辑是否幂等？

### Step 2: 检索业界成熟实践 (Strong Practices)
分析业界在解决此类异常时的强规范或模式（如事务隔离、滑窗 Token 截断、Idempotency-Key 防重、分布式锁等）。

### Step 3: 进行复杂度与 ROI 评估
利用下面详述的 **ROI 决策数学模型** 评估开发收益比，避免过度设计。

### Step 4: 给出决策与代码实现
依据项目当前生命周期（MVP vs. 生产级），决定是“不做仅告警”、“提供低成本缓解方案 (Mitigation)” 还是 “实现业界 Strong 方案 (Full Standard)”，并编写落地代码。

---

## Pragmatic ROI 决策数学模型

在评估一个边界场景是否值得修补时，使用以下公式进行定性与定量分析：

$$\text{ROI} = \frac{\text{发生概率} \times \text{单次故障损失 (Cost of Failure)}}{\text{建设与维护成本 (Cost of Implementation)}}$$

### 1. 发生概率 (Probability)
- **高 (High)**：$\ge 1\%$。日常业务流量下，每天或每百次请求必然会遇到（如网络抖动超时、用户快速双击、LLM 上下文溢出）。
- **中 (Medium)**：$0.01\% \sim 1\%$。特定高频操作或系统发布时触发（如滚动发布时 Worker 被杀死、行级锁竞争）。
- **低 (Low)**：$< 0.01\%$。极端物理故障下发生（如 Redis 宕机、主备切换延迟）。

### 2. 故障损失 (Cost of Failure)
- **灾难性 (Catastrophic)**：资损、核心数据损坏污染、安全漏洞、系统核心级雪崩。
- **严重 (Severe)**：单次任务永久失败（如用户付完钱但 AIGC 图片没生成出来），需要人工修改 DB 订正数据，或者引起大量客诉。
- **轻微 (Mild)**：对用户体验影响极小，或者用户只需手动“刷新/重试”即可自行修复，无持久数据污染。

### 3. 建设与维护成本 (Cost of Implementation)
- **高 (High)**：需要引入新的基础设施组件（如 Temporal, Kafka），或者重构大规模数据表，编写复杂的分布式事务补偿。
- **中 (Medium)**：需要编写较复杂的并发控制代码（如自研 Redis 锁中间件、Token 计数截断与大模型摘要历史逻辑）。
- **低 (Low)**：只需几行防御性代码（如增加 `if` 校验、添加 DB `UNIQUE KEY` 约束、API 输入长度物理截断）。

### 4. 阶段决策矩阵

| 边界风险级别 (发生概率 $\times$ 故障影响) | MVP / 验证期 决策 | 快速增长期 决策 | 生产级 / 成熟期 决策 |
| :--- | :--- | :--- | :--- |
| **高风险** | **Mitigation (低成本防线)**<br>只加唯一索引拦截重复，不写复杂事务补偿。 | **Full Standard (标准方案)**<br>实现完整事务、重试退款队列、核心接口加锁防重。 | **Full Standard + Auto-Recovery**<br>实现完全高可用、Saga 自动补偿、熔断。 |
| **中风险** | **Do Nothing + Log/Alert**<br>只留下清晰的错误日志并配置告警。 | **Mitigation (低成本防线)**<br>写轻量级的超时自动失败，或在前端截断。 | **Full Standard**<br>标准覆盖，写入核心架构设计，杜绝人工处理成本。 |
| **低风险** | **Do Nothing**<br>暂不处理，优先交付 Happy Path。 | **Do Nothing + Alert**<br>保持监控即可。 | **Mitigation**<br>用极小成本（几行代码）防护，保证系统完美性。 |

---

## 核心边界场景详解与代码样本

### 场景 1. AIGC / 异步任务 Worker 重启导致任务丢失

- **场景描述**: Worker 节点正在执行耗时任务时突然被杀死（如 OOM、K8s 滚动发布）。数据库中任务状态永远停留在 `PROCESSING`，用户无限 Loading，任务状态悬挂且丢失。
- **业界 Strong 做法**: 带心跳与可见性超时的分布式队列（如 BullMQ, asynq, Temporal）。Worker 抢占任务后有可见性超时，且定期发送心跳；若心跳中断，队列自动回收任务重新分配。
- **决策指导**:
  - **MVP/轻量级**: `Mitigation` 方案（扫描数据库中超时任务并自动重置/失败）。
  - **生产级/高频**: `Full` 方案（基于 BullMQ/asynq 的 ACK/超时自动重入队机制）。

#### Go 示例（Mitigation：轻量级数据库超时扫表重置逻辑）
```go
package main

import (
	"context"
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

// SweepOrphanTasks 扫描悬挂任务（如处于 processing 超过 10 分钟）并尝试重置或标记失败
func SweepOrphanTasks(db *gorm.DB) {
	threshold := time.Now().Add(-10 * time.Minute)
	var tasks []Task

	// 找出所有超时的 processing 任务
	err := db.Where("status = ? AND updated_at < ?", "processing", threshold).Find(&tasks).Error
	if err != nil {
		log.Printf("Failed to scan orphan tasks: %v", err)
		return
	}

	for _, task := range tasks {
		if task.RetryCount >= 3 {
			// 超过最大重试次数，直接标记为失败，避免死循环（Poison Pill 保护）
			db.Model(&task).Updates(map[string]interface{}{
				"status": "failed",
				"updated_at": time.Now(),
			})
			log.Printf("Task %d failed permanently after max retries", task.ID)
		} else {
			// 重置为 pending，让其他 Worker 可以重新领取
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

### 场景 2. 数据库状态污染与事务隔离缺陷

- **场景描述**: 业务流程包含“修改本地 DB -> 掉外部 API -> 再修改 DB 状态”。中途外部 API 失败，前面已经提交的 DB 写入未回滚，产生半吊子非法脏状态。
- **业界 Strong 做法**: 事务（Transaction）仅用于包裹本地 DB 写操作。外部 API 交互绝不能写在事务内部（防止连接悬挂与死锁）。通过 **Transactional Outbox 模式** 或 **Saga 补偿模式** 异步、可靠地调用外部 API。
- **决策指导**:
  - 本地多表修改：**强制**使用本地数据库事务。
  - 混合外部 I/O 写入：遵循 `本地写预备状态 -> 提交事务 -> 执行外部网络 I/O -> 写入最终状态` 的分离设计。

#### TypeScript/Prisma 示例（安全的混合事务操作模式）
```typescript
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function processOrderPayment(userId: string, orderId: string, amount: number) {
  // 1. 本地 DB 事务：仅执行本地 DB 写。不能有任何外部网络 I/O
  const txResult = await prisma.$transaction(async (tx) => {
    const user = await tx.user.findUnique({ where: { id: userId } });
    if (!user || user.balance < amount) {
      throw new Error("INSUFFICIENT_BALANCE");
    }

    await tx.user.update({
      where: { id: userId },
      data: { balance: { decrement: amount } }
    });

    const paymentLog = await tx.paymentLog.create({
      data: { orderId: orderId, amount: amount, status: 'PENDING' }
    });

    return { paymentLogId: paymentLog.id };
  });

  // 2. 事务提交后，在外部执行可能超时的网络 I/O
  try {
    const apiResponse = await callExternalPaymentGateway(orderId, amount);
    
    // 3. 网络调用成功，写入最终状态
    await prisma.paymentLog.update({
      where: { id: txResult.paymentLogId },
      data: { status: 'SUCCESS', externalTxId: apiResponse.gatewayTxId }
    });
  } catch (error) {
    // 4. 网络调用失败，写入失败状态，并执行异步补偿（如退款）
    console.error("External payment failed, scheduling compensation:", error);
    await prisma.paymentLog.update({
      where: { id: txResult.paymentLogId },
      data: { status: 'FAILED', errorMsg: (error as Error).message }
    });
    await scheduleRefund(userId, amount); 
  }
}

async function callExternalPaymentGateway(orderId: string, amount: number) {
  return { gatewayTxId: "gw_129381203" };
}
async function scheduleRefund(userId: string, amount: number) { /* ... */ }
```

---

### 场景 3. Agent 与大模型 Chat 上下文超限（Context Limit）

- **场景描述**: 多轮对话聊天中，历史 Message 逆序增长，超过大模型的最大 Context Window。导致大模型直接返回 400 错误拒绝服务，或生成极慢、费用暴增。
- **业界 Strong 做法**: 动态 Token 预算控制（使用 tiktoken）+ 滑动窗口保护。当 Token 达到预算上限时，自动截取部分较老的消息交给大模型做“摘要总结（Summary Memory）”，将摘要拼入 System Prompt 并丢弃这部分原始历史，释放 Context 空间。
- **决策指导**:
  - **Mitigation/通用**: `系统提示词保留 + 基于 Token 计数的逆序滑动窗口截断`。无需额外调用大模型做摘要，直接安全丢弃超出预算的最早消息。

#### Python 示例（基于 Token 逆序滑窗截断算法）
```python
import tiktoken
from typing import List, Dict

def truncate_messages_by_token_limit(
    messages: List[Dict[str, str]], 
    max_tokens: int = 4000, 
    model: str = "gpt-4"
) -> List[Dict[str, str]]:
    """
    根据 Token 预算对消息列表进行安全截断。
    规则：必须保留 System Prompt，逆序保留最新的对话，直到达到 max_tokens 预算限制。
    """
    try:
        encoding = tiktoken.encoding_for_model(model)
    except KeyError:
        encoding = tiktoken.get_encoding("cl100k_base")

    def count_message_tokens(msg: Dict[str, str]) -> int:
        return len(encoding.encode(msg.get("content", ""))) + 4

    system_prompts = [m for m in messages if m.get("role") == "system"]
    chat_history = [m for m in messages if m.get("role") != "system"]

    system_tokens = sum(count_message_tokens(m) for m in system_prompts)
    available_budget = max_tokens - system_tokens

    if available_budget <= 500:
        raise ValueError("System prompt is too long, leaving insufficient budget for conversation.")

    selected_history = []
    accumulated_tokens = 0

    # 逆序遍历历史对话（优先保留最新的）
    for msg in reversed(chat_history):
        msg_token = count_message_tokens(msg)
        if accumulated_tokens + msg_token > available_budget:
            break
        selected_history.insert(0, msg)
        accumulated_tokens += msg_token

    return system_prompts + selected_history
```

---

### 场景 4. 并发冲突与幂等性实现

- **场景描述**: 用户多击按钮同时发出两个扣款请求，或者 MQ 重试发送了两次扣款消息。由于服务端缺乏并发锁，导致重复扣款。
- **业界 Strong 做法**: 客户端携带 UUID `Idempotency-Key`；服务端使用 Redis 以原子操作 `SET NX PX` 加防重分布式锁，锁状态存入 Redis。处理成功后，将 Response 结果直接序列化缓存于 Redis 中。下次遇到相同 Key，若还在处理则报 409 Conflict，若已成功直接返回缓存的 Response。
- **决策指导**:
  - 非核心更新接口（如修改头像）：不做特殊设计。
  - 核心资损/敏感接口：**强制**实现基于 Redis 的防重锁，以及数据库层面的唯一约束索引（`UNIQUE INDEX`）。

#### TypeScript 示例（基于 Redis 的高可靠防重幂等实现）
```typescript
import Redis from 'ioredis';
const redis = new Redis();

interface IdempotencyResult {
  isDuplicate: boolean;
  status: 'PENDING' | 'SUCCESS';
  cachedResponse?: any;
}

async function checkAndLockIdempotency(key: string, ttlSeconds: number = 60): Promise<IdempotencyResult> {
  const redisKey = `idempotency:${key}`;
  const acquired = await redis.set(redisKey, 'processing', 'EX', ttlSeconds, 'NX');
  
  if (acquired === 'OK') {
    return { isDuplicate: false, status: 'PENDING' };
  }

  const currentStatus = await redis.get(redisKey);
  if (currentStatus === 'processing') {
    return { isDuplicate: true, status: 'PENDING' };
  }

  if (currentStatus && currentStatus.startsWith('success:')) {
    const cachedResponse = JSON.parse(currentStatus.substring(8));
    return { isDuplicate: true, status: 'SUCCESS', cachedResponse };
  }

  return { isDuplicate: true, status: 'PENDING' };
}

async function saveIdempotencyResult(key: string, response: any, ttlSeconds: number = 3600) {
  const redisKey = `idempotency:${key}`;
  const val = `success:${JSON.stringify(response)}`;
  await redis.set(redisKey, val, 'EX', ttlSeconds);
}

// API Handler 示例
async function handlePaymentRequest(req: any, res: any) {
  const idempotencyKey = req.headers['x-idempotency-key'];
  if (!idempotencyKey) {
    return res.status(400).send("Missing Idempotency-Key");
  }

  const check = await checkAndLockIdempotency(idempotencyKey);
  if (check.isDuplicate) {
    if (check.status === 'PENDING') {
      return res.status(409).send("Request is processing, please do not resubmit.");
    }
    if (check.status === 'SUCCESS') {
      return res.status(200).json(check.cachedResponse);
    }
  }

  try {
    const paymentResult = { orderId: req.body.orderId, status: "paid", amount: 100 };
    await saveIdempotencyResult(idempotencyKey, paymentResult);
    return res.status(200).json(paymentResult);
  } catch (err) {
    await redis.del(`idempotency:${idempotencyKey}`);
    return res.status(500).send("Payment failed: " + (err as Error).message);
  }
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
