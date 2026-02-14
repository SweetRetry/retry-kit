# 后端架构模式

## Elysia 项目结构

```
apps/server/src/
├── index.ts           # 入口，挂载所有模块，导出 App 类型
├── modules/           # feature-based 业务模块
│   └── <feature>/
│       ├── <feature>.controller.ts   # 路由定义
│       ├── <feature>.service.ts      # 业务逻辑
│       └── <feature>.schema.ts       # Zod v4 验证 schema
├── middleware/         # 全局中间件（auth、rate-limit）
└── lib/               # 工具（db 实例、redis 客户端）
```

**关键约定：**
- 每个 module 导出一个 `new Elysia({ prefix })` 实例，入口文件通过 `.use()` 挂载
- 入口文件必须 `export type App = typeof app`——这是 Eden Treaty 类型安全的起点
- controller 只做路由绑定和参数验证，业务逻辑放 service
- schema 文件放模块内（请求/响应验证），跨模块共享的 schema 放 `packages/shared`

## Eden Treaty 集成

**接线模式（只需两步）：**

```typescript
// 1. apps/web/src/lib/api.ts — 创建客户端
import { treaty } from "@elysiajs/eden"
import type { App } from "@repo/server/src/index"
export const api = treaty<App>("http://localhost:3001")

// 2. 在 TanStack Query 中使用 — 自动类型推导
const { data, error } = await api.users.get()
```

**注意事项：**
- Eden Treaty 的类型推导依赖入口文件导出的 `App` 类型，修改路由后确保类型同步
- `{ data, error }` 解构是统一的错误处理模式——在 queryFn 中 `if (error) throw error`
- 不要在前端直接 `fetch` Elysia API，Eden Treaty 存在的意义就是端到端类型安全

## Hono 切换方案

当 Bun 运行时不兼容时（如 HocusPocus 等依赖 Node API 的库），切换到 Hono。

**与 Elysia 的关键差异：**

| | Elysia | Hono |
|--|--------|------|
| 运行时 | Bun | Node.js（用 `tsx` 开发） |
| 类型安全 RPC | Eden Treaty | Hono RPC（`hc` client） |
| 验证 | 内置 `t.Object()` | `@hono/zod-validator` |

模块结构、目录组织与 Elysia 保持一致，仅替换框架 API。

**Hono RPC 接线：**

```typescript
// 后端：链式路由赋值给变量，导出类型
const routes = app.get("/users", /* ... */).post("/users", /* ... */)
export type AppType = typeof routes

// 前端：hc 客户端
import { hc } from "hono/client"
import type { AppType } from "@repo/hono-server/src/index"
const client = hc<AppType>("http://localhost:3001")
```

## Drizzle Schema 约定

**Schema 放在 `packages/database/src/schema/` 下，每个表一个文件。**

关键约定：
- PostgreSQL（生产）用 `uuid().primaryKey().defaultRandom()` 作为主键
- SQLite（本地 demo）用 `text().primaryKey().$defaultFn(() => crypto.randomUUID())`
- 时间戳字段：PostgreSQL 用 `timestamp("created_at", { withTimezone: true })`，SQLite 用 `integer("created_at", { mode: "timestamp" })`
- DB 实例在 `packages/database/src/index.ts` 创建并导出，传入 `{ schema }` 启用关系查询
- `drizzle.config.ts` 放在 `packages/database/` 根目录

**注意事项：**
- 从 SQLite 切换到 PostgreSQL 时需要重写 schema 的列定义（API 不同），不是简单改 import
- 所有 schema 通过 `src/schema/index.ts` 统一导出
- 迁移文件（`drizzle/` 目录）纳入版本管理

## Zod v4 验证模式

**类型安全链路：`Drizzle schema → Zod v4 schema → Eden Treaty → 前端`**

约定：
- Zod schema 放在 `packages/shared/src/schemas/`，与 Drizzle table 一一对应
- 基础 schema 包含所有字段 → `createSchema = base.omit({ id, createdAt, updatedAt })` → `updateSchema = createSchema.partial()`
- 类型通过 `z.infer<typeof schema>` 导出，不手写重复类型

**Zod v4 关键变化（容易踩的坑）：**
- 导入路径：`import { z } from "zod/v4"`（不是 `"zod"`）
- `z.email()` 替代 `z.string().email()`
- `z.uuid()` 替代 `z.string().uuid()`
- `z.url()` 替代 `z.string().url()`
- `z.object()` 默认不再 strip unknown keys，需要显式 `.strict()`

## Next.js 轻量后端

简单 CRUD 不需要独立后端，直接用 Next.js Server Actions 或 Route Handlers。

**何时用哪个：**
- **Server Actions** — 表单提交、数据变更操作（POST/PUT/DELETE 语义）
- **Route Handlers** — 需要被外部调用的 API（webhooks、第三方集成）

**Server Actions 约定：**
- 文件放在 `src/features/<feature>/actions.ts`，顶部 `"use server"`
- 必须用 Zod `safeParse` 验证输入
- 返回 `{ data }` 或 `{ error: parsed.error.flatten() }`，不 throw
- 导入 db 和 schema 时使用 `@repo/database` 和 `@repo/shared` 的包路径

**注意事项：**
- Server Actions 不适合复杂业务逻辑（多表事务、定时任务、WebSocket）——这些场景用独立后端
- Route Handlers 放在 `src/app/api/` 下，遵循 Next.js 文件路由约定
