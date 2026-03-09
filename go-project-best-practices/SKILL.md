---
name: go-project-best-practices
description: >
  Go 项目结构与工程最佳实践规范。基于 golang-standards/project-layout、Go 官方文档和社区共识，
  指导 Go 项目的目录布局、包命名、分层架构、依赖管理和常见反模式规避。
  触发场景：(1) 初始化新的 Go 项目或模块，(2) 为 Go 项目添加新功能/包/服务，
  (3) Go 项目结构审查或重构，(4) 讨论 Go 项目的 cmd/internal/pkg 等目录该怎么组织，
  (5) 用户提到 Go 项目布局、Go 目录结构、Go 包设计、Go 模块组织，
  (6) 用户在写 Go 代码时出现 utils/helpers/common 等反模式包名，
  (7) 用户在决定 Go 代码放哪个目录、怎么拆包、怎么分层时。
  即使用户没有明确提到"项目结构"，只要是在创建 Go 文件或包时需要做目录/命名决策，也应使用此 skill。
---

# Go Project Best Practices

基于 [golang-standards/project-layout](https://github.com/golang-standards/project-layout)、[Go 官方模块布局指南](https://go.dev/doc/modules/layout) 和社区最佳实践的综合规范。

> **核心原则**：Go 崇尚简单。目录结构应该从需求中自然生长，而不是预先搭建一个空的脚手架。

---

## 1. 按项目规模选择结构

### 小型项目（单二进制、PoC、CLI 工具）

一个 `main.go` + `go.mod` 就够了。不需要 `cmd/`、`internal/`、`pkg/`。

```
myapp/
├── go.mod
├── go.sum
├── main.go
├── config.go
└── handler.go
```

当文件超过 5-7 个、或开始有多个可执行文件时，再引入目录结构。

### 中型项目（单服务、有一定复杂度）

```
myapp/
├── go.mod
├── go.sum
├── main.go              # 或 cmd/myapp/main.go（如有多个二进制）
├── internal/
│   ├── user/            # 按领域组织，不按技术层
│   │   ├── handler.go   # HTTP handler
│   │   ├── service.go   # 业务逻辑
│   │   ├── repo.go      # 数据访问
│   │   └── model.go     # 领域模型
│   ├── auth/
│   └── order/
├── config/
│   └── config.go
└── Makefile
```

### 大型项目（多服务、团队协作）

```
myapp/
├── go.mod
├── go.sum
├── cmd/
│   ├── api-server/
│   │   └── main.go
│   ├── worker/
│   │   └── main.go
│   └── migrate/
│       └── main.go
├── internal/
│   ├── app/             # 各 cmd 的启动/组装逻辑
│   │   ├── apiserver/
│   │   └── worker/
│   ├── user/            # 领域包
│   ├── order/
│   ├── infra/           # 基础设施（数据库、缓存、消息队列）
│   │   ├── mysql/
│   │   ├── redis/
│   │   └── aigc/
│   └── middleware/
├── api/                 # OpenAPI/Protobuf 定义
├── configs/             # 配置文件模板
├── scripts/             # 构建/部署脚本
├── build/               # Docker / CI 配置
├── deployments/         # K8s / IaaS 模板
├── docs/
├── test/                # 集成测试、测试数据
├── tools/               # 项目工具（代码生成等）
├── Makefile
└── README.md
```

---

## 2. 核心目录详解

### `/cmd` — 入口点

- 每个子目录对应一个可执行文件，目录名 = 二进制名
- `main.go` 尽量精简：解析配置 → 组装依赖 → 启动服务
- 业务逻辑放在 `internal/`，不写在 `cmd/` 里
- **只有一个二进制时不需要 `cmd/`**，直接在根目录放 `main.go`

```go
// cmd/api-server/main.go — 保持极简
func main() {
    cfg := config.Load()
    db := mysql.Connect(cfg.DB)
    srv := apiserver.New(cfg, db)
    srv.Run()
}
```

### `/internal` — 私有代码（编译器强制）

Go 编译器保证 `internal/` 下的包无法被外部模块导入，这不是约定而是语言机制。

**按领域组织，不按技术层组织：**

```
# 正确 — 按领域/功能
internal/
├── user/          # 用户相关的 handler + service + repo 都在这
├── order/
└── payment/

# 错误 — 按技术层（Java 风格）
internal/
├── handlers/      # 所有 handler 混在一起
├── services/      # 所有 service 混在一起
└── repositories/  # 所有 repo 混在一起
```

按领域组织的好处：

- 相关代码在同一目录，改一个功能不用跳转多个目录
- 包的依赖关系清晰，领域之间通过接口解耦
- 更容易将来拆分为独立服务

### `/pkg` — 公共库代码（谨慎使用）

`pkg/` 意味着"这个代码可以被外部项目导入"。90% 的项目不需要这个目录。

**使用条件**：你确实在构建一个库/SDK，且有外部消费者。

**不满足条件时**：代码放 `internal/` 或根目录。如果不确定，默认放 `internal/`。

### 其他目录

| 目录 | 用途 | 备注 |
|---|---|---|
| `/api` | API 定义文件（OpenAPI、Protobuf） | 不是 Go 代码，是协议定义 |
| `/configs` | 配置模板/默认配置 | 生产配置不入库 |
| `/scripts` | 构建、安装、分析脚本 | Makefile 的补充 |
| `/build` | CI/CD 和打包配置 | Dockerfile、.goreleaser.yml |
| `/deployments` | 部署模板 | K8s manifests、docker-compose |
| `/test` | 集成测试、测试夹具 | 单元测试随源码，集成测试放这里 |
| `/docs` | 设计文档 | |
| `/tools` | 项目支撑工具 | 代码生成器等 |
| `/web` | 前端静态资源 | SPA、模板 |

---

## 3. 包命名规则

Go 包名是 API 的一部分，用户每次调用都要敲。好的包名让代码自文档化。

### 规则

1. **全小写、单词**：`user`、`auth`、`config`（不是 `userService`、`auth_handler`）
2. **单数形式**：`user` 不是 `users`，`order` 不是 `orders`
3. **用包名消除导出名的冗余**：

```go
// 正确 — 调用方写 user.New()、user.Find()
package user
func New() *User { ... }
func Find(id int64) (*User, error) { ... }

// 错误 — 调用方写 user.NewUser()（冗余）
package user
func NewUser() *User { ... }
```

1. **不用 `Get` 前缀**：

```go
// 正确
func (u *User) Name() string { return u.name }
func (u *User) SetName(n string) { u.name = n }

// 错误
func (u *User) GetName() string { return u.name }
```

1. **一方法接口用 `-er` 后缀**：`Reader`、`Writer`、`Formatter`、`Stringer`

---

## 4. 反模式清单

### 绝对禁止

| 反模式 | 问题 | 替代 |
|---|---|---|
| `utils/` `helpers/` `common/` `base/` | 语义空洞，沦为垃圾抽屉 | 按功能命名：`validator`、`hash`、`timeutil` |
| `/src` 目录 | Java 风格，Go 不用 | 直接放根目录或 `internal/` |
| 循环导入 | Go 编译错误 | 提取共享类型到独立包，或用接口解耦 |
| 一个 struct 贯穿 API/DB/逻辑 | 层与层强耦合 | 每层独立模型 + 显式转换函数 |

### 应当避免

| 反模式 | 问题 | 替代 |
|---|---|---|
| 过深嵌套 `internal/services/user/handlers/http/v1/` | 导航噩梦 | 扁平化：`internal/user/handler.go` |
| 过早抽象 | 增加认知负担，减慢迭代 | 等到第三次重复再抽象 |
| 过度 DRY | 引入不必要的耦合 | 允许适度重复，三行重复代码优于一个不稳定的抽象 |
| 省略 struct tag | 重命名字段时静默破坏 API/DB 契约 | 显式写全 `json:"name"` `gorm:"column:name"` |
| 空的 `pkg/` 目录 | 模仿大项目却没有外部消费者 | 不用就删掉 |

---

## 5. 分层架构实践

### 模型分离

每个边界（HTTP、数据库、领域）使用独立的 struct：

```go
// internal/user/model.go — 领域模型
type User struct {
    ID    int64
    Name  string
    Email Email  // 值对象，构造时校验
}

func NewUser(name, email string) (User, error) {
    e, err := NewEmail(email)
    if err != nil {
        return User{}, err
    }
    return User{Name: name, Email: e}, nil
}

// internal/user/handler.go — HTTP 请求/响应模型
type CreateUserRequest struct {
    Name  string `json:"name" binding:"required"`
    Email string `json:"email" binding:"required,email"`
}

type UserResponse struct {
    ID    int64  `json:"id"`
    Name  string `json:"name"`
    Email string `json:"email"`
}

// internal/user/repo.go — 数据库模型
type UserRow struct {
    ID    int64  `gorm:"primaryKey;column:id"`
    Name  string `gorm:"column:name"`
    Email string `gorm:"column:email"`
}
```

### 接口定义在消费方

```go
// internal/user/service.go — 消费方定义接口
type UserRepo interface {
    Create(ctx context.Context, u *User) error
    FindByID(ctx context.Context, id int64) (*User, error)
}

type Service struct {
    repo UserRepo  // 依赖接口，不依赖具体实现
}

// internal/user/repo.go — 实现方只管实现
type mysqlRepo struct {
    db *gorm.DB
}

func (r *mysqlRepo) Create(ctx context.Context, u *User) error { ... }
```

### 事务边界封装

事务处理放在 repo 层内部，不暴露给业务逻辑：

```go
// 正确 — 事务细节封装在 repo 里
func (r *mysqlRepo) TransferOrder(ctx context.Context, from, to int64, amount int) error {
    return r.db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
        // ...
        return nil
    })
}

// 错误 — 业务层感知事务
func (s *Service) Transfer(ctx context.Context, ...) error {
    tx := s.db.Begin()
    defer tx.Rollback()
    // 业务逻辑不应该知道 tx
}
```

---

## 6. 依赖管理

- 使用 Go Modules（Go 1.14+），不依赖 `$GOPATH`
- `go.mod` 和 `go.sum` 必须提交到版本控制
- `/vendor` 是可选的（`go mod vendor`），多数项目不需要
- 用 `go mod tidy` 保持依赖清洁

---

## 7. 决策速查

当不确定代码放哪里时，按顺序回答这些问题：

1. **这是一个独立可执行文件的入口吗？** → `cmd/<name>/main.go`
2. **这个代码会被外部模块导入吗？** → `pkg/`（确认有外部消费者）
3. **以上都不是？** → `internal/`，按领域分包
4. **项目还很小（< 7 个文件），还没有多个二进制？** → 根目录就好，别急着建目录结构

---

## 8. 代码风格速查

| 主题 | 规则 |
|---|---|
| 格式化 | `gofmt`（非可选） |
| Lint | `staticcheck`（golint 已废弃） |
| 命名 | `MixedCaps`/`mixedCaps`，不用下划线 |
| 错误处理 | 立即处理，不 `_ = err` |
| 注释 | 导出符号必须有 godoc 注释，内部代码只在逻辑不显而易见时注释 |
| 构造函数 | `New()` 返回接口优于返回具体类型（如适用） |
| 组合 | 用 embedding 组合行为，不用继承式设计 |
