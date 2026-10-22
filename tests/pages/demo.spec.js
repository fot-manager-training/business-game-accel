import { test, expect } from "@playwright/test";
import fs from "node:fs/promises";
const key = "zero-workshop-pages-v1";
const snapshot = (page) =>
  page.evaluate((key) => JSON.parse(sessionStorage.getItem(key)), key);
async function showOverview(page) {
  if (page.viewportSize().width < 761)
    await page.getByRole("button", { name: "Меню", exact: true }).click();
  await page.getByRole("button", { name: "Обзор", exact: true }).click();
}
async function freshSession(page) {
  await page.goto("./");
  await showOverview(page);
  if (page.viewportSize().width < 761)
    await page.getByRole("button", { name: "Меню", exact: true }).click();
  await page.getByRole("button", { name: "Настройки сессии" }).click();
  await page.getByRole("button", { name: "Начать новую сессию" }).click();
  await page.getByRole("button", { name: "Сбросить и создать" }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
}
test("public subpath loads all assets with no backend or external requests", async ({
  page,
}) => {
  const errors = [],
    broken = [],
    apis = [],
    external = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("response", (response) => {
    if (response.status() >= 400) broken.push(response.url());
  });
  page.on("request", (request) => {
    const url = new URL(request.url());
    if (url.pathname.startsWith("/api/")) apis.push(url.pathname);
    if (url.protocol.startsWith("http") && url.hostname !== "127.0.0.1")
      external.push(url.href);
  });
  await page.goto("./");
  await expect(
    page.getByRole("heading", { name: "Агенты работают. Вы видите всё." }),
  ).toBeVisible();
  await expect(page.getByText("Публичное демо", { exact: true })).toBeVisible();
  await expect(page.locator(".world-company")).toHaveCount(10);
  await expect(page.locator(".world-agent")).toHaveCount(60);
  await page.evaluate(() => document.fonts.ready);
  expect(
    (await snapshot(page)).teams.every((team) => team.agents.length === 6),
  ).toBe(true);
  expect(errors).toEqual([]);
  expect(broken).toEqual([]);
  expect(apis).toEqual([]);
  expect(external).toEqual([]);
});
test("strategy, investment and agent state persist across refresh", async ({
  page,
}) => {
  await freshSession(page);
  await page.getByRole("button", { name: "Управлять компанией" }).click();
  await page.getByRole("button", { name: "Рост Больше продаж" }).click();
  await page.getByRole("button", { name: "3 000 ₽" }).click();
  await page
    .locator(".agent-options button")
    .filter({ hasText: "Developer" })
    .click();
  await page.getByRole("button", { name: "Приостановить агента" }).click();
  await expect(page.locator(".agent-summary")).toContainText("На паузе");
  await page.reload();
  await showOverview(page);
  await expect(page.locator(".office-stats")).toContainText("3 000 ₽");
  const company = (await snapshot(page)).teams[0];
  expect(company.strategy).toBe("growth");
  expect(company.boosts).toBe(1);
  expect(company.agents[2].active).toBe(false);
});
test("A2A deal, final leaderboard and CSV work without a server", async ({
  page,
}) => {
  await freshSession(page);
  await page.getByRole("button", { name: "A2A-маркет", exact: true }).click();
  await page
    .locator(".market-card")
    .filter({ hasText: "Orbit Studio" })
    .getByRole("button", { name: "Заказать" })
    .click();
  await page.getByLabel("Выберите услугу").selectOption("design");
  await page.getByRole("button", { name: "Подтвердить сделку" }).click();
  await expect(page.locator(".trade-row")).toContainText("Дизайн");
  const state = await snapshot(page);
  expect(state.teams[0].expenses).toBe(1200);
  expect(state.teams[1].revenue).toBe(1200);
  await page.getByRole("button", { name: "Настройки сессии" }).click();
  await page.getByRole("button", { name: "Завершить", exact: true }).click();
  await page.getByRole("button", { name: "Завершить воркшоп" }).click();
  await expect(page.locator(".ranking-table-row").first()).toContainText(
    "Orbit Studio",
  );
  const pending = page.waitForEvent("download");
  await page.getByRole("button", { name: "Скачать результаты" }).click();
  const download = await pending;
  expect(download.suggestedFilename()).toBe("zero-workshop-results.csv");
  const csv = await fs.readFile(await download.path(), "utf8");
  expect(csv.trim().split("\n")).toHaveLength(11);
  expect(csv).toContain("1,2,Orbit Studio,1200,0,1200");
});
test("clock drives autonomous deals, pause freezes and timeout locks results", async ({
  page,
}) => {
  await page.clock.install();
  await freshSession(page);
  await page.getByRole("button", { name: "Продолжить", exact: true }).click();
  await page.clock.runFor(31000);
  let state = await snapshot(page);
  expect(state.elapsed).toBe(30);
  expect(state.trades).toHaveLength(1);
  expect(state.trades[0].automatic).toBe(true);
  await page.getByRole("button", { name: "Пауза", exact: true }).click();
  const frozen = await snapshot(page);
  await page.clock.runFor(10000);
  expect(await snapshot(page)).toEqual(frozen);
  await page.getByRole("button", { name: "Продолжить", exact: true }).click();
  await page.clock.fastForward(60 * 60 * 1000);
  state = await snapshot(page);
  expect(state.elapsed).toBe(3600);
  expect(state.status).toBe("finished");
  await page.getByRole("button", { name: "Управлять компанией" }).click();
  await expect(page.getByRole("button", { name: "3 000 ₽" })).toBeDisabled();
});
test("mobile demo and visitors have independent sessions", async ({
  page,
  browser,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await freshSession(page);
  await page.getByRole("button", { name: "Меню", exact: true }).click();
  await page.getByRole("button", { name: "A2A-маркет", exact: true }).click();
  await expect(page.locator(".market-card")).toHaveCount(9);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  const context = await browser.newContext();
  const other = await context.newPage();
  await other.goto(page.url());
  await expect(
    other.getByRole("heading", { name: "Агенты работают. Вы видите всё." }),
  ).toBeVisible();
  expect((await snapshot(page)).elapsed).toBe(0);
  expect((await snapshot(other)).elapsed).toBeGreaterThan(0);
  await context.close();
});
