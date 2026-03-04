# Token 与动效参数（执行版）

本文件用于把视觉决策转成可落地的 `before -> after` 变更，不用于定义审美偏好。

---

## 1) Token 变更策略（按模式）

| 模式 | 允许改动层级 | 典型动作 |
|------|-------------|---------|
| `Preserve` | 组件级 class | 修正对比度、边界、状态色，保持现有主题体系 |
| `Elevate` | 页面级 class + 少量语义 token | 增强层级与节奏，不改核心品牌变量 |
| `Forge` | 全局 CSS 变量 + 组件级 class | 重设主视觉语言，并同步组件映射 |

---

## 2) 常用语义 Token

| 用途 | Token（Tailwind class） | 备注 |
|------|------------------------|------|
| 页面背景 | `bg-background` | 全局底色 |
| 卡片背景 | `bg-card` | 容器底色 |
| 浮层背景 | `bg-popover` | Menu / Dialog / Tooltip |
| 次级底色 | `bg-muted` | 辅助信息区 |
| 主文字 | `text-foreground` | 正文和标题 |
| 次文字 | `text-muted-foreground` | 描述和弱信息 |
| 主操作 | `bg-primary text-primary-foreground` | 主 CTA |
| 次操作 | `bg-secondary text-secondary-foreground` | 次级按钮 |
| 常规边框 | `border-border` | 通用边界 |
| 输入边框 | `border-input` | 表单控件 |
| 错误态 | `text-destructive` / `bg-destructive` | 错误提示 |
| 成功态 | `text-emerald-500` + `bg-emerald-500/10` | 状态反馈 |
| 警告态 | `text-amber-500` + `bg-amber-500/10` | 状态反馈 |

---

## 3) 可执行变更示例

### Preserve 示例（组件级修正）

```txt
before: className="bg-white text-zinc-900 border-zinc-200"
after : className="bg-card text-foreground border-border"
```

### Elevate 示例（页面级增强）

```txt
before: className="bg-background"
after : className="bg-background md:bg-muted/30"
```

### Forge 示例（变量级重设）

```txt
before: --primary: 222.2 47.4% 11.2%;
after : --primary: 210 92% 45%;
```

---

## 4) 动效参数建议

优先使用低风险参数，除非用户明确要求更强表达。

| 场景 | stiffness | damping | 说明 |
|------|-----------|---------|------|
| 通用入场 | 300 | 30 | 默认推荐 |
| 大元素过渡 | 200 | 40 | 更沉稳 |
| 轻交互跟随 | 150 | 25 | 仅用于少量焦点元素 |

---

## 5) 动效硬约束

1. 只动画 `transform` 和 `opacity`
2. 必须处理 `prefers-reduced-motion`
3. 移动端优先降级复杂跟随和视差效果
4. 交互反馈不能延迟按钮可点击性
5. 对比度硬门槛：正文 `>= 4.5:1`，大字/图标 `>= 3:1`
6. 焦点样式硬门槛：必须具备可见 `focus-visible`
7. 推荐焦点样式：`focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-1`

---

## 6) 交付检查模板

```md
Token 变更：
1. <before> -> <after>
2. <before> -> <after>

影响范围：
- 文件：...
- 组件：...

验证：
- 对比度通过
- 对比度达标（`4.5:1` & `3:1`）
- focus-visible 可见且一致
- 深色模式正常
- reduced-motion 降级生效
```
