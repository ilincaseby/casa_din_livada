import { test, expect } from "@playwright/test";
import { join } from "node:path";

test("real WebGL geometry, finite pointer motion, offscreen pause, static toggle and navigation cleanup", async ({ page }) => {
  await page.goto("/");
  const mountain = page.locator("[data-mountain]");
  await expect(mountain).toHaveAttribute("data-ready", "true");
  await expect(mountain.locator("canvas")).toHaveCount(1);
  if (process.env.CAPTURE_DIR) {
    await page.screenshot({ path: join(process.env.CAPTURE_DIR, "home-3d-1440.png"), fullPage: true });
    const hide = await page.addStyleTag({ content: ".hero-copy,.hero-photo,.scene-controls { visibility:hidden; } .mountain { opacity:1; }" });
    await mountain.screenshot({ path: join(process.env.CAPTURE_DIR, "mountain-render.png") });
    await hide.evaluate((element) => element.parentNode?.removeChild(element));
  }
  const frames = Number(await mountain.getAttribute("data-frames"));
  await page.mouse.move(100, 400);
  await expect.poll(async () => Number(await mountain.getAttribute("data-frames"))).toBeGreaterThan(frames);
  await page.waitForTimeout(1500);
  const settled = await mountain.getAttribute("data-frames");
  await page.waitForTimeout(300);
  expect(await mountain.getAttribute("data-frames")).toBe(settled);
  await page.locator("footer").scrollIntoViewIfNeeded();
  await expect(mountain).toHaveAttribute("data-rendering", "paused");
  const paused = await mountain.getAttribute("data-frames");
  await page.waitForTimeout(300);
  expect(await mountain.getAttribute("data-frames")).toBe(paused);
  await page.locator("h1").scrollIntoViewIfNeeded();
  await page.getByRole("button", { name: "Vezi fundalul static" }).click();
  await expect(mountain.locator("canvas")).toHaveCount(0);
  await expect(mountain).toHaveAttribute("data-mode", "static");
  if (process.env.CAPTURE_DIR) await page.screenshot({ path: join(process.env.CAPTURE_DIR, "home-static-1440.png"), fullPage: true });
  await page.getByRole("button", { name: "Activează relieful 3D" }).click();
  await expect(mountain.locator("canvas")).toHaveCount(1);
  await page.getByRole("link", { name: "Intră în casă" }).click();
  await page.goBack();
  await expect(page.locator("[data-mountain] canvas")).toHaveCount(1);
});

test("hidden tab pauses rendering", async ({ page }) => {
  await page.goto("/");
  const mountain = page.locator("[data-mountain]");
  await expect(mountain).toHaveAttribute("data-ready", "true");
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", { configurable: true, value: true });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await expect(mountain).toHaveAttribute("data-rendering", "paused");
  const frames = await mountain.getAttribute("data-frames");
  await page.mouse.move(120, 450);
  await page.waitForTimeout(300);
  expect(await mountain.getAttribute("data-frames")).toBe(frames);
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", { configurable: true, value: false });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await expect.poll(async () => Number(await mountain.getAttribute("data-frames"))).toBeGreaterThan(Number(frames));
});

for (const mode of ["reduced", "mobile", "save-data", "no-webgl", "chunk-failure"]) {
  test(`${mode}: static poster and usable content`, async ({ page }) => {
    const scripts: string[] = [];
    page.on("request", (request) => { if (request.resourceType() === "script") scripts.push(request.url()); });
    if (mode === "reduced") await page.emulateMedia({ reducedMotion: "reduce" });
    if (mode === "mobile") await page.setViewportSize({ width: 390, height: 844 });
    if (mode === "save-data") await page.addInitScript(() => Object.defineProperty(navigator, "connection", { value: { saveData: true, addEventListener() {} } }));
    if (mode === "no-webgl") await page.addInitScript(() => {
      Object.defineProperty(HTMLCanvasElement.prototype, "getContext", { value: () => null });
    });
    if (mode === "chunk-failure") await page.route("**/_astro/mountain.*.js", (route) => route.abort());
    await page.goto("/");
    if (["no-webgl", "chunk-failure"].includes(mode)) {
      await expect(page.locator("[data-mountain]")).toHaveAttribute("data-mode", "fallback");
    } else {
      await page.waitForTimeout(300);
      expect(scripts.some((url) => /\/mountain\./.test(url))).toBe(false);
    }
    await expect(page.locator("[data-mountain] img")).toBeVisible();
    await expect(page.locator("[data-mountain] canvas")).toHaveCount(0);
    await page.getByRole("link", { name: "Intră în casă" }).click();
    await expect(page).toHaveURL(/\/casa\/$/);
  });
}

test("other routes never download the scene or its poster", async ({ page }) => {
  for (const path of ["/casa/", "/galerie/", "/imprejurimi/", "/contact/"]) {
    const requests: string[] = [];
    const record = (request: import("@playwright/test").Request) => requests.push(request.url());
    page.on("request", record);
    await page.goto(path);
    await page.waitForLoadState("networkidle");
    expect(requests.filter((url) => /\/mountain\.|Mountain\.astro|mountain-poster/.test(url))).toEqual([]);
    await expect(page.locator("[data-mountain]")).toHaveCount(0);
    page.off("request", record);
  }
});
