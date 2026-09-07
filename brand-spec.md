# 耳朵 ERDUO / SURGE 品牌与网站规格

更新日期：2026-09-07。

本文记录个人站当前视觉与对外事实。首页已经重构，旧首页的固定字阶、暗白 slab、SURGE Hero、旗舰网格和预发布入口要求不再适用；现有产品子页保留各自的设计与业务边界。

## 1. 身份与叙事

- 网站主角：**耳朵 ERDUO / 刘冉**，影视广告导演、AI 创作者、构建者。
- 品牌归属：**SURGE / 无限涌动**，在首屏辅助信息和页脚保留。
- 首页主张：**用导演的判断，指挥 AI 做成事。**
- 工作方法：**想清楚 → 做出来 → 看结果。**
- 履历表述：十余年影视广告与品牌服务经验；不以未经更新的固定年份替代。
- 叙事顺序：个人介绍 → 工作方式与合作方向 → 经历 → 作品 → 知识资产 → 公开工具 → 联系。
- 语气：直接、具体、有作品依据。区分创作片段、概念演示、正式版本、Alpha 和公开实验。

正式品牌名称以 HTML 文本排版。风格化人物是个人网站形象，不替代真实肖像，也不把临时图形包装为已注册品牌 Logo。参考站提供视觉与交互方向，不复制其人物、作品、履历、客户或身份内容。

## 2. 页面边界

| 页面 | 视觉真源 | 维护要求 |
|---|---|---|
| 个人首页 | `index.html`、`portfolio.css` / `portfolio.js`、`motion.css` / `motion.js`、`toolbox-scene.css` / `toolbox-scene.js` | 黑底紫光、真人比例人物、共同 sticky 介绍、横向作品展与工具球 |
| ReachSurge | `reachsurge/index.html`、`styles.css`、`product.css`、`site.js` | 保留 Alpha / 内测和本地 MCP 事实，不把首页主题强制覆盖产品页 |
| 知识资产激活 | `knowledge/index.html`、`styles.css`、`knowledge/knowledge.css`、相关 JS | 保留现有服务范围、报价、申请方式与隐私边界 |

`home.css` 是旧首页文件。当前首页不加载 `styles.css` / `site.js`，不要把新首页规则塞回子页共享文件。页面特定组件可采用适合各自叙事的字阶和间距，不能用旧首页规则否定本次已批准重构。

## 3. 首页视觉

当前首页颜色由 `portfolio.css` 声明：

```css
--bg: #000000;
--text: #e9e5ed;
--muted: #99939f;
--accent: #b496ed;
--line: #29262e;
--gutter: clamp(24px, 4.5vw, 84px);
```

黑场承担空间，雾白承担信息，淡紫用于重点词、人物轮廓、细线和边缘光。保留暗部和留白，避免给每段内容套发光卡片。子页继续使用 `styles.css` 中既有 SURGE 色彩变量，不因首页改色批量替换。

桌面首屏将中央人物、左侧姓名与右侧角色排成同一场景；英文大字与中文身份有清晰主次。内容区为流体边距、约 1320 px 上限，桌面预留侧边快捷栏。中文保证字形、行高和自然换行，人工断行服务语义，不用紧字距强行挤入宽度。

作品展采用细边界、编号、短介绍与交替的上下图文。每个项目保持名称、价值、适度的状态说明和真实入口；技术限制集中在项目仓库与必要说明，不堆满首页视线。

## 4. 字体与许可证

