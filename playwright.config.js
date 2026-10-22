import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests/browser",
  fullyParallel: false,
  workers: 1,
  reporter: "list",
  use: {
    baseURL: "http://127.0.0.1:3002",
    launchOptions: {
      executablePath: "/usr/bin/chromium",
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
