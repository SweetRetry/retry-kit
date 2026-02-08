# sweetretry-skills

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
| **design-director** | 设计总监 — 多风格编排与融合，诊断项目类型、分配风格比例、解决冲突 |
| **expressive-style-guide** | 影院级质感 (Cinematic UI) 设计规范 |
| **minimal-style-guide** | 极简主义 UI 设计规范，内容优先、高信噪比 |
| **swiss-style-guide** | 新瑞士风格 (Neo-Swiss) 设计规范，面向高密度数据 SaaS |

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
