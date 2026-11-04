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
| 整站爬取检查 | SiteOne Crawler，无浏览器查死链、响应头、TLS、HTML 结构 |
| 整站运行时审计 | Unlighthouse，按路由跑 Lighthouse |
| Git hooks | lefthook |
| 共享配置 | `typescript-config` 包 |

## Zod v4

只写 v4 API。[scripts/check-zod.mjs](scripts/check-zod.mjs) 拦截能从源码文本判定的 v3 写法：`z.string().email()` 这类格式链、`.deepPartial()`、单参数 `z.record()`。以下需要类型信息，靠评审：

- 错误消息用 `error`，不用 `message`。
- `.default()` 的值匹配 output 类型，需经过 transform 时用 `.prefault()`。
- 环境变量解析用 `z.stringbool()` 与 `z.coerce.*`。

## 门禁

`pnpm verify` 是唯一的全量验证入口，依次跑格式、lint、规则检查、Markdown、typecheck、test、build、knip。

- 规则检查只放零判断余地的机械门禁，其余交给验收与评审，不写启发式正则。
- 检查脚本放 `scripts/`，pre-commit 传 `--staged` 检查暂存内容，`pnpm verify` 检查全部已跟踪文件；`--no-verify` 跳过 hook 时由 CI 兜底。示范见 [scripts/](scripts/)，共用的文件读取在 `git-files.mjs`。
- 同一文件只由一个工具写入：oxfmt 先排版，markdownlint 只检查。

## 文件体积

Agent 按文件整体读入与改写，单文件越大越占上下文、越容易改出遗漏。[scripts/check-file-size.mjs](scripts/check-file-size.mjs) 是示范实现，阈值与排除清单集中在脚本顶部。脚本里的 5000 token、500 行只是前端 TS 项目的起点，按语言与工程实测调整。

- token 是硬上限，超出阻断提交；行数是软上限，超出只警告。
- token 用离线 tokenizer（`gpt-tokenizer` 的 `o200k_base`）计数，不调用模型 API。
- 超限时按职责拆分文件，不靠压缩格式、删注释或改成长行绕过。

## Git hooks

hook 是 `pnpm verify` 的前置子集，不替代 CI。

| 阶段 | 内容 |
| --- | --- |
| pre-commit | staged 文件跑 oxfmt 并重新入 stage，再跑 markdownlint、规则检查与文件体积检查 |
| commit-msg | 英文 Conventional Commits |
| pre-push | typecheck 与 test |

## CI

- push 与 PR 到 main 时运行，同一 ref 新运行取消旧运行。
- `pnpm install --frozen-lockfile`，启用 pnpm 缓存。
- `pnpm verify` 与端到端并行。
- 有界面的项目在预览部署就绪后跑整站检查。两者依赖部署地址，不进 `pnpm verify`。
  - `siteone-crawler --ci` 阻断合并，404、5xx、critical 用默认阈值 0；存量项目先用 `--ci-baseline` 只拦退化。
  - `unlighthouse-ci` 只出报告，存为 CI artifact，不阻断合并。
