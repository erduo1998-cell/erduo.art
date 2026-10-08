# 会员 CLI 用法

[返回接入指南](README.md) · [客户端源码](../skills/surge-member/scripts/member_agent_client.py)

客户端只使用 Python 标准库，适用于 macOS/Linux 的 Python 3.11 及以上版本；Windows 使用 WSL，不把原生 Windows 当已验证运行环境。无需安装网站后台或额外 Python 包。客户端读会员资料，也能在授权后保存本人任务进度。

## 安装与连接

下载或通过 Skill 安装取得 `skills/surge-member/scripts/member_agent_client.py`，先检查源码。以下命令假设终端当前目录就是客户端所在目录：

```bash
python3 --version
python3 member_agent_client.py --help
python3 member_agent_client.py login
```

`login` 在浏览器打开 `https://login.erduo.art` 的授权页。用户自己登录、核对当前账号并确认权限，回到终端等待成功。不要提供密码、验证码、Cookie 或 token 给 Agent。连接需要会员读取 `member:read`，下载需要 `member:download`，本人进度需要 `member:progress`。

自动开浏览器失败时可运行 `login --no-browser`，在能访问此终端 `127.0.0.1` 回调的浏览器打开本次链接；默认等待 300 秒，可用 `--wait 600` 延长。远端 SSH 的浏览器回调不会自动接通，不要把授权服务暴露到公网；可改用本机 CLI 或 MCP。

连接文件默认位于 `~/.config/surge-member-agent/config.json`，目录权限 700、文件 600。工具自行保存和刷新授权，输出不含 token。不要上传、粘贴或提交该文件。同一配置同一时刻只执行一个需要授权的命令。

```bash
python3 member_agent_client.py status
python3 member_agent_client.py access
```

`status` 只显示本地连接状态；`access` 才会访问网站核对当前权限。多账号使用不同 `--config` 路径，每个账号各自在网页授权。例如：

```bash
python3 member_agent_client.py --config ~/.config/surge-member-work/config.json login
```

全局选项 `--config`、`--origin`、`--timeout` 放在子命令之前。正式站保持默认 origin；不要把配置改到不可信站点。

## 搜索、阅读和下载

```bash
python3 member_agent_client.py search "入门 操作" --limit 5
python3 member_agent_client.py search "报错关键词" --project PROJECT_ID
python3 member_agent_client.py read RESOURCE_ID --revision 1 --limit 6000
python3 member_agent_client.py read RESOURCE_ID --revision 1 --section SECTION_ID
python3 member_agent_client.py workflow RESOURCE_ID --revision 1
python3 member_agent_client.py download RESOURCE_ID ASSET_ID --revision 1 --output ./手册.pdf
```

`PROJECT_ID`、`RESOURCE_ID`、`SECTION_ID`、`ASSET_ID` 以及版本 `1` 都是示例占位，必须换成实际响应中的编号和当前版本。下载目标目录须先存在，目标文件须不存在；客户端不覆盖旧文件，不接受符号链接或重定向，完成大小和 SHA256 核验后才保存。

搜索有 `next_cursor` 时用 `search ... --cursor 游标`；正文有 `next_offset` 时用 `read ... --offset 偏移`；章节目录有 `next_section_cursor` 时用 `read ... --section-cursor 游标`。保留同一查询和版本，直到找到当前任务需要的范围即可。

`readable` / `partial` / `raw_only` / `failed` 区分可读文本、部分抽取、仅原件、抽取失败；索引 `pending` 表示还在准备。OCR、语音识别和视频抽帧要以原件核对，不能宣称已读完未返回的部分。

## 本人任务进度

这些命令需要 `member:progress`。先查旧任务，再决定是否新建：

```bash
python3 member_agent_client.py tasks
python3 member_agent_client.py task TASK_ID
python3 member_agent_client.py start RESOURCE_ID --request-key my-first-task-20261008 --question "从入门开始"
python3 member_agent_client.py ask TASK_ID "当前步骤报错应该查哪一节" --expected-version 1
python3 member_agent_client.py advance TASK_ID --expected-version 2 --action record --result "已检查实际环境，仍缺少输入文件"
python3 member_agent_client.py advance TASK_ID --expected-version 3 --action complete --result "已生成目标文件并打开核验"
```

每次以最新响应的任务版本替换示例 `expected-version`。`ask` 会保存这次讨论；`record` 保存实际结果；只有实际完成才用 `complete`。`request-key` 表示同一次创建意图，重试保持不变，新的任务再换新值。资料变更需要重启时，先查明差异，再用 `advance ... --action restart`。

## 退出与异常

```bash
python3 member_agent_client.py logout
```

退出先向网站撤销连接，成功后清除本地 token。网络失败会保留本地连接，便于重试撤销；也可在网站会员区撤销。直接删除本地配置不能证明服务端授权已撤销。

| 现象 | 处理 |
| --- | --- |
| 等待授权超时 | 确认浏览器与终端可互通本机回调，再重跑 `login` |
| 401 或刷新失败 | 在网页核对连接是否撤销，重新授权；不要粘贴 token |
| 403 权限不足 | 查看账号及授权范围，在网站补充允许的权限；不要借用管理员凭据 |
| 404 无法读取 | 编号可能无效、资料已下架或当前无权；从 `access` 和搜索重新找 |
| 409 版本冲突 | 重新读取资料或任务，核对版本差异后继续 |
| 429 请求过频 | 稍后继续，缩小检索；不要并发刷全库 |
| 文件核验失败 | 不使用未完成文件，重新读取当前附件信息后再下载到新路径 |

客户端下载不执行附件。运行代码、安装依赖、调用付费服务或发布结果仍按用户自己的任务授权处理。
