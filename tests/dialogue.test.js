import { test } from "node:test";
import assert from "node:assert/strict";
import { newSession, recordInteraction, act } from "../server/model.js";
import { describeDialogue, speechForCompany } from "../src/agent-dialogue.js";
test("a real handoff becomes an addressed message, reply and next task above the correct agent", () => {
  const state = newSession(60);
  state.status = "running";
  const message = recordInteraction(
    state,
    { team: 1, agent: 1 },
    { team: 1, agent: 2 },
    "internal",
    "Техническое задание",
  );
  const t = message.time,
    company = state.teams[0];
  let speech = speechForCompany(
    company,
    state.interactions,
    t + 100,
    "running",
    t,
  );
  assert.equal(speech.agent, 1);
  assert.equal(speech.interactionId, message.id);
  assert.match(speech.text, /Developer/);
  speech = speechForCompany(
    company,
    state.interactions,
    t + 2000,
    "running",
    t,
  );
  assert.equal(speech.agent, 2);
  assert.match(speech.text, /разработку/);
  assert.equal(speech.mode, "speaking");
  speech = speechForCompany(
    company,
    state.interactions,
    t + 4000,
    "running",
    t,
  );
  assert.equal(speech.mode, "intent");
  assert.match(speech.text, /Иду разрабатывать/);
});
test("speech follows actual payment data and identifies both finance agents", () => {
  const state = newSession(60);
  act(state, { type: "trade", team: 1, seller: 2, service: "design" });
  const payment = state.interactions.find((i) => i.kind === "payment"),
    dialogue = describeDialogue(payment);
  assert.ok(dialogue.from.includes(String(state.trades[0].amount)));
  assert.equal(dialogue.fromRole, "Finance");
  assert.equal(dialogue.toRole, "Finance");
  assert.match(dialogue.toIntent, /баланс/);
});
test("pause freezes the conversation and inactive participants do not speak", () => {
  const state = newSession(60),
    message = recordInteraction(
      state,
      { team: 1, agent: 0 },
      { team: 1, agent: 1 },
      "internal",
      "План",
    ),
    t = message.time;
  const frozen = speechForCompany(
    state.teams[0],
    state.interactions,
    t + 100000,
    "paused",
    t + 2000,
  );
  assert.equal(frozen.mode, "speaking");
  assert.equal(frozen.agent, 1);
  state.teams[0].agents[0].active = false;
  state.teams[0].agents[1].active = false;
  assert.equal(
    speechForCompany(state.teams[0], state.interactions, t + 100, "running", t),
    null,
  );
});
