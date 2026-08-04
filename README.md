# erduo.art

SURGE / 无限涌动官网与 ReachSurge 产品页。网站用于说明公司使命、真实业务能力、开源项目、研发边界与联系方式。

线上地址：<https://www.erduo.art/>

## 页面

- `/`：SURGE 公司品牌首页。
- `/reachsurge/`：ReachSurge B2B 获客智能体产品页；当前口径为“内测产品 / 开源 MCP 技术底座”。

## 本地预览

这是零构建静态站。不要直接双击 HTML；根路径资源需要本地 HTTP 服务。

```bash
python3 -m http.server 4173
```

打开 <http://127.0.0.1:4173/>。

## 文件结构

```text
index.html                 首页语义内容与 SEO
styles.css                SURGE 共享视觉系统与响应式
site.js                   菜单、header、入场和肖像轻动效
brand-spec.md             品牌资产、tokens 与事实边界
robots.txt                搜索引擎规则
sitemap.xml               首页与 ReachSurge 索引
vercel.json               Vercel 静态部署、www 跳转与安全头
assets/                   首页本地图片
reachsurge/index.html     ReachSurge 产品页
```

## 修改规则

1. 先读 `brand-spec.md`，沿用颜色、字体、间距、资产和动效语言。
2. 不恢复旧报价、Token 代理、“硅基军团”虚拟高管或个人手机号。
3. 不用愿景冒充完成状态；项目成熟度必须保留“可用 / 内测 / 预发布 / 实验室”。
4. 首页项目数据写在语义 HTML 中；JavaScript 只做渐进增强。
5. 不再把大型图片转成 base64，不加载 `assets/agents/agent-*.png`。
6. ReachSurge 首页与子页必须同步事实边界，不能出现“零配置、全自动无人值守、所有数据绝对安全”等未普遍验证承诺。

## 发布前检查

```bash
git diff --check
node --check site.js
python3 -m http.server 4173
```

人工检查至少覆盖 375×812、768×1024、1440×900 和 reduced-motion。确认：

- 首页与 `/reachsurge/` 无 404；
- 菜单、锚点、外链和邮件链接可用；
- 控制台无错误；
- 320 px 到大屏无横向滚动或文字遮挡；
- 首页只有一个 H1；
- 关闭 JavaScript 后内容和链接仍完整可读。

## 部署

Vercel 直接发布仓库根目录，不需要构建命令。`vercel.json` 会把裸域 `erduo.art` 永久跳转到 `www.erduo.art`，并为静态资源添加缓存与基础安全响应头。

远端发布、域名绑定和 DNS 仍以 Vercel 项目设置为准。不要把访问令牌写进仓库。
