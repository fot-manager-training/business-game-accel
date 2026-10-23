import { test } from "node:test";
import assert from "node:assert/strict";
import { newSession } from "../server/model.js";
import { companyPoses } from "../src/agent-motion.js";

const spots = Array.from({ length: 6 }, (_, i) => [
  43 + (i % 3) * 62,
  143 + Math.floor(i / 3) * 130,
]);

test("all ten companies meet in pairs inside their office and return to desks", () => {
  for (const team of newSession(60).teams) {
    const offset = (team.id - 1) * 670;
    const home = companyPoses(team, spots, 16000 - offset);
    const meeting = companyPoses(team, spots, 23000 - offset);
    for (let i = 0; i < 6; i++) {
      assert.deepEqual([home[i].x, home[i].y], spots[i]);
      assert.notEqual(meeting[i].y, spots[i][1]);
      assert.equal(meeting[meeting[i].partner].partner, i);
      assert.ok(Math.abs(meeting[i].x - meeting[meeting[i].partner].x) < 28);
      assert.ok(Math.abs(meeting[i].y - meeting[meeting[i].partner].y) < 30);
    }
    for (let time = 0; time < 48000; time += 250) {
      for (const pose of companyPoses(team, spots, time)) {
        assert.ok(pose.x >= 20 && pose.x <= 194);
        assert.ok(pose.y >= 143 && pose.y <= 273);
      }
    }
  }
});

test("inactive partners and reduced motion stay at their desks", () => {
  const team = newSession(60).teams[0];
  team.agents[3].active = false;
  const poses = companyPoses(team, spots, 7000);
  for (const i of [0, 3]) {
    assert.deepEqual([poses[i].x, poses[i].y], spots[i]);
    assert.equal(poses[i].moving, false);
  }
  companyPoses(team, spots, 7000, true).forEach((pose, i) => {
    assert.deepEqual([pose.x, pose.y], spots[i]);
    assert.equal(pose.moving, false);
  });
});
