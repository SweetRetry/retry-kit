# Tooling

## 选型

| 能力 | 选择 | 备注 |
| --- | --- | --- |
| 语言 | TypeScript 7 | 原生 `tsc`，包名仍是 `typescript` |
| 运行时 | Node.js 24 | |
| 包管理 | pnpm 12 | `packageManager` 字段锁定版本 |
| 构建编排 | Turborepo | |
| Lint | oxlint | 通过 `@shadcn/lint` 插件承载界面规则：调用点契约、硬编码色值、任意值 |
| 格式化 | oxfmt | oxlint 不做格式化。Markdown 也由 oxfmt 排版 |
| 统一入口 | Vite+（`vp fmt`、`vp lint`、`vp test`） | 一套命令驱动 oxfmt、oxlint 与 Vitest，配置集中在 `vite.config.ts`。不用 Vite+ 时直接调用 oxlint 与 oxfmt |
| Markdown 结构 | markdownlint-cli2 | 只补 oxfmt 管不到的规则：围栏语言、标题层级、链接、表格对齐 |
| 死代码 | knip | |
| 测试 | Vitest | |
| 端到端 | Playwright | |
| Git hooks | lefthook | 只负责在 Git 事件上运行命令，也可用 `lefthook run <hook>` 手动触发 |
| 共享配置 | `typescript-config` 包 | 提供 base 与框架预设 |

## 门禁

`pnpm verify` 是唯一的全量验证入口，依次是格式检查、lint、规则检查、Markdown 检查、typecheck、test、build、knip。完成代码修改后以它为准。

- 规则检查只放零判断余地的机械门禁：Zod 废弃 API、`transition-all`、任意 `z-index`、硬编码色值。
- 其余规则由验收清单与人工评审判定，不写启发式正则扫描，避免为了过检查而写代码。
- 能写成测试或类型的不变量优先写成测试或类型。
- Markdown 由一个任务独占：oxfmt 先排版，markdownlint 再补结构规则，不让两个工具写同一个文件。

## Git hooks

hook 是 `pnpm verify` 的前置子集，不替代 CI。

| 阶段 | 内容 |
| --- | --- |
| pre-commit | 对 staged 文件跑 oxfmt 并重新入 stage，Markdown 再跑 markdownlint，最后跑规则检查 |
| commit-msg | 要求英文 Conventional Commits |
| pre-push | typecheck 与 test |

lint、build 与 knip 留给 `pnpm verify` 和 CI。绕开 hook 用 `--no-verify` 或 `LEFTHOOK=0`。

## CI

- 在 push 到 main 和 PR 到 main 时运行，同一 ref 上新运行取消旧运行。
- 安装用 `pnpm install --frozen-lockfile`，Node 24，启用 pnpm 缓存。
- 并行跑两个任务：`pnpm verify`，以及端到端。
- Vercel 栈的任务另起 PostgreSQL 服务容器，先应用 migration 再跑 `pnpm verify`，测试需要的环境变量在 CI 里显式给出。
