# Over-Engineering Anti-Patterns

---

## Interface 决策树

```
需要 interface？
├─ 有 2+ 个实现？→ ✅ 创建
├─ 只有 1 个实现？
│  ├─ 需要 mock 测试？→ ✅ 创建（consumer 侧定义，最小化）
│  └─ 不需要 mock？→ ❌ 不创建
└─ 0 个实现？→ ❌ 预防式 interface，删掉
```

### Go 核心原则

- "The bigger the interface, the weaker the abstraction" — Rob Pike
- Interface 在 consumer 侧定义，不在 producer 侧
- Accept interfaces, return structs
- 最强的 interface 只有一个方法（`io.Reader`, `io.Writer`, `fmt.Stringer`）

```go
// ❌ Producer 定义大 interface
package user

type UserRepository interface {
    GetByID(ctx context.Context, id string) (*User, error)
    GetByEmail(ctx context.Context, email string) (*User, error)
    List(ctx context.Context, filter Filter) ([]*User, error)
    Create(ctx context.Context, user *User) error
    Update(ctx context.Context, user *User) error
    Delete(ctx context.Context, id string) error
}

// ✅ Consumer 侧定义最小 interface
package notification

type UserFinder interface {
    GetByID(ctx context.Context, id string) (*user.User, error)
}

type Notifier struct {
    users UserFinder // 只需要 GetByID
}
```

---

## DI 框架决策

| 条件 | 方案 |
|------|------|
| < 10 个组件，静态依赖图 | 构造函数注入 |
| 10-30 个组件，初始化变复杂 | 考虑 Wire（编译时） |
| 30+ 个组件，需要生命周期管理 | 考虑 dig/fx（运行时） |
| Python 小项目 | 构造函数，不需要 dependency-injector |

```go
// ✅ 构造函数注入（大多数项目够用）
func NewOrderService(repo OrderRepository, mailer Mailer) *OrderService {
    return &OrderService{repo: repo, mailer: mailer}
}

// main.go 里手动组装
repo := postgres.NewOrderRepo(db)
mailer := sendgrid.NewMailer(apiKey)
orderSvc := service.NewOrderService(repo, mailer)
```

DI 框架不是架构需求，是规模需求。小项目加 DI 框架 = 用推土机种花。

---

## Factory / Builder 规则

```
需要 Factory？
├─ 有多种变体需要运行时选择？→ ✅
├─ 初始化逻辑复杂（10+ 行）？→ ✅ 考虑 Builder
├─ 只有一个实现，构造一行？→ ❌ 直接 new
└─ "以后可能有多种实现"？→ ❌ YAGNI
```

```go
// ❌ 过度 factory
type UserServiceFactory struct{}

func (f *UserServiceFactory) Create() *UserService {
    return &UserService{} // 就这一行...
}

// ✅ 直接构造
svc := &UserService{repo: repo}
```

---

## YAGNI 检查

代码审查时，对每个抽象问：

1. **现在有人在用吗？** 不是"以后可能有人用"
2. **如果删掉，哪个功能会坏？** 如果答案是"没有"，删掉
3. **是在解决真实问题还是假设问题？** "我觉得以后可能需要"= 假设问题

### YAGNI ≠ 不设计

YAGNI 意味着：
- ✅ 让代码易于变更（好的结构、清晰的边界）
- ✅ 基本的错误处理和输入验证
- ❌ 为假设需求写代码
- ❌ "万一以后要支持多租户"就现在加多租户架构
- ❌ 永远不会 toggle 的 feature flag

---

## 错误抽象（Sandi Metz）

### 路径

1. 看到两段重复代码 → 提取成函数/类
2. 新需求来了，"差不多"能复用 → 加个参数
3. 又来一个 → 再加个 flag
4. 函数里堆满 `if/switch` → 没人敢动

### 规则

> "Duplication is far cheaper than the wrong abstraction." — Sandi Metz

- 等 2-3 个**真实**例子再提取（Rule of Three）
- 所有例子必须用**相同逻辑**。如果逻辑不同，那不是重复，是巧合
- 发现抽象里堆满条件？**回退到重复**：
  1. 把抽象内联回每个调用方
  2. 每个调用方只保留自己需要的代码路径
  3. 删除不需要的分支
  4. 现在能看清真正的模式了

### Dan Abramov 的补充

> "My code traded the ability to change requirements for reduced duplication, and it was not a good trade." — Dan Abramov, "Goodbye, Clean Code"

DRY 是手段不是目的。如果消除重复导致代码更难改，那就保留重复。

---

## 泛型 / 类型参数

```
用泛型？
├─ 集合操作（Filter/Map/Reduce）？→ ✅
├─ 多类型共享完全相同的逻辑？→ ✅
├─ 只处理一种类型？→ ❌ 用具体类型
├─ 不同类型需要不同逻辑？→ ❌ interface 或 switch
└─ 不确定约束该怎么写？→ ❌ 抽象还不成熟
```

```go
// ✅ 适合泛型：通用集合操作
func Filter[T any](items []T, fn func(T) bool) []T {
    var result []T
    for _, item := range items {
        if fn(item) {
            result = append(result, item)
        }
    }
    return result
}

// ❌ 不适合泛型：只处理 User
func GetActiveUsers[T User](users []T) []T { ... }
// 直接写：
func GetActiveUsers(users []User) []User { ... }
```

---

## 配置 vs 决策

| 适合做成配置 | 适合写死 |
|-------------|---------|
| 运维开关（降级、熔断） | 业务规则 |
| AB 测试变量 | 只有一种正确做法的逻辑 |
| 灰度发布百分比 | 永远不会改的常量 |
| 环境差异（dev/staging/prod） | "我拿不准所以做成配置" |

**Feature flag 生命周期**：创建 → 灰度 → 全量 → **删除**。永久 flag = 技术债。

来源：Rob Pike Go Proverbs, Uber Go Style Guide, Sandi Metz "The Wrong Abstraction", Dan Abramov "Goodbye Clean Code", Martin Fowler "Yagni", Go Wiki CodeReviewComments, 100 Go Mistakes "Interface Pollution"
