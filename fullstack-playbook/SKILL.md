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
| 后端 (轻量) | Next.js Route Handlers / Server Actions | — | 简单 CRUD、表单提交 |
| 后端 (重度) | Elysia + Eden Treaty (Bun) | Hono (Node) | 复杂业务逻辑（金融等）；Bun 不兼容时换 Hono |
| 数据库 ORM | Drizzle + PostgreSQL | Drizzle + SQLite | 本地 demo / 原型 |
| 数据库迁移 | drizzle-kit | — | — |
| 验证 | **Zod v4** (必须) | — | — |
| 样式 | Tailwind CSS v4 (严格) | — | 禁止 CSS Modules / inline styles |
| 组件库 | shadcn/ui | — | 禁止定制组件源码 |
| 动画 (极简) | tw-animate-css | — | 纯 CSS，用于 shadcn/ui 内置动画和简单 fade/slide |
| 动画 (默认) | Motion (framer-motion) | GSAP / Three.js | GSAP: 复杂时间线、ScrollTrigger；Three.js: 3D 场景 |
| 3D | React Three Fiber 或原生 Three.js | — | 视场景复杂度选择 |
| 状态管理 | Zustand | — | — |
| 数据获取 | TanStack Query | Eden Treaty | 搭配 Elysia 时 Eden Treaty 提供端到端类型安全 |
| 表单 | React Hook Form + Zod v4 | — | — |
| 日期 | dayjs | — | — |
| 图标 | lucide-react | @tabler/icons-react | Lucide 缺图标时用 Tabler，最后才自绘 SVG |
| 国际化 | next-intl | — | — |
| 环境变量 | @t3-oss/env-nextjs + Zod | — | — |
| Lint / Format | Biome | — | — |
| 死代码检测 | Knip | — | — |
| Git Hooks | Husky | — | — |
| 测试 | Vitest | — | — |
| 认证 | Supabase Auth (海外) / Better Auth (通用) | — | 有 Supabase 基建时用 Supabase Auth，否则 Better Auth |

## 决策树

### 后端方案选择

```
需要后端 API？
├─ 简单 CRUD / 表单 → Next.js Server Actions 或 Route Handlers
└─ 复杂业务逻辑 → 独立后端服务
   ├─ Bun 运行时兼容 → Elysia + Eden Treaty
   └─ Bun 不兼容 → Hono (Node)
```

### 部署方案选择

```
目标市场？
├─ 海外 → Vercel + Supabase (DB + Auth + Storage) + Upstash (Redis) + ImageKit (CDN/媒体)
└─ 国内 → Sealos (内置 PG + Redis) + 自选对象存储/CDN
```

### 数据库选择

```
项目阶段？
├─ 本地 demo / 原型
│  ├─ 数据库 → Drizzle + SQLite（需要索引的结构化数据）
│  └─ 文件存储 → 本地目录（图片/视频/文档等非结构化资源）
└─ 生产环境
   ├─ 海外 → Supabase Postgres + Supabase Storage / ImageKit
   └─ 国内 → Sealos PG + 自选对象存储
```

## Monorepo 结构

```
project-root/
├── apps/
│   ├── web/                    # Next.js (App Router)
│   └── server/                 # Elysia 或 Hono（需要时）
├── packages/
│   ├── ui/                     # shadcn/ui 共享组件（不打包，TypeScript paths）
│   ├── database/               # Drizzle schema + 迁移
│   ├── shared/                 # 类型、Zod schema、工具函数
│   └── config-typescript/      # 共享 tsconfig
├── biome.json
├── knip.json
├── turbo.json
└── package.json
```

**关键约定：**

- `packages/ui` 不打包，使用 TypeScript paths + Turborepo internal packages
- `packages/database` 存放 Drizzle schema，被 `apps/server` 和 `apps/web` 共同引用
- `packages/shared` 存放跨 app 共享的 Zod schema 和类型定义
- 应用级的组件、hooks、lib 放在 `apps/web/src/` 下（如 `components/`、`hooks/`、`lib/`），不要随意提升到 packages
- 将代码移入 `packages/ui` 或 `packages/shared` 前必须征求用户同意，除非项目中已有对应的业务级 package

## 代码约定

### 文件命名

