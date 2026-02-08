# 前端模式

## 目录

- [Next.js App Router 约定](#nextjs-app-router-约定)
- [RSC 模式](#rsc-模式)
- [TanStack Query](#tanstack-query)
- [React Hook Form + Zod v4](#react-hook-form--zod-v4)
- [Zustand](#zustand)
- [next-intl](#next-intl)
- [动画使用边界](#动画使用边界)

---

## Next.js App Router 约定

### 目录结构

```
apps/web/src/
├── app/                        # App Router 路由
│   ├── layout.tsx              # 根布局（providers 挂载点）
│   ├── page.tsx                # 首页
│   ├── globals.css             # 导入 @repo/ui/globals.css
│   ├── (marketing)/            # 路由分组：营销页
│   │   ├── page.tsx
│   │   └── pricing/page.tsx
│   ├── (app)/                  # 路由分组：应用主体
│   │   ├── layout.tsx          # 应用布局（含侧边栏等）
│   │   ├── dashboard/page.tsx  # 聚合视图，组合多个 feature
│   │   └── settings/page.tsx
│   └── api/                    # Route Handlers（轻量 API）
│       └── webhooks/route.ts
├── components/                 # 应用级共享组件（非 feature 专属）
├── hooks/                      # 应用级共享 hooks
├── lib/                        # 应用级工具函数
└── features/                   # feature-based 业务模块（见下方）
```

**层级归属原则：**
- feature 专属的组件/hooks → `features/<name>/components/`、`features/<name>/hooks/`
- 跨 feature 复用但仅限本 app → `src/components/`、`src/hooks/`、`src/lib/`
- 跨 app 复用 → 需征求用户同意后提升到 `packages/`

### Feature-Based 模块

```
apps/web/src/features/
├── auth/
│   ├── components/         # 该功能专属组件
│   │   ├── login-form.tsx
│   │   └── auth-guard.tsx
│   ├── hooks/              # 该功能专属 hooks
│   │   └── use-auth.ts
│   ├── actions.ts          # Server Actions
│   └── queries.ts          # TanStack Query hooks
├── billing/
│   ├── components/
│   ├── hooks/
│   └── queries.ts
└── user/
    ├── components/
    ├── actions.ts
    └── queries.ts
```

### 布局层级和 Providers

```tsx
// apps/web/src/app/layout.tsx
import "@repo/ui/globals.css"
import { Providers } from "./providers"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
```

```tsx
// apps/web/src/app/providers.tsx
"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useState } from "react"

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
          },
        },
      }),
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
```

---

## RSC 模式

### 默认 Server Component

所有组件默认是 Server Component。只在以下情况添加 `"use client"`：

- 使用 `useState`、`useReducer`、`useEffect`
- 使用浏览器 API（`window`、`document`）
- 使用事件处理器（`onClick`、`onChange`）
- 使用第三方客户端库（Motion、Zustand hooks）

### 最小化客户端边界

```tsx
// BAD: 整页标记为客户端
"use client"
export default function DashboardPage() { /* ... */ }

// GOOD: 只包裹需要交互的部分
export default function DashboardPage() {
  const data = await fetchData() // 服务端获取
  return (
    <div>
      <h1>Dashboard</h1>
      <StaticContent data={data} />
      <InteractiveChart data={data} /> {/* 只有这个是 "use client" */}
    </div>
  )
}
```

### 数据获取模式

```tsx
// Server Component 直接获取数据
import { db } from "@repo/database"
import { users } from "@repo/database/schema"

export default async function UsersPage() {
  const allUsers = await db.select().from(users)
  return <UserList users={allUsers} />
}
```

---

## TanStack Query

用于**客户端**数据获取和缓存。Server Component 直接 await，不需要 TanStack Query。

### Query 组织

```typescript
// src/features/user/queries.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api"

export const userKeys = {
  all: ["users"] as const,
  lists: () => [...userKeys.all, "list"] as const,
  detail: (id: string) => [...userKeys.all, "detail", id] as const,
}

export function useUsers() {
  return useQuery({
    queryKey: userKeys.lists(),
    queryFn: async () => {
      const { data, error } = await api.users.get()
      if (error) throw error
      return data
    },
  })
}

export function useUser(id: string) {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: async () => {
      const { data, error } = await api.users({ id }).get()
      if (error) throw error
      return data
    },
  })
}

export function useCreateUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: CreateUser) => {
      const { data, error } = await api.users.post(input)
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() })
    },
  })
}
```

---

## React Hook Form + Zod v4

```tsx
"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { createUserSchema, type CreateUser } from "@repo/shared/schemas/user"
import { Button } from "@repo/ui/components/button"
import { Input } from "@repo/ui/components/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/components/form"

export function CreateUserForm() {
  const form = useForm<CreateUser>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  })

  function onSubmit(values: CreateUser) {
    // mutation.mutate(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Create</Button>
      </form>
    </Form>
  )
}
```

---

## Zustand

### Store 模式

```typescript
// src/features/auth/hooks/use-auth-store.ts
import { create } from "zustand"

interface AuthState {
  isAuthenticated: boolean
  user: User | null
  setUser: (user: User | null) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  logout: () => set({ user: null, isAuthenticated: false }),
}))
```

**使用原则：**
- 仅用于真正的**客户端**状态（UI 状态、临时交互状态）
- 服务端数据用 TanStack Query 管理，不放进 Zustand
- 每个 feature 可以有自己的 store，避免单一巨大 store

---

## next-intl

### 配置

```typescript
// apps/web/src/i18n/request.ts
import { getRequestConfig } from "next-intl/server"

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = await requestLocale
  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  }
})
```

```
apps/web/
├── messages/
│   ├── en.json
│   └── zh.json
├── src/
│   ├── i18n/
│   │   └── request.ts
│   └── app/
│       └── [locale]/
│           ├── layout.tsx
│           └── page.tsx
```

### 使用

```tsx
import { useTranslations } from "next-intl"

export function Header() {
  const t = useTranslations("Header")
  return <h1>{t("title")}</h1>
}
```

---

## 动画使用边界

### tw-animate-css — 最轻量方案

纯 CSS 动画，零 JS 开销。用于极简单的、不需要编排控制的动画：

- shadcn/ui 组件内置动画（Dropdown 展开、Toast 弹出等）
- 简单的 fade-in / slide-in 入场
- 不需要退场动画、不需要 spring 物理、不需要交互响应的场景

```tsx
// 直接用 Tailwind class，无需额外导入
<div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
  Content
</div>
```

**边界**：一旦需要 `exit` 动画、`spring` 物理、`whileHover`/`whileTap`、`layout` 动画或任何交互驱动的动态效果，立即升级到 Motion。

### Motion (framer-motion) — 默认方案

所有 UI 过渡和微交互的首选：

- 页面切换动画（`AnimatePresence`）
- 组件入场/退场
- hover / tap 反馈
- 布局动画（`layout` prop）
- 弹簧物理（spring）

```tsx
import { motion, AnimatePresence } from "motion/react"

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -20 }}
  transition={{ type: "spring", stiffness: 300, damping: 30 }}
/>
```

### GSAP — 复杂时间线和滚动

**何时用 GSAP：**
- 复杂多元素编排时间线
- ScrollTrigger 驱动的滚动动画
- 需要像素级精确控制的动画
- SVG 路径动画

```tsx
"use client"

import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useRef } from "react"

gsap.registerPlugin(ScrollTrigger)

export function ParallaxSection() {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    gsap.to(".parallax-element", {
      y: -100,
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    })
  }, { scope: containerRef })

  return <div ref={containerRef}>...</div>
}
```

### Three.js — 3D 场景

**React Three Fiber** 用于 React 集成度高的场景，**原生 Three.js** 用于需要极致性能控制的场景。

```tsx
// React Three Fiber 示例
"use client"

import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment } from "@react-three/drei"

export function Scene() {
  return (
    <Canvas>
      <OrbitControls />
      <Environment preset="studio" />
      <mesh>
        <boxGeometry />
        <meshStandardMaterial color="orange" />
      </mesh>
    </Canvas>
  )
}
```

### 选择矩阵

| 需求 | 方案 |
|------|------|
| shadcn/ui 组件内置动画 | tw-animate-css |
| 简单 fade/slide 入场（无退场需求） | tw-animate-css |
| UI 过渡、入场 + 退场 | Motion |
| hover/tap 交互反馈 | Motion |
| 布局动画 | Motion (`layout` prop) |
| spring 弹簧物理 | Motion |
| 复杂多元素时间线 | GSAP |
| 滚动驱动动画 | GSAP ScrollTrigger |
| SVG 路径动画 | GSAP |
| 3D 渲染 | Three.js (R3F 或原生) |
| 简单 3D（产品展示等） | R3F + Drei |
| 高性能 3D（游戏级） | 原生 Three.js |
