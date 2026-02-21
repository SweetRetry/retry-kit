# 前端模式

> **TOC**: [目录结构](#目录结构) · [RSC](#rsc-模式) · [TanStack Query](#tanstack-query) · [RHF + Zod](#react-hook-form--zod-v4) · [Zustand](#zustand) · [next-intl](#next-intl) · [动画](#动画使用边界)

## 目录结构

```
apps/web/src/
├── app/                        # App Router 路由
│   ├── layout.tsx              # 根布局（Providers 挂载点）
│   ├── globals.css             # 导入 @repo/ui/globals.css
│   ├── (marketing)/ · (app)/   # 路由分组
│   └── api/                    # Route Handlers
├── components/ · hooks/ · lib/ # 应用级共享
└── features/<feature>/         # feature-based 业务模块
    ├── components/ · hooks/
    ├── actions.ts              # Server Actions
    └── queries.ts              # TanStack Query hooks
```

**层级归属：** feature 专属 → `features/` · 跨 feature 本 app → `src/` · 跨 app → `packages/`（需征求同意）

**Providers：** 根布局 `<Providers>`（`"use client"`），QueryClient 通过 `useState` 初始化。

---

## RSC 模式

**最小化客户端边界。** 页面级保持 SC，`await` 取数据后传给客户端子组件。

- SC 可直接 `import { db } from "@repo/database"` 查询，不需要 API 层
- `"use client"` 是边界声明——注意不要意外拉入服务端依赖

---

## TanStack Query

客户端数据获取和缓存（SC 直接 await，不需要 TanStack Query）。

- Query hooks 放 `features/<feature>/queries.ts`
- query key factory 模式：`featureKeys.all → .lists() → .detail(id)`
- queryFn 用 Eden Treaty API，`{ data, error }` 解构，`if (error) throw error`
- mutation 成功后 `invalidateQueries` 刷新列表
- 数据转换用 `select`，保持 queryFn 纯净

---

## React Hook Form + Zod v4

**Schema 必须从 `@repo/shared/schemas/` 导入，不在组件内重复定义。**

`useForm` + `zodResolver(schema)` · shadcn/ui `FormField` · `defaultValues` 必须提供 · 标记 `"use client"`

---

## Zustand

仅用于客户端 UI 临时状态（侧边栏、弹窗、临时交互）。

- Store 放 `features/<feature>/hooks/use-<name>-store.ts`
- 每个 feature 独立 store

---

## next-intl

- 翻译文件：`apps/web/messages/{locale}.json`
- 路由用 `[locale]` 动态段
- 翻译 key 按 feature 组织：`"Auth.loginButton"`

---

## 动画使用边界

| 需求 | 方案 |
|------|------|
| shadcn/ui 内置、简单 fade/slide | tw-animate-css |
| exit/spring/hover/tap/layout 动画 | Motion |
| 复杂时间线、ScrollTrigger、SVG 路径 | GSAP |
| 3D | Three.js (R3F + Drei 或原生) |

- Motion 导入：`import { motion } from "motion/react"`（不是 `"framer-motion"`）
- GSAP 用 `useGSAP`（`@gsap/react`）+ `scope`