- 所有文件名：**kebab-case** → `user-profile.tsx`、`auth-guard.ts`
- 内部命名：**camelCase** → `const userName`、`function getUserProfile()`
- 组件导出名：**PascalCase** → `export function UserProfile()`
- 目录组织：**feature-based** → `features/auth/`、`features/billing/`、`features/user/`
- 聚合视图（如 dashboard）是多个 feature 的组合，放在 `app/` 路由层，不作为 feature
- **强制语义化命名**：文件名、变量名、函数名、属性名、CSS class 必须清晰表达意图。禁止 `data`、`info`、`temp`、`item`、`handleClick`、`res`、`val` 等模糊命名，用 `userProfile`、`invoiceList`、`onSubmitPayment` 等具体名称

### TypeScript

- **strict mode** 必须开启
- 禁止 `as` 和 `any`（除非有充分注释说明原因）
- 端到端类型安全链路：`Drizzle schema → Zod v4 → Eden Treaty → 前端`
- **优先从已有定义推导类型**：写新代码前先检查项目中已有的类型、Zod schema、Drizzle schema，用 `z.infer`、`typeof`、`ReturnType` 等推导，禁止重复手写已存在的类型定义

### 样式

- 严格使用 Tailwind utility classes，禁止 CSS Modules 和 inline `style={{}}`
- 使用 `cn()` 工具函数（`clsx` + `tailwind-merge`）处理条件类名
- 具体的 token 选择、色值规范、间距系统等视觉层面的约束由 web-style-guideline 管理

### React

- **RSC 优先**：默认 Server Component，只在必要时添加 `"use client"`
- 禁止 `"use client"` 包裹整个页面组件
- **`useEffect` 需审批**：使用前先思考是否真的需要副作用（可能是产品或架构设计问题）。如果确需使用，说明原因并征求用户同意后再写
- **交互组件优先使用 shadcn/ui**（Dialog、Popover、Select、Tabs 等），只在定制性超出组件 variant 能力时才自行实现
- **URL 驱动状态**：搜索、筛选、分页、排序等用户可感知的状态通过 `searchParams` 管理（可分享、可书签），Zustand 只管 UI 临时状态

### 错误处理

- 统一使用 `{ data, error }` 返回值模式（与 Eden Treaty 一致），不 throw
- Server Actions 返回 `{ data }` 或 `{ error: parsed.error.flatten() }`
- 客户端通过 `if (error)` + `error.status` 类型收窄处理错误
- 全局 Error Boundary 仅兜底未预期的异常，不作为常规错误处理手段

## 反模式清单

| 级别 | 反模式 | 正确做法 |
|------|--------|----------|
| CRITICAL | `useEffect` 做数据获取 | TanStack Query 或 Server Component |
| CRITICAL | `"use client"` 包裹整页 | 只包裹需要交互的最小组件 |
| CRITICAL | 硬编码颜色 / 任意值 | 使用 Tailwind 语义 token 和标准 scale |
| CRITICAL | 原生 HTML 元素替代组件库 | 使用 shadcn/ui 对应组件 |
| CRITICAL | inline `style={{}}` | Tailwind utility class |
| CRITICAL | throw 做常规错误处理 | `{ data, error }` 返回值模式 |
| WARNING | `as` / `any` 类型断言 | 正确的泛型 / 类型守卫 |
| WARNING | 复杂交互动画用 CSS `transition` | 需要 spring 物理 / exit 动画 / 编排时用 Motion |
| WARNING | 条件类名字符串拼接 | `cn()` 工具函数 |
| WARNING | 筛选/分页状态放 Zustand | `searchParams` URL 驱动 |

## 行为纪律

- **改完必验证**：每次修改后运行 `tsc --noEmit` 和 `biome check` 确认零错误，不允许留下类型错误后声称"完成"
- **新增依赖需审批**：安装任何新 npm 包前必须征求用户同意，说明为什么现有依赖无法满足需求

## 深度参考

在执行具体开发任务时，按需加载以下参考文档获取详细配置和代码模式：

- **Monorepo 详细配置** → [references/monorepo-setup.md](references/monorepo-setup.md) — Turborepo 配置、package.json 模板、TypeScript paths、Biome/Knip/Husky 配置
- **后端架构** → [references/backend-patterns.md](references/backend-patterns.md) — Elysia 项目结构、Eden Treaty 集成、Hono 切换方案、Drizzle schema 模式、Zod v4 验证模式
- **前端模式** → [references/frontend-patterns.md](references/frontend-patterns.md) — Next.js App Router 约定、RSC 模式、TanStack Query、React Hook Form + Zod v4、Zustand、next-intl、Motion/GSAP/Three.js 使用边界
