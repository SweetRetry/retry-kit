# 交互设计

## 八态设计

每个可交互元素都需要设计这些状态：

| 状态 | 触发条件 | 视觉处理 |
|------|---------|---------|
| **Default** | 静止 | 基础样式 |
| **Hover** | 指针悬停（非触控） | 微妙抬升、颜色偏移 |
| **Focus** | 键盘/程序化聚焦 | 可见焦点环（见 [tokens.md](tokens.md)） |
| **Active** | 正在按下 | 按下感、更深色 |
| **Disabled** | 不可交互 | 降低透明度，无指针 |
| **Loading** | 处理中 | spinner 或 skeleton |
| **Error** | 无效状态 | 红色边框、图标、消息 |
| **Success** | 已完成 | 绿色确认、对勾 |

**常见遗漏**：设计了 hover 但没设计 focus。它们不同——键盘用户永远看不到 hover 状态。

---

## 表单设计

- **Placeholder 不是 Label**——输入时消失。总是使用可见 `<label>`
- **验证时机**：blur 时验证，不是每次击键（例外：密码强度）
- **错误位置**：字段**下方**，用 `aria-describedby` 关联

---

## 加载状态

- **Skeleton > Spinner**：预览内容形状，感觉更快。Spinner 只在不知道内容结构时使用
- **Optimistic UI**：低风险操作（点赞、关注）立即更新界面，后台同步。支付和破坏性操作不用

---

## Modal：正确方式

用 `inert` 属性或原生 `<dialog>` 替代手动焦点陷阱：

```html
<main inert><!-- 背后不可聚焦 --></main>
<dialog open><!-- 焦点自动锁定 --></dialog>
```

```js
dialog.showModal();  // 自带焦点陷阱，Escape 关闭
```

---

## Popover API

tooltip、dropdown、非 modal 浮层用原生 popover：

```html
<button popovertarget="menu">打开菜单</button>
<div id="menu" popover>...</div>
```

优势：点击外部关闭、正确堆叠、无 z-index 战争、默认可访问。

---

## 破坏性操作：Undo > Confirm

Undo 优于确认对话框——用户会无脑点击确认。立即从 UI 移除 → 显示 undo toast → toast 过期后真正删除。只在真正不可逆、高成本、批量操作时用确认。

> 确认对话框的文案规范见 [ux-writing.md](ux-writing.md)

---

## 键盘导航

### Roving Tabindex

组件组（tabs、菜单项、radio group）中，一个元素可 tab 到，方向键在内部移动：

```html
<div role="tablist">
  <button role="tab" tabindex="0">Tab 1</button>
  <button role="tab" tabindex="-1">Tab 2</button>
</div>
```

### Skip Link

`<a href="#main-content">跳转到主内容</a>`——视觉隐藏，聚焦时显示。

---

## 手势可发现性

滑动删除等手势是不可见的。必须暗示存在：部分露出、首次引导 coach mark、总是提供可见回退。不要把手势作为唯一方式。

---

## 渐进式披露

从简单开始，通过交互揭示复杂性：基础选项先显示，高级选项在可展开区域；hover 揭示次要操作。
