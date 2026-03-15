# SQL & Query Optimization — Detailed Reference

Focused on MySQL 8.0+ with GORM v2. For GORM-specific anti-patterns (N+1, zero-value updates,
chain reuse), see the GORM section in SKILL.md and `gorm.md`.

## Function Calls in WHERE — Index Killer

```sql
-- BAD: wrapping column in function prevents index usage
SELECT * FROM orders WHERE YEAR(created_at) = 2024;
SELECT * FROM orders WHERE UPPER(customer_email) = 'JOHN@EXAMPLE.COM';

-- FIX: range scan, index-friendly
SELECT * FROM orders
WHERE created_at >= '2024-01-01' AND created_at < '2025-01-01';

SELECT * FROM orders WHERE customer_email = 'john@example.com';
```

In GORM:
```go
// BAD
db.Where("YEAR(created_at) = ?", 2024).Find(&orders)

// GOOD
db.Where("created_at >= ? AND created_at < ?", "2024-01-01", "2025-01-01").Find(&orders)
```

## SELECT * Waste

```sql
-- BAD: transfers all columns including large TEXT/BLOB
SELECT * FROM large_table lt JOIN another_table at ON lt.id = at.ref_id;

-- GOOD: explicit columns
SELECT lt.id, lt.name, at.value
FROM large_table lt JOIN another_table at ON lt.id = at.ref_id;
```

In GORM:
```go
// BAD: default SELECT *
db.Find(&users)

// GOOD: select only needed columns
db.Select("id", "name", "email").Find(&users)
```

## Correlated Subquery → JOIN or Window

```sql
-- BAD: correlated subquery, re-executes per row
SELECT p.product_name, p.price
FROM products p
WHERE p.price > (
    SELECT AVG(price) FROM products p2 WHERE p2.category_id = p.category_id
);

-- FIX: window function (MySQL 8.0+)
SELECT product_name, price
FROM (
    SELECT product_name, price,
           AVG(price) OVER (PARTITION BY category_id) as avg_price
    FROM products
) t
WHERE price > avg_price;
```

## IN Subquery → EXISTS or JOIN

```sql
-- BAD: IN subquery can be slow on large sets
SELECT * FROM orders WHERE customer_id IN (
    SELECT id FROM customers WHERE status = 'active'
);

-- GOOD: JOIN
SELECT o.* FROM orders o
INNER JOIN customers c ON o.customer_id = c.id
WHERE c.status = 'active';
```

## OFFSET Pagination → Cursor Pagination

```sql
-- BAD: OFFSET scans and discards rows, O(offset+limit) cost
SELECT * FROM products ORDER BY created_at DESC LIMIT 20 OFFSET 10000;

-- GOOD: cursor-based, O(limit) cost
SELECT * FROM products
WHERE created_at < '2024-06-15 10:30:00'
ORDER BY created_at DESC LIMIT 20;

-- Or ID-based cursor
SELECT * FROM products WHERE id > 1000 ORDER BY id LIMIT 20;
```

In GORM:
```go
// BAD
db.Offset(10000).Limit(20).Order("created_at DESC").Find(&products)

// GOOD: cursor
db.Where("created_at < ?", cursor).Order("created_at DESC").Limit(20).Find(&products)
```

## Conditional Aggregation — Avoid Multiple Queries

```sql
-- BAD: N queries for N statuses
SELECT COUNT(*) FROM orders WHERE status = 'pending';
SELECT COUNT(*) FROM orders WHERE status = 'shipped';

-- GOOD: single scan
SELECT
    COUNT(CASE WHEN status = 'pending' THEN 1 END)  AS pending_count,
    COUNT(CASE WHEN status = 'shipped' THEN 1 END)  AS shipped_count,
    COUNT(CASE WHEN status = 'delivered' THEN 1 END) AS delivered_count
FROM orders;
```

## OR → UNION ALL

```sql
-- BAD: complex OR may prevent index usage
SELECT * FROM products
WHERE (category = 'electronics' AND price < 1000)
   OR (category = 'books' AND price < 50);

-- GOOD: each branch uses its own index
SELECT * FROM products WHERE category = 'electronics' AND price < 1000
UNION ALL
SELECT * FROM products WHERE category = 'books' AND price < 50;
```

## Batch Insert — Avoid Row-by-Row

```sql
-- BAD: N round-trips
INSERT INTO products (name, price) VALUES ('A', 10);
INSERT INTO products (name, price) VALUES ('B', 15);

-- GOOD: single round-trip
INSERT INTO products (name, price) VALUES ('A', 10), ('B', 15), ('C', 20);
```

GORM `CreateInBatches` handles this automatically:
```go
db.CreateInBatches(products, 100) // 100 per batch
```

## Composite Index Column Order

```
Rule: equality columns first, then range/sort columns.
The index (status, created_at) supports:
  WHERE status = 'active' ORDER BY created_at   ✓
  WHERE created_at > '2024-01-01'               ✗ (leftmost prefix not used)
```

```sql
-- For: WHERE status = ? AND created_at BETWEEN ? AND ? ORDER BY created_at
CREATE INDEX idx_status_created ON orders(status, created_at);

-- Covering index (avoids table lookup)
CREATE INDEX idx_covering ON orders(status, created_at, total_amount);
```

## MySQL Slow Query Monitoring

```sql
-- Find slow queries
SELECT query_time, lock_time, rows_sent, rows_examined, sql_text
FROM mysql.slow_log
ORDER BY query_time DESC;

-- Check index usage
SELECT table_name, index_name, seq_in_index, column_name
FROM information_schema.statistics
WHERE table_schema = DATABASE()
ORDER BY table_name, index_name, seq_in_index;

-- Unused indexes (MySQL 8.0+ performance_schema)
SELECT object_schema, object_name, index_name
FROM performance_schema.table_io_waits_summary_by_index_usage
WHERE index_name IS NOT NULL AND count_star = 0
  AND object_schema = DATABASE();
```

## Optimization Checklist

- Avoid `SELECT *` — use `Select()` in GORM or explicit columns
- No functions wrapping indexed columns in WHERE
- Composite indexes: equality → range → sort order
- Cursor pagination instead of OFFSET for large datasets
- Batch inserts via `CreateInBatches`
- EXISTS/JOIN over IN subquery for large sets
- Conditional aggregation over multiple COUNT queries
- EXPLAIN before deploying new queries touching large tables
