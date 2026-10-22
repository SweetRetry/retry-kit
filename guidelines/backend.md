# Backend

Node 服务形态：独立的 HTTP 后端进程加 PostgreSQL。Edge 与桌面形态见 [edge.md](edge.md)、[desktop.md](desktop.md)。

## 选型

| 能力 | 选择 | 备注 |
| --- | --- | --- |
| 运行时 | Node.js 24 及以上 | 开发期用 tsx |
| HTTP 框架 | Hono，`@hono/node-server` | |
| API 描述 | `@hono/zod-openapi`，OpenAPI 3.1 | 由 Zod schema 派生，见 [api.md](api.md) |
| API 文档页 | Scalar | |
| 鉴权 | Better Auth，Bearer session | `/api/auth/*` 由 Better Auth 按其协议接管 |
| 数据库 | PostgreSQL | 本地用 compose 提供，镜像 `postgres:17-alpine` |
| ORM | Drizzle ORM，`drizzle-kit`，node-postgres | |
| 校验 | Zod v4 | |
| 日志 | Pino，`hono-pino` | 见 [observability.md](observability.md) |
| 限流 | `hono-rate-limiter` | |
| AI | Vercel AI SDK | provider 与模型名由部署环境提供 |
| 测试 | Vitest | |

## 数据库

- PostgreSQL 是应用数据的持久化基线。
- Drizzle 管理全部 schema，业务表与 Better Auth 表同在 server 应用的 `database/` 下。
- schema 变更走 migration，不手工改库。生成与应用分两步：先 generate，再 migrate。
- 依赖外部资源的集成测试，缺少 `DATABASE_URL` 时跳过。测试不自行启动容器运行时，由显式的 integration environment 提供数据库。

## 环境变量

- 每个应用在 `src/env.ts` 用 Zod 读取并校验自己的环境变量，在 composition root 显式传给下游。公共 package 不维护跨 runtime 的配置聚合。
- 本地配置放对应目录的 `.env.local`，生产变量参考相邻的 `.env.example`。
- 生产环境必须提供高熵的鉴权密钥。
- AI provider 的 key 未配置时，相关 endpoint 返回 `503 SERVICE_UNAVAILABLE`。

## Zod v4

生成代码时使用 v4 API，不写 v3 模式。

- 字符串格式用 standalone 构造器：`z.email()`、`z.url()`、`z.uuid()`、`z.ipv4()` / `z.ipv6()`、`z.iso.datetime()` / `z.iso.date()` / `z.iso.time()`，替代 `z.string().email()` 这类链式写法。
- 错误消息用 `error` 字段，替代 `message`。
- `z.record()` 必须给出 key 与 value 两个 schema。key 不需穷尽时用 `z.partialRecord()`。
- `.deepPartial()` 已移除，改用顶层 `z.deepPartial(schema)`。
- `.default()` 的值要匹配 output 类型。值匹配 input 并需经过 transform 时用 `.prefault()`。
- 环境变量解析用 `z.stringbool()` 与 `z.coerce.*`。

废弃 API 值得用一个小脚本在门禁里扫描，因为命中即错、几乎没有误报。

## 边界

- 业务代码只依赖 OpenTelemetry API，SDK 在应用入口装配。
- 错误响应只经统一的 problem 构造函数产出，不手写错误 JSON。
- 面向 HTTP 的特性错误类携带 `{ code, status, title, type? }`，由 `app.onError` 统一适配成响应。
