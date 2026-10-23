import { defineConfig } from "@playwright/test";
const executablePath =
  process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH ||
  (process.env.CI ? undefined : "/usr/bin/chromium");
const base = process.env.PAGES_BASE_PATH || "/business-game-accel/";
export default defineConfig({
  testDir: "./tests/pages",
  workers: 1,
  reporter: process.env.CI ? [["list"], ["github"]] : "list",
  use: {
    baseURL: `http://127.0.0.1:4173${base}`,
    launchOptions: {
      ...(executablePath ? { executablePath } : {}),
      args: ["--no-sandbox"],
    },
    screenshot: "only-on-failure",
  },
  webServer: {
    command: "npm run preview:pages",
    url: `http://127.0.0.1:4173${base}`,
    reuseExistingServer: false,
  },
});
