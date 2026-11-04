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

## 文件体积

Agent 按文件整体读入与改写，单文件越大越占上下文、越容易改出遗漏。用 tokenizer 与行数双阈值限制单文件体积，阈值按项目定，集中写在一处配置。

- token 是硬上限，超出阻断提交；行数是软上限，超出只警告。例如单文件 5000 token 硬、500 行软。
- token 用离线 tokenizer 计数（如 tiktoken `o200k_base`），不调用模型 API，保证结果确定且无网络依赖。
- 检查 staged 内容，不读工作区。
- 生成物、lockfile、快照与数据文件不计入，排除清单写进同一配置。
- 超限时按职责拆分文件，不靠压缩格式、删注释或改成长行绕过。
- 检查是 `scripts/` 里的一个脚本，pre-commit 与 `pnpm verify` 共用；`--no-verify` 跳过 hook 时由 CI 兜底。
- 报错信息写明文件、实测值、阈值与「按职责拆分」，让 Agent 直接据此修正。

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
