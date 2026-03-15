# ORM Patterns & Anti-Patterns

语言无关规则，以 GORM (Go) / SQLAlchemy (Python) / Prisma (JS/TS) / ActiveRecord (Ruby) 为示例。

---

## Session / 连接安全

### GORM：方法链会携带状态

```go
// ❌ 前一次 Where 条件污染后续查询
db.Where("status = ?", "active").Find(&users1)
db.Find(&users2) // 仍带 "status = 'active'" 条件！

// ✅ 用 NewSession 方法开始新链
db.WithContext(ctx).Find(&users2)
db.Session(&gorm.Session{}).Find(&users2)
```

NewSession 方法：`Session()`, `WithContext()`, `Debug()` —— 任一方法都会创建干净的 statement context。

### SQLAlchemy：Session-per-unit-of-work

```python
# ❌ 全局 session 复用
Session = sessionmaker(bind=engine)
session = Session()  # 创建一次，到处用

# ✅ 每个工作单元新 session
def get_user(user_id):
    with Session() as session:
        return session.query(User).filter(User.id == user_id).first()
```

SQLAlchemy 2.0+ 默认 `autocommit=False`，95% 生产问题来自：隐式创建 session 不清理、混用 sessionmaker 模式、忽略新默认值。

### 通用规则

- 有显式 session 的 ORM（GORM, SQLAlchemy）：每逻辑操作单元新建 session
- 无状态 ORM（Prisma）：天然安全，无此问题
- 连接池公式：`MaxOpenConns ≥ 并发请求数 × 平均持连接秒数`

---

## 连接池配置

```go
sqlDB, _ := db.DB()
sqlDB.SetMaxOpenConns(25)                  // 活跃连接上限
sqlDB.SetMaxIdleConns(25)                  // 空闲连接池（≤ MaxOpen）
sqlDB.SetConnMaxLifetime(5 * time.Minute)  // 回收旧连接
sqlDB.SetConnMaxIdleTime(3 * time.Minute)  // 释放闲置过久的连接
```

- `MaxIdleConns > MaxOpenConns` 无意义，多出的空闲连接立即关闭
- 空闲池过大浪费资源，过小导致频繁建连
- `ConnMaxLifetime` 必须短于数据库服务器的 `wait_timeout`

---

## N+1 检测与修复

### 症状识别

100 条父记录 + 每条访问一个关联 = 101 条 SQL。在开发环境看不出来（数据少），在生产环境性能断崖。

### 各 ORM 解法对比

| ORM | Eager Load 方式 | 策略 |
|-----|----------------|------|
| GORM | `db.Preload("Posts").Find(&users)` | 2 条 SQL，用 IN 子句 |
| GORM | `db.Joins("Posts").Find(&users)` | 1 条 SQL JOIN，可能有重复行 |
| SQLAlchemy | `selectinload(User.posts)` | 2 条 SQL，用 IN 子句 |
| SQLAlchemy | `joinedload(User.posts)` | 1 条 SQL JOIN |
| Prisma | `include: { posts: true }` | 自动优化 |
| ActiveRecord | `User.includes(:posts)` | 2 条 SQL |

### 检测策略

1. 开发环境开 SQL 日志（`db.Debug()` / `echo=True` / `debug: true`）
2. 用 100+ 父记录的测试数据集跑 endpoint
3. 计数查询条数：超过 `关联层数 + 1` 条就有 N+1

### 注意

GORM 同时用 `Joins()` + `Preload()` 同一关联时可能产生额外查询（Issue #6988）。选一种用。

---

## Hook / Callback 规则

### 只允许

- 数据规范化：`email = strings.ToLower(email)`
- 默认值填充：`if u.Role == "" { u.Role = "user" }`
- 计算字段：`u.FullName = u.FirstName + " " + u.LastName`

### 禁止

- 外部 API 调用（邮件、Webhook）
- 事件发布（Kafka、消息队列）
- 缓存操作（Redis 清理）
- 任何依赖事务已提交才有意义的操作

### 原因

Hook 在事务内执行。如果 hook 发了邮件但后续操作失败导致 rollback，邮件无法撤回。把副作用放到 service 层，在事务提交成功后执行。

---

## 事务纪律

### 回调式 vs 手动式

```go
// ✅ 回调式：自动 rollback，支持 savepoint 嵌套
db.Transaction(func(tx *gorm.DB) error {
    if err := tx.Create(&order).Error; err != nil {
        return err // 自动 rollback
    }
    return tx.Transaction(func(tx2 *gorm.DB) error {
        return tx2.Create(&item).Error // savepoint
    })
})

// ❌ 手动式：忘 rollback = 连接泄漏，不支持嵌套
tx := db.Begin()
tx.Create(&order)
// 如果这里 panic 或 return，连接永远不会释放
tx.Commit()
```

### 事务内不做 I/O

```go
// ❌ 持锁调外部 API
db.Transaction(func(tx *gorm.DB) error {
    tx.Clauses(clause.Locking{Strength: "UPDATE"}).First(&order, id)
    status := callExternalAPI(order.ID) // 锁持续整个 API 调用时间！
    return tx.Model(&order).Update("status", status).Error
})

// ✅ 先查后做 I/O 再写
var order Order
db.First(&order, id)                    // 无锁查询
status := callExternalAPI(order.ID)     // I/O 在事务外
db.Transaction(func(tx *gorm.DB) error {
    return tx.Model(&order).Update("status", status).Error
})
```

---

## 软删除陷阱

### JOIN 不自动过滤

```go
// ❌ Users 表有软删除过滤，Posts 表没有
db.Joins("LEFT JOIN posts ON posts.user_id = users.id").Find(&result)
// 返回已删除用户的 posts！

// ✅ 手动加过滤条件
db.Joins("LEFT JOIN posts ON posts.user_id = users.id").
    Where("users.deleted_at IS NULL").Find(&result)
```

### 唯一索引

```go
// ❌ 用 timestamp 做唯一索引组成部分
// 每次删除 timestamp 不同 → 唯一约束无效
CREATE UNIQUE INDEX ON products(sku, deleted_at)

// ✅ 用 flag（0/1）
import "gorm.io/plugin/soft_delete"

type Product struct {
    Sku       string
    DeletedAt soft_delete.DeletedAt `gorm:"uniqueIndex:idx_sku"`
}
// DeletedAt = 0 (活跃) 或 1 (已删除)，唯一约束有效
```

---

## Raw SQL 使用时机

### 适合 Raw SQL

- CTE / 递归查询 / 窗口函数
- 批量 upsert（`ON CONFLICT DO UPDATE`）
- 数据库特有功能（JSON 操作、全文搜索）
- 经 profiling 证明 ORM 生成的 SQL 有性能问题

### Raw SQL 安全规则

```go
// ✅ 参数化
db.Raw("SELECT * FROM users WHERE email = ?", email)

// ❌ 字符串拼接 = SQL 注入
db.Raw(fmt.Sprintf("SELECT * FROM users WHERE email = '%s'", email))
```

等效于：
- SQLAlchemy: `text("... WHERE id = :id")` + `{"id": user_id}`
- Prisma: `` $queryRaw`... WHERE email = ${email}` `` (tagged template)

来源：GORM 官方文档 Session/Hooks/Delete/Transactions 章节, GORM Issues #4818 #3662 #6988 #5395, Alex Edwards "Configuring sql.DB", SQLAlchemy Session FAQ, Prisma Raw Queries 文档
