# Monorepo 详细配置

> **TOC**: [Turborepo](#turborepo) · [根 package.json](#根-packagejson) · [config-typescript](#packagesconfigtypescript) · [ui](#packagesui) · [shared](#packagesshared) · [database](#packagesdatabase) · [apps/web](#appsweb) · [apps/server](#appsserver)

## Turborepo

- `turbo.json` 的 `outputs` 必须包含 `.next/**` 和 `dist/**`，否则缓存失效
- Workspace 通过 `pnpm-workspace.yaml` 声明（即使用 bun 也需要）
- `lint` / `lint:fix` 直接用 `biome check`，不经过 turbo

## 根 package.json

- `packageManager`: `bun@latest`
- 根 devDependencies 只装 `@biomejs/biome`、`husky`、`knip`、`turbo`

## packages/config-typescript

- `base.json` — `strict: true`、`moduleResolution: "bundler"`、`target: "ES2022"`、`noUncheckedIndexedAccess: true`
- `nextjs.json` — extends base + `jsx: "preserve"` + next plugin + `@/*` paths
- `library.json` — extends base + `jsx: "react-jsx"` + `declaration` + `sourceMap`

注意：`noUncheckedIndexedAccess` 让数组索引返回 `T | undefined`。

## packages/ui

不打包，TypeScript paths 引用。

**exports：** `./components/*` → `./src/components/*.tsx` · `./lib/*` → `./src/lib/*.ts` · `./globals.css` → `./src/globals.css`

**引用：** `import { Button } from "@repo/ui/components/button"`

- shadcn/ui 通过 CLI 安装，不手动创建
- `cn()` 放 `src/lib/utils.ts`
- `globals.css` 含 Tailwind v4 + 设计 token，`apps/web` 导入它
- `class-variance-authority`、`clsx`、`tailwind-merge` 装在此 package

## packages/shared

**exports：** `./schemas/*` · `./types/*` · `./utils/*` → 对应 `./src/` 下目录

- 只有**确定被多个 app 引用**的代码才放这里
- `zod` 版本 `^4.0.0`

## packages/database

**exports：** `.` → `./src/index.ts`（db 实例） · `./schema` → `./src/schema/index.ts`

**脚本：** `generate` · `migrate` · `studio`

- `drizzle.config.ts` 放此 package 根目录，迁移文件纳入版本管理

## apps/web

- `dev`: `next dev --turbopack`
- 依赖 `@repo/ui`、`@repo/shared`、`@repo/database` 通过 `workspace:*`
- tsconfig extends `@repo/config-typescript/nextjs.json`
- 环境变量：`@t3-oss/env-nextjs` + Zod，配置放 `src/env.ts`

## apps/server

| | Elysia (Bun) | Hono (Node) |
|--|---|---|
| dev | `bun --watch src/index.ts` | `tsx watch src/index.ts` |
| start | `bun src/index.ts` | `node dist/index.js` |
| 核心依赖 | `elysia` + `@elysiajs/eden` | `hono` |

- 依赖 `@repo/shared` 和 `@repo/database`，通过 `workspace:*`
