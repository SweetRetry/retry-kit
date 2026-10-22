# Frontend

## 选型

| 能力 | 选择 | 备注 |
| --- | --- | --- |
| 框架 | Next.js App Router、React 19 | |
| 样式 | Tailwind CSS v4 | 颜色、圆角、字号走语义 Token，业务代码只消费语义名 |
| 组件 | shadcn/ui on Base UI | 初始化用 `shadcn init --base base`，不引入 Radix 包 |
| 服务端状态 | TanStack Query | |
| 客户端状态 | zustand | 只放真正的客户端状态，服务端数据交给 Query |
| 请求 | ky，封装在共享 request 包 | 错误契约由该包解析，见 [api.md](api.md) |
| 表单 | react-hook-form + zod + @hookform/resolvers | 配 shadcn/ui 的 Form 组件 |
| 通知 | sonner | |
| 动效 | motion（`motion/react`）或 Tailwind 过渡 | 规则见 [design/DESIGN.md](../design/DESIGN.md) |
| 图标 | [Phosphor](https://phosphoricons.com/)（`@phosphor-icons/react`） | 优先选用。lucide-react 仅作为 shadcn/ui 的默认依赖保留 |
| 日期 | dayjs | |
| 鉴权客户端 | better-auth 的 client | 与 [backend.md](backend.md) 的服务端配对 |
| 测试 | Vitest | |

## 边界

- 组件基座的版本以 Retry 设计语言为准。早先的 sweet-kit 基于 Radix，新项目不沿用。
- 原子控件自身的外观，包括高度、padding、圆角、颜色和字体，由变体（`variant` / `size`）决定。调用方只传布局类与 props。
- 容器与排版插槽（`Card*`、`Dialog*`、`Table*` 等）只开放职责内的 `spacing`、同心 `rounded` 或 `typography`。
- 新形态按复用面落点。跨处复用的通用形态扩展 `cva` 变体，单一业务场景的组合留在应用组件内。
- 主题与色板 Token 涉及全站语义，Agent 不静默修改。先提出方案，经人工确认后再改样式入口文件。
- 图标优先用 Phosphor。shadcn/ui 组件源码里自带的 lucide-react 图标保持不动，以便与上游同步，应用代码不新增 lucide 引用。同一个界面元素内不混用两套，图标只用在操作上，不做标题装饰。
- 公共环境变量用 `NEXT_PUBLIC_*`，并在构建任务里声明，否则缓存会跨环境串用。
- 不写 `transition-all`，不写任意 `z-index` 值。这两条值得用脚本机械拦截。

## 不选什么

- 不并存第二个状态库、通知库或日期库。
- 浏览器端 tracing 不随服务端 instrumentation 自动启用，需要单独评估数据治理、CORS 与采样，见 [observability.md](observability.md)。
