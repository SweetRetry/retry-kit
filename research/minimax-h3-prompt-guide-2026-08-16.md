# MiniMax H3 视频 prompt 指南核查

- 日期：2026-08-16
- 问题：MiniMax-H3 的官方 prompt、输入模态、时长与参数限制中，哪些规则必须进入 `video-prompt` 的模型 reference，而不能写入通用主文档？
- 来源范围：仅 MiniMax 官方 API 文档与官方示例；未使用第三方教程、聚合页或社区经验。

## 1. 官方来源

- [Video Generation Guide](https://platform.minimax.io/docs/guides/video-generation.md)
- [H3 Prompt Examples](https://platform.minimax.io/docs/guides/video-prompt.md)
- [V2 Create Video Generation Task](https://platform.minimax.io/docs/api-reference/video-generation-v2-create.md)

## 2. 事实

- 每个 request 都必须含非空 `text` item；单个 text prompt 最多 7000 characters。时长是 4–15 的整数秒；输出可为 768P 或 2K。
- 必须在 text-to-video、first/last-frame image-to-video、reference-to-video 中选择一种模式。前者需要 concrete ratio；首／尾帧模式由输入图决定画幅且为 adaptive；reference-to-video 可选 concrete ratio 或 adaptive。首／尾帧素材不能与 reference 图片、视频、音频同用。
- 首／尾帧入口最多 2 张图；reference-to-video 最多可用 9 张图片、3 个视频、3 个音频，合计不超过 12 个文件。每个参考视频／音频为 2–15 秒，同类型总时长不超过 15 秒。图片、视频的宽高为 256–5760，宽高比为 2:5–5:2。
- 官方列出的文件格式为：图片 JPG/JPEG/PNG/WEBP/HEIC/HEIF，视频 H.264/AVC 或 H.265/HEVC，音频 WAV/MP3；单文件上限依次为视频 50 MB、图片 30 MB、音频 15 MB，请求体上限 64 MB。
- 官方示例将多个 reference 以稳定序号和职责绑定，例如 `Image 1: …`；随后写 core story、tone／style、动作与声音。
- 官方 guide 显示可把 `[pan]`、`[zoom]`、`[static]` 等 camera movement tag 写在相关画面描述之后。
- 官方还提供 H3-Context-IR：异步解析多模态输入并返回增强后的 `content.prompt`，不生成视频；2K regeneration 则要求复现原始全部 `content` 并额外传入唯一 `role=base_video` 的 H3 768P 源视频。
- 视频 generation 本身是异步流程：创建任务取得 `task_id`，官方示例建议约每 10 秒查询一次；成功后从 `content.url` 下载视频，`failed`／`cancelled` 是终态。

## 3. 推断

- 主文档可保持素材职责、叙事时间线、连续性和可观察状态等共性流程；H3 的模式互斥、素材编号、画幅、时长和 camera tag 应留在 H3 reference。
- 多模态素材没有稳定编号与职责绑定时，主体、动作与声音容易互相串位；因此 reference 要求“编号—职责”后再写故事和风格。

## 4. 建议

- H3 prompt 先确定 mode，再列素材编号及其职责，之后写故事、动作、camera、风格／节奏与声音。
- 把时长、画幅、分辨率和素材上传放在请求字段；正文只描述会改变视听结果的内容，并与这些字段保持一致。

## 5. 局限

- 本次验证的是公开的官方 API 文档和示例，没有在登录后的控制台实际提交请求；账户、区域或灰度发布的限制未纳入。
- 官方示例说明了已验证的 prompt 组织和 tag，用例并不构成穷尽的强制语法。
