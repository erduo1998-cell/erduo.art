# 让你的 Agent 读取无限涌动会员资料

> 当前状态（2026-10-08）：正式 Agent 接入页、MCP 和 OAuth 已启用，站内资料辅导入口已开放。正常 DNS 与指定 IP 两路 HTTPS 各 147 项检查通过，发布资产 SHA 校验一致；这不代表六种客户端都完成了真人授权验收。

用自己的会员账号在网站授权后，Agent 可以检索你当前有权阅读的资料、引用原件并指导完成任务。允许记录进度后，还能接着上次任务继续。

- [连接 MCP](MCP.md)：让支持远程 MCP 和 OAuth 的 Agent 直接调用网站工具。
- [使用 CLI](CLI.md)：MCP 不可用时，以 Python 客户端连接；也适合核验下载文件。
- [安装 Skill](../skills/surge-member/SKILL.md)：给 Agent 按任务查资料、回源和记录进度的工作方法。
- [打开 Agent 接入页](https://login.erduo.art/agent/)：选择工具、查看接入说明及管理连接。
- [使用站内资料辅导](https://login.erduo.art/tutor/)：无需配置外部 Agent，按有权资料开始或继续自己的任务。

MCP 负责连接和工具调用，Skill 负责使用方法，CLI 是备用客户端。三者都沿用同一会员权限；安装任何一个都不会自动开通会员、增加课程权益或获得管理权限。

## 最快开始

1. 在 Agent 客户端添加远程 MCP：`https://login.erduo.art/mcp`，按网页提示完成会员授权。具体客户端配置见 [MCP](MCP.md)。
2. 可选安装 Skill；在终端运行以下命令，按安装器提示选择当前 Agent 和安装范围：

   ```bash
   npx skills add erduo1998-cell/erduo.art --skill surge-member
   ```

   也支持直接指定 [Skill 子目录](https://github.com/erduo1998-cell/erduo.art/tree/main/skills/surge-member)：

   ```bash
   npx skills add https://github.com/erduo1998-cell/erduo.art/tree/main/skills/surge-member
   ```

   命令格式依据 [Vercel Skills 官方说明](https://github.com/vercel-labs/skills/blob/main/README.md)。需要 Node.js/npm；可先查看源码，已有同名技能时先核对再更新，不盲目覆盖本地修改。也可请自己的 Agent 按其官方技能目录安装整个 `skills/surge-member/` 文件夹，保留 `scripts/`。
3. 告诉 Agent 一个具体任务，例如：

   > 使用 surge-member，先查看我有权访问的资料。我想完成自己的第一个项目，请先查对应入门手册，按步骤指导，每一步说明预期结果和检查方法，并引用资料版本。不要把建议写成已完成。

没有可用 MCP 时直接按 [CLI](CLI.md) 执行网页登录授权，不需要把账号密码交给 Agent。

## 能做什么

| 任务 | 行为 |
| --- | --- |
| 查找资料 | 只搜索当前账号有权访问且已发布的版本 |
| 阅读与解释 | 正文、可抽取的附件文本及已有指南；带章节、页码或时间定位 |
| 获取原件 | 下载当前有权附件；CLI 核对长度和 SHA256，保留原文件 |
| 继续任务 | 在 `member:progress` 授权下保存本人的任务和实际进度 |

资料索引仍在持续处理，尚未宣称全量完成。PDF/OCR、音频识别、视频抽帧和 ZIP 文本索引存在覆盖限制，以每次返回的 `readability`、索引状态和警告为准。扫描和抽取不等于完整理解所有画面。独立付费课程仍须具有对应权益；未发布、已下架或权限已撤销的资料不可继续读取。

本仓库这两处公开目录只提供连接工具和使用方法，不包含会员正文、凭据、后台源码或会员名单。`agent-access/` 与 `skills/surge-member/` 中的自有分发文件适用各自附带的 MIT 许可；这不改变仓库其他文件或会员资料的许可。
