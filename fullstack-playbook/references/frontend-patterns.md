# 前端模式

## Next.js App Router 约定

### 目录结构

```
apps/web/src/
├── app/                        # App Router 路由
│   ├── layout.tsx              # 根布局（Providers 挂载点）
│   ├── page.tsx
│   ├── globals.css             # 导入 @repo/ui/globals.css
│   ├── (marketing)/            # 路由分组：营销页
│   ├── (app)/                  # 路由分组：应用主体
│   └── api/                    # Route Handlers（轻量 API）
├── components/                 # 应用级共享组件
├── hooks/                      # 应用级共享 hooks
├── lib/                        # 应用级工具函数
└── features/                   # feature-based 业务模块
    └── <feature>/
        ├── components/         # 该功能专属组件
        ├── hooks/              # 该功能专属 hooks
        ├── actions.ts          # Server Actions
        └── queries.ts          # TanStack Query hooks
```

**层级归属原则：**
- feature 专属 → `features/<name>/`
- 跨 feature 复用但仅限本 app → `src/components/`、`src/hooks/`、`src/lib/`
- 跨 app 复用 → 征求用户同意后提升到 `packages/`

**注意事项：**
- 聚合视图（如 dashboard）是多个 feature 的组合，放在 `app/` 路由层，不作为 feature
- `globals.css` 导入 `@repo/ui/globals.css`，不要在 app 层重复定义 token

### Providers 约定

- 根布局中引入 `<Providers>`，Providers 组件标记 `"use client"`
- QueryClient 通过 `useState` 初始化（避免服务端/客户端共享实例）
- 默认 `staleTime: 60 * 1000`

---

## RSC 模式

**默认 Server Component。** 只在以下情况添加 `"use client"`：
- 使用 `useState`、`useReducer`、`useEffect`
- 使用浏览器 API（`window`、`document`）
- 使用事件处理器（`onClick`、`onChange`）
- 使用第三方客户端库（Motion、Zustand hooks）

**关键原则：最小化客户端边界。** 不要整页标记 `"use client"`，只包裹需要交互的最小组件。页面级组件保持 Server Component，在其中 `await` 获取数据后传给客户端子组件。

**注意事项：**
- Server Component 可以直接 `import { db } from "@repo/database"` 查询数据，不需要 API 层
- 客户端组件不能 `async`，需要数据时用 TanStack Query 或从父级 Server Component 接收 props
- `"use client"` 是边界声明，它下面的所有 import 也会变成客户端代码——注意不要意外拉入大型服务端依赖

---

## TanStack Query

用于**客户端**数据获取和缓存。Server Component 直接 await，不需要 TanStack Query。

**约定：**
- Query hooks 放在 `features/<feature>/queries.ts`
- 使用 query key factory 模式：`featureKeys.all → featureKeys.lists() → featureKeys.detail(id)`
- queryFn 中使用 Eden Treaty API，解构 `{ data, error }`，`if (error) throw error`
- mutation 成功后用 `queryClient.invalidateQueries` 刷新相关列表

**注意事项：**
- 不要在 Server Component 中使用 TanStack Query（没有意义，直接 await）
- queryKey 必须包含所有影响查询结果的参数（id、filters 等）
- 避免在 queryFn 中做数据转换，保持 queryFn 纯净，转换逻辑用 `select` 选项

---

## React Hook Form + Zod v4

**接线三步：**

1. `useForm` 绑定 `zodResolver(schema)`，schema 从 `@repo/shared/schemas/` 导入
2. 每个字段用 shadcn/ui 的 `FormField` 包裹（具体 JSX 参考 shadcn/ui 文档）
3. `onSubmit` 拿到类型安全的 values，调用 mutation 或 Server Action

**注意事项：**
- Schema 不要在组件内重复定义，必须从 `@repo/shared` 导入（保持单一来源）
- `defaultValues` 必须提供，否则非受控 → 受控切换会产生警告
- 表单组件必须标记 `"use client"`

---

## Zustand

**仅用于真正的客户端 UI 状态**（侧边栏开关、弹窗状态、临时交互状态）。

**决策规则：**
- 服务端数据 → TanStack Query（不放 Zustand）
- 可分享/可书签的状态（筛选、分页、排序）→ URL searchParams（不放 Zustand）
- 纯客户端临时状态 → Zustand

**约定：**
- Store 放在 `features/<feature>/hooks/use-<name>-store.ts`
- 每个 feature 独立 store，避免单一巨大 store
- 用 `create<StateType>((set) => ({ ... }))` 模式

---

## next-intl

**目录约定：**
- 翻译文件放 `apps/web/messages/{locale}.json`
- 配置文件放 `apps/web/src/i18n/request.ts`
- 路由使用 `[locale]` 动态段

**注意事项：**
- Server Component 用 `getTranslations`，Client Component 用 `useTranslations`
- 翻译 key 按 feature 组织（`"Auth.loginButton"`、`"Dashboard.title"`）

---

## 动画使用边界

**选择矩阵：**

| 需求 | 方案 |
|------|------|
| shadcn/ui 内置动画、简单 fade/slide 入场 | tw-animate-css |
| 入场 + 退场、hover/tap 反馈、布局动画、spring | Motion |
| 复杂多元素时间线、ScrollTrigger、SVG 路径动画 | GSAP |
| 3D 渲染 | Three.js（简单场景用 R3F + Drei，高性能用原生） |

**升级信号：** 一旦需要 `exit` 动画、`spring` 物理、`whileHover`/`whileTap`、`layout` 动画，从 tw-animate-css 升级到 Motion。

**注意事项：**
- Motion 导入路径：`import { motion } from "motion/react"`（不是 `"framer-motion"`）
- GSAP 在 React 中用 `useGSAP` hook（`@gsap/react`），配合 `scope` 限定 DOM 范围
- 所有动画组件必须标记 `"use client"`
- Three.js 的 Canvas 会阻塞主线程渲染，大场景考虑 `frameloop="demand"` 或 offscreen canvas
