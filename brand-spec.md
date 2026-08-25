# SURGE / 无限涌动品牌规格

更新日期：2026-08-05

本文件是 `erduo.art` 首页与产品子页的品牌事实源。页面扩展时优先沿用这里的资产、颜色、字体和动效，不额外制造一套“通用 AI 科技风”。

## 1. 品牌定位

- 品牌：`SURGE / 无限涌动`
- 主命题：`让 AI 从“会回答”，走到“把事情做完”。`
- 支撑命题：`把人的判断，变成能持续工作的 AI 系统。`
- 品牌公式：`碳基的判断 × 硅基的执行。`
- 语气：克制、直接、可信；区分已经可用、内测、预发布和正在构建。

## 2. 正式品牌资产

本项目没有独立图形 Logo。正式字标是文字组合 `SURGE` + `无限涌动`，使用 HTML 文本排版，不以临时 SVG 或 CSS 图形冒充 Logo。

| 资产 | 路径 | 用途 | 约束 |
|---|---|---|---|
| Hero 品牌肖像 | `assets/hero-portrait.webp` | 仅用于首页 Hero | 591×640；风格化人物视觉，不作为 Founder 正式照片复用；Hero 高优先加载 |
| Founder 真实肖像 | `assets/founder-erduo-2026.webp` | 首页 Founder | 1600×2400 WebP；保留完整 2:3 真源，页面以 4:5、`object-position: 50% 26%` 和 1.2× 编辑式胸腰裁切并 lazy load |
| 社交预览 | `assets/social-preview.jpg` | Open Graph / Twitter Card | 1200×630，由现有正式品牌视觉裁切，不是虚构产品截图 |
| 原始社交视觉 | `hero-poster.png` | 社交预览真源与历史资产 | 文件较大，不在页面正文加载 |
| 商务微信二维码 | `assets/qrcode.jpg` | 当前首页不展示，保留备用 | 只有明确需要公开商务微信时才加载 |
| ReachSurge 本地数据视觉 | `reachsurge/assets/data-local.webp` | 产品资料备用 | 不当作真实界面截图或安全证明 |
| 知识激活抽象思考者 | `assets/knowledge/founder-knowledge-thinker-abstract-v2.webp` | `/knowledge/` 首屏背景 | Codex 内置生图生成；无脸、非写实人物融入黑场，不作为独立图片卡片 |
| 知识激活流程视觉 | `assets/knowledge/knowledge-activation-process-abstract-v2.webp` | `/knowledge/` 激活流程 | Codex 内置生图生成；资料、判断核心与 Agent 节点形成连续无真人场景 |
| 知识激活交付物视觉 | `assets/knowledge/knowledge-activation-deliverables-integrated-v2.webp` | `/knowledge/` 交付物 | Codex 内置生图生成；档案、工作台与验证文件直接融入暖白纸面背景 |

以下旧资产不再由新版页面加载：

- `assets/agents/agent-*.png`：旧“硅基军团”拟人头像，不代表真实团队或项目。
- `reachsurge/assets/*.mp4` 与 `agent-3d.webp`：旧产品页氛围资产，不作为能力证明。
- `assets/marquee/livephoto-02.jpg`：体积过大，未优化前不得恢复加载。

## 3. 颜色系统

颜色由 `styles.css` 的 CSS custom properties 统一声明：

```css
--surge-bg: #0C0C0C;
--surge-surface: #161616;
--surge-paper: #FFFFFF;
--surge-text: #D7E2EA;
--surge-ink: #0C0C0C;
--surge-metal-dark: #646973;
--surge-metal-light: #BBCCD7;
--surge-metal-gradient: linear-gradient(180deg, #646973 0%, #BBCCD7 100%);
--surge-accent-gradient: linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%);
```

使用比例：暗色约 70%，冷白/金属灰约 25%，紫橙签名渐变不超过 5%。渐变只用于主按钮、细光带和少量状态，不铺满大背景或所有卡片。

## 4. 字体

