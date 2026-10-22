import { test, expect } from "@playwright/test";
const key = "zero-workshop-pages-v1";
const snapshot = (page) =>
  page.evaluate((key) => JSON.parse(sessionStorage.getItem(key)), key);
test("online map renders all pixel offices and sixty inspectable agents", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("./");
  await expect(
    page.getByRole("heading", { name: "Агенты работают. Вы видите всё." }),
  ).toBeVisible();
  await expect(page.locator(".world-company")).toHaveCount(10);
  await expect(page.locator(".world-agent")).toHaveCount(60);
  await expect(page.locator(".world-agent [data-pixel-sprite]")).toHaveCount(
    60,
  );
  expect(
    await page
      .locator(".world-map-scroll")
      .evaluate((el) => el.scrollWidth <= el.clientWidth + 1),
  ).toBe(true);
  await page
    .getByRole("button", { name: "На весь экран", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Выйти из полного экрана" }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Стол 10: Finance", exact: true })
    .click();
  await expect
    .poll(() => page.evaluate(() => Boolean(document.fullscreenElement)))
    .toBe(false);
  await expect(page.getByRole("dialog")).toContainText("Axiom Group");
  await expect(page.getByRole("dialog")).toContainText("Finance Agent");
  expect(errors).toEqual([]);
});
test("real communications advance on map and stream, filters isolate teams, pause freezes", async ({
  page,
}) => {
  await page.clock.install();
  await page.goto("./");
  const before = (await snapshot(page)).interactionCount;
  await page.clock.runFor(6000);
  await expect(page.locator(".world-wire")).not.toHaveCount(0);
  expect((await snapshot(page)).interactionCount).toBeGreaterThan(before);
  await page.getByRole("button", { name: "A2A", exact: true }).click();
  await expect(page.locator(".stream-event").first()).toHaveClass(/external/);
  await page.locator(".stream-event").first().click();
  await expect(page.locator(".world-wire.wire-focused")).toHaveCount(1);
  await expect(page.locator(".world-focus")).toBeVisible();
  await page.getByLabel("Фильтр команды в эфире").selectOption("4");
  const events = page.locator(".stream-event");
  expect(await events.count()).toBeGreaterThan(0);
  expect(
    (await events.allTextContents()).every((text) =>
      text.includes("Flow Systems"),
    ),
  ).toBe(true);
  await page.getByRole("button", { name: "Пауза", exact: true }).click();
  const paused = await snapshot(page);
  await page.clock.runFor(10000);
  expect(await snapshot(page)).toEqual(paused);
  await expect(page.locator(".world-wire animateMotion")).toHaveCount(0);
});
test("pixel office, map zoom, fullscreen, reduced motion and mobile canvas work", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("./");
  await expect(page.locator(".world-wire animateMotion")).toHaveCount(0);
  await page.getByRole("button", { name: "Увеличить карту" }).click();
  await expect(page.locator(".zoom-controls")).toContainText("120%");
  await page.getByRole("button", { name: "Уменьшить карту" }).click();
  await page
    .getByRole("button", { name: "На весь экран", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Выйти из полного экрана" }),
  ).toBeVisible();
  expect(await page.evaluate(() => Boolean(document.fullscreenElement))).toBe(
    true,
  );
  await page.getByRole("button", { name: "Выйти из полного экрана" }).click();
  await expect(
    page.getByRole("button", { name: "На весь экран", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Обзор", exact: true }).click();
  await expect(page.locator(".pixel-office [data-pixel-sprite]")).toHaveCount(
    6,
  );
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "Меню", exact: true }).click();
  await page.getByRole("button", { name: "Онлайн", exact: true }).click();
  await expect(page.locator(".world-agent")).toHaveCount(60);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page
    .locator(".world-map-scroll")
    .evaluate((el) => (el.scrollLeft = el.scrollWidth));
  await page
    .getByRole("button", { name: "Стол 10: Finance", exact: true })
    .scrollIntoViewIfNeeded();
  await expect(
    page.getByRole("button", { name: "Стол 10: Finance", exact: true }),
  ).toBeInViewport();
});
test("overhead dialogues contain messages and then show the agents next task", async ({
  page,
}) => {
  await page.clock.install();
  await page.goto("./");
  await expect(page.locator(".world-map .dialogue-speaking")).not.toHaveCount(
    0,
  );
  const initial = page.locator(".world-map .agent-dialogue").first();
  await expect(initial).not.toContainText("...");
  await expect(
    page.locator(".world-map .agent-dialogue").filter({ hasText: "→" }).first(),
  ).toBeVisible();
  await page.clock.runFor(3500);
  await expect(page.locator(".world-map .dialogue-intent")).not.toHaveCount(0);
  await expect(
    page.locator(".world-map .dialogue-intent").first(),
  ).toContainText("Иду");
  const state = await page.evaluate(() =>
    JSON.parse(sessionStorage.getItem("zero-workshop-pages-v1")),
  );
  const ids = new Set(state.interactions.map((i) => i.id));
  for (const id of await page
    .locator(".world-map .agent-dialogue")
    .evaluateAll((items) => items.map((el) => el.dataset.interactionId)))
    expect(ids.has(id)).toBe(true);
  await page.getByRole("button", { name: "Пауза", exact: true }).click();
  const text = await page
    .locator(".world-map .agent-dialogue")
    .allTextContents();
  await page.clock.runFor(10000);
  expect(
    await page.locator(".world-map .agent-dialogue").allTextContents(),
  ).toEqual(text);
});
