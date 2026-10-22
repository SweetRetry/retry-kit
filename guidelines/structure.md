# Structure

Turborepo + pnpm workspace。

```text
apps/
  web/             前端；Cloudflare 栈里也包含服务端
  server/          Hono 后端（Vercel 栈）
packages/
  ui/              shadcn/ui on Base UI 与设计 token
  typescript-config/
docs/
  adr/             长期架构取舍
  future/          未定型的计划
rules/             强制工程约束
scripts/           构建、检查与 Agent 自定义工具
AGENTS.md          Agent 入口
CONTEXT.md         项目术语
DESIGN.md          设计规范
```

## 归属规则

- `apps/*` 拥有进程入口、部署适配和应用专属业务模块。鉴权、数据库 schema 与 migration 属于服务端所在的应用。
- `packages/*` 只在已经有多个消费者时才建立，不以潜在复用性拆包。出现真实的跨边界消费者之前，代码留在所属应用。
- 只经 package 的公开 `exports` 使用能力，不导入内部文件。
- package 不启动进程级资源，不聚合跨 runtime 的配置。环境变量由所属应用校验。
- 每个应用的入口是 composition root：读取并校验环境变量，装配资源，注册关停流程。跨切面行为在这里显式组装。
- 新增应用需要同类装配时复制代码，不提取成公共启动函数。几十行重复换来的是服务名、环境变量来源和关停时机在应用内可读。

## 应用内部

Cloudflare 栈的 `apps/web`：

```text
src/routes/        文件路由：页面、布局与 /api/* 路由
src/server/        *.server.ts 与 *.functions.ts
src/components/    应用组件
src/lib/           浏览器与服务端共用的代码
db/schema.ts       Drizzle schema
db/migrations/     由 db:generate 生成
```

- `*.server.ts` 只在服务端。组件与 `src/lib` 不导入它们。
- server function（`createServerFn`）放在 `*.functions.ts`，可以导入 `*.server.ts`。

Vercel 栈：`apps/web` 用 Next.js 的 `app/`，`apps/server` 的 schema 与 client 在 `src/database/`，入口 `src/index.ts` 读取 `src/env.ts` 校验过的环境变量。

## 命名

目录名承担分组与语义前缀。目录已表达领域时，文件名只写目录内的具体职责：`canvas-commands/generation-handlers.ts`，而不是 `canvas-commands/canvas-command-generation-handlers.ts`。

## 资料落点

| 内容 | 位置 |
| --- | --- |
| 长期架构取舍与备选方案 | `docs/adr/`，命名 `NNNN-slug.md`，推翻时新增取代关系而不改历史 |
| 未定型或时机未到的计划 | `docs/future/`，写明问题、候选方案与触发推进的条件 |
| 系统说明与使用知识 | `docs/` |
| 强制工程约束 | `rules/` |
| 项目术语 | `CONTEXT.md`，只存当前有效的定义，易混用词用 `_Avoid_` 列出 |

ADR 只记录会长期约束架构、存在重要取舍且无法从代码还原的决策。工具用法、依赖清单和可局部调整的约定写在 README、`AGENTS.md` 或代码里。

## 规则的写法

- 每条规则都应能据此做出一个决定，写清适用边界和必要例外。
- 取值离散的领域列出全部可选值，并配越界禁令。只有表没有禁令的规则会退化成参考手册。
- 同一约束只说一次。依赖 API 查文档与类型，不复制能力清单。
- 能写成测试或类型的不变量优先写成测试或类型。
