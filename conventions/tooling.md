# Tooling

## 选型

| 能力 | 选择 |
| --- | --- |
| 语言 | TypeScript 7（原生 `tsc`） |
| 运行时 | Node.js 24 |
| 校验 | Zod v4，前后端共用 |
| 包管理 | pnpm 12，`packageManager` 锁定版本 |
| 构建编排 | Turborepo |
| 平台 CLI | Cloudflare 用 void，Vercel 用 vercel CLI |
| Lint | oxlint，界面规则经 `@shadcn/lint` 插件 |
| 格式化 | oxfmt，含 Markdown |
| 统一入口 | Vite+（`vp fmt`、`vp lint`、`vp test`），配置集中在 `vite.config.ts` |
| Markdown 结构 | markdownlint-cli2，只补 oxfmt 管不到的规则 |
| 死代码 | knip |
| 测试 | Vitest，端到端 Playwright |
| Git hooks | lefthook |
| 共享配置 | `typescript-config` 包 |

## Zod v4

只写 v4 API：

- 字符串格式用 `z.email()`、`z.url()`、`z.uuid()`、`z.iso.datetime()`，不用 `z.string().email()`。
- 错误消息用 `error`，不用 `message`。
- `z.record()` 必须给 key 与 value 两个 schema，key 不穷尽时用 `z.partialRecord()`。
- 用 `z.deepPartial(schema)`，不用 `.deepPartial()`。
- `.default()` 的值匹配 output 类型，需经过 transform 时用 `.prefault()`。
- 环境变量解析用 `z.stringbool()` 与 `z.coerce.*`。

## 门禁

`pnpm verify` 是唯一的全量验证入口，依次跑格式、lint、规则检查、Markdown、typecheck、test、build、knip。

- 规则检查只放零判断余地的机械门禁，其余交给验收与评审，不写启发式正则。
- 同一文件只由一个工具写入：oxfmt 先排版，markdownlint 只检查。

## Git hooks

hook 是 `pnpm verify` 的前置子集，不替代 CI。

| 阶段 | 内容 |
| --- | --- |
| pre-commit | staged 文件跑 oxfmt 并重新入 stage，再跑 markdownlint 与规则检查 |
| commit-msg | 英文 Conventional Commits |
| pre-push | typecheck 与 test |

## CI

- push 与 PR 到 main 时运行，同一 ref 新运行取消旧运行。
- `pnpm install --frozen-lockfile`，启用 pnpm 缓存。
- `pnpm verify` 与端到端并行。
