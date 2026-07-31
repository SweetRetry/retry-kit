# SweetRetry Skills

面向 Agent 的可复用 skill 集合。仓库按职责领域组织 skill，并将支持 skill 设计与迭代的研究证据单独落库。

## 目录

```text
engineering/   Agent、架构、代码质量与前端框架工程
product/       产品诊断与数据价值判断
web-design/    界面设计、视觉审查与网页视觉素材
research/      跨 skill 的研究证据，不参与 skill discovery
```

### Engineering

- `agent-engineering`：设计、审查和改进 AI Agent。
- `edge-case-analysis`：系统性分析可到达的边界失效。
- `future-proof-design`：为已确认的问题收敛长期 strong target。
- `reactflow-pratices`：React Flow v12+ 开发实践。
- `simplify-code`：识别并减少不改变行为的复杂度债务。
- `videojs-react`：Video.js v10 React 播放器开发实践。

### Product

- `analytics-tracking`：从业务问题判断数据与埋点价值。
- `product-guide`：诊断用户链路、产品状态、功能边界与 ROI。

### Web Design

- `generate-web-backgrounds`：生成耐裁切的 website background prompt。
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

find engineering product web-design -mindepth 2 -maxdepth 2 -name SKILL.md -type f |
while IFS= read -r file; do
  python3 "$VALIDATOR" "${file%/SKILL.md}"
done
```
