import { test, expect } from "@playwright/test";
import { business, locationLabel, publicationBlockers } from "../src/config/business";
import { mkdir } from "node:fs/promises";
import { join } from "node:path";

const routes = ["/", "/casa/", "/galerie/", "/imprejurimi/", "/contact/"];
for (const width of [1440, 768, 390, 320]) {
  test(`five routes at ${width}px: direct access, refresh, reflow and photographs`, async ({ page }) => {
    await page.setViewportSize({ width, height: width < 800 ? 844 : 1000 });
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    for (const route of routes) {
      const response = await page.goto(route);
      expect(response?.status()).toBe(200);
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator("head meta[name=robots]")).toHaveAttribute("content", "noindex, nofollow");
      await page.evaluate(() => document.fonts.ready);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      if (route === "/") {
        await expect(page.locator("[data-home-block]")).toHaveCount(4);
        const height = await page.evaluate(() => document.documentElement.scrollHeight);
        expect(height).toBeLessThan(width < 800 ? 2600 : 2100);
        console.log(`HOMEPAGE ${width}px: ${height}px, four blocks`);
      } else {
        await expect(page.locator(`${width >= 800 ? ".desktop-nav" : "#mobile-menu"} a[aria-current=page]`)).toHaveAttribute("href", route);
      }
      await page.evaluate(async () => {
        for (let y = 0; y < document.documentElement.scrollHeight; y += 650) {
          scrollTo(0, y);
          await new Promise((resolve) => setTimeout(resolve, 30));
        }
        scrollTo(0, 0);
      });
      await expect.poll(() => page.locator("img[data-photo]").evaluateAll((images) =>
        images.every((image) => image instanceof HTMLImageElement && image.complete && image.naturalWidth > 0),
      )).toBe(true);
      if (process.env.CAPTURE_DIR && (route === "/" || [1440, 390].includes(width))) {
        await mkdir(process.env.CAPTURE_DIR, { recursive: true });
        await page.screenshot({ path: join(process.env.CAPTURE_DIR, `${route === "/" ? "home" : route.replaceAll("/", "")}-${width}.png`), fullPage: true });
      }
      await page.reload();
      await expect(page.locator("h1")).toBeVisible();
    }
    expect(errors).toEqual([]);
  });
}

test("mobile menu traps focus, closes with Escape and restores focus", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "Deschide meniul" });
  await trigger.click();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await expect(page.locator("#mobile-menu")).toBeVisible();
  for (let i = 0; i < 10; i++) {
    await page.keyboard.press("Tab");
    expect(await page.evaluate(() => Boolean(document.activeElement?.closest("#mobile-menu")))).toBe(true);
  }
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await trigger.click();
  await page.locator("#mobile-menu").getByRole("link", { name: "Galerie", exact: true }).click();
  await expect(page).toHaveURL(/\/galerie\/$/);
  await page.reload();
  await expect(page.locator("h1")).toContainText("fotografie");
});

test("reservation and map destinations come from the business configuration", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".brand")).toContainText(business.name);
  await expect(page.locator(".brand")).toContainText(locationLabel);
  await page.getByRole("link", { name: "Verifică disponibilitatea", exact: true }).click();
  for (const listing of business.listings) {
    await expect(page.locator(".booking-links").getByRole("link", { name: new RegExp(listing.label.replace(".", "\\.")) }))
      .toHaveAttribute("href", listing.url);
  }
  expect(await page.locator('a[href^="mailto:"], a[href^="tel:"], a[href*="wa.me"]').count()).toBe(0);
  await expect(page.getByRole("link", { name: /Vezi Predeluț pe Google Maps/ })).toHaveAttribute("href", /query=Predelu/);
  expect(publicationBlockers(business).length).toBeGreaterThan(0);
  const incomplete = { ...business, listings: [], siteUrl: null, coordinates: null };
  expect(publicationBlockers(incomplete)).toContain("Lipsește o platformă de rezervare confirmată.");
});

test("legacy links resolve to the right new routes", async ({ page }) => {
  for (const [hash, destination] of [
    ["#despre", "/casa/#despre"], ["#facilitati", "/casa/#facilitati"],
    ["#galerie", "/galerie/"], ["#tur", "/galerie/#tur"],
    ["#imprejurimi", "/imprejurimi/"], ["#locatie", "/contact/#locatie"], ["#contact", "/contact/#rezervare"],
  ]) {
    await page.goto(`/${hash}`);
    await expect(page).toHaveURL(new RegExp(destination.replace("/", "\\/") + "$"));
    await expect(page.locator("h1")).toHaveCount(1);
  }
});

test("without JavaScript, content, mobile navigation, gallery and booking remain usable", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ baseURL, javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto("/");
  await expect(page.locator(".no-js-nav")).toBeVisible();
  await page.locator(".no-js-nav").getByRole("link", { name: "Galerie", exact: true }).click();
  await expect(page.locator("[data-gallery-item]")).toHaveCount(28);
  await expect(page.locator(".gallery-toolbar")).toBeHidden();
  const photoLink = page.locator("[data-gallery-link]").first();
  await photoLink.click();
  await expect(page).toHaveURL(/\.webp$/);
  await page.goBack();
  await page.locator(".no-js-nav").getByRole("link", { name: "Contact", exact: true }).click();
  await expect(page.locator(".booking-links a")).toHaveCount(2);
  await context.close();
});

test("200 percent text zoom and long brand text reflow without horizontal scrolling", async ({ page }) => {
  await page.setViewportSize({ width: 768, height: 1000 });
  await page.goto("/");
  await page.addStyleTag({ content: "html { font-size: 200%; }" });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.evaluate(() => {
    const brand = document.querySelector(".brand span");
    if (brand) brand.textContent = "Casa din Livadă cu un nume de proprietate neobișnuit de lung";
  });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
