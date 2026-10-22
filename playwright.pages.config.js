import { defineConfig } from "@playwright/test";
const base = process.env.PAGES_BASE_PATH || "/business-game-accel/";
export default defineConfig({
  testDir: "./tests/pages",
  workers: 1,
  reporter: "list",
  use: {
    baseURL: `http://127.0.0.1:4173${base}`,
    launchOptions: {
      ...(process.env.CI ? {} : { executablePath: "/usr/bin/chromium" }),
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