- 首页展示标题：Clash Display 200–700，由 `portfolio.css` 顶部 `@font-face` 直接加载官方 Fontshare CDN，末尾 `--display` 指定展示字族；不称整页字体自托管。
- 首页英文正文：本地 Geist 可变字体；子页保留 Kanit。
- 中文与混排：Noto Sans SC 100–900 可变字体；首页字体族名为 `Noto`，子页为 `Noto Sans SC`。
- 子页继续加载 Kanit 500 / 600 / 700 / 800 / 900，避免删除仍在使用的字重文件。
- 字体使用 WOFF2、`font-display: swap` 与 `font-synthesis: none`。Geist、Kanit、Noto Sans SC 自托管；Clash Display 依赖官方 Fontshare CDN，加载失败时保留后备字族。
- 固定源为 Google Fonts 官方仓库 [`ea14f3c4`](https://github.com/google/fonts/commit/ea14f3c4c462af1d847b1abe96fcb3c3a8a66f97) 中的 Kanit 与 Noto Sans SC。
- Clash Display 为 Fontshare / ITF 的专有免费字体，适用 `assets/fonts/FFL-ClashDisplay.txt`。仓库不再分发其二进制，不对字体做子集化或修改；复用者应从官方获取自己的副本。完整来源见 [FONT-SOURCES.md](assets/fonts/FONT-SOURCES.md)。
- OFL 许可证随其余字体保留于 `assets/fonts/OFL-Geist.txt`、`assets/fonts/OFL-Kanit.txt` 和 `assets/fonts/OFL-NotoSansSC.txt`。上述固定 Google Fonts 源记录只适用于 Kanit / Noto Sans SC。字体授权不等同于站内图片、视频或品牌授权。

修改页面与脚本文案后，检查字体子集字符覆盖。Noto 子集通过 `scripts/subset-site-fonts.sh` 从固定官方字体源更新；操作方法与最小发布检查见 [README](README.md)。不随意增加展示字体，不伪造未加载字重。

## 5. 交互、动效与降级

- 标题按字母进入，DIRECTOR / CREATOR / BUILDER 按字母轮换；文字的可访问名称保持完整，不让拆字改变朗读含义。
- 桌面宽度 1025 px 起，开启动效时，Hero 与 About 使用同一个 sticky 容器。人物移向左侧，姓名与角色淡出，介绍在同一场景出现。
- 桌面作品区由页面纵向进度推动横向轨道，支持鼠标拖拽；保留上一件、下一件、左右键与焦点跟随。1024 px 及以下采用原生横向滚动与触屏吸附。
- 细指针设备支持光标磁吸与服务悬浮展开；服务继续采用原生 `details`，点击和键盘可用。作品通过 `dialog` 与原生视频控件播放，关闭后恢复焦点。
- 人物左右看由生成视频提取的二维姿态图集呈现，根据指针方向选择帧；它不是可自由旋转的真实 3D 人物模型。坐姿用静音短循环，保留静态图片回退。
- 工具区使用本地 Three.js 构建 24 个球体，支持推动、拖拽、散开与重新聚合；球体为程序生成的三维对象，与人物的二维姿态图集是两种不同实现。工具标签不代表商业合作，MIT 许可保留在 `assets/vendor/three/LICENSE`。
- 默认跟随 `prefers-reduced-motion`，提供动效暂停按钮并保存选择。暂停时停下装饰动画、人物视频、工具球运动和滚动驱动过渡，全部正文和链接保持可达。
- 人物媒体按可见性、页面前后台和节流数据偏好加载/暂停；缺失、失败或未就绪时使用图片。作品视频由用户点击播放。
- CSS、JavaScript 与 WebGL 只作渐进增强。无 JavaScript、WebGL 不可用、reduced-motion、键盘和触屏状态均需能访问文本与项目入口。

动效实现以 `portfolio.css` / `portfolio.js`、`motion.css` / `motion.js`、`toolbox-scene.css` / `toolbox-scene.js` 为准。修改断点、展览、暂停逻辑或图集规格后，检查滚动位置、按钮状态、媒体回退以及桌面与移动端切换。

## 6. 媒体与身份资产

首页媒体的来源和用途以 [assets/portfolio/README.md](assets/portfolio/README.md) 为准；新增媒体同步补充说明。当前角色参考为本人提供的黑色 Polo 肖像，保留成年脸型、五官与身材比例。

| 资产 | 当前用途 | 表述边界 |
|---|---|---|
| `assets/portfolio/erduo-avatar.webp` | 真人比例头像 | 基于本人提供的黑色 Polo 肖像生成，不称真实摄影 |
| `assets/portfolio/erduo-workstation.webp` | 完整工作台场景 | 同一角色方向的生成场景，不当作真实现场记录 |
| `assets/portfolio/erduo-look-atlas.webp` | 头像左右看 | 从生成视频提取的二维姿态图集，不是可自由旋转的 3D 人物模型 |
| `assets/portfolio/erduo-idle.mp4` 与坐姿短循环 | 人物静音轻动态 | VidMuse 生成媒体，坐姿使用静音短循环，保留静态 fallback |
| `assets/portfolio/director-is-me.mp4` 及封面 | 个人创作片段 | 不宣称客户验收或商业效果 |
| `assets/portfolio/broll-showcase.mp4` 及封面 | 已公开 B-roll 项目演示 | 原始 Master 与网页播放分辨率分别说明 |
| `assets/portfolio/social-preview.jpg` | 当前首页社交预览 | 个人网站展示配图 |
| `assets/founder-erduo-2026.webp` | 既有真实身份肖像 | 继续保留摄影事实；新角色以本人提供的黑色 Polo 肖像为参考 |
| `assets/knowledge/knowledge-pulse-final.mp4` | 知识能力概念演示 | 不是客户结果或实际产品界面录屏 |
| `assets/knowledge/founder-knowledge-thinker-abstract-v2.webp` | 知识品牌视觉 | 不包含或象征已公开的私人知识正文 |
| `reachsurge/assets/hero-bg-poster.webp` | 产品抽象网络视觉 | 不代表真实客户分布或流量 |

人物源视频由 VidMuse H3 生成，8 秒、1440p，预计 96 积分。36 个朝向与 6 个眨眼帧组成二维姿态图集；网页循环为 960×960 H.264 静音媒体。媒体已完整解码，指针转头与坐姿播放已在浏览器验证。

既有知识子页的流程、交付物视觉与对应素材继续保留。旧品牌图和二维码可存档；只在具体公开用途成立时重新使用。旧虚拟团队头像不代表真实成员。媒体不能因位于公开仓库就被统一标成 MIT 素材库。

## 7. 七个公开项目的事实边界

状态核验日期为 2026-09-07。完整公开入口见 [README 项目表](README.md#公开项目)；未来更新以对应仓库当前版本、许可和已完成验证为准。

| 项目 | 当前状态与许可 | 对外能力边界 |
|---|---|---|
| IP Strategist | v2.2.0；CC BY-NC 4.0 | 源码开放、限非商业使用，商业使用须另行授权；覆盖私人档案驱动的定位、选题、写稿、增长和复盘，不代运营或替人问责 |
| B-roll Loop Engineering | v1.1.0；MIT | 已发布；主要实测为 macOS + Codex，默认 HyperFrames。不能将 Windows、Claude Code 或双后端视觉效果描述为同等验证，也不保证所有任务节省时间与 Token |
| Video Script Builder | v1.4.0；MIT | 只生成框架绑定的分镜规格，不直接输出 MP4 |
| VidMuse Video Creator | 已公开可安装，有真实交付案例；MIT，无独立 Release | 耳总开发的独立 Agent Skill，获 VidMuse 合作与赞助；平台、官方 CLI、模型服务和品牌属于各自权利人，生成服务费用另计 |
| Agent Knowledge Loop | v0.1.0；MIT | 早期正式发行、本地优先；机器生成待审核候选，人工接受与对外公开分开，不自动公开私人知识 |
| ReachSurge | Alpha；MIT | 本地 stdio MCP，连接外部数据源和邮箱环境；发信默认关闭并需明确确认，不是成熟公网 SaaS 或全自动无人值守获客 |
| Signal Sifter | 公开实验工作流，无 Release / CI；远端未明确完整许可 | 痛点与开源方案交叉匹配，依赖外部源；不标 MIT 或承诺七源开箱即用。仓库名与内部 `gem-hunter` Skill 名不重复计成果 |

IP 演示中的假想数据不能改写为本人或客户业绩；知识系统概念宣传片不能标作 UI 录屏；真实媒体案例也不意味着所有输入都获得同样结果。未公开、未完成的研发项目不伪装成可下载产品。Star、仓库数与版本号是有日期的状态，不推导用户量、营收或商业效果。

## 8. 现有子页与隐私

ReachSurge 子页保留 Alpha / 内测、本地工具与外部依赖说明；不得增加零配置、保证成交或所有部署绝对安全等承诺。知识资产子页按已有确认范围提供服务，不因首页重构调整价格、名额、申请方式或交付条款。

不公开客户原文、私人知识、真实会话、账号凭证、内部任务 ID 或本地私人路径。不使用未获授权的客户标识、人物评价或案例。展示合作伙伴需有真实公开关系，使用过一个工具不等于获得其品牌合作。

## 9. 域名、发布与恢复

- 主站与 canonical：`https://www.erduo.art/`。
- 子页 canonical：`https://www.erduo.art/reachsurge/` 与 `https://www.erduo.art/knowledge/`。
- 裸域 `https://erduo.art/` 经 `vercel.json` 永久跳转到 www。
- Vercel 使用原 GitHub 仓库的根目录静态文件，无构建命令；保留路由、缓存和安全响应头。
- 先完成 [README 最小发布检查](README.md#最小发布检查)，再执行已授权发布；恢复使用对应 Git 提交回退，不把凭据带入网站仓库。
