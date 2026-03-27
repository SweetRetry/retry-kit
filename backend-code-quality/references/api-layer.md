# API / Handler 分层审查参考

这个文件用于判断 handler、service、repository、middleware 的职责是否清晰，以及边界是否容易误用。

## 先看什么

1. 请求入口在哪里结束协议翻译
2. 业务规则在哪一层
3. 数据访问在哪一层
4. 错误和响应在哪一层映射
5. middleware 是否只做横切关注点

## 跨语言等价信号

- `handler` 等价于 controller / route handler / view function
- `middleware` 等价于 interceptor / dependency / request hook
- 判断标准不是框架名字，而是“这里是不是 HTTP 或 RPC 协议边界”

## 1. Handler 是否只是适配器

### 理想职责

- 解析请求
- 调用 service
- 格式化响应

### 高风险信号

- handler 里写业务规则
- handler 里直接写 SQL / ORM
- handler 里同时做鉴权、业务判断、持久化、响应组装

### 为什么危险

- 测试困难
- 复用困难
- 协议层和业务层耦合，后续接 worker / CLI 会很痛

## 2. Framework Context 穿透

### 高风险信号

- service 直接依赖 `gin.Context`、`echo.Context`、`req/res`
- service 通过框架 context 读写业务状态
- repository 层 import HTTP 或框架包

### 更稳的边界

- handler 层提取请求参数、认证信息、标准 `context`
- service 接收语言标准类型和领域参数
- repository 不知道 HTTP 存在

### 跨语言等价信号

- `gin.Context` / `echo.Context` 穿透 service，等价于 `FastAPI Request` / `Express req,res` 穿透业务层
- repository import `net/http`，等价于数据层直接依赖 Web framework response 对象

## 3. 请求绑定与验证

### 高风险信号

- 同一个 body 绑定多次
- handler 既做语法校验又做复杂业务校验，还继续往下传
- 未验证的外部输入直接进入 service / SQL

### 审查动作

- 看 body 是不是只读一次
- 看 handler 和 service 的校验边界是否清楚
- 看验证失败后是否立即终止

## 4. 响应后继续执行

### 高风险信号

- `JSON` / `Send` / `WriteHeader` 后没有 `return`
- 写完错误响应后仍继续调用 service
- handler 可能出现二次写响应

### 为什么危险

- 运行时警告
- 额外副作用
- 逻辑路径和用户看到的响应不一致

## 5. Middleware 边界

### 适合放 middleware

- 认证
- 日志
- trace / request ID
- CORS
- panic recovery
- 限流

### 不适合放 middleware

- 仅某个端点适用的业务规则
- 业务数据转换
- 依赖具体路由含义的判断

### 审查动作

- 问这段逻辑是不是横切关注点
- 如果只服务单个业务场景，应该下沉到 handler / service

## 最小验证

- 看 service / repository 是否 import HTTP 或具体框架包
- 看 body 是否被重复读取或重复绑定
- 看每个写响应分支后是否立即结束当前执行路径
- 看 middleware 是否只服务横切关注点，而不是偷偷承载单业务规则

## 6. 错误映射边界

### 更稳的做法

- service 返回领域错误
- handler 映射到 HTTP 状态码和统一响应结构

### 高风险信号

- service 返回 HTTP status code
- repository 直接生成 HTTP 响应
- handler 无统一错误出口

## 7. 最小验证

- handler 写出响应后，检查当前分支是否立即 `return`
- handler 是否直接操作 ORM / SQL，而不是调用 service
- service 的方法签名是否依赖框架请求 / 响应类型
- body / request payload 是否只绑定一次

## 8. 审查输出句式

- “这个 handler 同时承担协议翻译、业务判断和数据访问，已经变成 fat handler。”
- “service 依赖框架 context，导致业务层无法脱离 HTTP 框架复用或测试。”
- “响应写出后没有 `return`，后续逻辑仍会继续执行并产生额外副作用。”
- “middleware 里放了业务逻辑，这会让路由行为变得隐式且难以排查。”
