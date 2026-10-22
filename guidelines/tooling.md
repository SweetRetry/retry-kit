# Tooling

## 选型

| 能力 | 选择 | 备注 |
| --- | --- | --- |
| 语言 | TypeScript 7 | 原生 `tsc`，包名仍是 `typescript` |
| 包管理 | pnpm workspace | `packageManager` 字段锁定版本 |
| 构建编排 | Turborepo | |
| Lint | oxlint | 通过 `@shadcn/lint` 插件承载界面规则：调用点契约、硬编码色值、任意值 |
| 格式化 | oxfmt | oxlint 不做格式化，由同一 Oxc 工具链的 oxfmt 负责 |
| 死代码 | knip | |
| 测试 | Vitest | |
| Git hooks 管理器 | lefthook | 只负责在 Git 事件上运行命令，也可用 `lefthook run <hook>` 手动触发同一组任务 |
| 共享配置 | `typescript-config` 包 | 提供 base、nextjs、react-library 预设 |

## 门禁

`pnpm verify` 是唯一的全量验证入口，依次是格式与 lint、规则检查、typecheck、test、build、knip 与 peer 依赖检查。完成代码修改后以它为准。

- 规则检查只放零判断余地的机械门禁：废弃 API、`transition-all`、任意 `z-index`、硬编码色值。
- 其余规则由验收清单与人工评审判定，不写启发式正则扫描，避免为了过检查而写代码。
- 能写成测试或类型的不变量优先写成测试或类型。

## Git hooks

hook 是 `pnpm verify` 的前置子集，不替代 CI。

| 阶段 | 内容 |
| --- | --- |
| pre-commit | 对 staged 文件跑 oxfmt 与 oxlint，格式化结果重新入 stage，再跑规则检查 |
| commit-msg | 要求英文 Conventional Commits |
| pre-push | typecheck 与 test |

构建与 knip 留给 `pnpm verify` 和 CI。绕开 hook 用 `--no-verify` 或 `LEFTHOOK=0`。

## CI

- 在 push 到 main 和 PR 到 main 时运行，同一 ref 上新运行取消旧运行。
- 服务容器起 PostgreSQL，先 `pnpm db:migrate`，再 `pnpm verify`。
- 安装用 `pnpm install --frozen-lockfile`，Node 24，启用 pnpm 缓存。
- 测试所需的环境变量在 CI 里显式给出，日志级别设为 silent。

## 升级 TypeScript 7

- 依赖 `import "typescript"` 的工具，如 typescript-eslint，在 7.0 没有可用的编程 API 时，用 npm 别名并存两个版本：`typescript` 指向 `@typescript/typescript6`，另用别名安装 7.x 提供 `tsc`。
- 编程 API 预计在 7.1 提供，届时去掉别名。
