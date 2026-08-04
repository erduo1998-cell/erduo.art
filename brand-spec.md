# SURGE / 无限涌动品牌规格

更新日期：2026-08-04

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
| 创始人主肖像 | `assets/hero-portrait.webp` | 首页 Hero 与 Founder | 591×640；Hero 高优先加载，第二处 lazy load |
| 社交预览 | `assets/social-preview.jpg` | Open Graph / Twitter Card | 1200×630，由现有正式品牌视觉裁切，不是虚构产品截图 |
| 原始社交视觉 | `hero-poster.png` | 社交预览真源与历史资产 | 文件较大，不在页面正文加载 |
| 商务微信二维码 | `assets/qrcode.jpg` | 当前首页不展示，保留备用 | 只有明确需要公开商务微信时才加载 |
| ReachSurge 本地数据视觉 | `reachsurge/assets/data-local.webp` | 产品资料备用 | 不当作真实界面截图或安全证明 |

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

- 英文展示：Kanit，300–900。
- 中文标题与正文：Noto Sans SC，300–900。
- 字体来源：Google Fonts，保留 `display=swap` 和 preconnect。
- 字体总数不超过两家；不使用 Inter、Roboto、Arial 作为展示字体。

## 5. 结构与版式

- 主要观看距离：手机 10–30 cm、笔记本 50–100 cm。
- 内容宽度：1280 px；大屏最多 1360 px，正文保持较短阅读线。
- 基础间距：8 px；页面 gutter 使用流体值 20–64 px。
- 大区采用整页 slab、暗白交替和 32–64 px 大圆角。
- 普通信息以细线、留白和编辑式排版组织，不把每段文字装进小圆角卡片。
- 首页 Hero 使用超大 SURGE 字标、真实人物肖像、H1 三层景深。
- 项目卡只展示：项目名、成熟度、价值、系统角色、边界、真实入口。

## 6. 动效

- 区块入场：透明度 + 28 px 上移，680 ms，`cubic-bezier(.25,.1,.25,1)`。
- 微交互：180–220 ms。
- 肖像轻量跟随：仅桌面精细指针，水平不超过 12 px、垂直不超过 8 px。
- 项目 sticky stacking：仅 1024 px 以上；移动端与 reduced-motion 下恢复普通文档流。
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
