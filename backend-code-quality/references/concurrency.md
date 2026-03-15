# Concurrency Patterns & Anti-Patterns

以 Go 为主要示例，通用规则适用于 Python asyncio/Celery、Node.js worker 等。

---

## Goroutine 泄漏

### 典型场景：unbuffered channel + context 取消

```go
// ❌ ctx 取消后，发送端永远阻塞
func fetch(ctx context.Context) (string, error) {
    ch := make(chan string) // unbuffered
    go func() {
        result := expensiveQuery()
        ch <- result // 没人接收 → 永久阻塞
    }()
    select {
    case r := <-ch:
        return r, nil
    case <-ctx.Done():
        return "", ctx.Err() // goroutine 泄漏
    }
}

// ✅ 方案 A：buffered channel
ch := make(chan string, 1)

// ✅ 方案 B：errgroup（推荐）
g, ctx := errgroup.WithContext(ctx)
var result string
g.Go(func() error {
    var err error
    result, err = expensiveQuery()
    return err
})
return result, g.Wait()

// ✅ 方案 C：发送端也检查 ctx
go func() {
    result := expensiveQuery()
    select {
    case ch <- result:
    case <-ctx.Done():
    }
}()
```

### 检测

- 测试：`goleak.VerifyNone(t)` (uber-go/goleak)
- 监控：导出 `runtime.NumGoroutine()` 到 Prometheus
- Profiling：`go tool pprof http://localhost:6060/debug/pprof/goroutine`

---

## Data Race 常见模式

### 并发 Map 写入

```go
// ❌ fatal: concurrent map writes
cache := map[string]string{}
go func() { cache["a"] = "1" }()
go func() { cache["b"] = "2" }()

// ✅ sync.RWMutex
type SafeCache struct {
    mu   sync.RWMutex
    data map[string]string
}
func (c *SafeCache) Get(k string) string {
    c.mu.RLock()
    defer c.mu.RUnlock()
    return c.data[k]
}
func (c *SafeCache) Set(k, v string) {
    c.mu.Lock()
    defer c.mu.Unlock()
    c.data[k] = v
}
```

### 并发 Slice Append

```go
// ❌ data race：slice 元数据（ptr, len, cap）不是原子的
results := []Item{}
for range items {
    go func() {
        results = append(results, process()) // RACE
    }()
}

// ✅ 用 channel 收集结果
ch := make(chan Item, len(items))
for _, item := range items {
    item := item
    go func() { ch <- process(item) }()
}
for range items {
    results = append(results, <-ch)
}
```

### 循环变量捕获

```go
// ❌ i 被引用捕获
for i := 0; i < 10; i++ {
    go func() { process(i) }() // i 可能是 9 或 10
}

// ✅ 拷贝
for i := 0; i < 10; i++ {
    i := i
    go func() { process(i) }()
}
```

### Race Detector

```bash
go test -race ./...          # 测试时检测
go run -race main.go         # 运行时检测（10x 慢，5-10x 内存）
go build -race -o app_race   # 构建 race 检测版本（仅用于测试环境）
```

Race detector 是运行时检测，只能发现被执行到的 race。测试覆盖率决定检测有效性。

---

## Mutex vs Channel 选择

| 用 Mutex | 用 Channel |
|---------|-----------|
| 缓存读写 | 传递数据所有权 |
| 计数器、指标 | 分发工作单元 |
| 简单状态保护 | 协调 goroutine 生命周期 |
| 性能关键路径 | 信号通知（完成、取消） |

```go
// Mutex：简单状态（计数器）
type Counter struct {
    mu    sync.Mutex
    value int
}
func (c *Counter) Inc() {
    c.mu.Lock()
    c.value++
    c.mu.Unlock()
}

// Channel：工作分发
type Pool struct {
    tasks chan Task
}
func (p *Pool) Submit(t Task) { p.tasks <- t }
```

**混合模式**（生产常见）：channel 做工作分发 + mutex 保护统计数据。

