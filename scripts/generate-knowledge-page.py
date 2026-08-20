#!/usr/bin/env python3
"""Generate the static /knowledge page from the frozen public-safe snapshot."""

from __future__ import annotations

import hashlib
import html
import json
import re
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SNAPSHOT = ROOT / "assets" / "knowledge" / "public-knowledge.json"
OUTPUT = ROOT / "knowledge" / "index.html"
SNAPSHOT_SHA256 = "e423c026f22ac202361f64143000b0a4572563d4883c9a391254a9f3ed98e336"
ALLOWED_ENTRY_FIELDS = {
    "public_id", "slug", "title", "category", "public_summary", "why_it_matters",
    "evidence_level", "relation_tags", "view_tags", "public_source_label",
    "updated_at", "result_boundary",
}
FORBIDDEN_ENTRY_FIELDS = {
    "source_path", "canonical_source", "locator", "sha256", "independence_key",
    "candidate_id", "source_text", "source_body", "internal_id",
}


def esc(value: object) -> str:
    return html.escape(str(value), quote=True)


def load_snapshot() -> tuple[dict, list[dict]]:
    raw = SNAPSHOT.read_bytes()
    digest = hashlib.sha256(raw).hexdigest()
    if digest != SNAPSHOT_SHA256:
        raise SystemExit(f"snapshot hash mismatch: {digest}")
    snapshot = json.loads(raw)
    whitelist = snapshot.get("public_whitelist")
    entries = snapshot.get("entries")
    if snapshot.get("release_type") != "public_safe_snapshot" or not isinstance(whitelist, list) or not isinstance(entries, list):
        raise SystemExit("invalid public snapshot envelope")
    if len(whitelist) != 100 or len(entries) != 100 or len(set(whitelist)) != 100:
        raise SystemExit("public whitelist and entries must each contain 100 unique items")
    whitelist_set = set(whitelist)
    selected = []
    for entry in entries:
        if set(entry) != ALLOWED_ENTRY_FIELDS or FORBIDDEN_ENTRY_FIELDS & set(entry):
            raise SystemExit("entry fields drifted from the frozen public contract")
        if entry["public_id"] not in whitelist_set:
            raise SystemExit("entry is outside the frozen public whitelist")
        if not re.fullmatch(r"knowledge-[0-9]{3}-[\u3400-\u9fff]+", entry["slug"]):
            raise SystemExit("invalid public slug")
        selected.append(entry)
    if {item["public_id"] for item in selected} != whitelist_set:
        raise SystemExit("whitelist does not exactly cover the selected entries")
    combined = json.dumps(selected, ensure_ascii=False)
    if "/Users/" in combined or re.search(r"\b(?:IP|COURSE|MEMBER|AGENT)-100-[0-9]{3}\b", combined):
        raise SystemExit("private path or internal candidate ID leaked")
    return snapshot, selected


def option_values(entries: list[dict], field: str) -> str:
    return "".join(f'<option value="{esc(value)}">{esc(value)}</option>' for value in sorted({item[field] for item in entries}))


def render_tags(values: list[str]) -> str:
    return "".join(f"<li>{esc(value)}</li>" for value in values)


def render_entry(entry: dict, index: int) -> str:
    search = " ".join([
        entry["title"], entry["category"], entry["public_summary"], entry["why_it_matters"],
        entry["evidence_level"], *entry["relation_tags"], *entry["view_tags"], entry["public_source_label"],
    ])
    return f'''<article class="knowledge-card" id="{esc(entry['slug'])}" data-knowledge-card data-category="{esc(entry['category'])}" data-evidence="{esc(entry['evidence_level'])}" data-search="{esc(search.lower())}" data-lightfield>
  <div class="knowledge-card-top"><span>{index:03d}</span><span>{esc(entry['category'])}</span><strong>{esc(entry['evidence_level'])}</strong></div>
  <h3>{esc(entry['title'])}</h3>
  <p class="knowledge-summary">{esc(entry['public_summary'])}</p>
  <details data-knowledge-detail>
    <summary>查看详情</summary>
    <div class="knowledge-detail">
      <dl>
        <div><dt>为什么重要</dt><dd>{esc(entry['why_it_matters'])}</dd></div>
        <div><dt>公开来源类型</dt><dd>{esc(entry['public_source_label'])}</dd></div>
        <div><dt>结果边界</dt><dd>{esc(entry['result_boundary'])}</dd></div>
      </dl>
      <div class="tag-columns"><div><span>关系标签</span><ul>{render_tags(entry['relation_tags'])}</ul></div><div><span>视图标签</span><ul>{render_tags(entry['view_tags'])}</ul></div></div>
      <a class="deep-link" href="#{esc(entry['slug'])}">此条公开链接 <span aria-hidden="true">↗</span></a>
    </div>
  </details>
</article>'''


