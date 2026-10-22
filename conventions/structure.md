# Structure

Turborepo + pnpm workspace。

```text
apps/              可部署的应用
packages/          有多个消费者的共享代码
docs/
  architecture.md  系统结构与全局取舍
  future/          未定型的计划
  rules/           需要判断的工程规则
scripts/           机械检查、构建与 Agent 自定义工具
AGENTS.md          Agent 入口
CONTEXT.md         项目术语
DESIGN.md          设计规范
```

## 归属规则

- `apps/*` 拥有进程入口与业务模块；鉴权、schema 与 migration 属于承载 API 的应用。
- 已有多个消费者才建 package，不为潜在复用拆包。
- 只经 package 的公开 `exports` 使用能力。
- package 不启动进程级资源，不校验环境变量。
- 自管入口的应用（Hono、Node）以入口为 composition root，读取环境变量、装配资源、注册关停。
- 同类装配在应用间复制，不提取公共启动函数。

## 命名

目录已表达领域时，文件名只写具体职责：`canvas-commands/generation-handlers.ts`，不写 `canvas-commands/canvas-command-generation-handlers.ts`。

## 资料落点

| 内容 | 位置 |
| --- | --- |
| 全局取舍与偏离默认栈的理由 | `docs/architecture.md` |
| 局部取舍 | 决策处的一行代码注释 |
| 未定型的计划 | `docs/future/`，写明问题、候选方案与推进条件 |
| 需要判断的工程规则 | `docs/rules/`，由评审把关 |
| 系统说明与使用知识 | `docs/` |
| 项目术语 | `CONTEXT.md`，只存当前定义，易混词用 `_Avoid_` 列出 |

## 规则的写法

- 每条规则都能据此做出一个决定，并写清边界与例外。
- 取值离散的领域列全可选值，并配越界禁令。
- 同一约束只说一次，API 能力查文档与类型，不复制。
- 强制约束不写成文字：能写成类型或测试的写成类型或测试，其余写成 `scripts/` 里的检查并接入 `pnpm verify`。
