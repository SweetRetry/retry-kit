# Skills

Claude Code 技能集合。为 AI 编码助手提供领域专业知识、工程规范和设计系统。

## Skills

### 工程规范

| 技能 | 说明 |
| --- | --- |
| **fullstack-playbook** | 全栈工程规范手册 — 技术栈选型、monorepo 结构、代码约定、反模式禁令 |
| **commit-pr** | Git 提交与 PR 工作流自动化 |
| **pragmatic-architecture** | 代码架构审计，检测过度工程和不必要的抽象 |
| **product-guide** | 产品逻辑与功能流审计，评估用户价值与实现成本 |

### 设计系统

| 技能 | 说明 |
| --- | --- |
| **web-style-guideline** | Web 设计风格治理 — 风格诊断、原型选择（Swiss/Minimal/Organic）、多风格混合编排、Token 与组件规范生成 |

### 领域技能

| 技能 | 说明 |
| --- | --- |
| **chinese-manga** | 国漫美图 prompt 工坊 — 为中国漫剧市场生成图像 prompt |
| **fal-ai-model-search** | 搜索和集成 Fal AI 平台模型 |

## 结构

每个技能是一个独立目录：

```
<skill-name>/
├── SKILL.md              # 必须 — YAML frontmatter + 指令
└── references/           # 可选 — 按需加载的深度参考文档
```

- `SKILL.md` 的 YAML frontmatter（`name` + `description`）用于技能发现和触发
- `references/` 中的文档仅在需要时加载，节省 context window
