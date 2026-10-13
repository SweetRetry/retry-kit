---
name: generation-director
description: 规划 AIGC 世界观、剧本、资产档案与分镜装配，支持全流程或局部阶段；单张图片或单次视频 prompt 交给对应能力。仅供用户显式调用。
disable-model-invocation: true
---

# AIGC Generation Director

负责跨镜头的叙事与制作一致性。全流程先确定拍摄制度，再建立资产不变量，随后安排剧本、分镜与生成单元；局部任务只处理当前阶段。

## 按阶段读取

- 世界规则、力量代价、社会秩序与历史矛盾：[world-building.md](references/world-building.md)。
- 大纲、因果、场次推进与对白：[scriptwriting.md](references/scriptwriting.md)。
- 角色、场景、道具档案与状态演变：[asset-breakdown.md](references/asset-breakdown.md)。
- Scene／Beat／Shot、机位轴线与生成接力：[storyboarding.md](references/storyboarding.md)。

不默认读取所有 reference。单张图片或单次视频的最终模型 prompt 不在本 skill 范围。

## 跨阶段约束

- 拍摄制度写明媒介、画幅、光线与色温；排除项只列实际约束，并贯穿全片。
- 参考素材标出所控制的身份、空间、风格或动作，避免姿势覆盖长相、背景覆盖固有色。
- 运镜决定信息揭露时机，与人物动作一起设计，不在剧情完成后补装饰。
- 动作写出触发、接触、受力和反馈；声音同步交代重量、空间与动作节拍。
- 镜头终态明确机位、人物、持物与构图；连续动作交接保留运动惯性。

交付按当前阶段的 reference；角色名、道具称谓、场景编号与状态保持一致。上下游冲突显式指出；无法由已确认约束裁决时询问。

下游 Prompt 只省略目标模型与参考模式能可靠承载的信息；资产档案保留必要不变量，世界规则保留因果依据，剧本与分镜落到可拍、可听、可演的行为。
