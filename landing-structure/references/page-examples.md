# 落地页完整示例 (Page Examples)

> 本文件展示构图决策与文案策略，供页面结构与叙事设计参考。

---

## 与输出合同对应

使用本文件时，请按主规范的 5 段输出合同映射：

1. `Context Snapshot` -> 读取每个示例的 `Context Snapshot`
2. `Page Flow` -> 读取每个示例的 `Page Flow` 表格
3. `Hero + CTA Draft` -> 读取每个示例的 `Hero + CTA Draft`
4. `Assumptions & Gaps` -> 若示例未提供真实素材，必须显式补 `[Assumption]`
5. `Optimization Backlog` -> 从示例节奏中提炼 3 条高影响优化项（每条包含 `Action / Expected Impact / Metric`）

> 示例中的数字和素材仅用于结构说明。实际交付时必须替换为真实可验证信息，禁止伪造社会证明。

> 以下示例已按主规范字段命名，便于直接映射到最终输出结构。

---

## 示例一：SaaS 项目管理工具（成长期）

### Context Snapshot

- **产品：** 面向中小团队的项目管理工具，核心差异化在于 AI 自动分配任务
- **阶段：** 成长期，5000+ 付费团队，有量化成效数据
- **转化目标：** 免费试用注册
- **信任素材：** 3 个知名客户 Logo、用户增长数据、2 条客户证言

### 构图决策（视觉节奏）

策略：密→疏→密→疏→中→疏→中，以信任信号做呼吸区。

### Hero + CTA Draft

- **构图：** Split（左文右图）— UI 型产品，截图即卖点
- **标题：** "让 AI 分配任务，你专注真正重要的工作"
- **副标题：** "5000+ 团队用 [产品名] 将项目交付速度提升 40%。AI 分析工作负载，自动匹配最合适的人选。"
- **CTA：** "免费开始 — 无需信用卡"
- **视觉主体：** 产品 Dashboard 截图，高亮 AI 任务分配面板

### Page Flow

| 序号 | 模块 | 构图 | 密度 | 叙事作用 |
|------|------|------|------|----------|
| 1 | Hero | Split | 高 | 价值传递：AI 帮你分配任务 |
| 2 | Social Proof Bar | Logo 墙 + 数字 | 低 | 即时信誉："5000+ 团队信赖" |
| 3 | Features | Bento Grid（4 格） | 高 | 核心功能展开：AI 分配 / 看板 / 时间线 / 报表 |
| 4 | 成效数据 | Stats Section | 低 | 量化证明："40% 更快 · 60% 减少会议 · 3 分钟上手" |
| 5 | How It Works | 时间线（3 步） | 中 | 降低门槛："导入项目 → AI 分析 → 自动分配" |
| 6 | Testimonials | Statement Section（引用） | 低 | 用他人成功消除犹豫 |
| 7 | CTA | 居中 CTA 区 | 中 | 终场转化："免费开始" + 风险消除微文案 |
| 8 | FAQ + Footer | 折叠列表 | 中 | 异议消除 + 法律兜底 |

### Assumptions & Gaps

- `[Assumption]` 已有可公开客户 Logo，可用于 Social Proof。
- 缺失：是否有行业垂直案例（如电商、SaaS、教育）可用于 FAQ 异议处理。
- 缺失：主注册路径是否支持 SSO，影响 CTA 微文案表达。

### Optimization Backlog

| Action | Expected Impact | Metric |
|---|---|---|
| 将 Features 中最强卖点前置为首卡 | 缩短用户到价值认知的路径 | `CTA Reach Rate` |
| 在 How It Works 后补一次 CTA | 降低中段滚动流失 | `Primary CTA CTR` |
| FAQ 优先覆盖“迁移成本”和“数据安全” | 缩短犹豫路径，提高提交意愿 | `Conversion Rate` |

---

## 示例二：开发者 API 平台（早期 MVP）

### Context Snapshot

- **产品：** 文档解析 API，上传 PDF/图片返回结构化 JSON
- **阶段：** 早期 MVP，100 个 Beta 用户，无知名客户
- **转化目标：** 获取 API Key（注册）
- **信任素材：** 开源 SDK、API 响应速度数据、GitHub Star 数

### 构图决策（视觉节奏）

策略：先让用户"试一下"（交互先行），然后用技术细节建立信任，节奏偏轻快。

### Hero + CTA Draft

- **构图：** 交互先行 — 开发者产品，"先试后买"最有效
- **标题：** "上传任意文档，30 秒拿到结构化数据"
- **副标题：** "一个 API 调用，PDF / 图片 / 扫描件 → 干净的 JSON。支持 50+ 语言。"
- **CTA：** "免费获取 API Key"
- **视觉主体：** 可操作的文件上传区 + 右侧实时 JSON 输出预览

