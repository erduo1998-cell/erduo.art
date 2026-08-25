#!/usr/bin/env python3
"""Validate the client-facing founder knowledge activation page."""

from __future__ import annotations

import hashlib
import re
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PAGE = ROOT / "knowledge" / "index.html"
PAGE_CSS = ROOT / "knowledge" / "v0-2.css"
TITLE_PUNCTUATION = re.compile(r"[，。！？：；、,.!?;:“”‘’—…]")
EXPECTED_ASSETS = {
    "founder-knowledge-thinker-abstract-v2.webp": "978da83b762ab1763c09479e6e938594d7dbe2cffd87f2e3afd1a6147377e1c2",
    "knowledge-activation-process-abstract-v2.webp": "622e46e61f322b213978e2fca203742be2beeca98a3fc941a5c65df816d5a8ad",
    "knowledge-activation-deliverables-integrated-v2.webp": "59eb286b7856850933e9b54eadf7a2d8120615059f6b7365c9945a8d67284f95",
}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


class ProductHTML(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.headings: list[str] = []
        self.h1_count = 0
        self.images: dict[str, dict[str, str | None]] = {}
        self.application_links: list[str] = []
        self.meta: dict[str, str] = {}
        self.canonical = ""
        self.capture_heading = False
        self.buffer: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        values = dict(attrs)
        if tag == "meta" and values.get("name"):
            self.meta[values["name"]] = values.get("content") or ""
        if tag == "link" and values.get("rel") == "canonical":
            self.canonical = values.get("href") or ""
        if tag == "img" and values.get("src"):
            self.images[values["src"]] = values
        if tag == "a" and (values.get("href") or "").startswith("mailto:"):
            self.application_links.append(values["href"] or "")
        if tag in {"h1", "h2", "h3"}:
            self.capture_heading = True
            self.buffer = []
            if tag == "h1":
                self.h1_count += 1

    def handle_endtag(self, tag: str) -> None:
        if tag in {"h1", "h2", "h3"} and self.capture_heading:
            self.headings.append("".join(self.buffer).strip())
            self.capture_heading = False
            self.buffer = []

    def handle_data(self, data: str) -> None:
        if self.capture_heading:
            self.buffer.append(data)


def main() -> None:
    raw = PAGE.read_text(encoding="utf-8")
    css = PAGE_CSS.read_text(encoding="utf-8")
    parser = ProductHTML()
    parser.feed(raw)

    if parser.h1_count != 1 or parser.headings[0] != "知识激活":
        raise ValueError("formal page must contain one short H1: 知识激活")
    if any(TITLE_PUNCTUATION.search(title) for title in parser.headings):
        raise ValueError("product page heading contains forbidden punctuation")
    if parser.canonical != "https://www.erduo.art/knowledge/":
        raise ValueError("canonical URL drifted")
    if "robots" in parser.meta or not parser.meta.get("description"):
        raise ValueError("formal page is still noindex or lacks a description")

    required_copy = (
        "创始人知识资产激活计划", "一项为期 6～8 周的深度服务",
        "一个最重要的业务场景", "最终拿到什么", "¥59,800",
        "标准价格 98,000 元", "9,800 元", "198,000 元起", "4,800 元/月起",
    )
    if any(value not in raw for value in required_copy):
        raise ValueError("product definition, scope or price copy drifted")
    if not parser.application_links or any("59%2C800" not in href for href in parser.application_links):
        raise ValueError("application links do not preserve the approved co-creation offer")

    required_images = {
        "/assets/knowledge/knowledge-activation-process-abstract-v2.webp": ("1717", "916"),
        "/assets/knowledge/knowledge-activation-deliverables-integrated-v2.webp": ("1536", "1024"),
    }
    for src, dimensions in required_images.items():
        image = parser.images.get(src, {})
        if (image.get("width"), image.get("height")) != dimensions or not image.get("alt"):
            raise ValueError(f"image contract drifted: {src}")
    if "founder-knowledge-thinker-abstract-v2.webp" not in css:
        raise ValueError("abstract thinker is not embedded in the page field")
    if any(old in raw + css for old in ("founder-knowledge-thinker.webp", "knowledge-activation-process.webp", "knowledge-activation-deliverables.webp")):
        raise ValueError("old realistic or card-framed imagery is still referenced")

    for name, digest in EXPECTED_ASSETS.items():
        if sha256(ROOT / "assets" / "knowledge" / name) != digest:
            raise ValueError(f"generated asset hash mismatch: {name}")
    forbidden = ("/Users/", "candidate_id", "source_path", "canonical_source", "internal_id")
    if any(value in raw for value in forbidden):
        raise ValueError("private or internal metadata leaked into HTML")
    if '<a href="/knowledge/">知识</a>' not in (ROOT / "index.html").read_text(encoding="utf-8"):
        raise ValueError("homepage navigation does not expose /knowledge/")
    if (ROOT / "sitemap.xml").read_text(encoding="utf-8").count("https://www.erduo.art/knowledge/") != 1:
        raise ValueError("sitemap does not contain exactly one knowledge route")

    print("PASS product: definition, scope, deliverables, prices and application links")
    print("PASS visual: abstract thinker, no-real-person process and integrated deliverables")
    print("PASS publishing: canonical, indexability, homepage route and sitemap")


if __name__ == "__main__":
    try:
        main()
    except (ValueError, OSError) as error:
        print("FAIL " + str(error))
        raise SystemExit(1)