def render_page(snapshot: dict, entries: list[dict]) -> str:
    categories = Counter(item["category"] for item in entries)
    cards = "\n".join(render_entry(entry, index) for index, entry in enumerate(entries, 1))
    category_summary = " · ".join(f"{name} {categories[name]}" for name in ("内容决策", "工作方法", "交付规范", "智能体方法"))
    return f'''<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#0C0C0C">
  <link rel="icon" href="/favicon.ico" sizes="any">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <meta name="description" content="SURGE 公开知识视图，用一百条脱敏安全快照展示人的判断如何变成可追溯、可调用、可修正的 AI 能力。">
  <meta name="knowledge-snapshot-sha256" content="{SNAPSHOT_SHA256}">
  <title>公开知识视图｜SURGE 无限涌动</title>
  <link rel="canonical" href="https://www.erduo.art/knowledge/">
  <link rel="preload" href="/assets/fonts/noto-sans-sc-100-900-subset.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="/assets/knowledge/knowledge-pulse-poster.jpg" as="image" type="image/jpeg">
  <link rel="stylesheet" href="/styles.css">
  <link rel="stylesheet" href="/knowledge/knowledge.css">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="zh_CN">
  <meta property="og:title" content="公开知识视图｜SURGE 无限涌动">
  <meta property="og:description" content="一百条脱敏安全快照，展示判断如何成为可追溯、可调用、可修正的 AI 能力。">
  <meta property="og:url" content="https://www.erduo.art/knowledge/">
  <meta property="og:image" content="https://www.erduo.art/assets/knowledge/knowledge-pulse-poster.jpg">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="公开知识视图｜SURGE 无限涌动">
  <meta name="twitter:description" content="一百条脱敏安全快照，展示判断如何成为 AI 能力。">
  <meta name="twitter:image" content="https://www.erduo.art/assets/knowledge/knowledge-pulse-poster.jpg">
  <script src="/site.js" defer></script>
  <script src="/knowledge/knowledge.js" defer></script>
</head>
<body class="knowledge-page">
  <a class="skip-link" href="#main">跳到主要内容</a>
  <header class="site-header" data-header>
    <a class="brand" href="/" aria-label="SURGE 无限涌动，返回首页"><span class="brand-en">SURGE</span><span class="brand-cn">无限涌动</span></a>
    <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="site-navigation" data-menu-toggle><span>菜单</span><span class="menu-icon" aria-hidden="true"><i></i><i></i></span></button>
    <nav class="site-nav" id="site-navigation" aria-label="知识页面导航" data-menu><a href="#pulse">链路</a><a href="#library">公开知识</a><a href="#boundary">边界</a><a href="#method">方法</a><a href="/">首页</a><a href="/#contact">合作</a></nav>
  </header>

  <main id="main">
    <section class="knowledge-hero" id="top" aria-labelledby="knowledge-title">
      <div class="knowledge-orbit" aria-hidden="true"></div>
      <div class="shell knowledge-hero-layout">
        <div class="knowledge-hero-copy">
          <p class="section-label reveal">PUBLIC KNOWLEDGE VIEW</p>
          <h1 id="knowledge-title" class="reveal reveal-delay-1" aria-label="让判断成为能力"><span class="display-line" aria-hidden="true">让判断</span><span class="display-line metal-text" aria-hidden="true">成为能力</span></h1>
          <p class="knowledge-lead reveal reveal-delay-2">让合作方不接触私人原文，也能看懂一个判断从哪里来、怎样被使用、何时需要修正。这是一份经过授权的公开安全快照，不是本地知识库的镜像。</p>
          <div class="button-row reveal reveal-delay-3"><a class="button button-primary" href="#library">浏览一百条</a><a class="button button-secondary" href="/#contact">讨论合作</a></div>
        </div>
        <div class="knowledge-hero-field reveal reveal-delay-2" data-lightfield aria-label="公开知识能力概览">
          <div class="field-core"><span>100</span><small>PUBLIC SAFE ENTRIES</small></div>
          <div class="field-node field-node-a"><b>可追溯</b><small>判断保留来源类型</small></div>
          <div class="field-node field-node-b"><b>可调用</b><small>方法能够进入工作</small></div>
          <div class="field-node field-node-c"><b>可修正</b><small>证据状态持续透明</small></div>
        </div>
      </div>
      <div class="shell knowledge-proof"><span>公开安全快照 100 条</span><span>四类方法视图</span><span>不含原文路径与效果承诺</span></div>
    </section>

    <section class="pulse-section section-dark" id="pulse" aria-labelledby="pulse-title">
      <div class="shell">
        <header class="knowledge-section-head reveal"><div><p class="section-label">KNOWLEDGE PULSE</p><h2 id="pulse-title">看见判断如何工作</h2></div><p>问题与碎片进入证据和判断，经过最小知识内核成为 Agent 可调用能力，再由使用反馈触发人工复核。</p></header>
        <figure class="pulse-stage reveal" data-lightfield>
          <video controls muted playsinline preload="metadata" poster="/assets/knowledge/knowledge-pulse-poster.jpg"><source src="/assets/knowledge/knowledge-pulse-final.mp4" type="video/mp4">您的浏览器无法播放视频，可<a href="/assets/knowledge/knowledge-pulse-final.mp4">下载无旁白流程短片</a>。</video>
          <figcaption><span>8.4 秒无旁白流程短片</span><span>私有知识不会随页面公开</span><a href="/assets/knowledge/knowledge-pulse-final.mp4" download>下载视频</a></figcaption>
        </figure>
      </div>
    </section>

    <section class="knowledge-library section-paper" id="library" aria-labelledby="library-title">
      <div class="shell">
        <header class="knowledge-section-head knowledge-section-head-dark reveal"><div><p class="section-label section-label-dark">PUBLIC LIBRARY / 100</p><h2 id="library-title">浏览公开知识</h2></div><p>{esc(category_summary)}。证据等级如实保留，不把方法样本包装成效果证明。</p></header>
        <form class="knowledge-filter reveal" data-knowledge-filter role="search">
          <label><span>搜索</span><input type="search" name="query" placeholder="搜索标题 方法 标签" autocomplete="off" data-query></label>
          <label><span>分类</span><select name="category" data-category><option value="">全部分类</option>{option_values(entries, 'category')}</select></label>
          <label><span>证据状态</span><select name="evidence" data-evidence><option value="">全部状态</option>{option_values(entries, 'evidence_level')}</select></label>
          <button type="reset" data-reset>清除筛选</button>
        </form>
        <div class="filter-summary"><p aria-live="polite" data-result-count>显示 100 条</p><p>无 JavaScript 时仍显示全部条目并可展开详情</p></div>
        <div class="knowledge-grid" data-knowledge-grid>
{cards}
        </div>
        <p class="no-results" data-no-results hidden>没有符合当前筛选的公开条目</p>
      </div>
    </section>

    <section class="public-boundary section-dark" id="boundary" aria-labelledby="boundary-title">
      <div class="shell">
        <header class="knowledge-section-head reveal"><div><p class="section-label">PUBLIC BY DESIGN</p><h2 id="boundary-title">公开有边界</h2></div><p>页面只消费具名授权的公开安全快照，不连接本地知识库、Mem0 或内部审核队列。</p></header>
        <div class="boundary-status reveal" data-lightfield><div><span>SNAPSHOT STATUS</span><h3>一百条已获公开授权</h3><p>授权范围只覆盖脱敏后的公开表述</p></div><dl><div><dt>source text</dt><dd>NEVER EXPORTED</dd></div><div><dt>absolute paths</dt><dd>NEVER EXPORTED</dd></div><div><dt>internal decisions</dt><dd>NOT IMPLIED</dd></div><div><dt>outcome claims</dt><dd>NEVER EXPORTED</dd></div></dl></div>
        <div class="boundary-cards"><article class="reveal" data-lightfield><span>01</span><h3>原文不外流</h3><p>公开条目只保留安全表述与来源类型，不展示原始文件、定位和哈希。</p></article><article class="reveal" data-lightfield><span>02</span><h3>证据状态透明</h3><p>已验证决定、待结果验证与方法样本分开显示，不用成熟口吻覆盖未知。</p></article><article class="reveal" data-lightfield><span>03</span><h3>授权不等于晋升</h3><p>公开快照不代表内部 proposal accepted、知识内核事务、旧库迁移或 Mem0 写入。</p></article></div>
      </div>
    </section>

    <section class="method-section section-paper" id="method" aria-labelledby="method-title">
      <div class="shell method-panel reveal"><div><p class="section-label section-label-dark">SECOND LAYER / FOR BUILDERS</p><h2 id="method-title">先管好知识</h2><p>教学放在第二层。先看系统是否能交付可追责成果，再讨论如何复制。</p></div><details><summary>展开复制方法</summary><div class="method-grid"><article><span>STORE</span><h3>保存来源</h3><p>原始来源只读，用稳定身份和指纹去重。</p></article><article><span>GOVERN</span><h3>分开事实和推断</h3><p>冲突、缺证据和陈旧内容进入人工队列。</p></article><article><span>USE</span><h3>留下用料单</h3><p>Agent 只拿任务需要的能力，结果再回流。</p></article></div></details></div>
    </section>
  </main>

  <footer class="knowledge-footer"><div class="shell"><a class="brand" href="/" aria-label="SURGE 无限涌动，返回首页"><span class="brand-en">SURGE</span><span class="brand-cn">无限涌动</span></a><p>公开安全快照 · {esc(snapshot['generated_at'][:10])} · 不含私人原文与商业效果主张</p><a href="#top">返回顶部 ↑</a></div></footer>
</body>
</html>
'''


def main() -> None:
    snapshot, entries = load_snapshot()
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text(render_page(snapshot, entries), encoding="utf-8")
    print(f"generated {OUTPUT} from 100 whitelisted public-safe entries")
    print(f"snapshot sha256 {SNAPSHOT_SHA256}")


if __name__ == "__main__":
    main()
