# erduo.art

SURGE / 无限涌动官网与 ReachSurge 产品页。网站用于说明公司使命、真实业务能力、开源项目、研发边界与联系方式。

线上地址：<https://www.erduo.art/>

## 页面

- `/`：SURGE 公司品牌首页。
- `/reachsurge/`：ReachSurge B2B 获客智能体产品页；当前口径为“内测产品 / 开源 MCP 技术底座”。
- `/knowledge/`：创始人知识资产激活计划客户介绍与申请页面。

## 本地预览

这是零构建静态站。不要直接双击 HTML；根路径资源需要本地 HTTP 服务。

```bash
python3 -m http.server 4173
```

打开 <http://127.0.0.1:4173/>。

## 文件结构

```text
index.html                 首页语义内容与 SEO
styles.css                字体、颜色、type/space tokens 与共享组件
home.css                  首页布局及其响应式规则
product.css               ReachSurge 产品页布局及其响应式规则
site.js                   菜单、header、入场和肖像轻动效
brand-spec.md             品牌资产、tokens 与事实边界
robots.txt                搜索引擎规则
sitemap.xml               首页与 ReachSurge 索引
vercel.json               Vercel 静态部署、www 跳转与安全头
assets/                   首页本地图片与自托管字体
assets/fonts/             Kanit / Noto Sans SC 子集及 OFL 许可证
reachsurge/index.html     ReachSurge 产品页
knowledge/index.html      创始人知识资产激活计划正式页面
knowledge/knowledge.css   产品页布局、光场与响应式规则
knowledge/knowledge.js    菜单与光场渐进增强
assets/knowledge/         产品视觉与历史公开知识资产
scripts/                  知识页生成、字体子集与验证脚本
```

## 修改规则

1. 先读 `brand-spec.md`，沿用颜色、字体、间距、资产和动效语言。
2. 不恢复旧报价、Token 代理、“硅基军团”虚拟高管或个人手机号。
3. 不用愿景冒充完成状态；项目成熟度必须保留“可用 / 内测 / 预发布 / 实验室”。
4. 首页项目数据写在语义 HTML 中；JavaScript 只做渐进增强。
5. 不再把大型图片转成 base64，不加载 `assets/agents/agent-*.png`。
6. ReachSurge 首页与子页必须同步事实边界，不能出现“零配置、全自动无人值守、所有数据绝对安全”等未普遍验证承诺。
7. 中文与中英混排使用 Noto Sans SC；Kanit 只用于纯英文或数字展示。不要新增未加载字重或在中文标题上使用紧于 `-0.02em` 的字距。
8. 标题需要人工断行时使用带 `aria-label` 的 `.heading-layout` / `.display-line`，不要把裸 `<br>` 与自动 balance 混用。
9. 共享 token 和组件放在 `styles.css`；首页、产品页专属规则分别放在 `home.css`、`product.css`，媒体规则跟随所属页面文件。
10. 知识资产产品页不公开客户原文、私人资料、内部 ID 或未经确认的效果主张。

## 字体来源与维护

页面不依赖 Google Fonts CDN。字体源文件来自 Google Fonts 官方仓库固定版本 [`ea14f3c4`](https://github.com/google/fonts/commit/ea14f3c4c462af1d847b1abe96fcb3c3a8a66f97)：

- [Kanit 官方目录](https://github.com/google/fonts/tree/ea14f3c4c462af1d847b1abe96fcb3c3a8a66f97/ofl/kanit)，页面使用 500 / 600 / 700 / 800 / 900 五个静态字重；
- [Noto Sans SC 官方目录](https://github.com/google/fonts/tree/ea14f3c4c462af1d847b1abe96fcb3c3a8a66f97/ofl/notosanssc)，页面使用 100–900 可变字重文件；
- 许可证随资产保存在 `assets/fonts/OFL-Kanit.txt` 和 `assets/fonts/OFL-NotoSansSC.txt`。

仓库中的 WOFF2 是按 `index.html`、`reachsurge/index.html`、`site.js` 当前文本，加上基础 ASCII 与常用中英文标点制作的子集。修改这些文件中的可见文案后，必须从上述固定官方源重新生成子集，并检查新字符是否完整覆盖；不要直接从第三方字体站点下载，也不要只修改文件名沿用旧子集。发布前应在屏蔽外部网络时确认字体仍从 `/assets/fonts/` 加载，且实际渲染字体为 Kanit 与 Noto Sans SC。

## 发布前检查

```bash
git diff --check
node --check site.js
node --check knowledge/knowledge.js
python3 scripts/generate-knowledge-page.py
python3 scripts/validate-knowledge-page.py
python3 -m http.server 4173
```

人工检查至少覆盖 375×812、768×1024、1440×900、1920×1080 和 reduced-motion。确认：

- 首页与 `/reachsurge/` 无 404；
- 菜单、锚点、外链和邮件链接可用；
- 控制台无错误；
- 320 px 到大屏无横向滚动或文字遮挡；
- 首页只有一个 H1；
- 关闭 JavaScript 后内容和链接仍完整可读。

## 部署

Vercel 直接发布仓库根目录，不需要构建命令。`vercel.json` 会把裸域 `erduo.art` 永久跳转到 `www.erduo.art`，并为静态资源添加缓存与基础安全响应头。

远端发布、域名绑定和 DNS 仍以 Vercel 项目设置为准。不要把访问令牌写进仓库。
