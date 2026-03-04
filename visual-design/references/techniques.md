# 视觉技法库（执行版）

技法是增强质量的主手段。`Elevate` 默认至少启用 1 个结构技法 + 1 个交互技法；`Forge` 默认至少启用 2 个结构技法 + 1 个氛围技法。

---

## 使用前检查

1. 当前模式是否允许新增技法：`Preserve` 默认不新增重技法
2. 技法是否直接服务目标：可读性、聚焦、反馈、品牌识别之一
3. 是否提供了移动端降级与 `prefers-reduced-motion` 降级
4. 是否提供了失败回退（静态样式）

---

## 技法矩阵

| 技法 | 适用模式 | 场景 | 实施要点 | 风险级 | 回退方案 |
|------|---------|------|---------|-------|---------|
| **Bento Grid** | `Elevate` `Forge` | 信息块 >= 4，且主次明显 | `grid-cols-[2fr_1fr]` + 主卡 `row-span-2` | `[建议]` | 回退到等宽两列或单列 |
| **Split Hero** | `Elevate` `Forge` | 首屏有产品截图/演示 | `md:grid-cols-2`，移动端自动单列 | `[建议]` | 回退到单栏 Hero |
| **Dashboard Shell** | `Preserve` `Elevate` | 需要稳定导航框架 | 侧栏固定宽度 + 主区 `flex-1` | `[建议]` | 回退到顶部导航单栏 |
| **Spotlight Border** | `Forge` | 需要突出单一焦点卡片 | 鼠标驱动边框高光，移动端关闭 | `[建议]` | 改静态渐变描边 |
| **Parallax Tilt** | `Forge` | Hero 主视觉展示 | 仅桌面启用，`transform` 动画 | `[严重]`（无降级时） | 改静态图 + 轻浮层 |
| **Command Input** | `Elevate` | 核心交互是输入/命令 | 占位文案循环频率低，避免干扰输入 | `[建议]` | 纯静态 placeholder |
| **Live Status Pulse** | `Elevate` | 实时状态或监控指标 | 仅状态点轻动画，不影响布局 | `[建议]` | 改静态状态色 |
| **Infinite Carousel** | `Forge` | Logo 墙/合作方展示 | 线性匀速，容器避免误触 | `[严重]`（掉帧或可访问性问题） | 改分页网格或静态列表 |
| **Mesh Gradient** | `Forge` | 品牌氛围背景 | 颜色 <= 3，周期 >= 8s | `[建议]` | 静态渐变 |
| **Grain Texture** | `Elevate` `Forge` | 深色背景需质感 | 噪点低透明度，不影响内容对比 | `[建议]` | 去掉噪点，仅保留纯色/渐变 |
| **Button Press** | 全模式 | 按钮点击反馈 | `whileTap={{ scale: 0.97 }}` | `[建议]` | `active:scale-95` |

---

## 默认组合（避免保守产出）

- `Elevate` 默认组合：`Split Hero` + `Button Press`
- `Elevate`（数据页）默认组合：`Dashboard Shell` + `Live Status Pulse`
- `Forge` 默认组合：`Bento Grid` + `Mesh Gradient` + `Spotlight Border`

若用户没要求克制，不要降级为“只改颜色和圆角”。

---

## 强度上限（防过载）

1. 同屏重技法最多 `2` 个。重技法：`Parallax Tilt`、`Infinite Carousel`、`Spotlight Border`、`Mesh Gradient`。
2. 单屏仅允许 `1` 个主焦点 + 最多 `1` 个次焦点；CTA 最多 `2` 个且仅 `1` 个主 CTA。

---

## 严重问题判定（技法相关）

以下情况标记为 `[严重]` 并建议立即回退：

1. 动效未处理 `prefers-reduced-motion`
2. 技法造成交互阻塞或显著掉帧
3. 技法导致文本可读性或对比度不达标
4. 移动端出现误触、抖动、横向溢出
5. 同屏重技法超过 `2` 个
6. 单屏主焦点超过 `1` 个，或 CTA 超过 `2` 个
7. 缺失明确 `focus-visible` 样式

---

## 最小实现模板

```md
技法：<name>
目标：<解决的问题>
变更：
1. <before class/token> -> <after class/token>
2. <before class/token> -> <after class/token>

降级：
- mobile: <on/off or alternative>
- reduced-motion: <alternative>

验证：
- 可读性/可点击性
- 桌面与移动端一致性
- 性能与回退可用
```
