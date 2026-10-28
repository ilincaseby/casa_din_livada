import { test, expect } from "@playwright/test";
import { build } from "astro";
import { readFile } from "node:fs/promises";
import { resolve, join } from "node:path";

test("one business change updates rendered pages; incomplete optional data cannot create fake actions", async ({ browser }, testInfo) => {
  const outDir = testInfo.outputPath("config-build");
  await build({
    root: resolve("."),
    outDir,
    logLevel: "silent",
    vite: {
      plugins: [{
        name: "test-business-fixture",
        enforce: "pre",
        transform(code, id) {
          if (!id.replaceAll("\\", "/").endsWith("/src/config/business.ts")) return;
          return code.replace("export const locationLabel", `
business.name = "Casa de Test cu un Nume Lung";
business.location.village = "Localitate de Test";
business.listings = [];
business.coordinates = null;
business.contact = { email: "contact@example.com", phone: null, verified: false };
export const locationLabel`);
        },
      }],
    },
  });
  const page = await browser.newPage();
  for (const route of ["", "casa", "galerie", "imprejurimi", "contact"]) {
    const html = await readFile(join(outDir, route, "index.html"), "utf8");
    await page.setContent(html);
    await expect(page).toHaveTitle(/Casa de Test cu un Nume Lung/);
    await expect(page.locator(".brand")).toContainText("Casa de Test cu un Nume Lung");
    await expect(page.locator(".brand")).toContainText("Localitate de Test");
    await expect(page.locator(".footer-brand")).toHaveText("Casa de Test cu un Nume Lung");
    await expect(page.locator('a[href^="mailto:"], a[href^="tel:"], a[href*="example.com"]')).toHaveCount(0);
    await expect(page.locator('script[type="application/ld+json"]')).toHaveCount(0);
    if (route === "contact") {
      await expect(page.locator(".booking-links a")).toHaveCount(0);
      await expect(page.locator(".booking-links [role=status]")).toContainText("nu sunt încă verificate");
      await expect(page.locator('a[href*="google.com/maps"]')).toHaveAttribute("href", /Localitate%20de%20Test/);
    }
    if (route === "galerie") {
      await expect(page.locator("[data-video]")).toHaveAttribute("data-title", "Tur video Casa de Test cu un Nume Lung — YouTube");
    }
  }
  await page.close();
});
