import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  workers: 1,
  reporter: "list",
  use: {
    baseURL: process.env.PREVIEW_URL ?? "http://127.0.0.1:4330",
    browserName: "chromium",
    headless: true,
    viewport: { width: 1440, height: 1000 },
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
    launchOptions: { args: ["--enable-unsafe-swiftshader"] },
  },
  webServer: process.env.PREVIEW_URL ? undefined : {
    command: "npm run preview -- --port 4330",
    url: "http://127.0.0.1:4330",
    reuseExistingServer: false,
  },
});
