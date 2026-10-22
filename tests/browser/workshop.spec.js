import { test, expect } from "@playwright/test";
async function gotoOverview(page) {
  await page.goto("/");
  if (page.viewportSize().width < 761)
    await page.getByRole("button", { name: "Меню", exact: true }).click();
  await page.getByRole("button", { name: "Обзор", exact: true }).click();
}

test.beforeEach(async ({ request }) => {
  await request.post("/api/reset", { data: { duration: 60 } });
});
test("dashboard, ten companies and team selection", async ({ page }) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await gotoOverview(page);
  await expect(
    page.getByRole("heading", { name: "Большие идеи. Автономный бизнес." }),
  ).toBeVisible();
  await expect(page.getByLabel("Выбор компании").locator("option")).toHaveCount(
    10,
  );
  await page.getByLabel("Выбор компании").selectOption("7");
  await expect(
    page.getByRole("heading", { name: "Echo Agency", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Компании 10", exact: true }).click();
  await expect(page.locator(".company-card")).toHaveCount(10);
  await page
    .locator(".company-card")
    .filter({ hasText: "Axiom Group" })
    .click();
  await expect(page.getByLabel("Выбор компании")).toHaveValue("10");
  expect(errors).toEqual([]);
});
test("strategy, expense accounting and agent pause sync between clients", async ({
  page,
  context,
  request,
}) => {
  await gotoOverview(page);
  const second = await context.newPage();
  await gotoOverview(second);
  await page.getByRole("button", { name: "Управлять компанией" }).click();
  await page.getByRole("button", { name: "Рост Больше продаж" }).click();
  await page.getByRole("button", { name: "3 000 ₽" }).click();
  await expect(second.locator(".office-stats")).toContainText("3 000 ₽");
  await page
    .locator(".agent-options button")
    .filter({ hasText: "Developer" })
    .click();
  await page.getByRole("button", { name: "Приостановить агента" }).click();
  await expect(page.locator(".agent-summary")).toContainText("На паузе");
  const s = await (await request.get("/api/state")).json();
  expect(s.teams[0].strategy).toBe("growth");
  expect(s.teams[0].expenses).toBe(3000);
  expect(s.teams[0].agents[2].active).toBe(false);
  await second.close();
});
test("A2A service updates both companies and trade history", async ({
  page,
  request,
}) => {
  await gotoOverview(page);
  await page.getByRole("button", { name: "A2A-маркет", exact: true }).click();
  await page
    .locator(".market-card")
    .filter({ hasText: "Orbit Studio" })
    .getByRole("button", { name: "Заказать" })
    .click();
  await page.getByLabel("Выберите услугу").selectOption("design");
  await page.getByRole("button", { name: "Подтвердить сделку" }).click();
  await expect(page.locator(".trade-row")).toContainText("Дизайн");
  const s = await (await request.get("/api/state")).json();
  expect(s.teams[0].expenses).toBe(1200);
  expect(s.teams[1].revenue).toBe(1200);
  expect(s.teams[0].boosts).toBe(1);
});
test("session controls, final ranking, export and reset", async ({
  page,
  request,
}) => {
  await gotoOverview(page);
  await page.getByRole("button", { name: "Продолжить", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Воркшоп идёт" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Настройки сессии" }).click();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Пауза", exact: true })
    .click();
  await page.getByRole("button", { name: "Завершить", exact: true }).click();
  await page.getByRole("button", { name: "Завершить воркшоп" }).click();
  await expect(
    page.getByRole("heading", { name: "Результаты воркшопа." }),
  ).toBeVisible();
  const res = await request.get("/api/export");
  expect(res.headers()["content-type"]).toContain("text/csv");
  expect((await res.text()).trim().split("\n")).toHaveLength(11);
  await page.getByRole("button", { name: "Настройки сессии" }).click();
  await page.getByRole("button", { name: "Начать новую сессию" }).click();
  await page.getByLabel("Длительность воркшопа").selectOption("30");
  await page.getByRole("button", { name: "Сбросить и создать" }).click();
  const s = await (await request.get("/api/state")).json();
  expect(s.duration).toBe(30);
  expect(s.status).toBe("paused");
  expect(s.teams.every((t) => t.revenue === 0 && t.expenses === 0)).toBe(true);
});
test("mobile navigation, dialogs, ranking and market fit screen", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await gotoOverview(page);
  await expect(
    page.getByRole("heading", { name: "Большие идеи. Автономный бизнес." }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.getByRole("button", { name: "Меню", exact: true }).click();
  await page.getByRole("button", { name: "Как это работает" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page.getByRole("button", { name: "Меню", exact: true }).click();
  await page.getByRole("button", { name: "Рейтинг", exact: true }).click();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.getByRole("button", { name: "Меню", exact: true }).click();
  await page.getByRole("button", { name: "A2A-маркет", exact: true }).click();
  await expect(page.locator(".market-card")).toHaveCount(9);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});
test("online map broadcasts actual agent transactions to all connected screens", async ({
  page,
  context,
  request,
}) => {
  await page.goto("/");
  await expect(page.locator(".world-agent")).toHaveCount(60);
  const other = await context.newPage();
  await other.goto("/");
  await expect(other.locator(".world-company")).toHaveCount(10);
  const response = await request.post("/api/action", {
    data: { type: "trade", team: 1, seller: 2, service: "analytics" },
  });
  expect(response.ok()).toBe(true);
  for (const screen of [page, other]) {
    await expect(screen.locator(".stream-event")).toHaveCount(2);
    await expect(screen.locator(".stream-events")).toContainText(
      "Оплата подтверждена",
    );
    await expect(screen.locator(".world-wire")).toHaveCount(2);
  }
  const state = await (await request.get("/api/state")).json();
  expect(state.interactions.find((i) => i.kind === "payment").tradeId).toBe(
    state.trades[0].id,
  );
  await other.close();
});
