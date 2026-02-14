# Monorepo 详细配置

## Turborepo

**关键约定：**
- `build` 任务 `dependsOn: ["^build"]`，确保依赖包先构建
- `dev` 任务 `cache: false, persistent: true`
- Workspace 通过 `pnpm-workspace.yaml` 声明（Turborepo 要求，即使用 bun）

**注意事项：**
- `turbo.json` 的 `outputs` 必须包含 `.next/**` 和 `dist/**`，否则缓存失效
- 新增 package 后需要在 `pnpm-workspace.yaml` 的 glob 范围内（`apps/*` 和 `packages/*`）

## 根 package.json

**脚本约定：**
- `dev` / `build` / `test` / `check` 通过 `turbo` 调度
- `lint` / `lint:fix` 直接用 `biome check`（不经过 turbo，因为 biome 本身支持全项目扫描）
- `prepare` 钩子用于 `husky` 初始化

**注意事项：**
- `packageManager` 字段设为 `bun@latest`
- 根目录的 devDependencies 只装 `@biomejs/biome`、`husky`、`knip`、`turbo`，业务依赖装在各 app/package 内

## packages/config-typescript

共享 TypeScript 配置，其他 package 通过 `extends` 引用。

**三个配置文件：**
- `base.json` — 所有包共享：`strict: true`、`moduleResolution: "bundler"`、`target: "ES2022"`、`noUncheckedIndexedAccess: true`
- `nextjs.json` — extends base，加 `jsx: "preserve"` + next plugin + `@/*` paths
- `library.json` — extends base，加 `jsx: "react-jsx"` + `declaration` + `sourceMap`

**注意事项：**
- 新建 package 时 tsconfig 必须 extends 以上之一，不要从零写
- `noUncheckedIndexedAccess: true` 会让数组索引访问返回 `T | undefined`，需要显式检查

## packages/ui

共享 shadcn/ui 组件库。**不打包**，直接通过 TypeScript paths 引用。

**exports 约定：**
- `./components/*` → `./src/components/*.tsx`
- `./lib/*` → `./src/lib/*.ts`
- `./globals.css` → `./src/globals.css`

**引用方式：** `import { Button } from "@repo/ui/components/button"`

**注意事项：**
- shadcn/ui 组件通过 CLI 安装到此 package，不要手动创建
- `cn()` 工具函数（`clsx` + `tailwind-merge`）放在 `src/lib/utils.ts`
- `globals.css` 包含 Tailwind v4 配置和设计 token，`apps/web` 的 `globals.css` 导入它
- 依赖项 `class-variance-authority`、`clsx`、`tailwind-merge` 装在此 package 的 dependencies 中

## packages/shared

跨 app 共享的类型定义、Zod schema、工具函数。

**exports 约定：**
- `./schemas/*` → `./src/schemas/*.ts`
- `./types/*` → `./src/types/*.ts`
- `./utils/*` → `./src/utils/*.ts`

**注意事项：**
- 只有**确定被多个 app 引用**的代码才放这里
- Zod schema 是这里最重要的内容——它是类型安全链路的中枢
- `zod` 依赖版本必须 `^4.0.0`

## packages/database

Drizzle ORM schema 和迁移配置。

**exports 约定：**
- `.` → `./src/index.ts`（db 实例）
- `./schema` → `./src/schema/index.ts`（所有表定义）

**脚本约定：**
- `generate` — 生成迁移文件
- `migrate` — 执行迁移
- `studio` — 启动 Drizzle Studio

**注意事项：**
- `drizzle.config.ts` 放在此 package 根目录
- 迁移文件（`drizzle/` 目录）必须纳入版本管理
- 所有 schema 通过 `src/schema/index.ts` 统一导出

## apps/web

Next.js App Router 应用。

**关键约定：**
- `dev` 脚本使用 `next dev --turbopack`
- 依赖 `@repo/ui`、`@repo/shared`、`@repo/database` 通过 `workspace:*`
- tsconfig extends `@repo/config-typescript/nextjs.json`
- 环境变量通过 `@t3-oss/env-nextjs` + Zod 验证，配置文件放 `src/env.ts`

## apps/server

独立后端服务（按需创建）。

| | Elysia (Bun) | Hono (Node) |
|--|---|---|
| dev 脚本 | `bun --watch src/index.ts` | `tsx watch src/index.ts` |
| start 脚本 | `bun src/index.ts` | `node dist/index.js` |
| 核心依赖 | `elysia` + `@elysiajs/eden` | `hono` |

**注意事项：**
- 同一 monorepo 可同时存在多个 server app
- server app 依赖 `@repo/shared` 和 `@repo/database`，通过 `workspace:*`

## Biome / Knip / Husky

这些工具的配置在项目初始化时生成，日常开发不需要改。

**Biome：**
- `recommended` 规则集 + `noExplicitAny: error` + `noUnusedVariables: error` + `noUnusedImports: error`
- 格式化：`indentStyle: "tab"` · `lineWidth: 100` · `quoteStyle: "double"` · `semicolons: "asNeeded"`

**Knip：**
- 每个 workspace 独立配置 entry 和 project 路径
- `apps/web` 的 entry 包含 `page.tsx`、`layout.tsx`、`route.ts`

**Husky：**
- pre-commit 只跑 `biome check --staged`，保持轻量
- 完整 lint 和测试放在 CI 中
