---
name: backend-code-quality
description: >
  Backend API / Worker 代码审查与反模式检测 skill。聚焦 ORM 使用、错误处理、并发安全、
  API handler 分层、过度工程五个高风险领域，帮助 agent 以证据驱动的方式发现 bug、回归风险、
  不安全实现和错误抽象。只要用户让你 review 后端 API / service / repository / worker 代码，
  或怀疑存在 N+1、log-and-return、context 传播、幂等、fat handler、interface 污染、
  错误抽象等问题，即使用户没有明确说“代码审查”，也应该优先使用本 skill。
  以 Go (Gin/GORM/asynq) 为主示例，但审查动作本身语言无关。
  不处理：项目目录结构、部署运维、容量规划、微服务拆分。
---

# Backend Code Quality

这个 skill 不负责“给后端最佳实践做百科全书式讲解”，而负责把后端代码审查变成稳定、可执行、可验证的工作流。

核心目标只有三个：

1. 找出真实会导致生产问题的缺陷，而不是风格偏好
2. 让 findings 能直接回指到代码证据和修复方向
3. 控制审查范围，避免从代码质量滑向架构空谈

## 何时使用

优先用于这些场景：

- 用户要求 review / code review / 审查后端代码
- 用户怀疑存在 ORM、错误处理、并发、handler 分层、抽象设计问题
- 用户在实现 API、service、repository、worker、job handler 时要求先做质量把关
- 用户提到这些信号词：
  - `N+1`
  - `log-and-return`
  - `context`
  - `goroutine leak`
  - `幂等`
  - `fat handler`
  - `middleware`
  - `interface 污染`
  - `factory 过度`
  - `过度抽象`

不要用于这些场景：

- 主要问题是目录布局、模块边界、项目结构
- 主要问题是基础设施、部署、监控、运维
- 用户要讨论微服务拆分、组织级架构、团队协作流程
- 用户只是想要框架教程，而不是针对当前代码做判断

需要项目结构时，转交 `go-project-best-practices` 或 `python-web-api-best-practices`。需要宏观架构减负时，转交 `pragmatic-architecture`。

## 核心执行原则

### 1. 先找风险，再谈风格

优先级始终是：

1. correctness / 数据一致性
2. production safety / 回归风险
3. maintainability / 边界清晰度
4. 风格与偏好

如果某个点不会增加 bug 风险、运行风险、排障成本或误用概率，不要把它包装成高优先级 finding。

### 2. finding 必须可证伪

每个关键结论都要尽量满足下面三件事：

- 能指出代码位置或缺失点
- 能解释为什么它会出问题
- 能说明更稳妥的修复方向

避免这种输出：

- “这里可以更优雅”
- “建议抽象一下”
- “看起来不太规范”

改成这种输出：

- “`handler` 在写出响应后没有 `return`，后续仍会继续执行 service 调用，可能造成二次写响应或重复副作用”
- “同一个 DB handle 复用了已附带查询状态的链，后续查询会继承旧条件”
- “worker 重试路径没有幂等保护，失败重跑会重复发邮件”

### 3. 先按审查对象选入口，不要一上来把五个主题全扫一遍

先判断当前代码主要属于哪一类：

- API / handler / middleware
- service / orchestration
- repository / ORM / SQL
- worker / job / async handler
- 抽象层 / interface / factory / generic helper

然后只展开最相关的 2-3 个主题，除非用户明确要求全面审查。

### 4. 结论必须区分严重度

默认用这三级：

- `High`: 明确 bug、数据错误、并发问题、事务错误、安全或稳定性风险
- `Medium`: 易误用设计、错误边界不清、回归风险、可维护性明显恶化
- `Low`: 可以优化但当前未形成直接风险

如果用户要 review，先给 `High`，再给 `Medium`，最后才是 `Low`。

### 5. 先做跨语言映射，再套示例

这个 skill 以 Go 例子为主，但判断逻辑不是 Go 专属。遇到其他栈时，先把失败模式映射，再看 API 名字：

- `gin.Context` / `echo.Context` -> `FastAPI Request` / `Express req,res`
- `gorm.Session` / query chain -> SQLAlchemy session / Prisma query builder / ActiveRecord scope
- `asynq` retry / cancel -> Celery / BullMQ / Sidekiq 的 retry / timeout / idempotency

