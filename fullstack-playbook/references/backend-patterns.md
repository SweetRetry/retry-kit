# 后端架构模式

> **TOC**: [Elysia](#elysia-项目结构) · [Eden Treaty](#eden-treaty-集成) · [Hono 切换](#hono-切换方案) · [Drizzle](#drizzle-schema-约定) · [Zod v4](#zod-v4-验证模式) · [Next.js 轻量后端](#nextjs-轻量后端)

## Elysia 项目结构

```
apps/server/src/
├── index.ts           # 入口，挂载模块，导出 App 类型
├── modules/<feature>/
│   ├── <feature>.controller.ts
│   ├── <feature>.service.ts
│   └── <feature>.schema.ts
├── middleware/         # auth、rate-limit
└── lib/               # db、redis
```

- 每个 module 导出 `new Elysia({ prefix })`，入口通过 `.use()` 挂载
- 入口必须 `export type App = typeof app`——Eden Treaty 的起点
- controller 只做路由绑定 + 参数验证，业务逻辑放 service

---

## Eden Treaty 集成

```typescript
// apps/web/src/lib/api.ts
import { treaty } from "@elysiajs/eden"
import type { App } from "@repo/server/src/index"
export const api = treaty<App>("http://localhost:3001")

// 使用：const { data, error } = await api.users.get()
```

- 类型推导依赖 `App` 类型，改路由后确保同步
- 不要直接 `fetch` Elysia API

---

## Hono 切换方案

Bun 不兼容时切换。目录结构同 Elysia，仅替换框架 API。

| | Elysia | Hono |
|--|--------|------|
| 运行时 | Bun | Node (`tsx`) |
| RPC | Eden Treaty | `hc` client |
| 验证 | `t.Object()` | `@hono/zod-validator` |

```typescript
// 后端：导出路由类型
const routes = app.get("/users", /* ... */).post("/users", /* ... */)
export type AppType = typeof routes
// 前端：import { hc } from "hono/client"
const client = hc<AppType>("http://localhost:3001")
```

---

## Drizzle Schema 约定

Schema 放 `packages/database/src/schema/`，每表一文件，`index.ts` 统一导出。

**PG / SQLite 差异（容易出错）：**

| 字段 | PostgreSQL | SQLite |
|------|-------|--------|
| 主键 | `uuid().primaryKey().defaultRandom()` | `text().primaryKey().$defaultFn(() => crypto.randomUUID())` |
| 时间戳 | `timestamp("created_at", { withTimezone: true })` | `integer("created_at", { mode: "timestamp" })` |

SQLite → PG 需**重写列定义**（API 不同），不是改 import。

---

## Zod v4 验证模式

链路：`Drizzle schema → Zod v4 → Eden Treaty → 前端`

- Schema 放 `packages/shared/src/schemas/`，与 Drizzle table 对应
- 派生：`createSchema = base.omit({ id, createdAt, updatedAt })` → `updateSchema = createSchema.partial()`

**v4 踩坑：**
- 导入 `"zod/v4"`（不是 `"zod"`）
- `z.email()` / `z.uuid()` / `z.url()` 替代 `z.string().xxx()`
- `z.object()` 不再 strip unknown keys，需 `.strict()`

---

## Next.js 轻量后端

- **Server Actions** — 表单/变更（`src/features/<feature>/actions.ts`，顶部 `"use server"`）
- **Route Handlers** — 外部调用的 API（webhooks、集成）

Server Actions 必须 Zod `safeParse` 验证，返回 `{ data }` 或 `{ error: parsed.error.flatten() }`。不适合复杂业务逻辑。
