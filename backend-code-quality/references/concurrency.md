# 并发与异步审查参考

这个文件用于审查 goroutine、worker、job handler、async flow 的生产安全性。

## 先看什么

1. 每个异步分支是否有退出路径
2. 共享状态如何保护
3. context 是否从入口一路传到底层 I/O
4. 重试是否有边界
5. 副作用是否幂等

## 1. 泄漏与退出路径

### 高风险信号

- `go func()` 启动后没有等待、取消或回收机制
- unbuffered channel 上发送，但接收方可能提前退出
- worker shutdown 后仍继续执行长循环

### Go 例子

```go
// ❌ ctx 取消后，发送端可能永久阻塞
ch := make(chan string)
go func() {
    ch <- expensiveQuery()
}()
select {
case result := <-ch:
    return result, nil
case <-ctx.Done():
    return "", ctx.Err()
}
```

### 审查动作

- 看每个 goroutine 的结束条件
- 看 channel 是否可能永远没人接
- 看是否有 `WaitGroup` / `errgroup` / worker lifecycle 管理

### 最小验证

- Go 项目优先查是否有 `goleak.VerifyNone(t)` 或 goroutine 数量监测
- 涉及并发读写时优先建议 `go test -race`

## 2. 共享状态

### 常见问题

- map 并发写
- slice 并发 append
- 同一对象跨多个 goroutine 修改但没锁

### 审查动作

- 找出共享 map / cache / accumulator
- 判断是用 mutex、channel 所有权转移，还是完全没保护
- 如果是读多写少，确认锁策略是否合理

## 3. Context 传播

### 高风险信号

- 在业务层使用 `context.Background()`
- 把 `context.Context` 存进 struct 字段长期复用
- 入口设置了 timeout，但底层 DB / HTTP client 没接到

### 审查动作

- 看 context 是否作为函数第一个参数传递
- 看外部 I/O 是否真的接了这个 context
- 看 shutdown / cancel 信号能否中断长任务

## 4. 重试与幂等

### 重试必须回答两个问题

1. 哪些错误可重试，哪些不可重试
2. 重试后副作用会不会重复执行

### 高风险信号

- 所有错误一律重试
- 没有最大次数、backoff、jitter
- 发邮件、扣款、发消息、写外部系统但没有幂等键

### 审查动作

- 看错误分类逻辑
- 看 retry policy 是否有边界
- 看副作用是否有 idempotency key、去重表或状态机保护

### 最小阈值

- 只要存在外部副作用，缺少幂等保护就至少是 `Medium`
- 如果会重复扣款、发消息、发通知，直接按 `High`

## 5. 并发度控制

### 高风险信号

- 按输入规模启动无限 goroutine
- 队列消费者 concurrency 没根据任务类型限制
- CPU 密集任务按 I/O 密集策略放大并发

### 审查动作

- 看是否有 `SetLimit`、semaphore、worker pool
- 看并发上限是否与任务类型匹配
- 看失败时是否会放大下游压力

## 6. 审查输出句式

- “这个 goroutine 在调用方超时退出后仍可能阻塞在发送操作上，存在泄漏风险。”
- “重试路径没有幂等保护，失败后重跑会重复执行外部副作用。”
- “context 在入口创建了，但没有继续传到底层 I/O，取消和超时无法真正生效。”
- “并发度没有上限，输入规模放大时会直接放大 goroutine 和下游压力。”

## 参考依据

- Go 官方 `context` 与并发实践
- `go test -race`
- `uber-go/goleak`
- 常见 worker / job queue 失败模式：取消失效、无限重试、非幂等副作用
