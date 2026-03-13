# Token 与工程落地

把视觉决策转化为可维护的代码。Token 是**设计意图的工程表达**。

---

## Token 变更策略

| 模式 | 改动范围 | 典型动作 |
|------|---------|---------|
| `Preserve` | 组件级 class | 修正对比度、边界，保持现有体系 |
| `Elevate` | 页面级 + 少量语义 token | 增强层级，不改核心变量 |
| `Forge` | 全局变量 + 组件级 class | 重设视觉语言，同步组件映射 |

---

## 语义 Token 速查

| 用途 | Tailwind Class | 说明 |
|------|---------------|------|
| 页面背景 | `bg-background` | 最底层底色 |
| 卡片背景 | `bg-card` | 内容容器 |
| 浮层背景 | `bg-popover` | Menu/Dialog/Tooltip |
| 次级底色 | `bg-muted` | 辅助信息区、hover 态 |
| 主文字 | `text-foreground` | 正文、标题 |
| 次文字 | `text-muted-foreground` | 描述、禁用态 |
| 主操作 | `bg-primary text-primary-foreground` | 主 CTA |
| 次操作 | `bg-secondary text-secondary-foreground` | 次级按钮 |
| 边框 | `border-border` | 通用边界 |
| 输入边框 | `border-input` | 表单控件 |
| 错误态 | `text-destructive` / `bg-destructive` | 错误提示（语义 token） |

---

## 变更示例

### Preserve（组件修正）

```txt
Before: className="bg-white text-zinc-900 border-zinc-200"
After : className="bg-card text-foreground border-border"
```

### Elevate（页面增强）

```txt
Before: className="bg-background"
After : className="bg-background md:bg-muted/30"
```

### Forge（变量重设）

```txt
Before: --primary: 222.2 47.4% 11.2%;
After : --primary: 210 92% 45%;
```

---

## 裸色使用白名单

以下场景**允许**使用裸色（如 `text-zinc-900`、`bg-blue-500`）：

1. **数据可视化**：分组色、图表色
2. **品牌素材不可替换色**：Logo、特定品牌元素
3. **语义色**：错误态（保留 `destructive` 语义 token）

**使用要求**：
- 在输出中写明原因
- 提供回退 token（如失效时的替代）
- 限制使用范围

---

## 动效参数建议

| 场景 | stiffness | damping | 说明 |
|------|-----------|---------|------|
| 通用入场 | 300 | 30 | 默认 |
| 大元素过渡 | 200 | 40 | 更沉稳 |
| 轻交互跟随 | 150 | 25 | 仅少量焦点元素 |

---

## 可访问性硬门槛

### 对比度

- 正文文字（< 18pt）：≥ 4.5:1
- 大文字（≥ 18pt 或 Bold ≥ 14pt）：≥ 3:1
- 图标：≥ 3:1

### 焦点样式

必须提供可见 `focus-visible`：

```css
/* 推荐 */
focus-visible:outline-none 
focus-visible:ring-2 
focus-visible:ring-primary/30 
focus-visible:ring-offset-1
```

### 触控目标

- 移动端：≥ 44×44px
- 推荐：≥ 48×48px

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 交付检查清单

```md
Token 变更：
1. <before> -> <after>
2. <before> -> <after>

影响范围：
- 文件：...
- 组件：...

可访问性验证：
- [ ] 对比度 ≥ 4.5:1（正文）
- [ ] 对比度 ≥ 3:1（大字/图标）
- [ ] focus-visible 可见且一致
- [ ] 深色模式正常
- [ ] reduced-motion 降级生效
- [ ] 移动端触控目标 ≥ 44px
```

---

## Token-First 原则

> "使用语义 token 不是限制，是设计意图的清晰表达。"

**`bg-blue-500`** 说："这里用蓝色"
**`bg-primary`** 说："这是主要操作的颜色"

后者在暗色模式、品牌换肤、无障碍适配时，只需要改一处变量。

---

## 常见错误

| 错误 | 后果 | 修正 |
|------|------|------|
| 裸色直接写死在 class | 无法换肤、暗色模式失效 | 替换为语义 token |
| 同屏多个主色 | 视觉语言混乱 | 收敛到 1 主 + 1 强调 |
| 透明度随意使用 | 对比度不可控 | 使用 token 的透明度变体 |
| 忽略 focus-visible | 键盘用户无法操作 | 添加焦点样式 |
