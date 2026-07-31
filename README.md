# SweetRetry Skills

面向 Agent 的可复用 skill 集合。仓库按职责领域组织 skill，并将支持 skill 设计与迭代的研究证据单独落库。

## 目录

```text
engineering/   Agent、架构、代码质量与前端框架工程
generation/    AI 图片、视频、剧本与分镜生成
product/       产品诊断与数据价值判断
web-design/    界面设计、视觉审查与网页背景资产
research/      跨 skill 的研究证据，不参与 skill discovery
```

### Engineering

- `agent-engineering`：设计、审查和改进 AI Agent。
- `edge-case-analysis`：系统性分析可到达的边界失效。
- `future-proof-design`：为已确认的问题收敛长期 strong target。
- `reactflow-pratices`：React Flow v12+ 开发实践。
- `simplify-code`：识别并减少不改变行为的复杂度债务。
- `videojs-react`：Video.js v10 React 播放器开发实践。

### Generation

- `asset-director`：规划跨画面复用的参考素材与连续性控制。
- `graphic-image-prompt`：生成封面、文章配图与 editorial graphic 等 artifact-first 视觉构成 prompt。
- `scene-image-prompt`：生成由主体、空间、视点与光照关系主导的 scene-first 图片 prompt。
- `script-director`：构思、诊断和改写不同媒介与篇幅的脚本。
- `storyboard-director`：把剧本转为分镜与连续生成段。
- `style-grill`：通过推荐与追问收敛可复用的视觉 Style Spec。
- `video-breakdown`：逐镜分析视频并输出紧凑 JSON。
- `video-prompt`：生成单次 4–15 秒的视频 prompt。

### Product

- `analytics-tracking`：从业务问题判断数据与埋点价值。
- `product-guide`：诊断用户链路、产品状态、功能边界与 ROI。

### Web Design

- `generate-web-backgrounds`：依据产品与页面职责选择 image / video，并生成 website background 资产 brief。
- `ui-critic`：对现有界面进行取证式视觉 critique。
- `ui-designer`：设计或实现网页与 App UI。

### Research

`research/` 保存支持 skill 决策的一手来源研究。研究记录应区分事实、推断与建议；研究结论只有回写到对应 `SKILL.md` 后，才会改变 skill 行为。

## 维护约定

- 每个 skill 使用独立目录，目录名与 `SKILL.md` 中的 `name` 一致。
- skill 专属的按需资料放在该 skill 的 `references/`；跨 skill 研究放在根目录 `research/`。
- 保持 skill 职责独立，避免通过目录分层掩盖能力重叠。
- 用户反馈驱动的修改遵循 [AGENTS.md](AGENTS.md) 中的反馈闭环。

## 校验

```bash
VALIDATOR="${CODEX_HOME:-$HOME/.codex}/skills/.system/skill-creator/scripts/quick_validate.py"

find engineering generation product web-design -mindepth 2 -maxdepth 2 -name SKILL.md -type f |
while IFS= read -r file; do
  python3 "$VALIDATOR" "${file%/SKILL.md}"
done
```
