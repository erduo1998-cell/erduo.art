#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const puppeteer = require("puppeteer-core");

const base = process.env.KNOWLEDGE_BASE_URL || "http://127.0.0.1:4173";
const chrome = process.env.CHROME_PATH || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const screenshotDir = process.env.KNOWLEDGE_SCREENSHOT_DIR || "/tmp/erduo-art-knowledge-check";
const axePath = require.resolve("axe-core/axe.min.js");

function assert(value, message) {
  if (!value) throw new Error(message);
}

async function audit(page, label) {
  await page.addScriptTag({ path: axePath });
  const result = await page.evaluate(async () => window.axe.run(document, {
    runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"] },
  }));
  assert(result.violations.length === 0, `${label} axe violations: ${result.violations.map((item) => `${item.id} ${item.nodes.map((node) => `${node.target.join(" ")} [${node.failureSummary}]`).join(" | ")}`).join(", ")}`);
  return result.passes.length;
}

async function main() {
  fs.mkdirSync(screenshotDir, { recursive: true });
  const browser = await puppeteer.launch({ executablePath: chrome, headless: true, args: ["--no-sandbox", "--disable-dev-shm-usage"] });
  const consoleErrors = [];
  try {
    const page = await browser.newPage();
    page.on("console", (message) => {
      if (message.type() === "error") consoleErrors.push(message.text());
    });
    page.on("pageerror", (error) => consoleErrors.push(error.message));

    for (const route of ["/", "/reachsurge/", "/knowledge/"]) {
      const response = await page.goto(base + route, { waitUntil: "networkidle0" });
      assert(response && response.status() === 200, `${route} did not return 200`);
    }
    assert(consoleErrors.length === 0, `route console errors: ${consoleErrors.join(" | ")}`);
    const missing = await page.goto(base + "/knowledge-not-found", { waitUntil: "domcontentloaded" });
    assert(missing && missing.status() === 404, "missing route did not return 404");
    consoleErrors.length = 0;

    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
    await page.goto(base + "/knowledge/", { waitUntil: "networkidle0" });
    const desktop = await page.evaluate(() => ({
      cards: document.querySelectorAll("[data-knowledge-card]").length,
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      h1: document.querySelector("h1").textContent.replace(/\s+/g, "").trim(),
      h1Font: getComputedStyle(document.querySelector("h1")).fontFamily,
      h1Weight: getComputedStyle(document.querySelector("h1")).fontWeight,
      video: {
        autoplay: document.querySelector("video").autoplay,
        muted: document.querySelector("video").muted,
        paused: document.querySelector("video").paused,
        controls: document.querySelector("video").controls,
        playsInline: document.querySelector("video").playsInline,
        readyState: document.querySelector("video").readyState,
        duration: document.querySelector("video").duration,
        width: document.querySelector("video").videoWidth,
      },
      fontReady: document.fonts.status,
    }));
    assert(desktop.cards === 100, "desktop does not contain 100 cards");
    assert(desktop.overflow <= 1, `desktop overflow ${desktop.overflow}px`);
    assert(desktop.h1 === "让判断成为能力", "hero title drifted");
    assert(desktop.h1Font.includes("Noto Sans SC") && desktop.h1Weight === "700", "hero font contract failed");
    assert(!desktop.video.autoplay && desktop.video.muted && desktop.video.paused && desktop.video.controls && desktop.video.playsInline, "video contract failed");
    assert(desktop.video.readyState >= 1 && Math.abs(desktop.video.duration - 8.4) < 0.05 && desktop.video.width === 1920, "video metadata failed");
    assert(desktop.fontReady === "loaded", "fonts did not finish loading");
    await page.screenshot({ path: path.join(screenshotDir, "knowledge-desktop-hero.png") });

    await page.select("[data-category]", "工作方法");
    await page.waitForFunction(() => document.querySelector("[data-result-count]").textContent.includes("18"));
    assert(await page.$$eval("[data-knowledge-card]:not([hidden])", (items) => items.length) === 18, "category filter count failed");
    await page.click("[data-reset]");
    await page.waitForFunction(() => document.querySelector("[data-result-count]").textContent.includes("100"));
    await page.type("[data-query]", "记忆前置");
    assert(await page.$$eval("[data-knowledge-card]:not([hidden])", (items) => items.length) === 1, "search filter failed");
    await page.click("[data-reset]");

    const slug = await page.$eval("[data-knowledge-card]", (item) => item.id);
    await page.goto(base + "/knowledge/#" + encodeURIComponent(slug), { waitUntil: "networkidle0" });
    assert(await page.$eval("[data-knowledge-card] details", (detail) => detail.open), "deep link did not open detail");
    const firstSummary = await page.$("[data-knowledge-card] summary");
    await firstSummary.focus();
    await page.keyboard.press("Enter");
    assert(!(await page.$eval("[data-knowledge-card] details", (detail) => detail.open)), "keyboard did not toggle detail");
    await page.keyboard.press("Enter");

    await new Promise((resolve) => setTimeout(resolve, 900));
    const desktopAxe = await audit(page, "desktop");
    await page.screenshot({ path: path.join(screenshotDir, "knowledge-desktop-library.png") });

    const mobile = await browser.newPage();
    mobile.on("console", (message) => {
      if (message.type() === "error") consoleErrors.push(message.text());
    });
    await mobile.setViewport({ width: 375, height: 812, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
    await mobile.goto(base + "/knowledge/", { waitUntil: "networkidle0" });
    const mobileLayout = await mobile.evaluate(() => ({
      cards: document.querySelectorAll("[data-knowledge-card]").length,
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      columns: getComputedStyle(document.querySelector("[data-knowledge-grid]")).gridTemplateColumns.split(" ").length,
    }));
    assert(mobileLayout.cards === 100 && mobileLayout.overflow <= 1 && mobileLayout.columns === 1, "mobile layout failed");
    await mobile.screenshot({ path: path.join(screenshotDir, "knowledge-mobile-hero.png") });
    const mobileSummary = await mobile.$("[data-knowledge-card] summary");
    await mobileSummary.evaluate((element) => element.scrollIntoView({ block: "center" }));
    await new Promise((resolve) => setTimeout(resolve, 900));
    const box = await mobileSummary.boundingBox();
    await mobile.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2);
    assert(await mobile.$eval("[data-knowledge-card] details", (detail) => detail.open), "touch did not open detail");
    await new Promise((resolve) => setTimeout(resolve, 900));
    const mobileAxe = await audit(mobile, "mobile");
    await mobile.screenshot({ path: path.join(screenshotDir, "knowledge-mobile-library.png") });

    const responsiveChecks = [];
    for (const viewport of [{ width: 768, height: 1024 }, { width: 1920, height: 1080 }]) {
      const responsive = await browser.newPage();
      await responsive.setViewport(viewport);
      await responsive.goto(base + "/knowledge/", { waitUntil: "networkidle0" });
      const result = await responsive.evaluate(() => ({
        cards: document.querySelectorAll("[data-knowledge-card]").length,
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      }));
      await responsive.close();
      assert(result.cards === 100 && result.overflow <= 1, `responsive layout failed at ${viewport.width}`);
      responsiveChecks.push({ ...viewport, ...result });
    }

    const reduced = await browser.newPage();
    await reduced.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
    await reduced.setViewport({ width: 1440, height: 900 });
    await reduced.goto(base + "/knowledge/", { waitUntil: "networkidle0" });
    const reducedState = await reduced.evaluate(() => ({
      transform: getComputedStyle(document.querySelector("[data-lightfield]")).transform,
      videoPaused: document.querySelector("video").paused,
      animationDuration: getComputedStyle(document.querySelector(".reveal")).animationDuration,
    }));
    assert(reducedState.transform === "none" && reducedState.videoPaused, "reduced-motion contract failed");

    const noJs = await browser.newPage();
    await noJs.setJavaScriptEnabled(false);
    await noJs.goto(base + "/knowledge/", { waitUntil: "domcontentloaded" });
    const noJsState = await noJs.evaluate(() => ({
      cards: document.querySelectorAll("[data-knowledge-card]").length,
      hidden: document.querySelectorAll("[data-knowledge-card][hidden]").length,
      summaries: document.querySelectorAll("[data-knowledge-card] summary").length,
    }));
    assert(noJsState.cards === 100 && noJsState.hidden === 0 && noJsState.summaries === 100, "no-JS content is incomplete");

    const assetChecks = await page.evaluate(async () => {
      const urls = [
        "/assets/fonts/noto-sans-sc-100-900-subset.woff2",
        "/assets/knowledge/knowledge-pulse-poster.jpg",
        "/assets/knowledge/knowledge-pulse-final.mp4",
        "/assets/knowledge/public-knowledge.json",
      ];
      return Promise.all(urls.map(async (url) => {
        const response = await fetch(url);
        return { url, status: response.status, type: response.headers.get("content-type"), size: Number(response.headers.get("content-length") || 0) };
      }));
    });
    assert(assetChecks.every((item) => item.status === 200 && item.size > 0), "one or more public assets failed");
    assert(consoleErrors.length === 0, `console errors: ${consoleErrors.join(" | ")}`);
    console.log(JSON.stringify({ status: "passed", desktop, mobile: mobileLayout, responsiveChecks, reduced: reducedState, noJs: noJsState, desktopAxePasses: desktopAxe, mobileAxePasses: mobileAxe, assetChecks, consoleErrors, screenshotDir }, null, 2));
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exit(1);
});
