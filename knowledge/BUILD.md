# 公开知识页构建记录

## 冻结输入

- 公开安全快照：`assets/knowledge/public-knowledge.json`
- SHA-256：`e423c026f22ac202361f64143000b0a4572563d4883c9a391254a9f3ed98e336`
- 条目：100；生成器只消费冻结公开快照顶层白名单内的条目
- 最终视频 SHA-256：`1e916c74afb6f2ef2f1eb7596948cae1621cb07d656703d2317de04a1b5ad7ef`
- Poster SHA-256：`0f9d371577c087779d2d95a2d42188e7373b48fe4671cef79588adab857800f9`

## 可重复生成

```bash
python3 scripts/generate-knowledge-page.py
```

生成器会在写入 `knowledge/index.html` 前核对快照哈希、100 条白名单、公开批准范围、slug 格式、字段白名单，以及绝对路径和内部候选 ID 泄漏。

新增可见文案后，使用官方 Noto Sans SC 可变真源重建中文子集：

```bash
PATH=/path/to/fonttools/bin:$PATH scripts/subset-site-fonts.sh /path/to/NotoSansSC-Variable.ttf
```

本次真源 SHA-256 为 `a3041811a78c361b1de50f953c805e0244951c21c5bd412f7232ef0d899af0da`，生成子集覆盖 `index.html`、`reachsurge/index.html`、`site.js`、`knowledge/index.html` 与 `knowledge/knowledge.js` 的全部字符。
当前子集 SHA-256 为 `6693b717d633aca667bb07d1fc62644b6edf2af36870790844c6f9da19789d2d`。

## 展示边界

- 页面不展示或读取原始文件、绝对路径、内部候选 ID、SHA、locator、私有审核包、具名 actor、内部 decision 或 provenance。
- 公开授权只覆盖安全快照，不代表 internal proposal accepted、knowledge promotion、kernel transaction、旧库迁移或 Mem0 写入。
- 页面保持零构建静态结构；`knowledge.js` 只做渐进增强。关闭 JavaScript 后 100 条内容和详情仍可读。
- 视频不自动播放，使用 `muted`、`playsinline`、原生 controls 和 `preload=metadata`；reduced-motion 不触发自动运动。

## 发布边界

本记录不是提交、推送或部署授权。发布前必须完成内容与代码独立验收。
