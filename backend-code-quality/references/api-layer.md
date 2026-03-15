# API Handler Layer Patterns

以 Gin (Go) 为主要示例，规则适用于 Express、FastAPI、Echo 等框架。

---

## 分层职责矩阵

| 层 | 职责 | 禁止 |
|----|------|------|
| **Handler** | 解析 HTTP 请求、调用 service、格式化 HTTP 响应 | 业务逻辑、直接数据库操作 |
| **Service** | 业务逻辑、编排、数据转换 | 知道 HTTP 状态码、导入框架包 |
| **Repository** | 数据持久化、查询构建 | 知道 handler 类型、业务决策 |

依赖方向：Handler → Service → Repository（单向，不可反转）

---

## Fat Handler 反模式

### 症状

Handler 函数 200+ 行，包含验证、业务规则、数据库查询、响应格式化。

### 修复

```go
// ❌ Fat handler
func CreateOrder(c *gin.Context) {
    var req CreateOrderRequest
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(400, gin.H{"error": err.Error()})
        return
    }
    // 50 行业务逻辑...
    // 30 行数据库操作...
    // 20 行响应格式化...
}

// ✅ 瘦 handler
func (h *OrderHandler) CreateOrder(c *gin.Context) {
    var req CreateOrderRequest
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(400, ErrorResponse{Error: "invalid request"})
        return
    }

    order, err := h.orderService.Create(c.Request.Context(), &req)
    if err != nil {
        h.handleError(c, err)
        return
    }

    c.JSON(201, order)
}
```

---

## 框架 Context 隔离

```go
// ❌ gin.Context 穿透到 service
func (s *OrderService) Create(c *gin.Context, req *CreateOrderRequest) (*Order, error) {
    userID := c.GetString("user_id")   // 依赖 gin
    c.Set("order_created", true)       // 依赖 gin
    // ...
}

// ✅ 在 handler 层提取，传标准类型
func (h *OrderHandler) CreateOrder(c *gin.Context) {
    ctx := c.Request.Context()
    userID := c.GetString("user_id")

    order, err := h.orderService.Create(ctx, userID, &req)
    // ...
}

func (s *OrderService) Create(ctx context.Context, userID string, req *CreateOrderRequest) (*Order, error) {
    // 不依赖任何 HTTP 框架
}
```

**好处**：service 可以被 worker、CLI、测试直接调用，不需要构造 gin.Context。

---

## 请求绑定规则

### 只绑定一次

```go
// ❌ 绑定两次，第二次拿到空数据
func Handler(c *gin.Context) {
    var req1 PartA
    c.ShouldBindJSON(&req1) // 读完 body

    var req2 PartB
    c.ShouldBindJSON(&req2) // body 已空，req2 全是零值
}

// ✅ 一次绑定完整请求
func Handler(c *gin.Context) {
    var req FullRequest
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(400, ErrorResponse{Error: "invalid request"})
        return
    }
    // 用 req.PartA, req.PartB
}
```

### 验证边界

- Handler 层：语法验证（类型、格式、必填字段）—— 用 struct tag
- Service 层：业务验证（余额够不够、权限对不对）
- 外部输入都是敌意的，验证完再传下去

---

## 响应后必须 Return

```go
// ❌ 忘记 return，后续代码继续执行
func Handler(c *gin.Context) {
    if err := validate(req); err != nil {
        c.JSON(400, ErrorResponse{Error: err.Error()})
        // 没有 return！下面的代码还会跑
    }

    order, _ := service.Create(ctx, &req) // 即使验证失败也会执行
    c.JSON(201, order)                    // 第二次写响应 → 框架警告
}

// ✅ 每次发送响应后立即 return
func Handler(c *gin.Context) {
    if err := validate(req); err != nil {
        c.JSON(400, ErrorResponse{Error: err.Error()})
        return
    }

    order, err := service.Create(ctx, &req)
    if err != nil {
        handleError(c, err)
        return
    }
    c.JSON(201, order)
}
```

---

## 中间件规范

### 只做横切关注点

- ✅ 认证 / 授权
- ✅ 请求日志 / 链路追踪
- ✅ CORS
- ✅ Panic 恢复
- ✅ 限流
- ❌ 业务逻辑
- ❌ 数据转换
- ❌ 特定端点的验证

**判断标准**：如果逻辑只适用于部分端点，它不该在 middleware 里。

### 执行顺序

```
请求 → Recovery → Logger → CORS → Auth → RateLimit → Handler → 响应
```

- Recovery 在最外层（保证任何 panic 都能被抓到）
- Auth 在 Authorization 之前
- CORS 在 Auth 之前（preflight 请求不带 token）

### 中间件不修改已发送的响应

HTTP 响应是流，headers + status 一旦写入就不可更改。需要修改响应的中间件（如压缩）必须在 handler 写入前 wrap response writer。

---

## 统一响应格式

### 所有端点使用同一结构

```go
type Response struct {
    Code    int         `json:"code"`
    Data    interface{} `json:"data,omitempty"`
    Error   *ErrorInfo  `json:"error,omitempty"`
    Message string      `json:"message,omitempty"`
}

type ErrorInfo struct {
    Code    string        `json:"code"`
    Message string        `json:"message"`
    Details []FieldError  `json:"details,omitempty"`
}
```

### 错误映射：领域错误 → HTTP 响应

```go
func handleError(c *gin.Context, err error) {
    var ve *ValidationError
    if errors.As(err, &ve) {
        c.JSON(422, Response{Error: &ErrorInfo{
            Code: "VALIDATION_ERROR", Message: ve.Message,
        }})
        return
    }
    if errors.Is(err, ErrNotFound) {
        c.JSON(404, Response{Error: &ErrorInfo{
            Code: "NOT_FOUND", Message: "resource not found",
        }})
        return
    }
    // 兜底：内部错误
    slog.Error("unhandled error", "err", err)
    c.JSON(500, Response{Error: &ErrorInfo{
        Code: "INTERNAL_ERROR", Message: "an error occurred",
    }})
}
```

Service 层返回领域错误（`ValidationError`, `ErrNotFound`），Handler 层映射到 HTTP 码。Service 永远不知道 HTTP 的存在。

---

## 层违规检测

### 信号

- Repository 文件 import 了 `net/http` 或 `gin` → 层违规
- Service 方法返回 `(int, *User, error)` 其中 int 是 HTTP 码 → 层违规
- Handler 里直接写 SQL 或调 `db.Where(...)` → 跳层
- Service A import Service B 且 B 也 import A → 循环依赖

### 修复

- 依赖注入：内层通过 interface 依赖，外层传入具体实现
- 如果两个 service 互相调用，提取共享逻辑到第三个 service

来源：Three Dots Labs "Common Anti-Patterns in Go Web Applications", Gin 官方文档 Binding/Validation, RFC 9457 Problem Details, ASP.NET Core Middleware 文档
