import React, { useState, useEffect, useRef } from "react";
import {
  Radio,
  Expand,
  Minimize,
  Plus,
  Minus,
  Play,
  Pause,
  ArrowRight,
  ArrowUpRight,
  Network,
  MessageSquare,
  Zap,
  Filter,
  Clock3,
  Eye,
  X,
} from "lucide-react";
import WorldCanvas from "./WorldCanvas.jsx";
import { roles } from "../server/model.js";
const kindNames = {
  internal: "Внутри компании",
  request: "Запрос",
  offer: "Предложение",
  handoff: "Передача задачи",
  settlement: "Расчёты",
  delivery: "Результат",
  payment: "Оплата",
};
function ageLabel(time, now) {
  const seconds = Math.max(0, Math.floor((now - time) / 1000));
  return seconds < 3
    ? "сейчас"
    : seconds < 60
      ? `${seconds} сек назад`
      : `${Math.floor(seconds / 60)} мин назад`;
}
export default function LiveWorld({
  state,
  now,
  time,
  busy,
  onToggle,
  onCompany,
  onAgent,
}) {
  const [filter, setFilter] = useState(0),
    [kind, setKind] = useState("all"),
    [zoom, setZoom] = useState(1),
    [focus, setFocus] = useState(null),
    [fullscreen, setFullscreen] = useState(false),
    [reducedMotion, setReducedMotion] = useState(false);
  const consoleRef = useRef(null);
  useEffect(() => {
    const listener = () =>
      setFullscreen(document.fullscreenElement === consoleRef.current);
    document.addEventListener("fullscreenchange", listener);
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(motion.matches);
    update();
    motion.addEventListener("change", update);
    return () => {
      document.removeEventListener("fullscreenchange", listener);
      motion.removeEventListener("change", update);
    };
  }, []);
  useEffect(() => {
    if (focus && !(state.interactions || []).some((item) => item.id === focus))
      setFocus(null);
  }, [state.interactions, focus]);
  async function inspectAgent(team, index) {
    if (document.fullscreenElement === consoleRef.current)
      await document.exitFullscreen();
    onAgent(team, index);
  }
  const all = state.interactions || [];
  const matches = (i) =>
    (!filter || i.from.team === filter || i.to.team === filter) &&
    (kind === "all" || (kind === "internal") === (i.from.team === i.to.team));
  const interactions = all.filter(matches);
  const recent = all.filter((i) => now - i.time < 7500 && now - i.time >= 0);
  const wires = [
    ...all
      .filter((i) => i.from.team === i.to.team)
      .filter(
        (i, index, array) =>
          array.findIndex((x) => x.from.team === i.from.team) === index,
      ),
    ...all.filter((i) => i.from.team !== i.to.team).slice(0, 5),
  ].filter(matches);
  const activeCount = state.teams.reduce(
    (n, t) => n + t.agents.filter((a) => a.active).length,
    0,
  );
  const focused = all.find((i) => i.id === focus);
  const shownWires = focused
    ? [...wires.filter((i) => i.id !== focus), focused]
    : wires;
  const running = state.status === "running";
  const inspectTeam = filter || focused?.from.team || 1;
  async function toggleFullscreen() {
    if (document.fullscreenElement) await document.exitFullscreen();
    else if (consoleRef.current?.requestFullscreen)
      await consoleRef.current.requestFullscreen();
  }
  return (
    <section
      ref={consoleRef}
      className={`live-console ${running ? "is-running" : "is-paused"}`}
      aria-label="Онлайн-взаимодействия всех команд"
    >
      <div className="live-topline">
        <div className="live-heading">
          <span className="live-orb">
            <Radio size={19} />
          </span>
          <div>
            <h2>Живая экономика</h2>
            <p>Все команды. Все агенты. Каждое взаимодействие.</p>
          </div>
          <span className="live-label">
            <i />
            {running ? "LIVE" : state.status === "finished" ? "ИТОГИ" : "ПАУЗА"}
          </span>
        </div>
        <div className="live-controls">
          <span className="live-clock">
            <Clock3 size={14} />
            {time}
          </span>
          <button
            className="button small"
            disabled={busy || state.status === "finished"}
            onClick={onToggle}
          >
            {running ? <Pause size={14} /> : <Play size={14} />}
            <span>{running ? "Пауза" : "Продолжить"}</span>
          </button>
          <button
            className="icon-button"
            title={fullscreen ? "Выйти из полного экрана" : "На весь экран"}
            aria-label={
              fullscreen ? "Выйти из полного экрана" : "На весь экран"
            }
            onClick={toggleFullscreen}
            disabled={!document.fullscreenEnabled}
          >
            {fullscreen ? <Minimize size={16} /> : <Expand size={16} />}
          </button>
        </div>
      </div>
      <div className="live-summary">
        <div>
          <span className="pixel-square" />
          <strong>10</strong>
          <span>компаний</span>
        </div>
        <div>
          <span className="pixel-square cyan" />
          <strong>
            {activeCount}
            <small>/ 60</small>
          </strong>
          <span>агентов в работе</span>
        </div>
        <div>
          <MessageSquare size={13} />
          <strong>{state.interactionCount ?? all.length}</strong>
          <span>сообщений</span>
        </div>
        <div>
          <Network size={13} />
          <strong>{running ? recent.filter(matches).length : 0}</strong>
          <span>связей сейчас</span>
        </div>
        <div>
          <Zap size={13} />
          <strong>{state.trades.length}</strong>
          <span>A2A-сделок</span>
        </div>
      </div>
      <div className="live-layout">
        <div className="world-panel glass">
          <div className="world-toolbar">
            <div className="world-label">
              <span className="tiny-dot" /> ZERO WORLD{" "}
              <span>PIXEL EDITION / 01</span>
            </div>
            <div className="zoom-controls">
              <button
                aria-label="Уменьшить карту"
                disabled={zoom <= 0.8}
                onClick={() =>
                  setZoom((v) => Math.max(0.8, Math.round((v - 0.2) * 10) / 10))
                }
              >
                <Minus size={13} />
              </button>
              <span>{Math.round(zoom * 100)}%</span>
              <button
                aria-label="Увеличить карту"
                disabled={zoom >= 1.8}
                onClick={() =>
                  setZoom((v) => Math.min(1.8, Math.round((v + 0.2) * 10) / 10))
                }
              >
                <Plus size={13} />
              </button>
            </div>
          </div>
          <div className="world-map-scroll">
            <WorldCanvas
              state={state}
              now={now}
              zoom={zoom}
              filter={filter}
              shownWires={shownWires}
              focus={focus}
              running={running}
              reducedMotion={reducedMotion}
              inspectAgent={inspectAgent}
            />
          </div>
          <div className="world-legend">
            <span>
              <i className="legend-internal" />
              Внутри компании
            </span>
            <span>
              <i className="legend-external" />
              Между командами
            </span>
            <span>
              <i className="legend-payment" />
              Оплата
            </span>
            <small>Нажмите на агента, чтобы узнать, что он делает</small>
          </div>
          {focused && (
            <div className="world-focus">
              <span>{kindNames[focused.kind]}</span>
              <strong>
                {state.teams[focused.from.team - 1].name} /{" "}
                {roles[focused.from.agent]}
              </strong>
              <ArrowRight size={12} />
              <strong>
                {state.teams[focused.to.team - 1].name} /{" "}
                {roles[focused.to.agent]}
              </strong>
              <button
                aria-label="Снять выделение связи"
                onClick={() => setFocus(null)}
              >
                <X size={14} />
              </button>
            </div>
          )}
        </div>
        <aside className="world-stream glass">
          <div className="stream-heading">
            <div>
              <ActivityIcon />
              <h3>Прямой эфир</h3>
            </div>
            <span className="live-label">
              <i />
              {running ? "LIVE" : "ПАУЗА"}
            </span>
          </div>
          <div className="stream-filters">
            <label>
              <Filter size={12} />
              <select
                aria-label="Фильтр команды в эфире"
                value={filter}
                onChange={(e) => {
                  setFilter(Number(e.target.value));
                  setFocus(null);
                }}
              >
                <option value="0">Все 10 команд</option>
                {state.teams.map((t) => (
                  <option key={t.id} value={t.id}>
                    Стол {t.id} · {t.name}
                  </option>
                ))}
              </select>
            </label>
            <div className="stream-tabs">
              {[
                ["all", "Все"],
                ["external", "A2A"],
                ["internal", "Внутренние"],
              ].map(([value, label]) => (
                <button
                  key={value}
                  className={kind === value ? "selected" : ""}
                  onClick={() => {
                    setKind(value);
                    setFocus(null);
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div className="stream-events" aria-label="Лента сообщений агентов">
            {interactions.length === 0 ? (
              <div className="stream-empty">
                <MessageSquare size={25} />
                <strong>
                  {running ? "Агенты устанавливают связи" : "Эфир на паузе"}
                </strong>
                <p>
                  {running
                    ? "Первые сообщения появятся в течение 5 секунд."
                    : "Запустите симуляцию, чтобы увидеть работу всех команд."}
                </p>
              </div>
            ) : (
              interactions.slice(0, 16).map((i) => {
                const from = state.teams[i.from.team - 1],
                  to = state.teams[i.to.team - 1],
                  external = i.from.team !== i.to.team;
                return (
                  <button
                    key={i.id}
                    className={`stream-event ${focus === i.id ? "selected" : ""} ${external ? "external" : ""}`}
                    onClick={() => setFocus(focus === i.id ? null : i.id)}
                  >
                    <div className="stream-event-meta">
                      <span>{kindNames[i.kind]}</span>
                      <small>{ageLabel(i.time, now)}</small>
                    </div>
                    <div className="stream-endpoints">
                      <span style={{ color: from.color }}>
                        {String(from.id).padStart(2, "0")} ·{" "}
                        {roles[i.from.agent]}
                      </span>
                      <ArrowRight size={11} />
                      <span style={{ color: to.color }}>
                        {external ? String(to.id).padStart(2, "0") + " · " : ""}
                        {roles[i.to.agent]}
                      </span>
                    </div>
                    <p>{i.message}</p>
                    {i.amount && (
                      <b>
                        +{new Intl.NumberFormat("ru-RU").format(i.amount)} ₽ →{" "}
                        {to.name}
                      </b>
                    )}
                    <div className="stream-company-names">
                      {from.name}
                      {external ? ` → ${to.name}` : ""}
                    </div>
                  </button>
                );
              })
            )}
          </div>
          <button
            className="stream-open-company"
            onClick={() => onCompany(inspectTeam)}
          >
            Открыть {state.teams[inspectTeam - 1].name}
            <ArrowUpRight size={14} />
          </button>
        </aside>
      </div>
      <div className="live-footnote">
        <span>
          <Eye size={13} /> Один экран для всего воркшопа
        </span>
        <span>
          Сообщения формируются симуляцией · без LLM · финансовые сделки
          отражаются в рейтинге
        </span>
      </div>
    </section>
  );
}
function ActivityIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M1 9h3l2-6 4 10 2-6h3" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}
