# 后端架构模式

## 目录

- [Elysia 项目结构](#elysia-项目结构)
- [Eden Treaty 集成](#eden-treaty-集成)
- [Hono 切换方案](#hono-切换方案)
- [Drizzle Schema 模式](#drizzle-schema-模式)
- [Zod v4 验证模式](#zod-v4-验证模式)
- [Next.js Server Actions / Route Handlers](#nextjs-轻量后端)

---

## Elysia 项目结构

```
apps/server/
├── src/
│   ├── index.ts           # 入口，挂载所有模块
│   ├── modules/           # feature-based 业务模块
│   │   ├── auth/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   └── auth.schema.ts    # Zod v4 schema
│   │   └── user/
│   │       ├── user.controller.ts
│   │       ├── user.service.ts
│   │       └── user.schema.ts
│   ├── middleware/         # 全局中间件
│   │   ├── auth.ts
│   │   └── rate-limit.ts
│   └── lib/               # 工具函数
│       ├── db.ts           # Drizzle 实例
│       └── redis.ts        # Upstash Redis 客户端
├── package.json
└── tsconfig.json
```

### 模块模式

```typescript
// src/modules/user/user.controller.ts
import { Elysia, t } from "elysia"
import { userService } from "./user.service"

export const userController = new Elysia({ prefix: "/users" })
  .get("/", () => userService.list())
  .get("/:id", ({ params: { id } }) => userService.getById(id), {
    params: t.Object({
      id: t.String(),
    }),
  })
  .post("/", ({ body }) => userService.create(body), {
    body: t.Object({
      name: t.String(),
      email: t.String({ format: "email" }),
    }),
  })
```

```typescript
// src/index.ts
import { Elysia } from "elysia"
import { userController } from "./modules/user/user.controller"
import { authController } from "./modules/auth/auth.controller"

const app = new Elysia()
  .use(userController)
  .use(authController)
  .listen(3001)

export type App = typeof app
```

## Eden Treaty 集成

Eden Treaty 提供端到端类型安全，从 Elysia 后端到前端。

```typescript
// apps/web/src/lib/api.ts
import { treaty } from "@elysiajs/eden"
import type { App } from "@repo/server/src/index"

export const api = treaty<App>("http://localhost:3001")
```

```typescript
// 前端使用（自动类型推导）
const { data, error } = await api.users.get()
const { data: user } = await api.users({ id: "123" }).get()
```

**搭配 TanStack Query：**

```typescript
import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"

export function useUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data, error } = await api.users.get()
      if (error) throw error
      return data
    },
  })
}
```

## Hono 切换方案

当 Bun 运行时不兼容时（如使用 HocusPocus 等依赖 Node API 的库），切换到 Hono。

**切换要点：**
- Hono 的 API 风格与 Elysia 类似（链式路由），迁移成本低
- 运行在 Node.js 上，使用 `tsx` 开发
- 失去 Eden Treaty 端到端类型安全，需手动定义 API 类型或使用 Hono RPC

```typescript
// apps/hono-server/src/index.ts
import { Hono } from "hono"
import { zValidator } from "@hono/zod-validator"
import { z } from "zod/v4"

const app = new Hono()

const userSchema = z.object({
  name: z.string(),
  email: z.email(),
})

app.get("/users", async (c) => {
  // ...
  return c.json(users)
})

app.post("/users", zValidator("json", userSchema), async (c) => {
  const body = c.req.valid("json")
  // ...
  return c.json(user, 201)
})

export default app
```

**Hono RPC（替代 Eden Treaty）：**

```typescript
// 后端导出类型
const routes = app.get("/users", /* ... */).post("/users", /* ... */)
export type AppType = typeof routes

// 前端使用
import { hc } from "hono/client"
import type { AppType } from "@repo/hono-server/src/index"

const client = hc<AppType>("http://localhost:3001")
```

## Drizzle Schema 模式

### Schema 定义

```typescript
// packages/database/src/schema/user.ts
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
})
```

### SQLite 用于本地 demo

```typescript
// packages/database/src/schema/user.ts (SQLite 版)
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core"

export const users = sqliteTable("users", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
})
```

### DB 实例

```typescript
// packages/database/src/index.ts (PostgreSQL)
import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import * as schema from "./schema"

const client = postgres(process.env.DATABASE_URL!)
export const db = drizzle(client, { schema })
```

### Drizzle Kit 配置

```typescript
// packages/database/drizzle.config.ts
import { defineConfig } from "drizzle-kit"

export default defineConfig({
  schema: "./src/schema/index.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
})
```

## Zod v4 验证模式

### Drizzle → Zod 类型安全链路

```typescript
// packages/shared/src/schemas/user.ts
import { z } from "zod/v4"

// 基础 schema（对应 Drizzle table 字段）
export const userSchema = z.object({
  id: z.uuid(),
  name: z.string().min(1),
  email: z.email(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

// 创建用 schema（排除自动生成字段）
export const createUserSchema = userSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})

// 更新用 schema（所有字段可选）
export const updateUserSchema = createUserSchema.partial()

// 类型导出
export type User = z.infer<typeof userSchema>
export type CreateUser = z.infer<typeof createUserSchema>
export type UpdateUser = z.infer<typeof updateUserSchema>
```

### Zod v4 关键变化

- 导入路径：`import { z } from "zod/v4"`（非 `"zod"`）
- `z.email()` 替代 `z.string().email()`
- `z.uuid()` 替代 `z.string().uuid()`
- `z.url()` 替代 `z.string().url()`
- `z.object().strict()` 默认不再 strip unknown keys

## Next.js 轻量后端

简单 CRUD 不需要独立后端，直接用 Next.js 能力。

### Server Actions

```typescript
// src/features/user/actions.ts
"use server"

import { db } from "@repo/database"
import { users } from "@repo/database/schema"
import { createUserSchema } from "@repo/shared/schemas/user"

export async function createUser(formData: FormData) {
  const raw = Object.fromEntries(formData)
  const parsed = createUserSchema.safeParse(raw)

  if (!parsed.success) {
    return { error: parsed.error.flatten() }
  }

  const [user] = await db.insert(users).values(parsed.data).returning()
  return { data: user }
}
```

### Route Handlers

```typescript
// src/app/api/users/route.ts
import { NextResponse } from "next/server"
import { db } from "@repo/database"
import { users } from "@repo/database/schema"

export async function GET() {
  const allUsers = await db.select().from(users)
  return NextResponse.json(allUsers)
}
```
