import { chromium } from "@playwright/test";
import { readdir, readFile } from "node:fs/promises";
import { gzipSync } from "node:zlib";
import { resolve } from "node:path";

const url = process.env.PREVIEW_URL;
if (!url) throw new Error("Setează PREVIEW_URL la adresa verificată a preview-ului local.");
const target = new URL(url);
if (!["127.0.0.1", "localhost"].includes(target.hostname)) throw new Error("Măsurarea este limitată la preview-ul local.");
const browser = await chromium.launch({ args: ["--enable-unsafe-swiftshader"] });
const results = [];
try {
  for (const mobile of [false, true]) {
    const context = await browser.newContext({ viewport: { width: mobile ? 390 : 1440, height: mobile ? 844 : 1000 } });
    const page = await context.newPage();
    await page.addInitScript(() => {
      window.measurements = { lcp: 0, cls: 0, longTasks: [] };
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) window.measurements.lcp = entry.startTime;
      }).observe({ type: "largest-contentful-paint", buffered: true });
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) if (!entry.hadRecentInput) window.measurements.cls += entry.value;
      }).observe({ type: "layout-shift", buffered: true });
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) window.measurements.longTasks.push(entry.duration);
      }).observe({ type: "longtask", buffered: true });
    });
    if (mobile) {
      const cdp = await context.newCDPSession(page);
      await cdp.send("Network.enable");
      await cdp.send("Network.emulateNetworkConditions", { offline: false, latency: 150, downloadThroughput: 200000, uploadThroughput: 93750 });
      await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
    }
    const response = await page.goto(url);
    if (response?.status() !== 200 || await page.locator("[data-home-block]").count() !== 4) {
      throw new Error("Adresa nu răspunde cu homepage-ul așteptat. Verifică portul preview-ului.");
    }
    await page.waitForTimeout(3000);
    results.push(await page.evaluate((mobile) => ({
      condition: mobile ? "390px, CPU 4x, 1.6Mbps, RTT 150ms" : "1440px, localhost, no throttling",
      ...window.measurements,
      resourceBytes: performance.getEntriesByType("resource").reduce((sum, entry) => sum + entry.transferSize, 0),
      sceneMode: document.querySelector("[data-mountain]").dataset.mode,
      homeHeight: document.documentElement.scrollHeight,
    }), mobile));
    await context.close();
  }
  const assetDir = resolve(import.meta.dirname, "../dist/_astro");
  const assets = [];
  for (const file of await readdir(assetDir)) {
    if (!file.endsWith(".js")) continue;
    const data = await readFile(resolve(assetDir, file));
    assets.push({ file, bytes: data.length, gzip: gzipSync(data).length });
  }
  console.log(JSON.stringify({ timestamp: new Date().toISOString(), results, assets }, null, 2));
} finally {
  await browser.close();
}
