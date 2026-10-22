import express from "express";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { seed, tick, act, newSession, resultsCsv } from "./model.js";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const file = path.join(
  process.env.ZERO_DATA_DIR || path.join(root, ".data"),
  "workshop.json",
);
fs.mkdirSync(path.dirname(file), { recursive: true });
let state;
try {
  state = JSON.parse(fs.readFileSync(file, "utf8"));
} catch {
  state = seed();
}
const save = () => {
  fs.writeFileSync(file + ".tmp", JSON.stringify(state));
  fs.renameSync(file + ".tmp", file);
};
const clients = new Set();
function broadcast() {
  state.updatedAt = Date.now();
  save();
  for (const c of clients) c.write(`data: ${JSON.stringify(state)}\n\n`);
}
const app = express();
app.use(express.json({ limit: "16kb" }));
app.get("/api/state", (_, res) => res.json(state));
app.get("/api/events", (req, res) => {
  res.set({
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });
  res.flushHeaders();
  res.write(`data: ${JSON.stringify(state)}\n\n`);
  clients.add(res);
  req.on("close", () => clients.delete(res));
});
app.post("/api/action", (req, res) => {
  try {
    act(state, req.body);
    broadcast();
    res.json({ ok: true });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});
app.post("/api/reset", (req, res) => {
  try {
    state = newSession(Number(req.body.duration));
    broadcast();
    res.json({ ok: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
app.get("/api/export", (_, res) => {
  res
    .set(
      "Content-Disposition",
      'attachment; filename="zero-workshop-results.csv"',
    )
    .type("text/csv")
    .send(resultsCsv(state));
});
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(root, "dist")));
  app.get("/{*path}", (_, res) =>
    res.sendFile(path.join(root, "dist/index.html")),
  );
}

const timer = setInterval(() => {
  if (state.status === "running") {
    tick(state, 5);
    broadcast();
  }
}, 5000);
const server = app.listen(Number(process.env.PORT) || 3001, "0.0.0.0", () =>
  console.log(
    "ZERO workshop API listening on port " + (process.env.PORT || 3001),
  ),
);
process.on("SIGTERM", () => {
  clearInterval(timer);
  save();
  server.close();
  process.exit(0);
});
