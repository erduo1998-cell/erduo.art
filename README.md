# erduo.art

耳朵 ERDUO / 刘冉的个人网站，也是 SURGE / 无限涌动的对外入口。首页围绕影视广告导演、AI 创作者与构建者本人展开，展示合作方向、创作作品、公开工具和联系方式。

线上地址：[www.erduo.art](https://www.erduo.art/)。本次个人站设计更新于 2026-09-07。

## 页面与维护入口

| 路径 | 用途 | 当前代码入口 |
|---|---|---|
| `/` | 个人介绍、服务、经历、作品展、知识资产与项目 | `index.html`、`portfolio.css`、`portfolio.js` |
| `/reachsurge/` | ReachSurge B2B 获客产品介绍；Alpha / 本地 MCP 技术底座 | `reachsurge/index.html`、`styles.css`、`product.css`、`site.js` |
| `/knowledge/` | 创始人知识资产激活计划与申请 | `knowledge/index.html`、`styles.css`、`knowledge/knowledge.css`、`site.js`、`knowledge/knowledge.js` |

新首页独立加载 `portfolio.css` 和 `portfolio.js`。`styles.css` 与 `site.js` 继续服务子页，`home.css` 保留为旧首页资产。旧首页的 SURGE 巨型字标、暗白交替、旗舰项目网格、固定年限和预发布链接要求，不再约束新首页。

[brand-spec.md](brand-spec.md) 记录当前视觉与事实边界；[docs/portfolio-design.md](docs/portfolio-design.md) 记录本次设计；[assets/portfolio/README.md](assets/portfolio/README.md) 是首页媒体来源、用途和生成性质的说明。

## 首页设计与交互

- 黑底、雾白文字与淡紫光，以风格化人物和英文身份大字构成首屏；个人是主角，SURGE 是品牌归属。
- 桌面介绍采用共同 sticky 容器：人物随滚动移向一侧，关于文字在同一场景中出现。移动端按文档流排列。
- 作品采用横向展览与交替图文。桌面动效开启时由纵向滚动推动展览；移动端、暂停动效和未增强状态使用原生横向滚动。
- 作品支持前后按钮、左右方向键和点击播放；视频弹层保留原生播放控件。正文、项目和链接直接保存在语义 HTML 中。
- 遵循 `prefers-reduced-motion`，并提供全局动效暂停按钮。首屏静音视频按可见性、暂停状态和节流数据偏好启停，无法播放时保留图片。
- 关闭 JavaScript 后，介绍、服务、作品信息和链接仍可阅读；动效不能成为获取信息的前提。

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
brand-spec.md             视觉规范、产品状态与内容边界
assets/portfolio/         本次人物、作品视频、封面与媒体来源说明
assets/fonts/             自托管 Kanit / Noto Sans SC 与 OFL 许可证
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
2. 首页样式与交互只在 `portfolio.css` / `portfolio.js` 维护；修改共享子页代码时，验证 `/reachsurge/` 与 `/knowledge/`。
3. 保护作品来源说明；生成形象不当作真实摄影，概念动画不当作产品录屏，技术演示不当作客户验收。
4. 项目状态、许可和链接以公开仓库为准。ReachSurge 保留 Alpha、本地运行、确认后发送的边界；IP Strategist v2 不称为无限制免费商用。
5. 知识资产子页保留已确认的服务范围、价格与申请入口；不因首页重构修改报价，也不公开客户原文、私人资料或内部 ID。
6. 不恢复旧 Token 代理、虚拟高管阵容或个人手机号；大型图片不转成 HTML 内联 base64。保护既有公开媒体，不进行无关重压缩。

## 字体来源与更新

页面使用自托管字体，不依赖 Google Fonts CDN。字体源固定来自 Google Fonts 官方仓库 [`ea14f3c4`](https://github.com/google/fonts/commit/ea14f3c4c462af1d847b1abe96fcb3c3a8a66f97)：[Kanit](https://github.com/google/fonts/tree/ea14f3c4c462af1d847b1abe96fcb3c3a8a66f97/ofl/kanit) 与 [Noto Sans SC](https://github.com/google/fonts/tree/ea14f3c4c462af1d847b1abe96fcb3c3a8a66f97/ofl/notosanssc)。

首页实际加载 Kanit 500 / 700，用于英文与数字；中文和混排使用 Noto Sans SC 100–900 可变字重，首页 CSS 字体名为 `Noto`。子页保留原有 Kanit 500 / 600 / 700 / 800 / 900。两家字体均使用 WOFF2、`font-display: swap` 与 `font-synthesis: none`。

许可证保留在 `assets/fonts/OFL-Kanit.txt` 与 `assets/fonts/OFL-NotoSansSC.txt`。修改可见文案后，检查新字符是否在子集中；需要更新 Noto 时，以固定官方源运行：

```bash
sh scripts/subset-site-fonts.sh /path/to/NotoSansSC-Variable.ttf
```

脚本汇总首页、两个子页和相应脚本的文本。发布前确认没有缺字，字体离线仍能从 `/assets/fonts/` 加载；不要从第三方字体站替换来源或仅改文件名沿用旧子集。

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
