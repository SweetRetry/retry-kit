# 设计规则入口

编写、修改或评审 UI 时，按本次改动**实际触及的内容**查规则，不按需求名称判断。同一个需求常同时命中多行，命中即读。

规则适用于应用与新增业务组件；组件外观归属与调用点契约遵循 [AGENTS.md](AGENTS.md)。`globals.css` 的主题与 Token 改动必须 **HITL（人工在环确认）**，避免静默污染全局样式。
静态门禁与规则维护原则见 [rules/README.md](rules/README.md)；UI 检查配置在 `.oxlintrc.json`。
