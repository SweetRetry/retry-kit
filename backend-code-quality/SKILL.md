---
name: backend-code-quality
description: >
  Backend API / Worker 编码质量与反模式检测。覆盖 ORM 使用、错误处理、并发安全、
  API handler 分层、过度工程五大领域的通用规则与检查项。以 Go (Gin/GORM/asynq) 为主要示例，
  但规则本身语言无关，适用于任何后端服务。
  触发场景：(1) 编写或审查后端 API handler / service / repository 代码，
  (2) 编写或审查 background worker / job queue 处理逻辑，
  (3) 出现 ORM 误用（N+1、session 复用、hook 塞业务逻辑、事务内做 I/O），
  (4) 出现错误处理问题（log-and-return、暴露内部错误、缺少 wrap 上下文），
  (5) 出现并发问题（goroutine 泄漏、data race、不检查 context 取消、非幂等重试），
  (6) 出现 API 层问题（fat handler、框架 context 穿透 service、响应后不 return），
  (7) 出现过度工程（预防式 interface、单用 factory、过早泛型、错误抽象），
  (8) 用户提到"代码审查"、"反模式"、"code review"、"过度抽象"、"错误处理"、
  "并发安全"、"handler 太胖"、"N+1"。
  不处理：项目目录结构（交给 go-project-best-practices / python-web-api-best-practices），
  部署运维，微服务架构设计。
---

# Backend Code Quality

后端 API / Worker 编码质量规范。规则语言无关，示例以 Go 为主。

> **核心立场**：代码审查不是风格偏好，而是防止生产事故。每条规则都对应一个真实的生产问题。

---

## 1. ORM 使用

### 规则

- **每次操作链使用新 session**。不复用带查询状态的 DB 实例——前一次 `Where` 条件会污染下一次查询。用 `WithContext(ctx)` 或 `Session(&gorm.Session{})` 开始新链。
- **连接池必须显式配置**。`MaxIdleConns ≤ MaxOpenConns`，设 `ConnMaxLifetime`（建议 5min），按 `max(并发请求数 × 平均持连接时间)` 估算上限。
- **Hook 只做数据规范化**（lowercase、默认值、计算字段）。发邮件、推事件、清缓存等副作用放 service 层，不放 model hook——hook 在事务未提交时执行，外部调用不可回滚。
- **事务内不做外部 I/O**。持锁期间调外部 API = 数据库连接被占满。先查数据 → 释放锁 → 做 I/O → 再开事务写入。
- **用回调式事务**（`db.Transaction(func(tx) error {…})`），不用手动 `Begin/Commit`——手动模式不支持 savepoint 嵌套，且忘 rollback 会泄漏连接。

### 检查项

- [ ] 展示型查询是否 eager load 关联（Preload / Include / joinedload）？用 100+ 父记录测试确认无 N+1
- [ ] 软删除表的 JOIN 是否手动加了 `deleted_at IS NULL` 过滤？
- [ ] 软删除唯一索引是否用 flag（0/1）而非 timestamp？
- [ ] Raw SQL 是否全部用参数化占位符（`?` / `$1` / `:name`），无字符串拼接？

### 反模式速查

| ID | 名称 | 症状 | 修复 |
|----|------|------|------|
| ORM-1 | Session 复用 | 查询条件污染、连接泄漏 | 每操作链新 session |
| ORM-2 | N+1 查询 | 100 条父记录 = 101 条 SQL | Preload / eager load |
| ORM-3 | Hook 塞业务逻辑 | 事务未提交就发了邮件 | 移到 service 层 |
| ORM-4 | 事务内 I/O | 持锁等网络响应 | 拆成查→I/O→写 |
| ORM-5 | 手动 Begin/Commit | 嵌套事务失败、忘 rollback | 用回调式事务 |

> 详细的跨 ORM 对比和代码示例见 [orm-patterns.md](references/orm-patterns.md)
> SQL 查询优化（索引策略、分页、聚合、执行计划分析）见 [sql.md](references/sql.md)

---

## 2. 错误处理

### 规则

