# erduo.art

耳朵 ERDUO / 刘冉的个人网站，也是 SURGE / 无限涌动的对外入口。首页围绕影视广告导演、AI 创作者与构建者本人展开，展示合作方向、创作作品、公开工具和联系方式。

线上地址：[www.erduo.art](https://www.erduo.art/)。本次个人站设计更新于 2026-09-07。

## 页面与维护入口

| 路径 | 用途 | 当前代码入口 |
|---|---|---|
| `/` | 个人介绍、服务、经历、作品展、知识资产与项目 | `index.html`、`portfolio.css`、`portfolio.js`、`motion.css` / `motion.js`、`toolbox-scene.css` / `toolbox-scene.js` |
| `/reachsurge/` | ReachSurge B2B 获客产品介绍；Alpha / 本地 MCP 技术底座 | `reachsurge/index.html`、`styles.css`、`product.css`、`site.js` |
| `/knowledge/` | 创始人知识资产激活计划与申请 | `knowledge/index.html`、`styles.css`、`knowledge/knowledge.css`、`site.js`、`knowledge/knowledge.js` |

新首页独立加载 `portfolio.css` / `portfolio.js`，v2 交互由 `motion.css` / `motion.js` 与 `toolbox-scene.css` / `toolbox-scene.js` 增强。`styles.css` 与 `site.js` 继续服务子页，`home.css` 保留为旧首页资产。旧首页的 SURGE 巨型字标、暗白交替、旗舰项目网格、固定年限和预发布链接要求，不再约束新首页。

[brand-spec.md](brand-spec.md) 记录当前视觉与事实边界；[docs/portfolio-design.md](docs/portfolio-design.md) 记录本次设计；[assets/portfolio/README.md](assets/portfolio/README.md) 是首页媒体来源、用途和生成性质的说明。

## 首页设计与交互

- 黑底、雾白文字与淡紫光，以真人比例的生成角色和英文身份大字构成首屏。人物参考为本人提供的黑色 Polo 肖像，保持成年脸型和身材比例。
- 标题逐字进入，DIRECTOR / CREATOR / BUILDER 按字母轮换；细指针设备支持光标磁吸，服务条目悬浮展开并保留点击、键盘操作。
- 桌面介绍采用共同 sticky 容器：人物随滚动移向一侧，关于文字在同一场景出现。移动端按文档流排列。
- 头像左右看使用生成视频提取的姿态图集，根据指针方向选帧；这是二维媒体交互，不是可自由旋转的 3D 人物模型。坐姿使用静音短循环，图片始终作为回退。
- 作品采用横向展览与交替图文。桌面动效开启时由纵向滚动推动展览，支持鼠标拖拽、前后按钮、方向键与点击播放；移动端、暂停动效和未增强状态使用原生横向滚动。
- 工具区以本地 Three.js 渲染 24 个工具球，支持推动、拖拽、散开与重新聚合；工具名称代表使用与方法，不表示品牌合作。Three.js MIT 许可随本地副本保留。
- 视频弹层保留原生播放控件。正文、项目和链接直接保存在语义 HTML 中；无 JavaScript 或 WebGL 不可用时仍可阅读文字与使用链接。
- 遵循 `prefers-reduced-motion`，提供全局动效暂停按钮。人物动态按可见性、暂停状态和节流数据偏好启停，未就绪或失败时使用图片。

人物源视频由 VidMuse H3 生成，8 秒、1440p，预计 96 积分。网页使用 36 个朝向与 6 个眨眼帧的图集、960×960 的静音循环；媒体已完整解码，桌面鼠标跟随与坐姿播放已在浏览器验证。来源详见 [媒体说明](assets/portfolio/README.md)。

## 本地预览

这是零构建静态站。根路径资源需通过 HTTP 服务预览：

```bash
python3 -m http.server 4173
```

打开 [本地首页](http://127.0.0.1:4173/)，并检查两个正式子页。

## 目录

```text
index.html                个人首页内容、元信息与结构化数据
portfolio.css             首页字体、颜色、布局、响应式与动效样式
portfolio.js              首页渐进增强、展览、动效开关与视频弹层
motion.css / motion.js    字母动效、磁吸光标、姿态选帧、悬浮与拖拽
toolbox-scene.css / .js    24 个 Three.js 工具球与文字降级
assets/vendor/three/      本地 Three.js 运行库及 MIT 许可证
brand-spec.md             视觉规范、产品状态与内容边界
assets/portfolio/         本次人物、作品视频、封面与媒体来源说明
assets/fonts/             本地字体、Clash Display FFL、OFL 与字体来源记录
styles.css / site.js      现有子页共享样式与交互
home.css                  旧首页样式，当前首页不加载
product.css               ReachSurge 子页样式
reachsurge/               ReachSurge 页面与既有媒体
knowledge/                知识资产激活页面、样式与交互
assets/knowledge/         已有知识资产产品视觉与概念媒体
scripts/                  字体子集工具及既有知识页维护脚本
robots.txt / sitemap.xml  搜索引擎规则与三个正式页面索引
vercel.json               静态部署、主域跳转与响应头
```

## 公开项目

核验基线为 2026-09-07；新版本或许可变化需重新核对对应公开仓库。作品展里的创作片段、概念演示与以下产品不是同一种成果，不混作客户案例。

| 项目 | 成熟度 | 许可 |
|---|---|---|
| [IP Strategist](https://github.com/erduo1998-cell/ip-strategist) | v2.2.0 已发布 | CC BY-NC 4.0；源码开放，商业使用需另行授权 |
| [B-roll Loop Engineering](https://github.com/erduo1998-cell/erduo-broll-loop-engineering) | v1.1.0 已发布；主要实测为 macOS + Codex | MIT |
| [Video Script Builder](https://github.com/erduo1998-cell/video-script-builder) | v1.4.0 已发布；交付分镜规格 | MIT |
| [VidMuse Video Creator](https://github.com/erduo1998-cell/vidmuse-video-creator) | 已公开可安装，有真实媒体交付案例；无独立 Release | MIT；平台与品牌权利另计 |
| [Agent Knowledge Loop](https://github.com/erduo1998-cell/agent-knowledge-loop) | 首个正式版本 v0.1.0 | MIT |
| [ReachSurge](https://github.com/erduo1998-cell/reachsurge) | Alpha；本地 stdio MCP | MIT |
| [Signal Sifter](https://github.com/erduo1998-cell/signal-sifter) | 公开实验工作流；无 Release / CI | 当前远端未声明完整许可，不标 MIT |

## 修改规则

1. 首页身份统一为耳朵 / 刘冉，履历年限使用已确认的“十余年”。不编造客户 Logo、业绩、评价、团队成员或真实界面。
2. 首页样式与交互在 `portfolio.css` / `portfolio.js`、`motion.css` / `motion.js` 和 `toolbox-scene.css` / `toolbox-scene.js` 维护；修改共享子页代码时，验证 `/reachsurge/` 与 `/knowledge/`。
3. 保护作品来源说明；生成形象不当作真实摄影，概念动画不当作产品录屏，技术演示不当作客户验收。
4. 项目状态、许可和链接以公开仓库为准。ReachSurge 保留 Alpha、本地运行、确认后发送的边界；IP Strategist v2 不称为无限制免费商用。
5. 知识资产子页保留已确认的服务范围、价格与申请入口；不因首页重构修改报价，也不公开客户原文、私人资料或内部 ID。
6. 不恢复旧 Token 代理、虚拟高管阵容或个人手机号；大型图片不转成 HTML 内联 base64。保护既有公开媒体，不进行无关重压缩。

## 字体来源与更新

首页展示标题使用 Clash Display，由 `portfolio.css` 的 `@font-face` 直接加载官方 Fontshare CDN，`--display` 指定其展示字族；它不是仓库内自托管字体。正文英文使用本地 Geist，中文使用本地 Noto Sans SC。完整来源见 [FONT-SOURCES.md](assets/fonts/FONT-SOURCES.md)。

既有 Kanit 与 Noto Sans SC 的字体源固定来自 Google Fonts 官方仓库 [`ea14f3c4`](https://github.com/google/fonts/commit/ea14f3c4c462af1d847b1abe96fcb3c3a8a66f97)：[Kanit](https://github.com/google/fonts/tree/ea14f3c4c462af1d847b1abe96fcb3c3a8a66f97/ofl/kanit) 与 [Noto Sans SC](https://github.com/google/fonts/tree/ea14f3c4c462af1d847b1abe96fcb3c3a8a66f97/ofl/notosanssc)。

首页展示字采用 Clash Display 200–700 可变字体，英文正文采用本地 Geist；中文和混排使用 Noto Sans SC 100–900 可变字重，首页 CSS 字体名为 `Noto`。子页保留原有 Kanit 500 / 600 / 700 / 800 / 900。页面字体均使用 WOFF2、`font-display: swap` 与 `font-synthesis: none`。

Clash Display 是 Fontshare / ITF 的专有免费字体，FFL 许可保留在 `assets/fonts/FFL-ClashDisplay.txt`；仓库不再分发其字体二进制，不对其做子集化或修改。复用站点时应自行从 Fontshare 获取字体。其余许可证保留在 `assets/fonts/OFL-Geist.txt`、`assets/fonts/OFL-Kanit.txt` 与 `assets/fonts/OFL-NotoSansSC.txt`；上面的 Google Fonts 固定源记录适用于 Kanit / Noto Sans SC，不套用于 Geist。修改可见文案后，检查新字符是否在子集中；需要更新 Noto 时，以固定官方源运行：

```bash
sh scripts/subset-site-fonts.sh /path/to/NotoSansSC-Variable.ttf
```

脚本汇总首页、两个子页和相应脚本的文本。发布前确认没有缺字、本地字体能从 `/assets/fonts/` 加载；Clash Display 需要访问官方 Fontshare CDN，断网或加载失败时应正常回退到后备字族；不要从第三方字体站替换来源或仅改文件名沿用旧子集。

## 最小发布检查

```bash
git diff --check
node --check portfolio.js
node --check site.js
node --check knowledge/knowledge.js
python3 -m http.server 4173
```

浏览器检查手机、平板、桌面与大屏，至少覆盖 375×812、768×1024、1440×900，以及 reduced-motion、动效暂停和无 JavaScript 状态。确认：

- 首页、`/reachsurge/`、`/knowledge/` 与图片、字体、视频无 404，控制台无新增错误。
- 首页只有一个 H1；导航、联系方式、项目入口、键盘焦点、视频关闭和播放正常。
- 桌面共同 sticky 场景与横向展览衔接自然；移动作品可原生横滑，页面本身没有意外横向溢出。
- 关闭或暂停动效后全部内容可达；字体、头像和文字在窄屏不遮挡。

`scripts/generate-knowledge-page.py` 与相关旧校验脚本属于既有知识页维护流程，不是首页通用发布门。使用前先核对其输入、输出和当前子页契约，避免生成旧页面或以旧标题、导航文字约束新首页。

## 部署与恢复

Vercel 从原 GitHub 仓库发布根目录静态文件，不需要构建命令。`vercel.json` 保留尾斜杠规则，将裸域 `erduo.art` 永久重定向到 `https://www.erduo.art/`，并配置静态资源缓存与基础安全响应头。域名绑定和实际部署状态以 Vercel 项目设置为准。

发布前完成上述检查；通过回退对应 Git 提交可恢复上一版。不要将访问令牌、账号会话或私人工作路径写入仓库。