---

## Worker / Job Queue 规则

### 1. 必须响应 context 取消

```go
// ❌ 长循环不检查取消
func (h *Handler) Process(ctx context.Context, task *asynq.Task) error {
    for i := 0; i < 10000; i++ {
        doWork(i) // shutdown 后仍在跑
    }
    return nil
}

// ✅ 循环内检查
func (h *Handler) Process(ctx context.Context, task *asynq.Task) error {
    for i := 0; i < 10000; i++ {
        if err := ctx.Err(); err != nil {
            return err
        }
        doWork(i)
    }
    return nil
}
```

Python/Celery 等效：检查 `task.request.is_revoked()` 或 catch `SoftTimeLimitExceeded`。

### 2. 指数退避 + jitter

```go
// asynq 默认使用指数退避
// 区分可重试和不可重试错误：
func (h *Handler) Process(ctx context.Context, task *asynq.Task) error {
    err := callExternalAPI()
    if err != nil {
        if isPermanent(err) {
            return asynq.SkipRetry // 不重试
        }
        return err // 触发指数退避重试
    }
    return nil
}
```

### 3. 幂等性

```go
// ❌ 重试会发两封邮件
func (h *Handler) SendEmail(ctx context.Context, task *asynq.Task) error {
    return h.mailer.Send(payload.Email, payload.Subject)
}

// ✅ idempotency key
func (h *Handler) SendEmail(ctx context.Context, task *asynq.Task) error {
    return h.mailer.SendWithID(payload.Email, payload.Subject, payload.MessageID)
}
```

幂等实现方式：
- 外部 API 的 idempotency key（Stripe 等支持）
- DB 去重表：`INSERT ... ON CONFLICT DO NOTHING`
- 状态机：检查当前状态再决定是否执行

### 4. 并发度配置

```go
srv := asynq.NewServer(redis, asynq.Config{
    Concurrency: runtime.NumCPU() * 2, // I/O 密集
    // Concurrency: runtime.NumCPU(),  // CPU 密集
})
```

---

## Context 传播

### 规则

```go
// ❌ 存 struct 字段
type Worker struct {
    ctx context.Context // 哪个调用方的？超时多少？
}

// ✅ 作为函数第一个参数
func (w *Worker) Fetch(ctx context.Context) (*Data, error) {
    return w.db.QueryContext(ctx, "SELECT ...")
}

// 调用方控制超时
w.Fetch(context.WithTimeout(ctx, 5*time.Second))
```

### context.Background() 使用场景

只在真正的顶层：`main()`、测试 setup、HTTP handler 入口。业务层如果用 `context.Background()` 就吞掉了调用方的取消信号。

### Context Values

```go
// ❌ 用 context 传业务数据
ctx = context.WithValue(ctx, userIDKey{}, userID)

// ✅ 显式参数
func process(ctx context.Context, userID string) error { ... }
```

Context values 只适合 request-scoped 的横切数据（trace ID、deadline），不适合业务参数。

---

## errgroup 最佳实践

```go
g, ctx := errgroup.WithContext(ctx)
g.SetLimit(20) // 限制并发度

for _, id := range userIDs {
    id := id
    g.Go(func() error {
        return fetchUser(ctx, id)
    })
}

if err := g.Wait(); err != nil {
    return err
}
```

### 常见错误

1. **Add 在 Go 之后**（WaitGroup）：`wg.Add(1)` 必须在 `go func()` 之前
2. **忘记 Done**：永远用 `defer wg.Done()`
3. **复用 group**：Wait 返回后不要再往同一 group 加任务，新建一个
4. **不限并发**：1M 个 ID 就起 1M 个 goroutine → OOM

来源：Go Wiki "MutexOrChannel", Go Blog "Context and Structs", Go Blog "Race Detector", Uber Blog "Data Race Patterns in Go", asynq Wiki "Task Timeout and Cancelation", uber-go/goleak