- **Wrap 或上抛，二选一**。加上下文时 wrap（`fmt.Errorf("load user: %w", err)`），会暴露实现细节时直接返回。
- **Log 或 return，不能两者都做**（Log-and-return 反模式）。底层 wrap + 上抛，顶层（HTTP middleware / worker 入口）统一 log。一个错误只打一次日志。
- **Sentinel 用于包内固定条件**（`io.EOF`, `sql.ErrNoRows`）；公开 API 用自定义错误类型，携带结构化信息。
- **API 错误响应不泄露内部细节**。堆栈、SQL、服务名、文件路径都不能出现在 HTTP 响应里。内部 log 完整记录，外部只返回安全的错误码 + 用户可理解的消息。
- **Panic/异常只在系统边界 recover**：HTTP middleware、goroutine 入口、worker 入口。业务代码不 recover，库代码不 panic。

### 检查项

- [ ] 结构化日志是否用 KV 对而非字符串拼接？
- [ ] 每条日志是否带 correlation/request ID？
- [ ] 是否记录了敏感信息（密码、token、PII）？
- [ ] 错误响应格式是否全局统一（所有端点同一结构）？

### 反模式速查

| ID | 名称 | 症状 | 修复 |
|----|------|------|------|
| ERR-1 | Log-and-return | 同一错误日志出现多次 | 底层 wrap，顶层 log |
| ERR-2 | 暴露内部错误 | 500 响应含堆栈/SQL/路径 | 映射到安全错误码 |
| ERR-3 | 到处 recover | panic 被吞没，bug 隐藏 | 只在系统边界 recover |

> 详细的 wrap 决策树和错误码映射表见 [error-handling.md](references/error-handling.md)

---

## 3. 并发安全

### 规则

- **每个 goroutine/coroutine 必须有退出路径**。用 buffered channel（cap=1）或 errgroup 防止发送端永久阻塞。测试用 `goleak.VerifyNone(t)`。
- **共享可变状态必须加锁**。Map 并发写 = fatal crash，slice 并发 append = data race。读多写少用 `sync.RWMutex`，写多用 `sync.Mutex`。
- **Mutex vs Channel 选择**：简单状态变更（计数器、缓存）用 mutex；协调多 goroutine 生命周期（任务分发、信号通知）用 channel。
- **Worker 必须响应 context 取消**。长循环内检查 `ctx.Done()` 或 `ctx.Err()`，不能让 worker 在 shutdown 后继续跑。
- **重试必须指数退避 + jitter**。区分可重试错误（网络超时）和不可重试错误（参数无效），不可重试直接 `SkipRetry`。
- **有副作用的任务必须幂等**。用 idempotency key 或 DB 去重，保证重试不会发两封邮件 / 扣两次款。
- **Context 作为函数第一个参数传递**，不存 struct 字段（破坏 per-operation 超时），不在业务层用 `context.Background()`（吞掉取消信号）。
- **并发度必须有上限**。`errgroup.SetLimit()` / `Semaphore`。I/O 密集 `CPU*2~4`，CPU 密集 `CPU*1`。无上限 = OOM 风险。

### 检查项

- [ ] 循环变量传入 goroutine 前是否拷贝？（`i := i`）
- [ ] `wg.Add()` 是否在 `go func()` 之前调用？
- [ ] errgroup 使用后是否新建而非复用？

### 反模式速查

| ID | 名称 | 症状 | 修复 |
|----|------|------|------|
| CON-1 | Goroutine 泄漏 | NumGoroutine 持续增长 | buffered chan / errgroup |
| CON-2 | 并发 map 写入 | fatal: concurrent map writes | sync.RWMutex / sync.Map |
| CON-3 | 不检查 ctx 取消 | worker 关不掉 | 循环内 select ctx.Done() |
| CON-4 | 无限重试 | 下游被打爆 | 指数退避 + 最大次数 |
| CON-5 | 非幂等副作用 | 重试发两封邮件 | idempotency key |
| CON-6 | 无并发上限 | 1M goroutine → OOM | SetLimit / Semaphore |

> 详细的并发模式代码示例见 [concurrency.md](references/concurrency.md)

