# Prompt 避坑指南 — AI 图像模型能力边界

> 以下规律基于多模型、多轮实测提炼。具体表现因模型而异，但底层模式具有普遍性。好 prompt 大幅提高基准出图率，多采样筛选是质量兜底，两者缺一不可。

---

## 一、七类常见陷阱

### 1. 光影全局一致性

**本质**：模型对局部光影渲染质量高，但「光源位置 → 遮挡物形状 → 投影方向/形状/大小」这条因果链难以维持。局部看合理，全局矛盾。

**典型翻车**：
- 投影形状与遮挡物不对应
- 多光源时投影方向矛盾
- "轮廓光"被误渲染为物体内部发光

**Prompt 策略**：
- **描写效果，不描写因果** — 写 "warm glow illuminating face" 而非 "candle light casting triangular shadow on left wall"
- 光效词用 "bright edge outlining silhouette" 而非 "body glowing" / "coated in golden light"
- 单主光源为主，第二光源只写色温氛围，不写具体投射

### 2. 多体交互关系

**本质**：单体渲染稳定，但两个物体之间的接触、承载、遮挡关系容易出错。交互复杂度越高，出错概率越大。

**交互难度梯度**（从易到难）：
| 难度 | 动作类型 | 可靠性 |
|------|----------|--------|
| 稳定 | 站立、独坐、并肩、对视 | 高 |
| 可控 | 倚靠、牵手、手握单件物体 | 较高 |
| 困难 | 骑乘、背负、双手复杂操作 | 中低 |
| 高危 | 多人缠斗、动态接触、精确手指姿态 | 低 |

**Prompt 策略**：
- 写动作意图（"hand gripping sword"），不写精确物理细节（"fingers wrapping hilt with middle finger pressing over index"）
- 困难/高危交互放在中景或远景，利用距离模糊掩盖
- 手指在飘散衣袖中时不精写细节

### 3. 精确重复结构

**本质**：模型难以维持精确计数和等距重复的结构（棋盘格线、琴弦、栏杆等距排列、文字笔画），但对整体对称性（建筑飞檐、宫殿正面）处理较好。

**Prompt 策略**：
- 精确重复性物体（棋盘、琴弦、文字）放在虚化区 / 暗部 / 画面边缘，不做主体
- 用模糊叙事代替精确描写："a game board with scattered pieces" 而非 "19x19 Go board with black and white stones"
- 对称性建筑可以写，但避免要求精确数量（"five pillars"）
- 能省则省——不需要出现的精确重复物体就别写进 prompt

### 4. 动物解剖

**本质**：模型对动物四肢关节结构的把控弱于人类面部。背面、仰视等非常规视角进一步恶化。马匹后腿、蹄部是重灾区。

**Prompt 策略**：
- 动物用侧面或 3/4 视角，回避正面 / 正背面
- 不精确描写关节和蹄部细节，写整体姿态："galloping horse with mane blowing in wind"
- 动物不是画面核心时，放在中远景处理

### 5. 复合语义词拆解

**本质**：模型会将复合词拆开理解，取最显眼的字面义。

**高危词汇示例**：
| 原词 | 模型可能的理解 | 安全替代 |
|------|---------------|---------|
| 紫檀 | 紫色 | dark reddish-brown wood |
| 金丝楠 | 金色丝线 | warm golden-brown wood grain |
| 青花瓷 | 青色花朵 | white porcelain with blue painted patterns |

**Prompt 策略**：
- 材质名不依赖隐含色彩认知，直接描述目标视觉效果
- 复合词拆为「颜色 + 质感 + 形态」三要素显式表达

### 6. 词汇文化联想劫持

**本质**：某些词汇自带强烈的文化 / 风格联想，会劫持整张图的文化方向。Negative prompt 对此纠偏力有限。

**高危词汇清单**：
| 词汇 | 联想方向 | 中国本土替代 |
|------|---------|-------------|
| 浪人 (rōnin) | 日本武士 | 游侠 / 独行剑客 / 江湖客 |
| 赛璐璞 (cel-shading) | 日本动画 | 直接描述视觉效果（见下） |
| 骑士 (knight) | 西方中世纪 | 甲士 / 将士 / 玄甲骑兵 |
| 刺客 (assassin) | 西方游戏风格 | 暗卫 / 死士 / 夜行人 |
| Art Nouveau | 欧洲新艺术 | 有机曲线边框、藤蔓式装饰线条 |

**Prompt 策略**：
- **正面 prompt 是强锚定，negative 只是辅助** — 文化方向必须靠正面描写中的具体服饰（交领右衽汉服）、武器（环首刀/雁翎刀）、建筑（青砖飞檐/红灯笼）锁死
- **终极方案：不写风格名，直接描述视觉效果** — 风格名自带文化包袱，视觉效果描述是文化中立的：
  - "cel-shading" → "flat color blocks with hard shadow edges, clean even outlines"
  - "ukiyo-e" → "bold black outlines, flat color areas, decorative wave patterns"

