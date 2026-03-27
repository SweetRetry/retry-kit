# ORM 审查参考

这个文件不是 ORM 教程，而是给审查时快速定位高风险问题用的。

## 先看什么

遇到 repository、query builder、model hook、transaction 时，优先检查：

1. session / statement 是否被复用
2. 展示型查询是否存在 N+1
3. 副作用是否放进 hook 或事务内
4. raw SQL 是否参数化
5. 软删除和唯一约束是否会失效

## 1. Session / Query Builder 复用

### 典型风险

- 上一条 `Where` / `Scopes` / `Joins` 的状态污染后续查询
- 长生命周期 session 未正确清理
- 把一次请求的 query state 挂到共享对象上

### 证据怎么找

- 看同一个 DB/session 对象是否在多个操作链之间重复使用
- 看后续查询是否明确从干净 session 开始
- 看是否把“带条件的链”缓存到 struct 字段或全局变量

### Go / GORM 信号

```go
// ❌ 条件污染
db.Where("status = ?", "active").Find(&users1)
db.Find(&users2)

// ✅ 新链
db.WithContext(ctx).Find(&users2)
db.Session(&gorm.Session{}).Find(&users2)
```

### 最小验证

- 看后续查询是否显式从新 session 开始
- 如果是共享 `db` wrapper，确认没有把带条件的链缓存到字段里

### 其他语言等价问题

- SQLAlchemy：全局 Session 到处复用，而不是每个 unit of work 新建
- ActiveRecord：默认 scope 叠加后误以为后续查询是干净的
- 任何 builder 风格 ORM：把已带条件的 builder 复用给多个调用方

## 2. N+1 查询

### 典型风险

- 列表页先查父对象，再在循环里逐条查关联
- serializer / response formatter 懒加载关联，开发环境看不出问题
- handler 本身只执行一条 service 调用，但 service 内部隐藏 100+ 条 SQL

### 证据怎么找

- 打开 SQL 日志，看一个列表请求到底打了几条 SQL
- 用 `100+` 父记录的测试数据跑一次
- 看关联对象是否用了 eager load / preload / include

### 最小阈值

- 父记录列表查询的 SQL 条数若明显随父记录数量线性增长，就按 N+1 处理
- 不能只在 3 条样本数据下说“没问题”

### 常见修复

- GORM：`Preload`
- SQLAlchemy：`selectinload` / `joinedload`
- Prisma：`include`
- ActiveRecord：`includes`

### 注意

- 不要同时对同一关联混用 `Joins` 和 `Preload`，除非你明确知道生成的 SQL 形态
- eager load 不是永远正确；如果只需要少数列，优先验证返回体和查询成本是否匹配

## 3. Hook / Callback 副作用

### 只适合放进 hook 的事

- 数据规范化
- 默认值填充
- 纯字段派生

### 不该放进 hook 的事

- 发邮件
- 发消息
- 清缓存
- 调外部 API
- 任何必须以“事务已提交”为前提的动作

### 为什么危险

hook 往往运行在事务内。外部副作用一旦发出，即使事务 rollback，也无法一起回滚。

## 4. 事务边界

### 高风险信号

- 手写 `Begin` / `Commit` / `Rollback`，中间还有多个 return 分支
- 事务内调用外部服务
- 事务函数里混合查、算、I/O、写四种动作

### 审查动作

- 找事务的开始和结束位置
- 看是否存在“锁住数据等待外部响应”
- 看错误分支是否一定会释放资源

### 更稳妥的形态

- 用回调式事务封装提交 / 回滚
- 先查数据，再做事务外 I/O，最后开短事务写回

### 最小验证

- 如果手写事务，确认每个错误分支都能 rollback
- 如果事务里有网络、消息、缓存调用，默认按高风险处理

## 5. 软删除和唯一约束

### 常见误区

- 以为 ORM 会自动帮所有 JOIN 附加软删除过滤
- 用 timestamp 字段参与唯一索引，结果软删除后唯一约束失效

### 审查动作

- 看 JOIN 语句是否显式加了软删除条件
- 看唯一约束是否真的只允许一个“活跃”记录

## 6. Raw SQL

### 什么时候合理

- 窗口函数、CTE、批量 upsert、数据库特有能力
- 已明确证明 ORM 生成 SQL 不适合当前场景

### 什么时候危险

- 字符串拼接参数
- 为了“看起来更底层”而把简单查询改成 raw SQL
- 用 raw SQL 后不再审查索引和执行计划

### 底线

```go
// ✅ 参数化
db.Raw("SELECT * FROM users WHERE email = ?", email)

// ❌ 注入风险
db.Raw(fmt.Sprintf("SELECT * FROM users WHERE email = '%s'", email))
```

### 与 `sql.md` 的边界

- 本文件只回答“什么时候该用 ORM、什么时候 raw SQL 仍然安全”
- 一旦已经进入 SQL 形态优化、索引与执行计划问题，转到 [sql.md](/Users/zhangzimin/Documents/sweetRetry/skills/backend-code-quality/references/sql.md)

## 审查输出句式

- “这里复用了带状态的 query chain，后续查询会继承旧条件，属于 correctness 风险。”
- “列表查询对每个父记录单独取关联对象，命中 N+1；在数据量上来后会出现性能断崖。”
- “事务内先锁记录再调外部 API，会把数据库连接和锁持有到网络返回为止。”

## 参考依据

- GORM 官方文档：Session、Hooks、Transactions、Delete
- SQLAlchemy 官方文档：Session basics / unit of work
- 常见 ORM 生产事故模式：N+1、transaction 内副作用、raw SQL 参数化
