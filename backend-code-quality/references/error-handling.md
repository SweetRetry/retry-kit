# Error Handling Patterns

语言无关原则，以 Go 为主要示例。

---

## Wrap 决策树

```
收到 error →
├─ 需要加上下文？
│  ├─ 是 → 会暴露实现细节？
│  │  ├─ 是 → 返回新的领域错误（不用 %w）
│  │  └─ 否 → fmt.Errorf("上下文: %w", err)
│  └─ 否 → 直接 return err
└─ 需要在此处处理？
   └─ 是 → 处理 + log，不再上抛
```

### Go 示例

```go
// ✅ 加上下文，不暴露内部
func (s *UserService) GetUser(ctx context.Context, id string) (*User, error) {
    user, err := s.repo.FindByID(ctx, id)
    if err != nil {
        return nil, fmt.Errorf("get user %s: %w", id, err)
    }
    return user, nil
}

// ✅ 隐藏实现细节（不暴露数据库错误类型）
func (s *UserService) GetUser(ctx context.Context, id string) (*User, error) {
    user, err := s.repo.FindByID(ctx, id)
    if err != nil {
        if errors.Is(err, sql.ErrNoRows) {
            return nil, ErrUserNotFound // 领域错误，不 wrap 数据库细节
        }
        return nil, fmt.Errorf("get user: %w", err) // 内部错误可 wrap
    }
    return user, nil
}
```

### 跨语言对照

| 语言 | Wrap 语法 | 检查语法 |
|------|----------|---------|
| Go | `fmt.Errorf("ctx: %w", err)` | `errors.Is(err, target)` / `errors.As(err, &t)` |
| Python | `raise NewErr() from original` | `except SpecificError` / `__cause__` |
| Rust | `.context("msg")?` (anyhow) | `downcast_ref::<T>()` |

---

## Log-and-Return 反模式

### 症状

同一错误在日志里出现 2-5 次（每经过一层 log 一次）。

### 规则：每个错误只 log 一次

```
层级        | 职责
-----------|------------------
Repository | return err（不 log）
Service    | wrap + return（不 log）
Handler    | log + 返回 HTTP 响应（唯一 log 点）
```

```go
// ❌ 每层都 log
func (r *Repo) GetUser(ctx context.Context, id string) (*User, error) {
    user, err := r.db.First(&user, id).Error
    if err != nil {
        slog.Error("db error", "err", err)  // Log 1
        return nil, err
    }
    return &user, nil
}

func (s *Service) GetUser(ctx context.Context, id string) (*User, error) {
    user, err := s.repo.GetUser(ctx, id)
    if err != nil {
        slog.Error("service error", "err", err)  // Log 2 (重复)
        return nil, fmt.Errorf("get user: %w", err)
    }
    return user, nil
}

// ✅ 底层 wrap，顶层 log
func (r *Repo) GetUser(ctx context.Context, id string) (*User, error) {
    user, err := r.db.First(&user, id).Error
    if err != nil {
        return nil, err // 不 log
    }
    return &user, nil
}

func (s *Service) GetUser(ctx context.Context, id string) (*User, error) {
    user, err := s.repo.GetUser(ctx, id)
    if err != nil {
        return nil, fmt.Errorf("get user %s: %w", id, err) // wrap 不 log
    }
    return user, nil
}

func (h *Handler) GetUser(c *gin.Context) {
    user, err := h.service.GetUser(c.Request.Context(), id)
    if err != nil {
        slog.Error("request failed",
            "path", c.Request.URL.Path,
            "err", err,
            "request_id", c.GetString("request_id"),
        ) // 唯一 log 点
        c.JSON(500, ErrorResponse{Error: "internal error"})
        return
    }
    c.JSON(200, user)
}
```

---

## Sentinel vs 自定义错误类型

| 场景 | 用 Sentinel | 用自定义类型 |
|------|-----------|------------|
| 包内固定条件（EOF、NotFound） | ✓ | |
| 公开 API，调用方需结构化信息 | | ✓ |
| 需要携带动态上下文（字段名、ID） | | ✓ |
| 测试断言 | ✓ | |

```go
// Sentinel：固定条件
var ErrNotFound = errors.New("not found")

// 自定义类型：携带信息
type ValidationError struct {
    Field   string
    Message string
}

func (e *ValidationError) Error() string {
    return fmt.Sprintf("validation: %s %s", e.Field, e.Message)
}

// 检查方式
if errors.Is(err, ErrNotFound) { ... }          // sentinel
var ve *ValidationError
if errors.As(err, &ve) { ... }                  // 自定义类型
```

---

## 结构化日志规范

### 必须记录

- Timestamp (ISO 8601 UTC)
- Log level
- Correlation / Request ID
- 结构化 KV 对（不是拼接字符串）

### 禁止记录

- 密码、API key、token
- PII（未脱敏的邮箱、手机号）
- 数据库连接字符串
- 包含敏感信息的完整 request/response body

### Go slog 示例

```go
slog.Info("request processed",
    "request_id", requestID,
    "user_id", userID,
    "duration_ms", elapsed.Milliseconds(),
    "status", statusCode,
)
```

---

## HTTP 错误码映射表

| 内部错误 | HTTP 码 | 响应 |
|---------|---------|------|
| 输入格式无效 | 400 | 说明格式要求 |
| 业务校验失败 | 422 | 说明失败字段 |
| 资源不存在 | 404 | 不透露是否曾经存在 |
| 未认证 | 401 | 不说明是用户不存在还是密码错 |
| 无权限 | 403 | 不透露资源是否存在 |
| 限流 | 429 | 返回 Retry-After header |
| 内部错误 | 500 | 通用消息，内部 log 详细信息 |

### 统一错误响应格式

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Password must be at least 8 characters",
    "details": [
      { "field": "password", "issue": "too_short" }
    ]
  }
}
```

---

## Panic / 异常边界

Recover 只在系统入口处：

```go
// ✅ HTTP middleware
func panicRecovery(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        defer func() {
            if err := recover(); err != nil {
                slog.Error("panic", "err", err, "path", r.URL.Path)
                w.WriteHeader(500)
            }
        }()
        next.ServeHTTP(w, r)
    })
}

// ✅ Goroutine 入口（middleware 的 recover 抓不到子 goroutine 的 panic）
go func() {
    defer func() {
        if err := recover(); err != nil {
            slog.Error("goroutine panic", "err", err)
        }
    }()
    processAsync()
}()
```

**规则**：库代码不 panic，业务代码不 recover。Panic 只用于真正不可恢复的编程错误。

来源：Go Blog "Error Handling and Go", Go Blog "Working with Errors in Go 1.13", Dave Cheney "Don't Just Check Errors", Go Blog "Structured Logging with slog", RFC 9457 Problem Details
