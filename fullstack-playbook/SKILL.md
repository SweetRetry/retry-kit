---
name: fullstack-playbook
description: 全栈工程规范手册。定义技术栈选型、monorepo 结构、代码约定、部署策略和反模式禁令。在任何前端/全栈开发任务中自动加载，确保技术选型和代码风格始终一致。触发场景：(1) 搭建新项目或初始化 monorepo，(2) 添加新功能、新页面、新 API，(3) 选择技术方案（数据库、认证、部署等），(4) 代码审查或重构，(5) 用户提到 Next.js、Turborepo、Elysia、shadcn/ui、Tailwind、Drizzle 等技术栈关键词。
---

# Fullstack Playbook

项目级工程规范。所有技术决策、目录约定、代码风格的单一事实来源。

## 技术栈速查

| 层 | 首选 | 备选 | 何时用备选 |
|---|---|---|---|
| Monorepo | Turborepo | — | — |
| 包管理 | bun | pnpm | Bun 运行时不兼容时（如 HocusPocus） |
| 前端框架 | Next.js (App Router, RSC 优先) | — | — |
| 路由 | Next.js App Router | TanStack Router | 非 Next.js 项目（Vite/SPA）或需要前端路由强类型搜索参数 |
| 后端 (轻量) | Next.js Route Handlers / Server Actions | — | 简单 CRUD、表单提交 |
| 后端 (重度) | Elysia + Eden Treaty (Bun) | Hono (Node) | 复杂业务逻辑；Bun 不兼容时换 Hono |
| 数据库 ORM | Drizzle + PostgreSQL | Drizzle + SQLite | 本地 demo / 原型 |
| 验证 | **Zod v4** (必须) | — | — |
| 样式 | Tailwind CSS v4 (严格) | — | ❌ CSS Modules / inline styles |
| 组件库 | shadcn/ui | — | ❌ 定制组件源码 |
| 动画 (极简) | tw-animate-css | — | 纯 CSS，shadcn/ui 内置动画 |
| 动画 (默认) | Motion (framer-motion) | GSAP / Three.js | GSAP: 复杂时间线；Three.js: 3D |
| 状态管理 | Zustand | — | — |
| 数据获取 | TanStack Query | Eden Treaty | Eden Treaty 端到端类型安全 |
| 表单 | React Hook Form + Zod v4 | — | — |
| 日期 | dayjs | — | — |
| 图标 | lucide-react | @tabler/icons-react | Lucide 缺图标时用 Tabler |
| 国际化 | next-intl | — | — |
| 环境变量 | @t3-oss/env-nextjs + Zod | — | — |
| Lint / Format | Biome | — | — |
| 测试 | Vitest | — | — |
| 认证 | Supabase Auth (海外) / Better Auth (通用) | — | 有 Supabase 基建时用前者 |

## 决策树

```
后端方案？
├─ 简单 CRUD / 表单 → Next.js Server Actions / Route Handlers
└─ 复杂业务 → Bun 兼容？ → Elysia + Eden Treaty │ 否 → Hono (Node)

部署？
├─ 海外 → Vercel + Supabase + Upstash + ImageKit
└─ 国内 → Sealos (内置 PG + Redis) + 自选对象存储/CDN

数据库？
├─ 本地原型 → Drizzle + SQLite + 本地目录（非结构化资源）
└─ 生产 → 海外 Supabase PG │ 国内 Sealos PG

前端路由？
├─ Next.js 项目 → App Router（文件路由）
└─ 非 Next.js（Vite/SPA）→ TanStack Router
```

## Monorepo 结构

```
project-root/
├── apps/
│   ├── web/              # Next.js (App Router)
│   └── server/           # Elysia 或 Hono（需要时）
├── packages/
│   ├── ui/               # shadcn/ui 共享组件（不打包，TypeScript paths）
│   ├── database/         # Drizzle schema + 迁移
│   ├── shared/           # 类型、Zod schema、工具函数
│   └── config-typescript/# 共享 tsconfig
├── biome.json · knip.json · turbo.json · package.json
```

**关键约定：**
- `packages/ui` 不打包，TypeScript paths + Turborepo internal packages
- `packages/shared` 存放跨 app 共享的 Zod schema 和类型定义
- 应用级组件/hooks/lib 放 `apps/web/src/`，不随意提升到 packages
- 将代码移入 `packages/` 前必须征求用户同意

## 代码约定

### 命名

- 文件名 **kebab-case**、变量/函数 **camelCase**、组件导出 **PascalCase**
- 目录 **feature-based** → `features/auth/`；聚合视图放 `app/` 路由层
- **强制语义化**：禁止 `data`、`info`、`temp`、`item`、`handleClick`、`res`、`val`

### TypeScript

- 禁止 `as` 和 `any`（除非有充分注释说明原因）
- 端到端类型安全链路：`Drizzle schema → Zod v4 → Eden Treaty → 前端`
- **优先推导类型**：用 `z.infer`、`typeof`、`ReturnType`，禁止重复手写已存在的类型

### 样式

- 严格 Tailwind utility classes。❌ CSS Modules、❌ inline `style={{}}`、❌ 硬编码颜色/任意值
- 条件类名用 `cn()`。视觉 token/色值约束由 visual-design 管理

### React

- **RSC 优先**：默认 Server Component。❌ `"use client"` 包裹整页
- **`useEffect` 需审批**：确需时说明原因并征求用户同意
- **交互组件优先 shadcn/ui**。❌ 原生 HTML 替代组件库
- **URL 驱动状态**：Next.js 用 `searchParams`；非 Next.js 用 TanStack Router search params。Zustand 只管 UI 临时状态
- **数据获取**：SC 直接 await，客户端用 TanStack Query。❌ `useEffect` 做数据获取

### 错误处理

- 统一 `{ data, error }` 返回值模式。❌ throw 做常规错误处理
- Server Actions 返回 `{ data }` 或 `{ error: parsed.error.flatten() }`

## 行为纪律

- **改完必验证**：每次修改后运行 `tsc --noEmit` 和 `biome check` 确认零错误
- **新增依赖需审批**：安装新 npm 包前必须征求用户同意

## 深度参考

按需加载：

- [references/monorepo-setup.md](references/monorepo-setup.md) — 各 package 的 exports 约定、tsconfig 配置、apps 配置
- [references/backend-patterns.md](references/backend-patterns.md) — Elysia 模块结构、Eden Treaty 接线代码、Hono 切换、Drizzle PG/SQLite 差异、Zod v4 踩坑
- [references/frontend-patterns.md](references/frontend-patterns.md) — Next.js 目录结构、TanStack Query 约定、RHF 接线、Zustand 边界、动画选择矩阵

## References 读取门禁

### 读取条件

1. 仅做小范围语法修复或注释调整：可不读取 references。
2. 发生架构决策、目录结构调整、跨层数据流修改、框架接线改造时：必须读取对应 reference。

### 最低读取量

1. 涉及 monorepo/package 边界：必读 `references/monorepo-setup.md`
2. 涉及后端 API/ORM/服务编排：必读 `references/backend-patterns.md`
3. 涉及前端目录/状态/表单/数据获取：必读 `references/frontend-patterns.md`
