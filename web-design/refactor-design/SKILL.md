---
name: refactor-design
description: 界面重新设计与排版链路重构：消除卡片嵌套、排版层级塌陷、多余弹窗与窒息式密度等设计债务，在不破坏既有功能目标的前提下实现排版重塑、交互链路压缩与信息减负。
disable-model-invocation: true
---

# Refactor Design

## 1. 核心心智模型 (Mental Model)

界面的重新设计（Redesign）等同于代码领域的**重构（Refactoring）**。
- **不改变外在目标，优化认知与操作结构**：重构代码是在不改变外部功能的前提下优化内部结构；重构设计是在**不破坏用户既有目标与核心功能意图**的前提下，消除界面的**偶发设计债务（Accidental Design Debt）**。
- **最大化信噪比与操作流畅度**：降低用户的“视线搜寻成本（Scanning Effort）”与“操作物理阻力（Interaction Friction）”。
- **三大基本法 (Three Axioms)**：
  1. **负空间优于边框盒子 (Negative Space over Boxes)**：依靠留白、间距与基线对齐建立亲密性，拒绝把每个模块都套上边框与底色。
  2. **就地闭环优于折返跳转 (Inline over Modals)**：操作尽量在当前上下文就地完成，消灭非必要的跳转、跳板页面与多层模态弹窗。
  3. **节奏呼吸优于窒息堆砌 (Pacing over Cramming)**：通过主线聚焦、合理分块（Chunking）与弹性留白，消除视觉压迫感。

## 2. 六大设计坏味道与重构手法 (Design Smells & Refactoring Catalogue)

识别界面中纯粹因“历史堆砌”或“缺乏排版意识”产生的偶发设计债务：

| 设计坏味道 (Design Smell) | 典型症状 (High Value Signal) | 合理例外 (Exclusion) | 推荐最小重构动作 (Refactoring Move) |
| :--- | :--- | :--- | :--- |
| **1. 容器嵌套膨胀<br>(Container Sprawl / Box-in-Box)** | 满屏 Border、卡片套卡片、灰底套白底、到处是多余的水平分割线（Divider Soup）。 | 需明确物理拖拽容器、严格隔离的独立沙箱或三方组件。 | **【拍平解构 (Flatten & Unbox)】**<br>剥离无价值外框与底色，用 8pt 网格（gap-4/6/8）和纯间距实现自然分组。 |
| **2. 排版层级塌陷<br>(Typography Flattening)** | 字号全部挤在 12-14px，粗细无区分，整页呈现“均匀灰色”，用户无法在 1 秒内找到视觉扫视锚点。 | 纯文本连续阅读（如长篇博客正文、法律协议条款）。 | **【锚点重塑 (Scanning Anchors)】**<br>严格收敛字阶至 3-4 级；核心客体/指标放大并加重（Bold）；元数据统一降灰（muted-foreground）。 |
| **3. 交互跳板与折返<br>(Pogo-Sticking & Modal Chains)** | 简单修改配置需弹窗，弹窗内再弹选择器；或改动一个小字段需跳出新页面再手动点“返回”。 | 涉及不可逆破坏性变更、敏感财务认证或复杂长流程分步向导。 | **【就地展开与行内闭环 (Inline Action)】**<br>以行内编辑（Inline Edit）、就近 Popover 或原地抽屉（Drawer）取代模态弹窗，操作就地完成。 |
| **4. 防御性确认泛滥<br>(Confirmation Fatigue)** | 保存、切换、标记等普通低风险操作，频繁弹出“你确定要...吗？”弹窗打断心流。 | 清空数据库、删除不可恢复的主资产、跨租户注销等极高风险操作。 | **【即时生效与撤销机制 (Undo over Confirm)】**<br>移除弹窗，操作立即生效并通过轻量 Toast 提供“撤销（Undo）”按钮。 |
| **5. 窒息式高密度<br>(Suffocating High Density)** | 元素挤在一起，毫无留白呼吸感，长表单一口气展示 30 个输入框，带来极高的认知压迫。 | 专业监控大屏、高频金融 Trading 终端或密集代码 Diff 工具。 | **【节奏分块与弹性留白 (Chunking & Pacing)】**<br>按业务心理模型将字段折叠/拆解为清晰的 Chunk；加大组间距（24-32px）；高阶配置默认收起。 |
| **6. 自解释字段冗余<br>(Label Clutter & Fluff)** | 满屏“用户名：张三”、“手机：138...”、“状态：运行中”，堆砌无实质价值的修饰性图标和客套说明。 | 格式极易混淆的数据（如连续出现多个不同维度的日期、数值无量纲单位）。 | **【自明降噪 (Self-explanatory Fields)】**<br>删除显而易见的 Label（直接展示带有头像的名字/电话号码格式）；说明文字改写为内联占位或轻量 Tooltip。 |
| **7. 视觉权重倒置<br>(Inverted Visual Weight)** | “取消”、“重置”、“返回”比核心 Primary CTA 还抢眼；满屏五颜六色的彩色 Badge 互相抢戏。 | 存在多个互斥且权重完全对等的紧急分支操作。 | **【单焦点归拢 (Single Primary Focus)】**<br>一屏视线内仅保留 1 个强视觉主按钮，次级动作降为 Ghost/Text 按钮；彩色 Tag 严格收敛至真实异常态。 |

