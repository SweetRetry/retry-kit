# SQL 审查参考

这个文件只覆盖代码审查里最常见、最影响性能与正确性的 SQL 问题，用来辅助 ORM 审查，而不是替代数据库性能专项分析。

## 先看什么

1. 查询是否拿了远多于需要的数据
2. where 条件是否破坏索引使用
3. 分页是否会在大 offset 下退化
4. 批量场景是否仍逐行处理
5. 新查询是否至少做过一次 `EXPLAIN`

## 直接可复用的改写 heuristics

### `IN (subquery)` 太重

- 只需要判断存在性：优先改成 `EXISTS`
- 需要同时取关联表字段：优先改成 `JOIN`

```sql
-- 一般优先级：IN -> EXISTS / JOIN
SELECT * FROM orders WHERE customer_id IN (
  SELECT id FROM customers WHERE status = 'active'
);
```

```sql
SELECT o.*
FROM orders o
JOIN customers c ON c.id = o.customer_id
WHERE c.status = 'active';
```

### 相关子查询按行重复执行

- 先考虑 `JOIN`
- 需要分组对比时，优先考虑 window function

```sql
-- 典型信号：子查询里引用外层表字段
WHERE p.price > (
  SELECT AVG(price) FROM products p2 WHERE p2.category_id = p.category_id
)
```

### 多次 `COUNT(*)` 扫同一张表

- 多个状态统计优先改成条件聚合

```sql
SELECT
  COUNT(CASE WHEN status = 'pending' THEN 1 END) AS pending_count,
  COUNT(CASE WHEN status = 'shipped' THEN 1 END) AS shipped_count
FROM orders;
```

### 大 `OFFSET`

- 列表持续增长时，优先改成 cursor 分页
- 时间线常用时间游标，后台列表常用 ID 游标

### 逐条写入

- ORM 支持批量接口时，优先用 batch insert
- GORM 常见落法：`CreateInBatches`

## 1. `SELECT *`

### 风险

- 返回过多列
- 传输和反序列化成本高
- JOIN 后把大字段一并拖出来

### 审查动作

- 看接口响应实际需要哪些列
- 看 repository / query builder 是否显式选择列

### 最小阈值

- 大表、JOIN、含大字段场景默认不接受无差别 `SELECT *`

## 2. 在索引列上包函数

### 风险

- 索引失效或利用率显著下降
- 看起来语义简单，实际上把范围查询变成全表扫描

### 例子

```sql
WHERE YEAR(created_at) = 2024
```

优先改成范围查询，而不是对列做函数运算。

### 最小验证

- 改了查询形态后，至少要求看一次 `EXPLAIN`

## 3. 大 offset 分页

### 风险

- offset 越大，数据库丢弃的数据越多
- 热门列表页或后台大分页会明显退化

### 审查动作

- 看是否是滚动列表、时间线、管理后台导出
- 如果数据量可能很大，优先考虑 cursor 分页

### 最小阈值

- 如果是持续增长的数据集，`OFFSET` 越大越危险，不能只凭当前数据量判断没问题

## 4. 逐行写入和逐行聚合

### 风险

- 批量插入做成多次 round trip
- 为多个状态分别跑多次 count

### 审查动作

- 看 ORM 是否支持 batch insert
- 看统计是否能合并成条件聚合

### 直接改法

- 逐条 `INSERT` -> batch insert / `CreateInBatches`
- 多条 `COUNT(*) WHERE status = ...` -> 条件聚合

## 5. 子查询与执行计划

### 风险信号

- 大集合 `IN (subquery)` 没确认执行计划
- 相关子查询对每行重复执行
- 改了查询但没做 `EXPLAIN`

### 审查动作

- 不是要求所有查询都手写优化，而是要求高风险查询至少验证执行计划

### 直接改法

- `IN (subquery)` -> `EXISTS` 或 `JOIN`
- 相关子查询 -> `JOIN` 或 window function
- 新索引或改写后查询 -> 补一次 `EXPLAIN`

## 与 `orm-patterns.md` 的边界

- 本文件不再讨论 hook、transaction、session、soft delete、raw SQL 安全性
- 本文件只回答“这条查询会不会退化，索引和执行计划是否合理”

## 审查输出句式

- “这里默认 `SELECT *`，但响应只需要 3 个字段；在大表和 JOIN 场景下会放大 I/O 和反序列化成本。”
- “where 条件对索引列做函数运算，查询很可能无法走期望索引。”
- “这个列表接口使用大 offset 分页，数据增长后会线性退化。”
- “批量写入仍逐条执行，数据库 round trip 成本被放大了。”
- “这里对大集合用了 `IN (subquery)`，如果只需要存在性判断，优先改成 `EXISTS`；如果需要关联列，优先改成 `JOIN`。”
- “相关子查询按外层记录重复执行，先评估能否改成 `JOIN` 或 window function。”

## 参考依据

- MySQL / PostgreSQL 执行计划常识：索引、范围查询、分页退化
- ORM 实践中的常见查询退化模式：`SELECT *`、大 offset、逐条写入、缺少 `EXPLAIN`
