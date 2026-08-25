#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const puppeteer = require("puppeteer-core");

const base = process.env.KNOWLEDGE_BASE_URL || "http://127.0.0.1:4173";
const chrome = process.env.CHROME_PATH || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const screenshotDir = process.env.KNOWLEDGE_SCREENSHOT_DIR || "/tmp/erduo-art-knowledge-check";

function assert(value, message) {
  if (!value) throw new Error(message);
}

async function inspect(page) {
  return page.evaluate(() => {
    const h1 = document.querySelector("h1");
    const process = document.querySelector(".v03-process-visual img");
    const delivery = document.querySelector(".v03-delivery-layout img");
    const applicationLinks = [...document.querySelectorAll('a[href^="mailto:"]')];
    return {
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      h1Count: document.querySelectorAll("h1").length,
      h1: h1 && h1.textContent.trim(),
      heroBackground: getComputedStyle(document.querySelector(".v04-hero-field")).backgroundImage,
      process: process && { complete: process.complete, width: process.naturalWidth, height: process.naturalHeight },
      delivery: delivery && { complete: delivery.complete, width: delivery.naturalWidth, height: delivery.naturalHeight },
      prices: document.body.innerText.includes("59,800") && document.body.innerText.includes("98,000"),
      applicationLinks: applicationLinks.length,
      applicationSubjects: applicationLinks.every((link) => link.href.includes("59%2C800")),
      fontReady: document.fonts.status,
    };
  });
}

async function main() {
  fs.mkdirSync(screenshotDir, { recursive: true });
  const browser = await puppeteer.launch({ executablePath: chrome, headless: true, args: ["--no-sandbox", "--disable-dev-shm-usage"] });
  const consoleErrors = [];
  try {
    const page = await browser.newPage();
    page.on("console", (message) => { if (message.type() === "error") consoleErrors.push(message.text()); });
    page.on("pageerror", (error) => consoleErrors.push(error.message));

    for (const route of ["/", "/reachsurge/", "/knowledge/"]) {
      const response = await page.goto(base + route, { waitUntil: "networkidle0" });
      assert(response && response.status() === 200, `${route} did not return 200`);
    }
    const missing = await page.goto(base + "/knowledge-not-found", { waitUntil: "domcontentloaded" });
    assert(missing && missing.status() === 404, "missing route did not return 404");

    const results = [];
    for (const viewport of [
      { width: 375, height: 812, name: "mobile" },
      { width: 768, height: 1024, name: "tablet" },
      { width: 1440, height: 900, name: "desktop" },
      { width: 1920, height: 1080, name: "wide" },
    ]) {
      await page.setViewport({ width: viewport.width, height: viewport.height, deviceScaleFactor: 1, isMobile: viewport.width < 500, hasTouch: viewport.width < 500 });
      await page.goto(base + "/knowledge/", { waitUntil: "networkidle0" });
      const result = await inspect(page);
      assert(result.overflow <= 1, `${viewport.name} overflow ${result.overflow}px`);
      assert(result.h1Count === 1 && result.h1 === "知识激活", `${viewport.name} H1 drifted`);
      assert(result.heroBackground.includes("founder-knowledge-thinker-abstract-v2.webp"), `${viewport.name} abstract hero missing`);
      assert(result.process.complete && result.process.width === 1717 && result.process.height === 916, `${viewport.name} process image failed`);
      assert(result.delivery.complete && result.delivery.width === 1536 && result.delivery.height === 1024, `${viewport.name} delivery image failed`);
      assert(result.prices && result.applicationLinks >= 1 && result.applicationSubjects, `${viewport.name} pricing or application CTA failed`);
      assert(result.fontReady === "loaded", `${viewport.name} fonts did not load`);
      await page.screenshot({ path: path.join(screenshotDir, `knowledge-${viewport.name}.png`) });
      results.push({ ...viewport, ...result });
    }

    const reduced = await browser.newPage();
    await reduced.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
    await reduced.setViewport({ width: 1440, height: 900 });
    await reduced.goto(base + "/knowledge/", { waitUntil: "networkidle0" });
    const transform = await reduced.$eval("[data-lightfield]", (element) => getComputedStyle(element).transform);
    assert(transform === "none", "reduced-motion contract failed");

    const noJs = await browser.newPage();
    await noJs.setJavaScriptEnabled(false);
    await noJs.goto(base + "/knowledge/", { waitUntil: "domcontentloaded" });
    const noJsState = await noJs.evaluate(() => ({ h1: document.querySelector("h1").textContent.trim(), links: document.querySelectorAll("a").length, sections: document.querySelectorAll("main section").length }));
    assert(noJsState.h1 === "知识激活" && noJsState.links > 5 && noJsState.sections === 10, "no-JS product page is incomplete");

    assert(consoleErrors.length === 0, `console errors: ${consoleErrors.join(" | ")}`);
    console.log(JSON.stringify({ status: "passed", results, reducedMotion: transform, noJs: noJsState, screenshotDir }, null, 2));
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exit(1);
});
