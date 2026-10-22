import { act, seed, tick, newSession, resultsCsv } from "../server/model.js";

export const isLocalDemo = import.meta.env.MODE === "pages";

function createDemoClient() {
  const storageKey = "zero-workshop-pages-v1";
  let state;
  try {
    const saved = JSON.parse(sessionStorage.getItem(storageKey));
    if (
      saved?.version === 1 &&
      saved.teams?.length === 10 &&
      ["running", "paused", "finished"].includes(saved.status)
    )
      state = saved;
  } catch {
    /* Storage may be disabled; the demo still works in memory. */
  }
  state ??= seed();
  let lastTick = Date.now();
  state.updatedAt = lastTick;
  const listeners = new Set();
  function publish() {
    state.updatedAt = lastTick;
    try {
      sessionStorage.setItem(storageKey, JSON.stringify(state));
    } catch {
      /* Keep the session in memory if storage is unavailable. */
    }
    for (const listener of listeners) listener(structuredClone(state));
  }
  return {
    subscribe(onState, onConnection) {
      listeners.add(onState);
      onConnection(true);
      publish();
      const timer = setInterval(() => {
        const now = Date.now();
        if (state.status !== "running") {
          lastTick = now;
          return;
        }
        let changed = false;
        while (now - lastTick >= 5000 && state.status === "running") {
          tick(state, 5);
          lastTick += 5000;
          changed = true;
        }
        if (changed) publish();
      }, 1000);
      return () => {
        listeners.delete(onState);
        clearInterval(timer);
      };
    },
    async action(action) {
      const oldStatus = state.status;
      act(state, action);
      if (oldStatus !== state.status) lastTick = Date.now();
      publish();
    },
    async reset(duration) {
      state = newSession(duration);
      lastTick = Date.now();
      publish();
    },
    exportResults() {
      const url = URL.createObjectURL(
        new Blob([resultsCsv(state)], { type: "text/csv;charset=utf-8" }),
      );
      const link = document.createElement("a");
      link.href = url;
      link.download = "zero-workshop-results.csv";
      document.body.append(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    },
  };
}

async function post(path, body) {
  const response = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const result = await response.json();
  if (!response.ok)
    throw new Error(result.error || "Не удалось выполнить действие");
}

function createServerClient() {
  return {
    subscribe(onState, onConnection) {
      const events = new EventSource("/api/events");
      events.onmessage = (event) => {
        onState(JSON.parse(event.data));
        onConnection(true);
      };
      events.onerror = () => onConnection(false);
      return () => events.close();
    },
    action: (action) => post("/api/action", action),
    reset: (duration) => post("/api/reset", { duration }),
    exportResults: () => window.location.assign("/api/export"),
  };
}

export const workshopClient = isLocalDemo
  ? createDemoClient()
  : createServerClient();