- 纯英文与数字展示：Kanit，只加载 500 / 600 / 700 / 800 / 900。
- 中文、正文与中英混排：Noto Sans SC，只加载 400 / 500 / 700。
- 中文展示标题固定 700，字距不得紧于 `-0.02em`，行高使用 1.08–1.16；Kanit 纯英文大字才可使用更紧字距和 0.86 左右行高。
- 全站使用 `font-synthesis: none`，不允许浏览器伪造未加载字重。
- 字体由本站自托管，不依赖 Google Fonts CDN；源文件固定为 Google Fonts 官方仓库 [`ea14f3c4`](https://github.com/google/fonts/commit/ea14f3c4c462af1d847b1abe96fcb3c3a8a66f97) 版本的 [Kanit](https://github.com/google/fonts/tree/ea14f3c4c462af1d847b1abe96fcb3c3a8a66f97/ofl/kanit) 与 [Noto Sans SC](https://github.com/google/fonts/tree/ea14f3c4c462af1d847b1abe96fcb3c3a8a66f97/ofl/notosanssc)，以 WOFF2 和 `font-display: swap` 加载。
- Kanit 分别保存 500 / 600 / 700 / 800 / 900 静态子集；Noto Sans SC 保存 100–900 可变字重子集。两份 OFL 许可证随字体保存在 `assets/fonts/`。
- 子集字符来自 `index.html`、`reachsurge/index.html`、`site.js` 当前文本，加基础 ASCII 和常用中英文标点。以上文件新增可见文案后必须由固定官方源重新生成并做字符覆盖检查；系统 fallback 依次包含 PingFang SC、Hiragino Sans GB、Microsoft YaHei 与平台 sans-serif。
- 字体总数不超过两家；不使用 Inter、Roboto、Arial 作为展示字体。

## 5. 结构与版式

- 主要观看距离：手机 10–30 cm、笔记本 50–100 cm。
- 内容宽度：连续流体 gutter 内的 1280 px 上限，断点处不得突跳；正文保持较短阅读线。
- 基础间距：8 px；`--space-1` 至 `--space-8` 对应 8 / 16 / 24 / 32 / 48 / 64 / 96 / 128 px，页面 gutter 连续流动在 20–64 px。
- 字阶只使用 7 个 token：label、body、lead、h3、h2、display、latin-xl；页面组件不得另造一次性字号。
- 普通 section 的纵向节奏为 80–136 px；信息型 section 可以使用更紧的 64–96 px，不用空白强行撑成整屏。
- 大区采用整页 slab、暗白交替和 32–64 px 大圆角。
- 普通信息以细线、留白和编辑式排版组织，不把每段文字装进小圆角卡片。
- 首页 Hero 的唯一大标题是文字品牌锁定 `SURGE / 无限涌动`：`SURGE` 为 Kanit 900 前景主焦点，中文品牌名使用 Noto Sans SC 700；使命句不放在 Hero 与品牌争夺层级。
- 主命题 `让 AI 从“会回答”，走到“把事情做完”。` 归属 Mission 区并作为该区 H2 第一焦点；`不是更多对话窗口，而是一套真正能完成工作的 Agent 系统。` 是较小的支撑命题。
- Hero 风格化肖像只服务首屏品牌氛围，Founder 区必须使用真实正式照片；桌面 Hero 品牌与肖像分栏，移动肖像不得覆盖品牌字标。
- 标题人工断行必须以完整语义行为单位，并提供无重复朗读的 `aria-label`；禁止裸 `<br>` 与 `text-wrap: balance` 叠加。
- 项目卡只展示：项目名、成熟度、价值、系统角色、边界、真实入口。ReachSurge 是旗舰大卡，其余三个项目使用紧凑网格，不使用伪 sticky 长滚动。

## 6. 动效

- 区块入场：透明度 + 28 px 上移，680 ms，`cubic-bezier(.25,.1,.25,1)`。
- 微交互：180–220 ms。
- 肖像轻量跟随：仅桌面精细指针，水平不超过 12 px、垂直不超过 8 px。
- 项目区使用普通文档流；除非未来重构为共同 sticky 容器并完成实机验证，否则不恢复逐卡 sticky slot。
- 不使用打字机、逐字符滚动揭示、首屏自动播放视频或 `scrollIntoView`。

## 7. 内容真实性

- `ReachSurge`：内测产品 / 开源技术底座，不描述为成熟 SaaS、零配置或全自动无人值守。
- `ip-strategist`：开源可用，不承诺替代真人问责、代运营、投放或直播执行。
- `Video Script Builder`：开源可用，只生成分镜规格，不直接渲染 MP4。
- `HyperFrames B-roll`：预发布 / 实验室，未完成的真实双端到端与 GUI 验证必须保留。
- 不使用虚构客户 Logo、评价、统计、产品界面、团队成员或案例结果。

## 8. 域名与部署

- 主域名与 canonical：`https://www.erduo.art/`
- 裸域：`https://erduo.art/` 永久重定向到 `www`。
- ReachSurge canonical：`https://www.erduo.art/reachsurge/`
- 网站保持零构建静态文件，可由 Vercel 托管，也可直接由普通静态服务器预览。
