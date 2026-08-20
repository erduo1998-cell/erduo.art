#!/usr/bin/env python3
"""Validate the static public knowledge integration without modifying files."""

from __future__ import annotations

import hashlib
import json
import re
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
EXPECTED_SNAPSHOT_SHA256 = "e423c026f22ac202361f64143000b0a4572563d4883c9a391254a9f3ed98e336"
EXPECTED_VIDEO_SHA256 = "1e916c74afb6f2ef2f1eb7596948cae1621cb07d656703d2317de04a1b5ad7ef"
EXPECTED_POSTER_SHA256 = "0f9d371577c087779d2d95a2d42188e7373b48fe4671cef79588adab857800f9"
TITLE_PUNCTUATION = re.compile(r"[，。！？：；、,.!?;:“”‘’—…]")


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


class KnowledgeHTML(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.cards: list[dict[str, object]] = []
        self.card: dict[str, object] | None = None
        self.card_depth = 0
        self.capture: str | None = None
        self.buffer: list[str] = []
        self.headings: list[str] = []
        self.meta: dict[str, str] = {}
        self.video_attrs: dict[str, str | None] = {}

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        values = dict(attrs)
        if tag == "meta" and values.get("name"):
            self.meta[values["name"]] = values.get("content") or ""
        if tag == "video":
            self.video_attrs = values
        if tag == "article" and "data-knowledge-card" in values:
            self.card = {"slug": values.get("id"), "category": values.get("data-category"), "evidence": values.get("data-evidence"), "texts": []}
            self.card_depth = 1
            return
        if self.card is not None:
            self.card_depth += 1
        if tag in {"h1", "h2", "h3"}:
            self.capture = "heading"
            self.buffer = []

    def handle_endtag(self, tag: str) -> None:
        if tag in {"h1", "h2", "h3"} and self.capture == "heading":
            self.headings.append("".join(self.buffer).strip())
            self.capture = None
            self.buffer = []
        if self.card is not None:
            self.card_depth -= 1
            if self.card_depth == 0:
                self.cards.append(self.card)
                self.card = None

    def handle_data(self, data: str) -> None:
        text = " ".join(data.split())
        if text and self.card is not None:
            self.card["texts"].append(text)
        if self.capture:
            self.buffer.append(data)


def main() -> None:
    snapshot_path = ROOT / "assets/knowledge/public-knowledge.json"
    page_path = ROOT / "knowledge/index.html"
    video_path = ROOT / "assets/knowledge/knowledge-pulse-final.mp4"
    poster_path = ROOT / "assets/knowledge/knowledge-pulse-poster.jpg"
    if sha256(snapshot_path) != EXPECTED_SNAPSHOT_SHA256:
        raise ValueError("public snapshot hash mismatch")
    if sha256(video_path) != EXPECTED_VIDEO_SHA256 or sha256(poster_path) != EXPECTED_POSTER_SHA256:
        raise ValueError("approved video or poster hash mismatch")
    snapshot = json.loads(snapshot_path.read_text(encoding="utf-8"))
    entries = snapshot["entries"]
    whitelist = set(snapshot["public_whitelist"])
    if len(entries) != 100 or len(whitelist) != 100:
        raise ValueError("public snapshot cardinality mismatch")
    if any(item["public_id"] not in whitelist for item in entries):
        raise ValueError("entry escaped the frozen public whitelist")

    raw = page_path.read_text(encoding="utf-8")
    parser = KnowledgeHTML()
    parser.feed(raw)
    expected_slugs = [item["slug"] for item in entries]
    actual_slugs = [item["slug"] for item in parser.cards]
    if actual_slugs != expected_slugs or len(set(actual_slugs)) != 100:
        raise ValueError("HTML does not preserve all 100 public slugs in order")
    by_slug = {item["slug"]: item for item in entries}
    for card in parser.cards:
        entry = by_slug[card["slug"]]
        card_text = " ".join(card["texts"])
        expected_text = [entry["title"], entry["public_summary"], entry["why_it_matters"], entry["public_source_label"], entry["result_boundary"], *entry["relation_tags"], *entry["view_tags"]]
        if card["category"] != entry["category"] or card["evidence"] != entry["evidence_level"] or any(value not in card_text for value in expected_text):
            raise ValueError(f"HTML content drift at public slug {entry['slug']}")
    if parser.meta.get("knowledge-snapshot-sha256") != EXPECTED_SNAPSHOT_SHA256:
        raise ValueError("HTML build metadata does not pin the public snapshot")
    video = parser.video_attrs
    if "controls" not in video or "muted" not in video or "playsinline" not in video or "autoplay" in video or video.get("preload") != "metadata":
        raise ValueError("video playback boundary is unsafe")
    if any(TITLE_PUNCTUATION.search(title) for title in parser.headings):
        raise ValueError("knowledge page heading contains forbidden punctuation")
    forbidden = ("/Users/", "candidate_id", "source_path", "canonical_source", "locator", "independence_key", "human_actor", "decision_provenance")
    if any(value in raw for value in forbidden) or re.search(r"\b(?:IP|COURSE|MEMBER|AGENT)-100-[0-9]{3}\b", raw):
        raise ValueError("private or internal metadata leaked into HTML")
    if '<a href="/knowledge/">知识</a>' not in (ROOT / "index.html").read_text(encoding="utf-8"):
        raise ValueError("homepage navigation does not expose /knowledge/")
    sitemap = (ROOT / "sitemap.xml").read_text(encoding="utf-8")
    if sitemap.count("https://www.erduo.art/knowledge/") != 1:
        raise ValueError("sitemap does not contain exactly one knowledge route")
    print("PASS snapshot and assets: frozen hashes match")
    print("PASS content: 100 whitelisted entries match HTML, public slugs, filters, evidence and details")
    print("PASS privacy: no paths, internal candidate IDs, private decision or provenance metadata")
    print("PASS integration: homepage route, sitemap, headings and safe video contract")


if __name__ == "__main__":
    try:
        main()
    except (ValueError, OSError, json.JSONDecodeError) as error:
        print("FAIL " + str(error))
        raise SystemExit(1)
