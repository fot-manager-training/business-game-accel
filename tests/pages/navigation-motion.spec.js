import { test, expect } from "@playwright/test";

test("sidebar hides, expands the workspace, remembers preference, and restores", async ({
  page,
}) => {
  await page.goto("./");
  const sidebar = page.getByRole("complementary", { name: "Боковая панель" });
  const shell = page.locator(".main-shell");
  const width = (await shell.boundingBox()).width;
  await page.getByRole("button", { name: "Скрыть боковую панель" }).click();
  await expect(sidebar).toBeHidden();
  await expect
    .poll(async () => (await shell.boundingBox()).width)
    .toBeGreaterThan(width + 100);
  await expect(page.locator(".world-agent")).toHaveCount(60);
  await page.reload();
  await expect(sidebar).toBeHidden();
  const restore = page.getByRole("button", { name: "Показать боковую панель" });
  await expect(restore).toHaveAttribute("aria-expanded", "false");
  await restore.focus();
  await page.keyboard.press("Enter");
  await expect(sidebar).toBeVisible();
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(sidebar).toBeHidden();
  const menu = page.getByRole("button", { name: "Меню", exact: true });
  await menu.click();
  await expect(sidebar).toBeVisible();
  await page.getByRole("button", { name: "Закрыть боковую панель" }).click();
  await expect(sidebar).toBeHidden();
  await expect(menu).toBeFocused();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});

test("agents travel in every company, bubbles follow, pause freezes, and offices animate", async ({
  page,
}) => {
  await page.clock.install();
  await page.goto("./");
  const positions = () =>
    page
      .locator(".world-agent .pixel-person")
      .evaluateAll((items) => items.map((el) => el.getAttribute("transform")));
  const before = await positions();
  await page.clock.runFor(6000);
  const after = await positions();
  for (let team = 0; team < 10; team++) {
    expect(after.slice(team * 6, team * 6 + 6)).not.toEqual(
      before.slice(team * 6, team * 6 + 6),
    );
  }
  const speech = page.locator(".world-map .agent-dialogue").first();
  const [team, agent] = (await speech.getAttribute("data-speaker"))
    .split(":")
    .map(Number);
  const transform = after[(team - 1) * 6 + agent];
  const x = Number(transform.match(/translate\(([^ ]+)/)[1]);
  const bubblePath = await speech.locator("path").getAttribute("d");
  expect(Number(bubblePath.match(/^M([^ ]+)/)[1]) + 6).toBeCloseTo(x, 2);
  await page.getByRole("button", { name: "Пауза", exact: true }).click();
  const frozen = await positions();
  await page.clock.runFor(5000);
  expect(await positions()).toEqual(frozen);
  await expect(page.locator(".world-agent[data-moving=true]")).toHaveCount(0);
  await page.getByRole("button", { name: "Продолжить", exact: true }).click();
  await page.clock.runFor(500);
  expect(await positions()).not.toEqual(frozen);
  await page.getByRole("button", { name: "Обзор", exact: true }).click();
  const officePositions = () =>
    page
      .locator(".pixel-office .pixel-person")
      .evaluateAll((items) => items.map((el) => el.getAttribute("transform")));
  const officeBefore = await officePositions();
  await page.clock.runFor(2000);
  expect(await officePositions()).not.toEqual(officeBefore);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator(".scene-agent[data-moving=true]")).toHaveCount(0);
  const still = await officePositions();
  await page.clock.runFor(2000);
  expect(await officePositions()).toEqual(still);
});