---

## 4. API Handler 层

### 规则

- **Handler 是 HTTP 适配器**，只做：解析请求 → 调 service → 格式化响应。业务逻辑在 service 层，数据访问在 repository 层。
- **框架 Context 不传入 service 层**。Gin 的 `*gin.Context` / Express 的 `req` 对象止步于 handler。Service 接收 `context.Context`（Go）或等效的标准类型，保持框架无关。
- **请求绑定只调一次**。HTTP body 是流，读一次就空了。Handler 入口统一绑定 + 验证，结果传给后续逻辑。
- **发送响应后必须 return**。`c.JSON()` / `res.send()` 不会中断函数执行，不 return 会继续跑后续代码。
- **中间件只做横切关注点**：认证、日志、CORS、panic 恢复。业务判断放 handler/service，不放 middleware。
- **依赖单向流动**：Handler → Service → Repository。内层不导入外层包，Service 不知道 HTTP 状态码，Repository 不知道 handler 类型。
- **统一响应格式**：所有端点（成功 + 错误）用同一 JSON 结构。客户端不需要条件解析逻辑。

### 反模式速查

| ID | 名称 | 症状 | 修复 |
|----|------|------|------|
| API-1 | Fat handler | 300 行 handler 函数 | 拆到 service + repo |
| API-2 | 框架 ctx 穿透 | service 依赖 gin.Context | 提取 context.Context |
| API-3 | JSON 后不 return | 响应发了但代码继续跑 | 立即 return |
| API-4 | Service 返 HTTP 码 | service 里 `return 400, err` | 返回领域错误，handler 映射 |

> 详细的分层示例和中间件排序规范见 [api-layer.md](references/api-layer.md)

---

## 5. 过度工程

### 规则

- **Interface 在需要时创建，不预防式定义**。只有多实现 OR 测试 mock 需求时才加。Consumer 侧定义，越小越强（Rob Pike: "The bigger the interface, the weaker the abstraction"）。
- **DI 先用构造函数注入**。20+ 组件或复杂初始化序列才引入 Wire/dig/fx 等框架。小项目加 DI 框架 = 纯增复杂度。
- **Factory/Builder 只用于真正多态或复杂初始化**。如果只有一个实现且构造只需一行，直接 `new`。
- **YAGNI：只构建当前需求的功能**。让代码易于变更，而非预测未来。"以后可能需要"不是写代码的理由。
- **错误的抽象比重复更贵**（Sandi Metz）。等 2-3 个真实例子再提取。发现抽象里堆满 `if/flag` 时，回退到重复，重新发现模式。
- **泛型/类型参数只用于集合和真正复用**。只处理一种类型的代码不加泛型。
- **配置用于运维控制（灰度、开关、AB 测试），不用于回避设计决策**。"我拿不准所以做成配置" = 没做决定。

### 反模式速查

| ID | 名称 | 症状 | 修复 |
|----|------|------|------|
| ENG-1 | 预防式 interface | 0 或 1 个实现 | 等需要时再加 |
| ENG-2 | 单用 factory | new 一行变成 factory 一个文件 | 直接构造 |
| ENG-3 | 过早泛型 | 只处理一种类型却加了 `[T any]` | 用具体类型 |
| ENG-4 | 错误抽象 | 抽象里堆满 if/flag | 回退重复，重新提取 |
| ENG-5 | 配置逃避 | 永远不会 toggle 的 feature flag | 做决定，删 flag |

> 详细的决策树和 Sandi Metz / Dan Abramov 原则展开见 [over-engineering.md](references/over-engineering.md)

---

## 审查工作流

当审查后端代码时，按以下顺序扫描：

1. **分层** — handler 是否只做 HTTP 翻译？service 是否框架无关？
2. **ORM** — 有无 N+1？session 是否安全？事务内有没有 I/O？
3. **错误处理** — 有无 log-and-return？错误响应是否泄露内部信息？
4. **并发** — goroutine 有没有退出路径？共享状态有没有保护？worker 是否幂等？
5. **抽象度** — 有没有没人用的 interface？有没有只构造一次的 factory？