## 3. 四步重构执行工作流 (Four-Stage Refactoring Flow)

针对待重构的代码、页面或设计片段，按以下 4 步执行：

### 步骤 1：摩擦与链路审计 (Friction & Step Audit)
- 追踪用户完成目标的核心路径，统计**点击次数、视线跳跃距离、上下文切换（跳转/弹窗）频次**。
- 标记出打断操作心流的“多余跳板”、“冗余确认弹窗”与“孤立保存按钮”。

### 步骤 2：解构与剪枝 (Radical Pruning)
- 审查所有视觉容器：凡是不提供语义隔离的 `border`、`bg-card`、`shadow`、`hr` 全部移除。
- 审查界面文案：删除客套修饰语、自解释的静态 Label，收束多余的装饰性图标。

### 步骤 3：排版与节奏重排 (Typography & Rhythm)
- 建立清晰字阶阶梯（如：Title 20px Bold ➔ Body 14px Regular ➔ Meta 12px Medium Muted）。
- 运用间距比例（Spacing Scale）拉开层级：元素内间距（4-8px）、关联元素间（8-16px）、独立业务块间（24-32px+）。

### 步骤 4：交付前后对比与高信噪比实现 (Diff & Delivery)
- 指出重构前痛点根因与消除的设计债务。
- 给出清晰的前后对比，并交付精简、优雅且符合现代规范的前端代码实现。

## 4. 重构红线（Prohibitions）

- **禁止吞噬关键信息**：严禁打着“极简/留白”旗号隐藏关键限制、代价、计费或操作后果（遵循 `information-clarity` 规则）。
- **禁止破坏状态反馈**：拍平弹窗改为行内编辑后，依然必须保留完整的就地 Loading、报错提示与撤销机制（遵循 `find-interaction-gap` 规则）。
- **禁止无脑稀疏化**：严禁将本身需要高信息密度的专业工具（如监控看板、日志排查器）暴力拉大间距破坏扫描效率。
- **禁止破坏业务意图**：重构仅优化交互路径与视觉表达，严禁在未获授权情况下删减业务核心功能分支。

## 5. 输出交付规范

重构审查或执行时，输出结构如下：

```markdown
### 设计债务诊断 (Design Smells Identified)
- [Smell 类型] <组件或区域>: <具体问题表现与认知/操作代价>

### 核心重构动作 (Refactoring Actions)
1. **[拍平/解构/分块/行内化]**: <具体结构调整说明>
2. **[排版重塑/降噪]**: <具体的字阶、间距与视觉焦点调整>

### 重构后实现 (Refactored Implementation)
[交付重构后的组件代码，保持高信噪比与现代组件规范]
```
