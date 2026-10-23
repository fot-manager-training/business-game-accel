import { defineConfig } from "@playwright/test";
const executablePath =
  process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH ||
  (process.env.CI ? undefined : "/usr/bin/chromium");
export default defineConfig({
  testDir: "./tests/browser",
  fullyParallel: false,
  workers: 1,
  reporter: process.env.CI ? [["list"], ["github"]] : "list",
  use: {
    baseURL: "http://127.0.0.1:3002",
    launchOptions: {
      ...(executablePath ? { executablePath } : {}),
      args: ["--no-sandbox"],
    },
    screenshot: "only-on-failure",
  },
  webServer: {
    command:
      "NODE_ENV=production PORT=3002 ZERO_DATA_DIR=/tmp/zero-browser-test node server/index.js",
    url: "http://127.0.0.1:3002/api/state",
    reuseExistingServer: false,
  },
});
