# 错误处理审查参考

这个文件用于判断错误是如何传播、记录和暴露的，不是语言特定 API 速查表。

## 先看什么

1. 错误从底层到边界如何传播
2. 唯一 log 点在哪里
3. 什么错误会暴露给用户
4. 领域错误和基础设施错误是否分层
5. panic / recover 是否只留在边界

## 1. Wrap 还是映射

### 基本判断

- 需要补上下文，且不泄露内部实现：wrap
- 需要隐藏底层实现细节：映射成领域错误
- 当前层能完整处理：处理并结束传播

### Go 例子

```go
return nil, fmt.Errorf("load user %s: %w", id, err)
```

如果这是数据库未找到，但对外只应该暴露“用户不存在”，则映射为领域错误，而不是把底层错误类型一路暴露。

## 2. Log-and-Return

### 典型风险

- repository log 一次
- service wrap 前再 log 一次
- handler / worker 入口最终又 log 一次

结果：

- 同一错误多条重复日志
- 排障时噪音大于信息
- 调用链层数越深，日志越重复

### 更稳的边界

- 底层：return error，不 log
- 中层：补上下文并 return
- 顶层边界：统一 log，并映射到响应 / 重试语义

## 3. 暴露内部错误

### 高风险信号

- HTTP 500 直接返回数据库报错、堆栈、文件路径
- 对未认证 / 无权限场景暴露过多内部信息
- 响应里携带敏感字段、SQL、服务名、主机信息

### 审查动作

- 看 handler / middleware 最终返回的错误结构
- 看日志是否完整而响应是否克制
- 看敏感信息是否出现在日志或返回体

### HTTP 错误映射速查

| 内部错误类型 | HTTP | 对外原则 |
|---|---:|---|
| 输入格式错误 | 400 | 说明格式要求，不暴露内部实现 |
| 业务校验失败 | 422 | 返回字段级错误或可理解消息 |
| 资源不存在 | 404 | 不补充内部查询细节 |
| 未认证 | 401 | 不区分用户名不存在还是密码错误 |
| 无权限 | 403 | 不额外暴露资源内部状态 |
| 限流 | 429 | 返回重试语义，例如 `Retry-After` |
| 内部错误 | 500 | 响应统一通用消息，细节只进日志 |

### 统一错误响应形态

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "password is too short",
    "details": [
      { "field": "password", "issue": "too_short" }
    ]
  }
}
```

## 4. Sentinel 与自定义错误类型

### 何时适合 sentinel

- 包内固定条件
- 调用方只需判断一个稳定分支

### 何时适合自定义错误类型

- 需要携带字段、资源 ID、校验详情
- 调用方要做结构化分支判断

### 审查关注点

- 是否把所有错误都做成字符串比较
- 是否把领域语义硬塞给底层库错误
- 是否需要结构化信息却只返回裸字符串

## 5. Panic / Recover 边界

### 允许 recover 的位置

- HTTP middleware
- goroutine 入口
- worker 入口

### 不该做的事

- 业务代码到处 recover
- 库代码主动 panic 表达普通失败
- recover 后吞掉错误，导致真实 bug 被隐藏

## 6. Structured Logging 约束

### 必须有

- 稳定事件名
- level
- request / correlation ID
- 结构化 KV 字段，而不是整段字符串拼接

### 禁止有

- 密码、token、密钥、未脱敏 PII
- 原始 request / response body，除非已脱敏且确有必要
- 直接返回给客户端的堆栈、SQL、文件路径

### Go 例子

```go
slog.Error("request_failed",
    "request_id", requestID,
    "path", r.URL.Path,
    "err", err,
)
```

### 跨语言等价信号

- Go `fmt.Errorf(... %w ...)`，等价于 Python `raise ... from err` 或 Java / Kotlin 用 cause 包裹底层异常
- Go `slog.Error(...)`，等价于结构化 logger，而不是裸 `print` / `console.log` 拼接长字符串

## 最小验证

- 沿一条失败路径数一遍日志点，确认同一错误不会被重复记录
- 检查 4xx / 5xx 响应是否泄露 SQL、堆栈、文件路径、服务名或敏感字段
- 检查 `recover` 是否只放在 HTTP / worker / goroutine 入口，而不是业务逻辑内部
- 检查结构化日志里是否带 request / correlation ID，且未记录 token、密码、原始敏感 body

## 7. 审查输出句式

- “同一条失败路径在 repository、service、handler 三层都记录日志，形成 log-and-return，噪音高且不利于排障。”
- “这里把底层数据库错误直接映射到 HTTP 响应，会泄露内部实现细节。”
- “service 返回的是传输层语义而不是领域错误，导致边界职责反转。”
- “`recover` 放在业务代码内部，会把编程错误伪装成业务失败。”
- “日志里记录了 token / 原始请求体，这会把排障手段变成数据泄露面。”