### Page Flow

| 序号 | 模块 | 构图 | 密度 | 叙事作用 |
|------|------|------|------|----------|
| 1 | Hero | 交互先行 | 高 | "上传一个文件试试看" — 零摩擦体验 |
| 2 | 支持格式 | Icon Grid（2×4） | 中 | 快速传递能力范围：PDF / Word / 图片 / 扫描件… |
| 3 | How It Works | 时间线（3 步） | 中 | 技术流程："上传 → 解析 → 返回 JSON" + 代码示例 |
| 4 | 性能数据 | Stats Section | 低 | "< 2s 响应 · 99.9% 可用性 · 50+ 语言" |
| 5 | CTA + 代码示例 | 居中 CTA | 中 | curl 命令 + "免费获取 API Key" |

**构图选择说明：** 早期产品模块少（5 个），不需要 Social Proof 或 Testimonials——没有就不放。交互先行让用户 10 秒内看到产品能力，比任何文案都有说服力。

### Assumptions & Gaps

- `[Assumption]` 用户具备基础 API 使用能力，可理解 curl 示例。
- 缺失：免费层限额、速率限制和商用条款，影响 CTA 后预期管理。
- 缺失：支持文件大小和格式上限，影响 How It Works 可信度。

### Optimization Backlog

| Action | Expected Impact | Metric |
|---|---|---|
| 将“首次成功调用时间”作为首屏辅助信息 | 强化“可立即上手”预期 | `Primary CTA CTR` |
| 在 CTA 附近增加 SDK 入口（Node/Python） | 降低试用门槛，提升继续操作率 | `CTA Reach Rate` |
| 将错误码与重试建议放入 FAQ | 降低试用期放弃率 | `Conversion Rate` |

---

## 示例三：DTC 护肤品牌

### Context Snapshot

- **产品：** 主打天然成分的护肤系列，核心单品是精华液
- **阶段：** 成熟品牌，品牌知名度中等，有用户 Before/After 数据
- **转化目标：** 购买核心单品
- **信任素材：** 皮肤科医生背书、用户 Before/After 对比照、成分检测报告

### 构图决策（视觉节奏）

策略：视觉冲击开场，用对比制造转化欲望，情感叙事收尾。

### Hero + CTA Draft

- **构图：** Product Showcase — 实体商品，产品形态本身即品牌表达
- **标题：** "28 天，让你的皮肤说出改变"
- **副标题：** "87% 的用户在 4 周内看到明显改善。纯天然植萃配方，零刺激承诺。"
- **CTA：** "立即购买 — 28 天无效全额退款"
- **视觉主体：** 产品精华液瓶身居中放大

### Page Flow

| 序号 | 模块 | 构图 | 密度 | 叙事作用 |
|------|------|------|------|----------|
| 1 | Hero | Product Showcase | 高 | 视觉锚定：产品即主角 |
| 2 | 成效数据 | Stats Section | 低 | "87% 改善率 · 100% 天然 · 28 天见效" |
| 3 | 成分介绍 | Bento Grid（4 格） | 高 | 核心成分拆解：每格一个明星成分 + 功效 |
| 4 | Before/After | 对比分割 | 中 | 真实用户对比照 + 使用周期标注 |
| 5 | 专家背书 | Statement Section | 低 | 皮肤科医生引用 + 检测报告标识 |
| 6 | CTA | 居中 CTA | 中 | "立即购买" + 退款保证 + 免邮标注 |

**构图选择说明：** 消费品落地页的核心是"看到 → 想要 → 信任 → 购买"。Product Showcase 让用户先建立视觉印象，Stats Section 快速建立可信度，对比分割制造"我也想要这个效果"的转化欲望，专家背书消除最后的安全顾虑。

### Assumptions & Gaps

- `[Assumption]` 平台允许展示 Before/After 对比，且合规可用。
- 缺失：退款条款的适用范围（地区/渠道/时间），影响 CTA 可信承诺。
- 缺失：成分敏感人群警示与使用说明，影响 FAQ 与法务段落。

### Optimization Backlog

| Action | Expected Impact | Metric |
|---|---|---|
| 在 Before/After 下增加样本说明（样本量/周期） | 提升结果可信度 | `CTA Reach Rate` |
| 在 CTA 前增加“适用肤质”分流 | 降低错误购买 | `Conversion Rate` |
| 将专家背书与检测报告建立一一映射 | 减少信息断层导致的犹豫 | `Primary CTA CTR` |