### 7. 默认美颜 / CG 平滑（"AI 味"）

**本质**：模型有强烈的"美颜"倾向——即使 prompt 要求厚涂笔触、粗糙质感，面部仍可能被渲染得过度光滑精致。这是"AI 味"的核心来源。

**典型矛盾**：
- 厚涂风格下老人脸像磨皮 CG
- 眼睛过于明亮清澈，不符合角色年龄 / 身份
- 整体"干净感"与角色设定（流浪者、战士、老人）矛盾

**Prompt 策略**：
- **多采样筛选是第一策略** — 同一 prompt 下质量波动正常，AI 味是随机的，不完全可控；但好 prompt 大幅提高基准
- 需要粗糙/写实质感时，显式强调面部也要有风格一致的处理："face covered with rough visible brushstrokes, impasto skin texture, unretouched weathered features"
- 角色设定越"不完美"（老人、伤疤、风霜感），越需要显式对抗美颜倾向
- Negative 中可辅助："smooth skin, airbrushed face, CG render, flawless complexion"

---

## 二、Prompt 自洽性检查

写完 prompt 后，逐条核查以下矛盾对。任何一组打架都会导致模型按权重更大的一方执行，另一方被忽略。

| 检查项 | 矛盾示例 | 修正方向 |
|--------|---------|---------|
| **构图 vs 尺度** | "centered symmetrical composition" + "tiny figure" | 要人物渺小 → 用 extreme wide shot + negative space，不用中心对称 |
| **精写细节 vs 景别距离** | 精写五官表情 + 大远景 | 大远景下人物只占 5-10%，没有像素渲染五官；要精写就用近景/中景 |
| **悬浮/漂浮 vs 完整人体** | "floating in air" + 需要完整身体 | "floating" 让模型合理化省略下半身；写 "feet lightly touching cloud surface" 暗示有下肢 |
| **风格笔触 vs 面部渲染** | "thick impasto brushwork" + 未对面部做同样要求 | 如需全画面一致笔触，面部必须显式要求同样处理 |
| **光效词 vs 物理表现** | "coated in golden glow" → 物体自发光 | 轮廓光写 "bright edge along silhouette"，不写 "glowing body" |
| **小饰品精写 vs 位置控制** | "waist jade pendant emitting green glow" → 跑到胸口变巨大宝石 | 小饰品写氛围 "faint cyan-green shimmer at waist" 而非精写实体 |

---

## 三、文化锚定策略

### 3.1 正面锚定 > Negative 排除

| 锚定手段 | 强度 | 说明 |
|---------|------|------|
| 正面 prompt 具体描写服饰/建筑/器物 | 强 | "cross-collar right-over-left hanfu, Chinese ring-pommel dao, blue brick wall with upturned eaves" |
| 明确题材标签 | 中 | "Chinese wuxia manhua" 提供方向但不够精确 |
| Negative prompt 排除 | 弱 | "Japanese style" 在 negative 中难以对抗正面词汇的文化拉力 |

### 3.2 文化联想劫持防御

当使用与外国文化强关联的词汇（赛璐璐、浪人、骑士等）时，必须同时满足：

1. **正面锚定**：在 prompt 中写入至少 3 个具体的中式视觉元素（服饰 + 建筑 + 器物）
2. **词汇替换**：尽可能用中国本土词汇替代有外国联想的词（见第一节第 6 条词汇清单）
3. **视觉效果直写**：最安全的方案是不写风格名，直接描述想要的视觉特征（色块/线条/阴影处理方式）

---

## 四、最反直觉的 5 条原则

> 以上三节的完整要点已融入 SKILL.md 的「出稿自检」清单。此处仅列出最容易遗忘、最反直觉的 5 条。

| # | 原则 | 为什么反直觉 |
|---|------|-------------|
| 1 | **常规视角优先，极端视角需简化主体** | 仰视/俯视本身没问题，但主体必须相应简化（俯视孤舟可行，俯视多人战场高危） |
| 2 | **"floating" 会触发省略下半身** | 写"悬浮"时模型认为下半身不需要存在；改写 "feet lightly touching cloud surface" |
| 3 | **风格一致性必须贯穿面部** | 厚涂/水墨等有笔触感的风格，面部不会自动继承——必须显式要求同样笔触处理，否则默认美颜 |
| 4 | **简单交互 > 复杂交互** | 骑乘/缠斗/动态接触即使写得再好也容易翻车；降级为低难度交互或放远景更有效 |
| 5 | **写视觉效果，不写风格名** | 风格名自带文化包袱（赛璐璐→日本、Art Nouveau→欧洲），直接描述视觉特征是文化中立的替代方案 |
