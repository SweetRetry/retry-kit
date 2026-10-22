# Frontend

## 框架

| 部署目标 | 框架 |
| --- | --- |
| Cloudflare | TanStack Start，经 [Void](https://void.cloud) 框架模式，起步用 [void-starter](https://github.com/SweetRetry/void-starter) |
| Vercel | Next.js App Router |
| 通用机器 | TanStack Start 或 Next.js，开工前询问 |

渲染模式（SSR、SSG、CSR）在选定框架内配置，部署按平台当前推荐的方式。用 Payload 时例外，见「按场景」。

## 选型

以下是默认倾向，框架原生能力够用时优先原生。

| 能力 | 选择 |
| --- | --- |
| 样式 | Tailwind CSS v4 |
| 组件 | shadcn/ui on Base UI（`shadcn init --base base`，不引入 Radix） |
| 服务端数据 | TanStack Query |
| 请求 | 同 Worker 的 TanStack Start 用 server function，Hono 后端用 `hc`，其他后端用 ky 封装（有 OpenAPI 时用 `openapi-typescript` 生成类型），解析点只在 `src/lib/api.ts` |
| 客户端状态 | zustand |
| 表单 | react-hook-form + zod，用 shadcn/ui 的 `Field` 配 `Controller` |
| 通知 | sonner |
| 动效 | motion（`motion/react`）或 Tailwind 过渡 |
| 图标 | 优先 [Phosphor](https://phosphoricons.com/)（`@phosphor-icons/react`），lucide-react 随 shadcn/ui 保留 |
| 日期 | date-fns，随 shadcn/ui 的 Calendar（react-day-picker）引入 |
| 鉴权客户端 | better-auth client |

## 按场景

| 场景 | 选择 | 限制 |
| --- | --- | --- |
| 拖拽 | `@dnd-kit/react` | 0.x，锁定版本；节点编辑器的拖拽归 React Flow |
| 非开发者编辑内容 | Payload | 锁定 Next.js，部署到 Vercel 或通用机器 |
| 开发者写的内容 | 仓库内 Markdown 或 MDX | 不引入 CMS |
| 国际化 | Next 用 next-intl，TanStack Start 用 use-intl | 两边共用同一套消息文件 |
| 文档站 | Fumadocs | 只用于文档站，博客用框架路由加 MDX |
