import { test, expect } from "@playwright/test";

test("filter persists on refresh, lightbox keyboard navigation and focus restoration", async ({ page }) => {
  await page.goto("/galerie/");
  await page.getByRole("button", { name: "Camere și băi", exact: true }).click();
  await expect(page.locator("[data-gallery-item]:visible")).toHaveCount(7);
  await page.reload();
  await expect(page.getByRole("button", { name: "Camere și băi", exact: true })).toHaveAttribute("aria-pressed", "true");
  const first = page.locator("[data-gallery-item]:visible [data-gallery-link]").first();
  await first.focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("[data-lightbox]")).toBeVisible();
  await expect(page.locator("[data-lightbox-count]")).toHaveText("1 / 7");
  await page.keyboard.press("ArrowRight");
  await expect(page.locator("[data-lightbox-count]")).toHaveText("2 / 7");
  await page.keyboard.press("ArrowLeft");
  await expect(page.locator("[data-lightbox-count]")).toHaveText("1 / 7");
  for (let i = 0; i < 5; i++) {
    await page.keyboard.press("Tab");
    expect(await page.evaluate(() => Boolean(document.activeElement?.closest("[data-lightbox]")))).toBe(true);
  }
  await page.keyboard.press("Escape");
  await expect(first).toBeFocused();
  await expect(page.locator("[data-lightbox]")).toBeHidden();
});

test("touch swipe changes photograph and broken image shows an honest local fallback", async ({ page }) => {
  await page.goto("/galerie/");
  await page.locator("[data-gallery-link]").first().click();
  const stage = page.locator(".lightbox-stage");
  await stage.dispatchEvent("pointerdown", { pointerType: "touch", isPrimary: true, pointerId: 1, clientX: 250, clientY: 200 });
  await stage.dispatchEvent("pointerup", { pointerType: "touch", isPrimary: true, pointerId: 1, clientX: 100, clientY: 205 });
  await expect(page.locator("[data-lightbox-count]")).toHaveText("2 / 28");
  await page.keyboard.press("Escape");
  await page.route("**/photos/**", (route) => route.abort());
  await page.reload();
  await expect(page.locator("[data-photo]").first()).toHaveAttribute("src", "/photo-unavailable.svg");
  await page.locator("[data-gallery-link]").first().click();
  await expect(page.locator("[data-lightbox-caption]")).toContainText("Fotografie indisponibilă");
  await page.keyboard.press("Escape");
  await expect(page.locator("h1")).toBeVisible();
});

for (const remaining of [0, 1]) {
  test(`development-only fixture: ${remaining} photographs`, async ({ page }) => {
    await page.route("**/galerie/", async (route) => {
      const response = await route.fetch();
      let found = 0;
      const html = (await response.text()).replace(/<figure data-gallery-item[\s\S]*?<\/figure>/g, (figure) => found++ < remaining ? figure : "");
      expect(found).toBe(28);
      await route.fulfill({ response, body: html });
    });
    await page.goto("/galerie/");
    await expect(page.locator("[data-gallery-item]")).toHaveCount(remaining);
    if (remaining === 0) {
      await expect(page.locator("[data-gallery-empty]")).toBeVisible();
      await page.getByRole("button", { name: "Spații comune", exact: true }).click();
      await expect(page.locator("[data-gallery-count]")).toHaveText("0 fotografii");
    } else {
      await page.locator("[data-gallery-link]").click();
      await expect(page.locator("[data-lightbox-count]")).toHaveText("1 / 1");
      await expect(page.locator("[data-lightbox-next]")).toBeDisabled();
      await page.keyboard.press("ArrowRight");
      await expect(page.locator("[data-lightbox-count]")).toHaveText("1 / 1");
      await page.keyboard.press("Escape");
    }
  });
}

test("YouTube is never requested before consent and embeds only once", async ({ page }) => {
  const requests: string[] = [];
  page.on("request", (request) => requests.push(request.url()));
  await page.goto("/galerie/");
  await expect(page.locator(".video-frame iframe")).toHaveCount(0);
  expect(requests.some((url) => /youtube|ytimg|googlevideo/.test(url))).toBe(false);
  await page.route("https://www.youtube-nocookie.com/**", (route) => route.fulfill({ contentType: "text/html", body: "<title>External player test boundary</title>" }));
  await page.getByRole("button", { name: "Încarcă turul video" }).click();
  await expect(page.locator(".video-frame iframe")).toHaveCount(1);
  await expect(page.locator(".video-frame iframe")).toHaveAttribute("src", /youtube-nocookie\.com\/embed\/QKQ7DnCwRoc/);
  await expect(page.getByRole("button", { name: "Încarcă turul video" })).toHaveCount(0);
});
