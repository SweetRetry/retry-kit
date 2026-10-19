# 设计规则入口

编写、修改或评审 UI 时，按本次改动**实际触及的内容**查规则，不按需求名称判断。同一个需求常同时命中多行，命中即读。

规则适用于应用与新增业务组件；组件外观归属和上游冻结边界遵循 [AGENTS.md](AGENTS.md)。`packages/ui` 与 `globals.css` 的改动必须 **HITL（人工在环确认）**，避免不知不觉修改元组件或污染全局。
静态门禁与规则维护原则见 [rules/README.md](rules/README.md)；UI 检查配置在 `.oxlintrc.json`。