如果风险模式成立，就可以给 finding；不要因为代码里没出现 Go API 名称，就放过同类问题。

## 审查前的最小判断

开始前先确定下面几点；如果缺失会显著影响结论，再向用户提问：

1. 这次看的对象是什么：API、worker、service、repository，还是整个改动
2. 你的角色是什么：找 bug、给实现建议，还是做准入审查
3. 是否允许改产品逻辑，还是只能在既有行为内修实现
4. 是否需要向后兼容
5. 审查语言 / 框架是什么

如果信息不完整但代码里已经能看出来，就直接继续，不要为了提问而提问。

如果用户让你“先把关设计 / 实现方案”但还没有代码，也可以继续，只是要切换成“风险预检”而不是伪装成代码 review：

- 只指出将来最可能踩雷的 1-3 个风险点
- 把无法验证的部分写成 `Open question`
- 不要捏造“位置”或“已确认 bug”

## 审查工作流

### Step 1: 先建立上下文

至少确认：

- 请求入口或任务入口在哪
- 主要业务路径经过哪些层
- 副作用是什么
- 出错后会怎么返回、重试或恢复

如果用户给的是 PR 或局部 diff，不要只盯改动行；要沿着调用链补看上下文，直到能回答：

- 谁负责校验
- 谁负责持久化
- 谁负责错误映射
- 谁负责并发 / 重试 / 取消

### Step 2: 选择审查轨道

按对象优先检查：

- API / handler：`API 层 + 错误处理 + 过度工程`
- repository / ORM：`ORM + SQL + 错误处理`
- worker / async：`并发 + 错误处理 + 幂等`
- service / orchestration：`错误处理 + 分层 + 抽象度`

### Step 3: 用主题检查表找证据

每个主题都按这个结构输出：

- `观察到什么`
- `为什么危险`
- `严重度`
- `建议修复方向`

优先寻找下面三类硬证据：

- `静态证据`：具体代码路径、调用顺序、依赖方向、状态复用
- `运行证据`：SQL 条数、重试行为、日志重复、响应后仍执行、goroutine 数量
- `验证锚点`：测试、`EXPLAIN`、`goleak.VerifyNone(t)`、`go test -race`、100+ 记录样本、幂等键或去重表

### Step 4: 给结论贴上证据标签

只有三种合法结论：

- `Finding`：证据已经足够支撑问题成立
- `Risk hypothesis`：有强信号，但仍缺少关键验证，不要当成已确认 bug
- `Open question`：缺少上下文，继续判断会放大误判

使用规则：

- `High` 优先给 `Finding`；如果做不到，宁可降级为 `Open question`
- 缺少运行证据但静态路径已经明确时，可以给 `Medium` 或 `High`，但要把缺失的验证锚点写清
- 不能把“我怀疑这里可能有问题”直接写成已确认 finding

### Step 5: 按请求形态输出

如果用户要 review，默认输出：

1. findings，按严重度排序
2. open questions / assumptions
3. change summary 或总体评价

如果用户要“实现前自检 / worker 设计检查 / 方案把关”，默认输出：

1. top risks
2. open questions
3. validation checklist

如果没有发现问题，要明确说“未发现明确 findings”，但仍可补充：

- 哪些区域没充分验证
- 哪些测试或运行验证还缺失

## 最小输出协议

### 正式 review

```md
1. [High] <问题标题>
   - 位置: <文件或调用路径>
   - 证据: <观察到的代码行为>
   - 风险: <为什么会出问题>
   - 修复方向: <建议怎么改>
```

### 风险预检 / 设计把关

```md
1. [Risk] <最高优先级风险>
   - 依据: <当前已知设计或代码片段>
   - 为什么现在就该担心: <未来最容易出事故的点>
   - 建议先验证: <测试、trace、SQL 日志、幂等键、race 检查等>
```

### 信息不足时

```md
Open question: <需要确认的点>
- 原因: <为什么它影响结论>
- 需要查看: <测试、日志、调用方、运行路径>
```

## 主题分流速查

