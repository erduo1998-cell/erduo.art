# 首页展示媒体

本目录用于耳朵（刘冉）的个人网站与作品展示。文件为本人创作、生成影像或既有公开品牌素材的网页衍生版本。生成场景用于视觉表达；它们不代表客户案例、真实产品界面或业务效果数据。

## 本次人物制作与当前状态

人物来源为本人提供的黑色 Polo 肖像，使用 Codex 内置图像生成功能制作真人比例的风格化角色，保留本人五官与成人比例。

| 文件或媒体 | 公开用途 | 实际来源与制作事实 |
| --- | --- | --- |
| `erduo-avatar.webp` | 首页人物主视觉 | 黑色 Polo 本人照片参考下的 Codex 生成形象，网页静态图取同一角色视频正面帧，以匹配动效构图。画面属于生成图像，不称真实摄影。 |
| `erduo-workstation.webp` | 创作者与工作台场景 | 同一本人照片与角色方向下的 Codex 生成场景，完整工作台构图；不称真实工作现场记录。 |
| `erduo-look-atlas.webp` | 头像左右看的姿态图集 | 从生成视频提取姿态帧，按指针方向选帧呈现转头。它是二维图集，不是可自由旋转的真实 3D 人物模型。图集为 3840×4480，每格 640×640；36 个开眼朝向与 6 个眨眼帧。已验证左右指针与按住拖动响应。 |
| `erduo-idle.mp4` 与坐姿短循环 | 人物静音轻动态与坐姿氛围 | 基于选定角色图使用 VidMuse MiniMax H3 生成；坐姿采用静音短循环，保留图片回退。源视频为 8 秒、1440p，预计 96 积分；两个网页循环均为 960×960、H.264、静音、约 7.92 秒，已完成完整解码和播放验证。预计成本不代表最终核实扣费。 |
| `social-preview.jpg` | 社交分享链接预览 | 首页实际浏览器截图的裁切版本；已随当前人物更新。 |

参考照片仅作为获得授权的生成输入。站内既有 `/assets/founder-erduo-2026.webp` 继续用于真实身份展示，但不是本轮新角色的参考来源。旧的 5 秒、1440p、预计 60 积分记录属于前一轮，不能用作当前 8 秒任务的状态或成本依据。

## 首页 v2 的媒体交互

- 标题按字母进入，DIRECTOR / CREATOR / BUILDER 角色文字轮换；细指针设备支持光标磁吸。
- 服务条目支持悬浮展开，继续保留原生 `details` 的点击和键盘访问；作品展可鼠标拖拽，并保留按钮、方向键与触屏滚动。
- 人物左右看由生成视频提取的姿态图集呈现；坐姿使用静音短循环。失败或未准备好时保留静态人物，不把未完成媒体宣称为已经上线。
- 工具区为 24 个 Three.js 球体，文字标签表达本人使用的工具与工作方法。球体由程序生成，不使用下载的人物模型、第三方 Logo 或客户数据；工具名称不表示商业合作。
- Three.js 使用本地副本，MIT 许可证保留在 `/assets/vendor/three/LICENSE`。字体许可继续随各字体保存。

## 个人创作与开源项目演示

| 文件 | 公开用途 | 实际来源与制作事实 |
| --- | --- | --- |
| `director-is-me.mp4`、`director-is-me.webp` | 《导演是我》个人创作片段及封面 | 来自本人 VidMuse 视频项目中《导演是我》第五期的 B01 生成片段。原片为 MiniMax H3 生成的积木导演与工作流场景；网页版本为 1280×960、H.264、静音、约 13.46 秒，封面取自视频。该文件展示个人创作实践，不宣称客户验收或商业效果。 |
| `broll-showcase.mp4`、`broll-showcase.webp` | B-roll Loop Engineering 开源项目演示及封面 | 来自为开源项目 GitHub 首页制作的 40 秒演示 Master。原片为 3840×2160、30 fps；网页版为 1280×720、30 fps、H.264、静音、faststart。封面取自第 37.5 秒，用 Pillow 保存为 WebP。画面中的“4K 可验证”描述原始 Master，网页播放文件为 720p。 |

开源项目：[erduo-broll-loop-engineering](https://github.com/erduo1998-cell/erduo-broll-loop-engineering)。

## 首页复用的既有公开媒体

| 站内文件 | 公开用途与来源 |
| --- | --- |
| `/assets/founder-erduo-2026.webp` | 既有官网使用的刘冉本人肖像，继续用于个人身份与人物参考。 |
| `/assets/knowledge/knowledge-pulse-final.mp4` | 既有官网公开知识能力概念动画，1920×1080、30 fps、H.264、静音、8.4 秒。它展示从问题、证据、判断到能力的关系。 |
| `/assets/knowledge/knowledge-pulse-poster.jpg` | 上述知识动画的既有公开封面。 |
| `/assets/knowledge/founder-knowledge-thinker-abstract-v2.webp` | 既有知识资产激活页面的抽象思考者品牌视觉，用于表达经验与判断的沉淀；不包含私人知识原文。 |
| `/reachsurge/assets/hero-bg-poster.webp` | 既有 ReachSurge 产品页的抽象全球网络视觉，用于产品展示；不表示真实客户分布或实时流量。 |

首页展示标题使用 Clash Display，由官方 Fontshare CDN 加载，适用 `/assets/fonts/FFL-ClashDisplay.txt`；它是专有免费字体，仓库不再分发其二进制。英文正文使用本地 Geist，中文使用本地 Noto Sans SC，子页 Kanit 保持不变。其余字体适用 `/assets/fonts/OFL-Geist.txt`、`/assets/fonts/OFL-Kanit.txt` 和 `/assets/fonts/OFL-NotoSansSC.txt`。完整来源见 `/assets/fonts/FONT-SOURCES.md`；不能把整个页面描述为全部字体自托管。

## 网页衍生验证

`director-is-me.mp4` 与 `broll-showcase.mp4` 已完成媒体信息检查与完整解码。B-roll 封面已经实际打开，确认标题可读、画面完整。此说明只记录来源、用途与可验证的制作事实，不扩大素材权利或声明第三方作品归属。
