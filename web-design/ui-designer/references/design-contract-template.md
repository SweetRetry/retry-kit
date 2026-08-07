# design.md 标准模板

`ui-designer` 阶段 5 产出 design.md 时使用本模板。把占位说明替换为实际内容；删去本模板的灰色说明行，保留编号与结构。范例见 `examples/arknights-endfield-landing/design.md`。

> 术语：`authority` = 项目既有视觉权威（design token / theme / 品牌资产 / 相邻页面 / 官方 design system）；`fallback baseline` = `references/visual-grammar.md` 的默认值；`token` = 具名视觉值（角色名而非字面量）；`agent contract` = §8 给下游实现 agent 的消费指令。
>
> 模板规则：每个视觉值必须解析到命名 token 或 authority 引用，缺失时标注 fallback 来源，绝不以字面量硬编码；状态与 a11y 内联在对应节；零 "TBD" microcopy；不写 mood 词（"高级、现代、克制、科技感"）；不写代码。

---

# <产品 / 项目> · <surface> — 设计契约 (Design Contract)

> 依据：`<design plan 结论 / 参考文件>`；交付物：`<design.md 路径>`（本文件）。

## 0. 项目边界

- 性质：`<粉丝向 / 官方 / 内部工具 / …>`，范围 `<单页 / 组件 / 全站>`。
- 目标用户与核心任务：`<一句话，具体到角色 / 设备 / 环境>`。
- 技术栈与运行约束：`<framework / styling / 无构建 / 依赖限制>`。
- 视觉 authority 与保留项：`<design token / theme / 品牌资产 / 相邻页面 / 不变项>`。
- **不在范围内（out-of-scope / anti-goals）**：`<不包含用户认证 / 支付 / 后台管理 / 多语言 / …>`。只说做什么不说不做什么的 spec，没有任何基础生成反模式警告。

## 1. THESIS

**`<这个 surface 独有的一件事>`**：`<一句话方向>`

- 拒绝的类别默认：`<该类别的模板套路 / 上个系统的旧约束>`。
- 拒绝的 AI default：`<本方向明确排除的 slop 组合>`。
- 视觉世界分工（若有多个来源）：`<来源 A 提供形 / 来源 B 提供物 …>`。
- authority gap（若有）：`<哪些决策因缺品牌输入用了 fallback，建议人在哪些点投入判断>`。

## 2. STORY / TASK

`<mode>` 描述用户推进顺序：

1. 先理解：`<第一眼理解到什么>`。
2. 再浏览 / 再操作：`<主路径，描述 job + 决策 + 时间约束，不是页面列表>`。
3. 最终行动：`<primary action 或达成状态>`。

## 3. OWN WORLD

### 3.1 色彩（角色制，非装饰制）

| 角色 | 值 | 语义映射 | 用量规则 | fallback 来源 |
|---|---|---|---|---|
| `bg` | `#…` | 全局底 | … | authority / 推导自 … |
| `surface` | `#…` | 区块容器 | … | … |
| `foreground` / `ink` | `#…` | 主前景 | … | … |
| `muted` | `#…` | 辅助 | … | … |
| `accent` | `#…` | **主导 accent 语义** | … | … |
| `semantic…` | `#…` | success / error / … | … | … |

规则：`<多 accent 映射 / CTA 与主 focus 的用色契约 / gradient 是否保留及理由 / dark mode 策略>`。`fallback 来源` 列让实现 agent 知道哪些值在 authority 更新时可自动跟随、哪些必须手工指定。

### 3.2 字体

| 角色 | 字体 | 规格 | fallback 来源 |
|---|---|---|---|
| Display | … | size / weight / tracking | … |
| Body | … | size / line-height / measure ≤ 34em | … |
| Label / data | … | size / case / tracking | … |

加载控制：`<家族数与 weight 档>`。

### 3.3 图形语言

`<shape / surface / icon / imagery / motif 的角色规则；真实素材或线稿的清单与裁切规则>`。

### 3.4 Motion

- 唯一 authored moment：`<name + 触发 + 手法>`。
- 从属 motion：`<列表>`。
- `prefers-reduced-motion` 静态帧：`<动画停止后 layout 与内容完整性的具体形态>`。

## 4. FIRST VIEWPORT

- 第一焦点：`<内容>`。
- 主内容与 primary action：`<关系，不互相争夺>`。
- 空间关系：`<在哪个 viewport 尺寸下成立>`。

## 5. TOPOLOGY

- 主要区域与 navigation：`<列表>`。
- progressive disclosure：`<什么折叠 / 何时展开>`。
- 跨 viewport 重组：`<哪些 reflow / 哪些 collapse / 哪些 sticky / 哪些 hide 及 why；mobile order、safe area>`。

## 6. STATES

### 6.1 关键状态

`<真实内容范围>`；以下状态各给出规则或标记 `不适用`：default / loading / empty / error / disabled / success / focus / hover / active。特别检查 long text overflow、RTL、keyboard focus order、offline、permission denied。

### 6.2 可访问性契约

- 对比度对：`<关键 foreground/background 对 + 目标 ratio>`。
- touch / pointer target：`<≥ 24×24 CSS px 或 44×44 的高频关键 action>`。
- keyboard interaction：`<tab order、焦点可见、trapped focus 场景>`。
- screen reader 策略：`<label / aria 角色 / announcement>`。
- reduced-motion：`<静态帧见 §3.4；确保动画停止后界面完整可理解>`。

数据边界：`<动态数据 / 权限 / 离线>`。a11y 内联在这里，实现 agent 不需要跨节拼凑。

## 7. SIGNATURE

- 唯一 signature moment：`<最能体现机制的 interaction / visual moment>`。
- 性能与可访问性风险：`<transform/opacity 约束 / reduced-motion / 焦点管理 / 对比度>`。

## 8. 实现约束与交接

- 本契约终态：`<design.md 为终态，不写代码；实现是后续独立请求>`。
- 实现需要的 assets：`<用户资产 / 可追溯素材 / 生成素材需求清单>`。
- 待验证项：`<未核实的事实写 unverified / 未覆盖的 viewport 与状态>`。
- 对比度 / 响应式 / 可访问性边界：`<实现时必须满足的最低要求>`。
- **Agent contract**：给下游实现 agent 的消费指令——
  - 消费顺序：`<先读 §0 → §1 → §3 → §4 → §5 → §6，再写代码>`。
  - 验收点：`<所有颜色解析到 token / 所有状态已覆盖 / a11y contract 全部满足 / 无 mood 词残留>`。
  - 禁止行为：`<不将 accent 借给非语义映射内容 / 不追加本文未声明的 gradient 或 decoration>`。

---

> **完成后自查（5 项，全部通过才定稿）：**
> 1. 去品牌测试：去掉 logo/品牌名后，构图仍由机制/内容/受众解释。
> 2. 状态完整性：所有 9 状态有规则或标注"不适用"。
> 3. 零 mood 词：全文无"高级/现代/克制/科技感"等不可执行形容词。
> 4. token 可追溯：每个颜色/字体/spacing 参数可映射到 authority 或 fallback baseline。
> 5. Agent consumable：下游 agent 不依赖本文未记录的上下文推导即可实现。