主 `SKILL.md` 只负责告诉 agent 什么时候展开某个主题、先抓什么信号、用什么锚点验证；具体规则、例子和改写 heuristics 都下沉到 `references/`。

### ORM / SQL

- 什么时候展开：看到 repository、query builder、transaction、列表接口、raw SQL
- 先抓什么：query chain 复用、N+1、事务内 I/O、raw SQL 拼接、查询形态退化
- 验证锚点：SQL 条数、`100+` 父记录样本、rollback 覆盖、`MaxIdleConns <= MaxOpenConns`、`EXPLAIN`
- 去哪看细节：
  - [orm-patterns.md](/Users/zhangzimin/Documents/sweetRetry/skills/backend-code-quality/references/orm-patterns.md) 负责 session、transaction、hook、soft delete、raw SQL 边界
  - [sql.md](/Users/zhangzimin/Documents/sweetRetry/skills/backend-code-quality/references/sql.md) 负责索引、分页、聚合、批量写入、查询改写

### 错误处理

- 什么时候展开：看到 error wrap、日志、HTTP 错误响应、worker 失败路径、panic / recover
- 先抓什么：log-and-return、内部错误泄露、边界映射缺失、错误类型混乱
- 验证锚点：同一路径日志是否只出现一次、4xx/5xx 是否泄露内部细节、边界层是否统一映射
- 去哪看细节：
  - [error-handling.md](/Users/zhangzimin/Documents/sweetRetry/skills/backend-code-quality/references/error-handling.md)

### 并发 / Worker

- 什么时候展开：看到 goroutine、queue handler、retry、异步副作用、共享状态
- 先抓什么：退出路径缺失、data race、context 不传播、无限重试、非幂等副作用
- 验证锚点：`go test -race`、`goleak.VerifyNone(t)`、最大重试次数、backoff、jitter、幂等键或去重表
- 去哪看细节：
  - [concurrency.md](/Users/zhangzimin/Documents/sweetRetry/skills/backend-code-quality/references/concurrency.md)

### API / Handler 分层

- 什么时候展开：看到 handler、middleware、binding、response mapping、service 边界
- 先抓什么：fat handler、framework context 穿透、body 重复绑定、响应后继续执行、middleware 塞业务逻辑
- 验证锚点：handler 是否直接操作 ORM / SQL、service 是否依赖框架类型、写响应后是否仍有执行分支
- 去哪看细节：
  - [api-layer.md](/Users/zhangzimin/Documents/sweetRetry/skills/backend-code-quality/references/api-layer.md)

### 过度工程

- 什么时候展开：看到 interface、factory、builder、DI、feature flag、泛型 helper
- 先抓什么：预防式 interface、单实现工厂、错误抽象、为未来需求提前抽象、配置逃避决策
- 验证锚点：是否已有 `2+` 真实实现、是否只有薄构造、feature flag 是否有生命周期
- 去哪看细节：
  - [over-engineering.md](/Users/zhangzimin/Documents/sweetRetry/skills/backend-code-quality/references/over-engineering.md)

## 常见失效模式

这个 skill 最容易跑偏到下面几类错误，请主动避免：

- 把所有问题都讲成“架构问题”，却没有代码证据
- 用抽象原则批评代码，但没证明抽象真的造成风险
- 在没有业务上下文时，把特定实现习惯误判成 bug
- 只复述 reference 内容，没有结合当前代码做判断
- 把低优先级风格问题排在真正 bug 前面
- 用户只是让你做设计把关，你却伪造出像代码 review 一样的“已确认 finding”

## 文件分工

- `SKILL.md`：触发边界、审查流程、输出协议、主题分流
- `references/*.md`：具体规则、例子、直接可复用 heuristics
- `evals/evals.json`：最小评测场景
- `evals/fixtures/*`：供 eval 使用的代码片段

如果问题是“这个查询是不是 ORM 误用”，先看 [orm-patterns.md](/Users/zhangzimin/Documents/sweetRetry/skills/backend-code-quality/references/orm-patterns.md)；如果问题是“这条 SQL 形态会不会退化”，再看 [sql.md](/Users/zhangzimin/Documents/sweetRetry/skills/backend-code-quality/references/sql.md)。
