import { test } from "node:test";
import assert from "node:assert/strict";
import { seed, tick, act, profit } from "../server/model.js";
test("ten independent companies each have six role agents", () => {
  const s = seed();
  assert.equal(s.teams.length, 10);
  assert.equal(new Set(s.teams.map((t) => t.id)).size, 10);
  assert.ok(s.teams.every((t) => t.agents.length === 6));
});
test("running earns money, paused freezes balances and clock", () => {
  const s = seed();
  let t = s.teams[0],
    p = profit(t);
  tick(s, 5);
  assert.ok(profit(t) > p);
  act(s, { type: "toggle" });
  const before = structuredClone(s);
  tick(s, 10);
  assert.deepEqual(s, before);
});
test("A2A conserves cash across buyer and seller and records a deal", () => {
  const s = seed();
  const [buyer, seller] = s.teams;
  const before = profit(buyer) + profit(seller);
  act(s, { type: "trade", team: 1, seller: 2, service: "design" });
  assert.equal(profit(buyer) + profit(seller), before);
  assert.equal(buyer.boosts, 1);
  assert.equal(s.trades.length, 1);
  assert.equal(s.trades[0].amount, 1200);
});
test("invalid trade cannot mutate financial balances", () => {
  const s = seed(),
    before = structuredClone(s);
  assert.throws(() =>
    act(s, { type: "trade", team: 1, seller: 1, service: "design" }),
  );
  assert.deepEqual(s, before);
  assert.throws(() =>
    act(s, { type: "trade", team: 1, seller: 2, service: "unknown" }),
  );
  assert.deepEqual(s, before);
});
test("investment is expensed immediately and boosts future revenue", () => {
  const s = seed(),
    copy = structuredClone(s);
  act(s, { type: "boost", team: 1 });
  assert.equal(profit(s.teams[0]), profit(copy.teams[0]) - 3000);
  const start = s.teams[0].revenue;
  tick(s, 5);
  const control = copy.teams[0].revenue;
  tick(copy, 5);
  assert.ok(s.teams[0].revenue - start > copy.teams[0].revenue - control);
});
test("disabled agents stop task work and reduce revenue", () => {
  const s = seed(),
    copy = structuredClone(s);
  act(s, { type: "agent", team: 1, agent: 0 });
  const tasks = s.teams[0].agents[0].tasks;
  tick(s, 5);
  tick(copy, 5);
  assert.equal(s.teams[0].agents[0].tasks, tasks);
  assert.ok(s.teams[0].revenue < copy.teams[0].revenue);
});
test("timeout fixes ranking and rejects later economic changes", () => {
  const s = seed();
  s.elapsed = s.duration * 60 - 2;
  tick(s, 5);
  assert.equal(s.status, "finished");
  assert.equal(s.elapsed, s.duration * 60);
  const before = structuredClone(s);
  tick(s, 5);
  assert.deepEqual(s, before);
  assert.throws(() => act(s, { type: "boost", team: 1 }));
});
test("strategies affect both revenue and expenses", () => {
  const s = seed(),
    copy = structuredClone(s);
  act(s, { type: "strategy", team: 1, value: "growth" });
  tick(s, 5);
  tick(copy, 5);
  assert.ok(s.teams[0].revenue > copy.teams[0].revenue);
  assert.ok(s.teams[0].expenses > copy.teams[0].expenses);
});
test("autonomous A2A agents trade on schedule and update both ledgers", () => {
  const s = seed();
  s.round = 23;
  const totalBefore = s.trades.length;
  tick(s, 5);
  assert.equal(s.trades.length, totalBefore + 1);
  assert.equal(s.trades[0].automatic, true);
  const deal = s.trades[0];
  for (const id of [deal.buyer, deal.seller]) {
    const t = s.teams.find((t) => t.id === id);
    assert.equal(t.history.at(-1), profit(t));
  }
});
test("pausing a sales agent prevents its autonomous purchase", () => {
  const s = seed();
  s.round = 23;
  s.teams[3].agents[4].active = false;
  tick(s, 5);
  assert.equal(s.trades.length, 0);
});
test("all ten teams generate real internal agent messages on each cycle", () => {
  const state = seed();
  state.interactions = [];
  state.interactionCount = 0;
  state.round = 0;
  tick(state, 5);
  const internal = state.interactions.filter((i) => i.kind === "internal");
  assert.equal(internal.length, 10);
  assert.equal(new Set(internal.map((i) => i.from.team)).size, 10);
  assert.ok(internal.every((i) => i.from.agent === 0 && i.to.agent === 1));
  assert.ok(
    state.interactions.some(
      (i) => i.kind === "request" && i.from.team !== i.to.team,
    ),
  );
});
test("paused agents do not send internal messages and pausing freezes communications", () => {
  const state = seed();
  state.interactions = [];
  state.round = 0;
  state.teams[0].agents[0].active = false;
  tick(state, 5);
  assert.ok(
    !state.interactions.some((i) => i.kind === "internal" && i.from.team === 1),
  );
  act(state, { type: "toggle" });
  const before = structuredClone(state);
  tick(state, 5);
  assert.deepEqual(state, before);
});
test("trade messages reference the exact settled financial transaction", () => {
  const state = seed();
  state.interactions = [];
  act(state, { type: "trade", team: 1, seller: 2, service: "design" });
  const trade = state.trades[0],
    payment = state.interactions.find((i) => i.kind === "payment"),
    delivery = state.interactions.find((i) => i.kind === "delivery");
  assert.equal(payment.tradeId, trade.id);
  assert.equal(payment.amount, trade.amount);
  assert.deepEqual(payment.from, { team: 1, agent: 5 });
  assert.deepEqual(payment.to, { team: 2, agent: 5 });
  assert.equal(delivery.from.agent, 2);
  assert.equal(delivery.tradeId, trade.id);
});
