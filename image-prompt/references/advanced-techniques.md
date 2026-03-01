# 高级控制与避坑

## JSON 结构化

2+ 主体需独立属性或精确空间排列时，可用 JSON 格式：

```json
{
  "scene": "a cozy cafe interior",
  "subjects": [
    {"type": "woman", "position": "left", "wearing": "red dress", "action": "reading"},
    {"type": "cat", "position": "right foreground", "color": "orange tabby", "action": "sleeping"}
  ],
  "lighting": "warm afternoon sunlight through window",
  "style": "cinematic photography"
}
```

并非所有工具都支持，效果因工具而异。

## 文字渲染

用**双引号**包裹目标文字：`a poster with the text "HELLO" in bold serif font`

- 1-3 个英文单词最可靠，非拉丁文字经常出错
- 指定字体风格和位置，预留干净区域

## 颜色精确控制

HEX + 颜色名称配合：`a scarf in #C7254E crimson draped over a #F5F5DC beige counter`

具体色名比泛称准确：crimson / cobalt / emerald / ivory / obsidian > red / blue / green / white / black

## 空间控制

每个主体指定**屏幕位置 + 景深层次**：

```
[left foreground] chess knight in sharp focus,
[right background] opponent's hand hovering above board, slightly blurred
```

最多同时精确控制 2-3 个主体。避免复杂相对位置（如 "A 背对 B，B 看着 C"）。

## 常见翻车与修正

| 问题 | 策略 |
|------|------|
| 手指错误/融合 | 保持简单动作（托腮、握物、放口袋），negative 加 `extra fingers, fused fingers` |
| 多人面部互换 | 最多 2-3 人，用服装颜色区分，景深分离；超过 3 人用 "crowd in background" |
| 文字拼写错误 | 保持简短大写英文，指定字体，预留干净区域 |
| 对称性不准 | 写 "perfectly symmetrical"，选正面视角，用几何/建筑主体 |
| 比例失调 | 提供参考物（"cat sitting next to coffee cup on table"） |
| 风格四不像 | 明确一种主导风格，辅助风格只影响局部，最多 2 种 |

## 工具适配

默认输出通用 prompt，不含工具特定参数。用户指定工具时在 Meta 中追加：

- **Midjourney**：`--ar` 画幅 / `--v` 版本 / `--no` 代替 negative / `::` 权重分隔
- **SD / Flux**：支持完整 negative prompt / CFG scale / 注明 LoRA/checkpoint
- **DALL-E**：不支持 negative prompt / 更擅长自然语言 / 支持 inpainting
