---
name: improve-ui
description: 审查或改进既有界面的信息呈现、构图、视觉系统与交互质量，涵盖响应式、尺寸稳定、动效、浮层与失败恢复。纯文案改写或系统 invariant 审查不触发。仅供用户显式调用。
disable-model-invocation: true
---

# Improve UI

从用户任务、内容关系与交互状态推导界面，改进理解与操作质量。默认交付诊断与建议；已授权实现时完成修改和验证。

## 1. 确定判断依据

读取目标项目的设计规范、token、组件变体与同类界面，明确当前任务、主操作及关键状态。项目的离散取值与组件外观归属沿用其规范；通用原则不覆盖已确认的品牌或产品规则。

先判断哪些信息支撑当前决定，再确定主次、比较关系、分组与操作顺序，最后选择组件。只删容器、增加留白或替换颜色不足以完成界面改进。

## 2. 按实际改动读取

| 涉及内容 | Reference |
| --- | --- |
| 信息缺失、堆砌、过度解释、判断依据或披露层级 | [information-design.md](references/information-design.md) |
| 构图、分组、主次、密度、宽度、对齐或响应式 | [composition.md](references/composition.md) |
| 字阶、数字、字体、颜色、表面、主题或圆角 | [visual-system.md](references/visual-system.md) |
| 加载占位、空值、溢出、尺寸变化、过渡或动画 | [motion-and-stability.md](references/motion-and-stability.md) |
| 展开载体、跳转、浮层、Portal、遮挡或焦点 | [overlays-and-navigation.md](references/overlays-and-navigation.md) |
| 受理、等待、竞态、通知、成功／失败或恢复 | [interaction-continuity.md](references/interaction-continuity.md) |

按实际触及内容读取，可命中多行；局部问题只读相关 reference。综合审查先定位相关维度，不把某一维度的检查当作全部验收。

纯文案改写由 ux-writing 处理；仅在当前任务需要且该 skill 可用时读取。新建可复用设计规范属于 design-md-creator。

## 3. 验证与交付

将问题连到具体界面、根因和任务后果，优先修复结构与行为，再调整外观。保持功能目标、关键代价与限制；新增后台执行、持久进度、取消或撤销能力须在授权范围内。

每项 finding 写明严重度、位置、任务后果、证据与最小调整，同一根因只报一次。实现后在运行界面验证原任务路径，以及改动涉及的状态、窄屏或键盘操作；检查决定前信息仍可见，操作位置稳定，反馈与真实状态一致。交付修改位置、实际检查与未验证范围。
