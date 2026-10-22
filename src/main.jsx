import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import {
  LayoutDashboard,
  Building2,
  ArrowUpRight,
  ArrowDownRight,
  ArrowRight,
  Activity,
  Network,
  Trophy,
  Settings2,
  BookOpen,
  ChevronDown,
  ChevronRight,
  Plus,
  Pause,
  Play,
  Clock3,
  MoreHorizontal,
  X,
  Check,
  CheckCheck,
  Download,
  RotateCcw,
  Flag,
  Volume2,
  VolumeX,
  Command,
  Radio,
  Layers,
  Wallet,
  TrendingUp,
  Users,
  Target,
  Zap,
  Globe,
  PanelLeftClose,
  Menu,
  ExternalLink,
  ArrowLeft,
  CheckCircle2,
  BriefcaseBusiness,
  Sparkles,
  Bot,
  SlidersHorizontal,
} from "lucide-react";
import "./styles.css";
import { workshopClient, isLocalDemo } from "./workshop-client.js";
const money = (n) => new Intl.NumberFormat("ru-RU").format(Math.round(n));
const rub = (n) => `${money(n)} ₽`;
const profit = (t) => t.revenue - t.expenses;
const roleNames = [
  "Стратегия и управление",
  "Развитие продукта",
  "Разработка и интеграции",
  "Привлечение клиентов",
  "Продажи и сделки",
  "Финансы и аналитика",
];
const strategies = {
  balanced: {
    title: "Баланс",
    description: "Устойчивый рост и контроль расходов",
    icon: SlidersHorizontal,
  },
  growth: {
    title: "Рост",
    description: "Больше продаж и выше инвестиции",
    icon: TrendingUp,
  },
  efficient: {
    title: "Эффективность",
    description: "Меньше расходов, умеренный рост",
    icon: Target,
  },
};
function Person({ color = "#b9f48b", variant = 0, ...props }) {
  return (
    <g {...props} className="person">
      <ellipse cx="0" cy="9" rx="21" ry="8" fill="#080e0d" opacity=".26" />
      <path
        d="M-12-16v20q2 6 9 0l3-20M4-16v20q3 6 10 0l-2-20"
        stroke="#354046"
        strokeWidth="9"
        strokeLinecap="round"
      />
      <path
        d="M-17 4l-6 3q-1 6 14 5l7-3-1-5M7 4l-2 5q6 6 17 1l-1-4-8-2"
        fill="#d7ded5"
      />
      <path
        d="M-15-57q-9 4-10 23l1 10q5 6 8-2l3-16M15-57q9 3 11 23l-1 9q-5 6-8-2l-2-17"
        stroke="#e0bba1"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <path d="M-15-58q14-10 30 0l5 33q-17 13-39 0z" fill={color} />
      <path d="M-13-55l-3 27q12 8 27 1l3-28" fill="url(#bodyShade)" />
      <path d="M-4-63v9q5 5 10 0v-9" fill="#d5ac91" />
      <rect x="-15" y="-88" width="32" height="32" rx="13" fill="#e9c7aa" />
      <path
        d={
          variant % 3 === 0
            ? "M-16-69v-15q0-14 18-13 20 0 15 23l-6-6-3-8-13 5-3 14"
            : variant % 3 === 1
              ? "M-16-72q-7-26 17-26 20 0 17 23l-8-9-12 2-10 10"
              : "M-16-70v-16q3-14 20-10 20 2 14 22l-10-13-15 4-5 14"
        }
        fill={["#323735", "#b3a490", "#52535e"][variant % 3]}
      />
      {variant % 2 === 0 ? (
        <>
          <rect x="-13" y="-76" width="26" height="9" rx="4" fill="#29393b" />
          <path d="M-9-73h6" stroke="#a5d8c9" strokeWidth="2" />
        </>
      ) : (
        <>
          <circle cx="-6" cy="-73" r="1.5" fill="#333" />
          <circle cx="7" cy="-73" r="1.5" fill="#333" />
          <path d="M-2-65q4 2 7-1" stroke="#a47f6e" fill="none" />
        </>
      )}
      <rect
        x="9"
        y="-49"
        width="6"
        height="8"
        rx="1"
        fill="#fff"
        opacity=".65"
      />
    </g>
  );
}
function Office({ team, onAgent, status }) {
  const spots = [
    [416, 139],
    [245, 206],
    [555, 213],
    [355, 287],
    [492, 316],
    [655, 282],
  ];
  return (
    <div className="office-scene">
      <div className="scene-grain" />
      <svg
        viewBox="0 0 800 410"
        role="img"
        aria-label={`Виртуальный офис ${team.name}, шесть AI-агентов`}
      >
        <defs>
          <linearGradient id="floor" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#61756d" stopOpacity=".32" />
            <stop offset="1" stopColor="#25312e" stopOpacity=".3" />
          </linearGradient>
          <linearGradient id="desk">
            <stop stopColor="#8b9b90" />
            <stop offset="1" stopColor="#455650" />
          </linearGradient>
          <linearGradient id="bodyShade">
            <stop stopColor="#fff" stopOpacity=".12" />
            <stop offset="1" stopColor="#000" stopOpacity=".18" />
          </linearGradient>
          <linearGradient id="glass" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#b5eccb" stopOpacity=".16" />
            <stop offset="1" stopColor="#b5eccb" stopOpacity=".01" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="6" />
          </filter>
          <pattern
            id="grid"
            width="45"
            height="25"
            patternUnits="userSpaceOnUse"
            patternTransform="skewY(-28)"
          >
            <path
              d="M45 0H0V25"
              stroke="#9db7aa"
              strokeOpacity=".06"
              fill="none"
            />
          </pattern>
        </defs>
        <ellipse
          cx="410"
          cy="327"
          rx="280"
          ry="61"
          fill="#000"
          opacity=".2"
          filter="url(#glow)"
        />
        <path
          d="M95 205L402 46 726 219 420 389z"
          fill="url(#floor)"
          stroke="#9bb9a2"
          strokeOpacity=".22"
        />
        <path d="M95 205v12l325 185 306-169v-14L420 389z" fill="#2a3630" />
        <path
          d="M95 205l325 184 306-170"
          fill="none"
          stroke="#a1e0aa"
          strokeOpacity=".3"
        />
        <path d="M100 207L402 51 721 220 420 384z" fill="url(#grid)" />
        <path
          d="M97 205V103L401-54V47"
          fill="url(#glass)"
          stroke="#b4e1c4"
          strokeOpacity=".07"
        />
        <path
          d="M402 47V-53L726 119v100"
          fill="url(#glass)"
          stroke="#b4e1c4"
          strokeOpacity=".07"
        />
        <path
          d="M123 189V116M186 154V82M251 122V48M315 87V14M471 83V11M537 118V47M603 153V82M669 188V117"
          stroke="#b2dfbd"
          strokeOpacity=".08"
        />
        <g opacity=".7">
          <path d="M146 225l25 14 25-14-24-14z" fill="#637b62" />
          <path d="M146 225v22l25 14v-22M196 225v22l-25 14" fill="#3e5041" />
          <path
            d="M172 219v-46M171 195q-32-15-18-30 25 8 18 30M173 204q29-10 24-28-26 2-24 28M172 181q20-21 6-36-20 15-6 36"
            fill="#7b9c6d"
            stroke="#7b9c6d"
            strokeWidth="4"
          />
        </g>
        {[
          [298, 172],
          [497, 185],
          [408, 267],
          [589, 275],
        ].map(([x, y], i) => (
          <g key={i}>
            <path
              d={`M${x - 34} ${y + 10}v36M${x + 35} ${y + 8}v37`}
              stroke="#53625a"
              strokeWidth="5"
            />
            <path
              d={`M${x - 55} ${y - 4}l51-28 67 36-51 28z`}
              fill="url(#desk)"
              stroke="#8f9f92"
              strokeOpacity=".3"
            />
            <path d={`M${x - 55} ${y - 4}v6l67 36v-6l-67-36`} fill="#34463c" />
            <path
              d={`M${x - 10} ${y - 19}v-31l31 17v31z`}
              fill="#26352f"
              stroke="#9dbca6"
              strokeWidth="1.5"
            />
            <path
              d={`M${x - 6} ${y - 23}v-21l23 12v22z`}
              fill="#a2d6b1"
              opacity=".48"
            />
            <path
              d={`M${x + 1} ${y - 33}l11 6M${x + 1} ${y - 27}l7 4`}
              stroke="#c9f9cf"
              strokeWidth="1.5"
            />
            <path
              d={`M${x - 6} ${y + 2}l16-9 21 12-15 9z`}
              fill="#a2afa2"
              opacity=".6"
            />
            <ellipse cx={x + 40} cy={y + 7} rx="4" ry="2" fill="#c6d4be" />
            <path d={`M${x + 36} ${y + 7}v-10q4-4 8 0v10`} fill="#b7c6ae" />
          </g>
        ))}
        {spots.map(([x, y], i) => (
          <g
            key={i}
            onClick={() => onAgent(i)}
            className={`scene-agent ${!team.agents[i].active ? "agent-paused" : ""}`}
            tabIndex="0"
            role="button"
            aria-label={`Открыть агента ${team.agents[i].role}`}
            onKeyDown={(e) => {
              if (e.key === "Enter") onAgent(i);
            }}
          >
            <Person
              transform={`translate(${x} ${y}) scale(.72)`}
              color={
                [
                  "#cadcbb",
                  "#afc5dd",
                  "#d6c7af",
                  "#c8b9d9",
                  "#b4d5c2",
                  "#d5d6bb",
                ][i]
              }
              variant={i}
            />
            <g transform={`translate(${x + 12} ${y - 91})`}>
              <rect
                x="-26"
                width="63"
                height="20"
                rx="6"
                fill="#23302b"
                stroke="#829d84"
                strokeOpacity=".3"
              />
              <circle
                cx="-17"
                cy="10"
                r="2.5"
                fill={team.agents[i].active ? "#b6f389" : "#e1bd7e"}
              />
              <text
                x="-9"
                y="13"
                fill="#d0d9cf"
                fontSize="8"
                fontFamily="Arial"
              >
                {team.agents[i].role}
              </text>
            </g>
          </g>
        ))}
        <path
          d="M225 293l76 42M545 352l79-43"
          stroke="#b6f389"
          strokeOpacity=".3"
          strokeWidth="2"
          strokeDasharray="4 7"
        />
        <circle cx="420" cy="389" r="3" fill="#b6f389" />
        <path d="M402 46l18-9 17 9-18 10z" fill="#c9efaa" opacity=".45" />
      </svg>
      <div className="office-location">
        <span className="tiny-dot" />{" "}
        {status === "running"
          ? "Автономный режим"
          : status === "paused"
            ? "Симуляция на паузе"
            : "Сессия завершена"}{" "}
        <span>
          {team.agents.filter((a) => a.active).length} агентов · A2A protocol
        </span>
      </div>
      <div className="scene-corner">
        ISOMETRIC VIEW <span>{String(team.id).padStart(2, "0")} / 10</span>
      </div>
    </div>
  );
}
function Sparkline({ values, color = "#b8f38c", large = false }) {
  const w = large ? 520 : 100,
    h = large ? 140 : 32;
  const min = Math.min(...values, 0),
    max = Math.max(...values, 1),
    pts = values.map(
      (v, i) =>
        `${(i * w) / Math.max(values.length - 1, 1)},${h - 6 - ((v - min) / (max - min)) * (h - 14)}`,
    );
  return (
    <svg
      className="sparkline"
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient
          id={large ? "areaLarge" : "areaSmall"}
          x1="0"
          y1="0"
          x2="0"
          y2="1"
        >
          <stop stopColor={color} stopOpacity=".18" />
          <stop offset="1" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d={`M0,${h} L${pts.join(" L")} L${w},${h}Z`}
        fill={`url(#${large ? "areaLarge" : "areaSmall"})`}
      />
      <polyline
        points={pts.join(" ")}
        fill="none"
        stroke={color}
        strokeWidth={large ? "2" : "1.6"}
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
function App() {
  const [state, setState] = useState(null),
    [connected, setConnected] = useState(false),
    [page, setPage] = useState("overview"),
    [selected, setSelected] = useState(1),
    [modal, setModal] = useState(null),
    [agent, setAgent] = useState(0),
    [toast, setToast] = useState(""),
    [duration, setDuration] = useState(60),
    [seller, setSeller] = useState(2),
    [service, setService] = useState("analytics"),
    [busy, setBusy] = useState(false),
    [mobile, setMobile] = useState(false),
    [guide, setGuide] = useState(false),
    [now, setNow] = useState(Date.now());
  useEffect(() => {
    const unsubscribe = workshopClient.subscribe(setState, setConnected);
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => {
      unsubscribe();
      clearInterval(timer);
    };
  }, []);
  useEffect(() => {
    if (!modal && !guide) return;
    const previous = document.activeElement;
    const old = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const timer = setTimeout(
      () => document.querySelector(".modal button")?.focus(),
      0,
    );
    const trap = (e) => {
      if (e.key !== "Tab") return;
      const list = [
        ...document.querySelectorAll(
          ".modal button:not(:disabled),.modal select:not(:disabled),.modal a[href]",
        ),
      ];
      const first = list[0],
        last = list.at(-1);
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    };
    document.addEventListener("keydown", trap);
    return () => {
      clearTimeout(timer);
      document.body.style.overflow = old;
      document.removeEventListener("keydown", trap);
      previous?.focus();
    };
  }, [modal, guide]);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 4000);
    return () => clearTimeout(t);
  }, [toast]);
  useEffect(() => {
    const key = (e) => {
      if (e.key === "Escape") {
        setModal(null);
        setGuide(false);
        setMobile(false);
      }
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, []);
  async function action(a, success) {
    setBusy(true);
    try {
      await workshopClient.action({ team: selected, ...a });
      if (success) setToast(success);
      return true;
    } catch (e) {
      setToast(e.message);
      return false;
    } finally {
      setBusy(false);
    }
  }
  async function reset() {
    setBusy(true);
    try {
      await workshopClient.reset(duration);
      setModal(null);
      setToast(
        "Новая сессия создана. Нажмите «Продолжить», когда команды будут готовы.",
      );
    } catch (e) {
      setToast(e.message);
    } finally {
      setBusy(false);
    }
  }
  if (!state)
    return (
      <div className="loading">
        <div className="brand-mark">Z</div>
        <p>
          Подключаем компании<span className="loading-dots">...</span>
        </p>
        <small>
          {connected ? "Загружаем воркшоп" : "Соединение с сервером воркшопа"}
        </small>
      </div>
    );
  const team = state.teams.find((t) => t.id === selected),
    ranked = [...state.teams].sort((a, b) => profit(b) - profit(a)),
    total = state.teams.reduce((a, t) => a + profit(t), 0),
    active = state.teams.reduce(
      (a, t) => a + t.agents.filter((x) => x.active).length,
      0,
    ),
    rank = ranked.findIndex((t) => t.id === selected) + 1;
  const elapsed = Math.min(
      state.duration * 60,
      state.elapsed +
        (state.status === "running"
          ? Math.max(0, (now - state.updatedAt) / 1000)
          : 0),
    ),
    remaining = Math.max(0, state.duration * 60 - elapsed),
    time = `${Math.floor(remaining / 60)
      .toString()
      .padStart(2, "0")}:${Math.floor(remaining % 60)
      .toString()
      .padStart(2, "0")}`;
  const openAgent = (i) => {
    setAgent(i);
    setModal("agent");
  };
  const nav = (id, label, Icon, badge) => (
    <button
      className={`nav-item ${page === id ? "active" : ""}`}
      onClick={() => {
        setPage(id);
        setMobile(false);
      }}
    >
      <Icon size={18} />
      <span>{label}</span>
      {badge && <span className="nav-badge">{badge}</span>}
    </button>
  );
  const companyCard = (t) => (
    <button
      key={t.id}
      className={`company-card glass ${selected === t.id ? "selected" : ""}`}
      onClick={() => {
        setSelected(t.id);
        setPage("overview");
        window.scrollTo({ top: 0, behavior: "smooth" });
      }}
    >
      <div className="company-card-top">
        <span className="table-index">
          СТОЛ {String(t.id).padStart(2, "0")}
        </span>
        <span className="company-state">
          <i />{" "}
          {state.status === "finished"
            ? "Финиш"
            : state.status === "paused"
              ? "Пауза"
              : "В работе"}
        </span>
      </div>
      <div className="company-identity">
        <div className="company-logo" style={{ "--company-color": t.color }}>
          <Layers size={21} />
        </div>
        <div>
          <h3>{t.name}</h3>
          <p>{t.sector}</p>
        </div>
        <ArrowUpRight size={16} />
      </div>
      <div className="company-finance">
        <div>
          <small>Прибыль</small>
          <strong>{rub(profit(t))}</strong>
        </div>
        <Sparkline values={t.history} color={t.color} />
      </div>
      <div className="company-card-bottom">
        <span>
          <Users size={12} />
          {t.agents.filter((a) => a.active).length} агентов
        </span>
        <span>
          {ranked.findIndex((x) => x.id === t.id) + 1} место{" "}
          <ArrowUpRight size={12} />
        </span>
      </div>
    </button>
  );
  return (
    <div className="app">
      {mobile && (
        <button
          className="mobile-scrim"
          onClick={() => setMobile(false)}
          aria-label="Закрыть меню"
        />
      )}
      <aside
        inert={!!modal || guide}
        className={`sidebar ${mobile ? "is-open" : ""}`}
      >
        <a
          className="brand"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setPage("overview");
          }}
        >
          <div className="brand-symbol">
            <span />
            <span />
          </div>
          <span>
            zero<span className="brand-period">.</span>
          </span>
          <span className="brand-beta">LAB</span>
        </a>
        <div className="workspace-switch">
          <div className="workspace-icon">
            <Command size={18} />
          </div>
          <div>
            <strong>Акселератор</strong>
            <small>Workshop space</small>
          </div>
          <ChevronDown size={15} />
        </div>
        <div className="nav-caption">РАБОЧЕЕ ПРОСТРАНСТВО</div>
        <nav>
          {nav("overview", "Обзор", LayoutDashboard)}
          {nav("companies", "Компании", Building2, "10")}
          {nav("network", "A2A-маркет", Network)}
          {nav("ranking", "Рейтинг", Trophy)}
        </nav>
        <div className="sidebar-divider" />
        <div className="nav-caption">ВОРКШОП</div>
        <button
          className="nav-item"
          onClick={() => {
            setModal("settings");
            setMobile(false);
          }}
        >
          <Settings2 size={18} />
          <span>Настройки сессии</span>
        </button>
        <button
          className="nav-item"
          onClick={() => {
            setGuide(true);
            setMobile(false);
          }}
        >
          <BookOpen size={18} />
          <span>Как это работает</span>
          <ArrowUpRight size={14} />
        </button>
        <div className="sidebar-bottom">
          <div className="experiment-box">
            <div>
              <span className="experiment-icon">
                <Sparkles size={17} />
              </span>
              <span>Zero Human Company</span>
            </div>
            <p>
              Люди задают направление.
              <br />
              Агенты создают результат.
            </p>
            <button
              onClick={() => {
                setGuide(true);
                setMobile(false);
              }}
            >
              Исследовать концепцию <ArrowUpRight size={14} />
            </button>
          </div>
          <div className="host">
            <div className="host-avatar">АК</div>
            <div>
              <strong>Акселератор</strong>
              <small>Организатор воркшопа</small>
            </div>
            <button
              aria-label="Настройки организатора"
              onClick={() => {
                setModal("settings");
                setMobile(false);
              }}
            >
              <MoreHorizontal size={18} />
            </button>
          </div>
        </div>
      </aside>
      <div className="main-shell" inert={!!modal || guide}>
        <header className="topbar">
          <div className="breadcrumb">
            <button
              className="mobile-toggle"
              onClick={() => setMobile(!mobile)}
              aria-label="Меню"
            >
              <Menu size={20} />
            </button>
            <span>Рабочее пространство</span>
            <ChevronRight size={13} />
            <strong>
              {
                {
                  overview: "Обзор",
                  companies: "Компании",
                  network: "A2A-маркет",
                  ranking: "Рейтинг",
                }[page]
              }
            </strong>
          </div>
          <div className="topbar-right">
            <span className={`connection ${connected ? "" : "offline"}`}>
              <i />
              {connected
                ? isLocalDemo
                  ? "Демо в вашем браузере"
                  : "Все системы в норме"
                : "Переподключение…"}
            </span>
            <span className="topbar-divider" />
            <button
              className="help-button"
              onClick={() => {
                setGuide(true);
                setMobile(false);
              }}
              aria-label="Помощь"
            >
              ?
            </button>
            <span className="profile-circle">АК</span>
          </div>
        </header>
        <main>
          <div className="page-heading">
            <div>
              <div className="eyebrow">
                <span className="eyebrow-line" /> ZERO HUMAN COMPANY{" "}
                <span>/</span> WORKSHOP 001
              </div>
              <h1>
                {
                  {
                    overview: "Большие идеи. Автономный бизнес.",
                    companies: "10 столов. 10 новых компаний.",
                    network: "Компании работают вместе.",
                    ranking:
                      state.status === "finished"
                        ? "Результаты воркшопа."
                        : "Результат говорит сам за себя.",
                  }[page]
                }
              </h1>
              <p>
                {
                  {
                    overview:
                      "Создавайте компанию, управляйте агентами и превращайте решения в прибыль.",
                    companies:
                      "У каждой команды своя стратегия. У каждого агента — своя миссия.",
                    network:
                      "Агенты находят партнёров, обмениваются услугами и создают новую ценность.",
                    ranking:
                      "Рейтинг компаний по чистой прибыли. Каждое решение меняет расстановку сил.",
                  }[page]
                }
              </p>
            </div>
            <button
              className="button subtle session-label"
              onClick={() => {
                setModal("settings");
                setMobile(false);
              }}
            >
              <span className="live-dot" />
              {state.status === "running"
                ? "Воркшоп идёт"
                : state.status === "paused"
                  ? "Воркшоп на паузе"
                  : "Воркшоп завершён"}
              <ChevronDown size={14} />
            </button>
          </div>
          {isLocalDemo && (
            <div className="demo-notice">
              <Globe size={15} />
              <strong>Публичное демо</strong>
              <span>
                У каждого посетителя своя игра. Прогресс сохраняется в этой
                вкладке.
              </span>
              <button
                onClick={() => {
                  setGuide(true);
                  setMobile(false);
                }}
              >
                Как играть <ArrowUpRight size={13} />
              </button>
            </div>
          )}
          {page === "overview" && (
            <>
              <section className="metrics">
                <div className="metric glass">
                  <div className="metric-label">
                    Общая прибыль <Wallet size={16} />
                  </div>
                  <div className="metric-value">
                    {rub(total)}
                    <span className="positive">
                      <ArrowUpRight size={13} /> LIVE
                    </span>
                  </div>
                  <div className="metric-foot">
                    <span className="mini-line" /> Суммарный результат 10
                    компаний
                  </div>
                </div>
                <div className="metric glass">
                  <div className="metric-label">
                    Компании в игре <Building2 size={16} />
                  </div>
                  <div className="metric-value">
                    10 <span className="metric-total">/ 10</span>
                    <div className="tiny-bars">
                      {state.teams.map((t) => (
                        <i key={t.id} />
                      ))}
                    </div>
                  </div>
                  <div className="metric-foot">
                    <span className="tiny-dot" /> Все команды подключены к
                    симуляции
                  </div>
                </div>
                <div className="metric glass">
                  <div className="metric-label">
                    Автономные агенты <Bot size={16} />
                  </div>
                  <div className="metric-value">
                    {active}
                    <span className="metric-tag">A2A</span>
                  </div>
                  <div className="metric-foot">
                    {active} работают <span className="foot-divider">·</span>{" "}
                    {60 - active} на паузе
                  </div>
                </div>
                <div className="metric glass timer-metric">
                  <div className="metric-label">
                    До конца воркшопа <Clock3 size={16} />
                  </div>
                  <div className="metric-value timer-value">
                    {time}
                    <button
                      aria-label={
                        state.status === "running" ? "Пауза" : "Продолжить"
                      }
                      disabled={state.status === "finished" || busy}
                      onClick={() => action({ type: "toggle" })}
                    >
                      {state.status === "running" ? (
                        <Pause size={16} />
                      ) : (
                        <Play size={16} />
                      )}
                    </button>
                  </div>
                  <div className="timer-track">
                    <i
                      style={{
                        width: `${(elapsed / (state.duration * 60)) * 100}%`,
                      }}
                    />
                  </div>
                  <div className="timer-captions">
                    <span>Старт</span>
                    <span>{state.duration} минут</span>
                  </div>
                </div>
              </section>
              <div className="workspace-grid">
                <section className="office-panel glass">
                  <div className="panel-heading">
                    <div className="panel-title">
                      <span className="small-icon">
                        <Building2 size={17} />
                      </span>
                      <h2>Ваша компания</h2>
                      <span className="pill">
                        СТОЛ {String(selected).padStart(2, "0")}
                      </span>
                    </div>
                    <div className="select-wrap">
                      <select
                        aria-label="Выбор компании"
                        value={selected}
                        onChange={(e) => setSelected(Number(e.target.value))}
                      >
                        {state.teams.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.name}
                          </option>
                        ))}
                      </select>
                      <ChevronDown size={13} />
                    </div>
                  </div>
                  <div className="office-company-heading">
                    <div>
                      <div className="office-name">
                        <span
                          className="company-logo"
                          style={{ "--company-color": team.color }}
                        >
                          <Layers size={22} />
                        </span>
                        <h3>{team.name}</h3>
                        <span className="online-label">
                          <i /> ONLINE
                        </span>
                      </div>
                      <p>
                        {team.sector} <span>·</span> Основана сегодня.
                        Управляется агентами.
                      </p>
                    </div>
                    <button
                      className="icon-button"
                      aria-label="Настроить компанию"
                      onClick={() => setModal("strategy")}
                    >
                      <Settings2 size={17} />
                    </button>
                  </div>
                  <Office
                    team={team}
                    onAgent={openAgent}
                    status={state.status}
                  />
                  <div className="office-stats">
                    <div>
                      <span>Выручка</span>
                      <strong>{rub(team.revenue)}</strong>
                    </div>
                    <div>
                      <span>Расходы</span>
                      <strong>{rub(team.expenses)}</strong>
                    </div>
                    <div>
                      <span>
                        Чистая прибыль <ArrowUpRight size={12} />
                      </span>
                      <strong className="mint">{rub(profit(team))}</strong>
                    </div>
                    <div>
                      <span>В рейтинге</span>
                      <strong>
                        <Trophy size={14} /> {rank}
                        <small> / 10</small>
                      </strong>
                    </div>
                  </div>
                  <div className="office-actions">
                    <div className="avatar-stack">
                      {team.agents.slice(0, 4).map((a, i) => (
                        <div key={i} className="mini-avatar">
                          <svg viewBox="-25 -100 50 70">
                            <Person variant={i} />
                          </svg>
                        </div>
                      ))}
                      <span>+2</span>
                    </div>
                    <span className="office-agents-label">
                      Ваша автономная команда
                    </span>
                    <button
                      className="button small"
                      onClick={() => setModal("strategy")}
                    >
                      Управлять компанией <ArrowUpRight size={14} />
                    </button>
                  </div>
                </section>
                <section className="leaderboard-panel glass">
                  <div className="panel-heading">
                    <div className="panel-title">
                      <Trophy size={17} />
                      <h2>Лидеры воркшопа</h2>
                    </div>
                    <span className="live-label">
                      <i /> LIVE
                    </span>
                  </div>
                  <div className="leaderboard-description">
                    Идеи разные. Цель одна — прибыль.
                  </div>
                  <div className="leaderboard-list">
                    {ranked.slice(0, 5).map((t, i) => (
                      <button
                        className={`leader-row ${t.id === selected ? "yours" : ""}`}
                        key={t.id}
                        onClick={() => setSelected(t.id)}
                      >
                        <span className={`rank-number rank-${i}`}>
                          {i === 0 ? (
                            <Trophy size={15} />
                          ) : (
                            String(i + 1).padStart(2, "0")
                          )}
                        </span>
                        <div
                          className="rank-logo"
                          style={{ "--company-color": t.color }}
                        >
                          <Layers size={17} />
                        </div>
                        <div className="rank-company">
                          <strong>
                            {t.name}
                            {t.id === selected && <span>ВЫ</span>}
                          </strong>
                          <small>Стол {String(t.id).padStart(2, "0")}</small>
                        </div>
                        <div className="rank-profit">
                          <strong>{rub(profit(t))}</strong>
                          <span>
                            <ArrowUpRight size={11} /> прибыль
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                  <button
                    className="leaderboard-all"
                    onClick={() => setPage("ranking")}
                  >
                    Полный рейтинг <ArrowRight size={15} />
                  </button>
                  <div className="leaderboard-note">
                    <div className="note-icon">
                      <Flag size={16} />
                    </div>
                    <div>
                      <strong>Финиш решает всё</strong>
                      <p>
                        Рейтинг фиксируется, когда
                        <br />
                        заканчивается время воркшопа.
                      </p>
                    </div>
                  </div>
                </section>
              </div>
              <section className="companies-section">
                <div className="section-heading">
                  <div>
                    <h2>
                      Компании на старте будущего <span>10</span>
                    </h2>
                    <p>От стола к столу — целая экономика автономных команд.</p>
                  </div>
                  <button
                    className="text-button"
                    onClick={() => setPage("companies")}
                  >
                    Все компании <ArrowUpRight size={15} />
                  </button>
                </div>
                <div className="companies-grid">
                  {state.teams.slice(0, 5).map(companyCard)}
                </div>
              </section>
              <div className="bottom-grid">
                <section className="glass activity-panel">
                  <div className="panel-heading">
                    <div className="panel-title">
                      <Activity size={17} />
                      <h2>Пульс компании</h2>
                    </div>
                    <span className="live-label">
                      <i /> LIVE
                    </span>
                  </div>
                  <div className="activity-list">
                    {state.events
                      .filter((e) => e.team === selected)
                      .slice(0, 4)
                      .map((e) => (
                        <div className="activity-row" key={e.id}>
                          <span className="activity-dot" />
                          <div>
                            <strong>{e.role}</strong> {e.text}
                            <small>
                              {new Date(e.time).toLocaleTimeString("ru-RU", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </small>
                          </div>
                          {e.amount && (
                            <span className={e.amount > 0 ? "mint" : "expense"}>
                              {e.amount > 0 ? "+" : ""}
                              {rub(e.amount)}
                            </span>
                          )}
                        </div>
                      ))}
                    {!state.events.some((e) => e.team === selected) && (
                      <div className="empty-inline">
                        Здесь появятся действия агентов после запуска.
                      </div>
                    )}
                  </div>
                </section>
                <section className="glass network-promo">
                  <div className="network-art">
                    <Network size={58} />
                    <span />
                    <span />
                  </div>
                  <div>
                    <span className="eyebrow">AGENT TO AGENT</span>
                    <h2>Одна компания. Больше связей.</h2>
                    <p>
                      Пусть ваши агенты найдут новых партнёров
                      <br />
                      среди других команд воркшопа.
                    </p>
                    <button
                      className="text-button mint"
                      onClick={() => setPage("network")}
                    >
                      Открыть A2A-маркет <ArrowUpRight size={15} />
                    </button>
                  </div>
                </section>
              </div>
            </>
          )}
          {page === "companies" && (
            <>
              <div className="section-toolbar">
                <span>
                  <span className="tiny-dot" /> 10 компаний в одной экосистеме
                </span>
                <button
                  className="button subtle"
                  onClick={() => {
                    setGuide(true);
                    setMobile(false);
                  }}
                >
                  <BookOpen size={15} /> Правила игры
                </button>
              </div>
              <div className="companies-grid full">
                {state.teams.map(companyCard)}
              </div>
              <div className="glass explanation">
                <Bot size={23} />
                <div>
                  <h3>Команда управляет решениями. Агенты — операционкой.</h3>
                  <p>
                    Выберите компанию, чтобы поменять стратегию, инвестировать в
                    продукт или приостановить отдельного агента.
                  </p>
                </div>
              </div>
            </>
          )}
          {page === "ranking" && (
            <>
              <div className="ranking-banner glass">
                <div>
                  <span className="eyebrow">
                    {state.status === "finished"
                      ? "ФИНАЛЬНЫЙ РЕЗУЛЬТАТ"
                      : "LIVE LEADERBOARD"}
                  </span>
                  <h2>
                    {state.status === "finished"
                      ? `${ranked[0].name} — победитель воркшопа`
                      : "Каждая минута меняет игру"}
                  </h2>
                  <p>
                    {state.status === "finished"
                      ? "Итоговая прибыль зафиксирована. Спасибо всем десяти командам!"
                      : "Побеждает компания с наибольшей чистой прибылью на момент завершения."}
                  </p>
                </div>
                <button
                  className="button"
                  onClick={() => workshopClient.exportResults()}
                >
                  <Download size={16} /> Скачать результаты
                </button>
              </div>
              <div className="ranking-table glass">
                <div className="ranking-table-head">
                  <span>МЕСТО</span>
                  <span>КОМПАНИЯ</span>
                  <span>ВЫРУЧКА</span>
                  <span>РАСХОДЫ</span>
                  <span>ЧИСТАЯ ПРИБЫЛЬ</span>
                  <span>ДИНАМИКА</span>
                </div>
                {ranked.map((t, i) => (
                  <button
                    className="ranking-table-row"
                    key={t.id}
                    onClick={() => {
                      setSelected(t.id);
                      setPage("overview");
                    }}
                  >
                    <span className={`rank-number rank-${i}`}>
                      {i === 0 ? (
                        <Trophy size={18} />
                      ) : (
                        String(i + 1).padStart(2, "0")
                      )}
                    </span>
                    <span className="ranking-company">
                      <span
                        className="rank-logo"
                        style={{ "--company-color": t.color }}
                      >
                        <Layers size={18} />
                      </span>
                      <span>
                        <strong>{t.name}</strong>
                        <small>
                          Стол {String(t.id).padStart(2, "0")} · {t.sector}
                        </small>
                      </span>
                    </span>
                    <span>{rub(t.revenue)}</span>
                    <span className="muted">{rub(t.expenses)}</span>
                    <strong className="mint">{rub(profit(t))}</strong>
                    <Sparkline values={t.history} />
                  </button>
                ))}
              </div>
            </>
          )}
          {page === "network" && (
            <>
              <div className="market-banner glass">
                <div className="network-orb">
                  <Network size={46} />
                </div>
                <div>
                  <span className="eyebrow">A2A PROTOCOL · SIMULATION</span>
                  <h2>Ваш следующий клиент — за соседним столом.</h2>
                  <p>
                    Закажите услугу другой компании. Сделка пополнит её выручку
                    <br />и повысит производительность вашей команды на 8%.
                  </p>
                </div>
                <div className="market-as-company">
                  <small>Ваша компания</small>
                  <div className="select-wrap">
                    <select
                      aria-label="Компания покупателя"
                      value={selected}
                      onChange={(e) => setSelected(Number(e.target.value))}
                    >
                      {state.teams.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={14} />
                  </div>
                </div>
              </div>
              <div className="section-heading">
                <div>
                  <h2>
                    Открыты к сотрудничеству <span>9</span>
                  </h2>
                  <p>Фиксированная стоимость услуги — 1 200 ₽. Без комиссий.</p>
                </div>
                <span className="pill">DEMO MARKET</span>
              </div>
              <div className="market-grid">
                {state.teams
                  .filter((t) => t.id !== selected)
                  .map((t, i) => (
                    <div className="market-card glass" key={t.id}>
                      <div className="market-card-top">
                        <div
                          className="company-logo"
                          style={{ "--company-color": t.color }}
                        >
                          <Layers size={23} />
                        </div>
                        <span className="online-label">
                          <i /> ДОСТУПНА
                        </span>
                      </div>
                      <h3>{t.name}</h3>
                      <p>{t.sector}</p>
                      <div className="service-tags">
                        <span>Аналитика</span>
                        <span>Дизайн</span>
                        <span>Маркетинг</span>
                      </div>
                      <div className="market-card-bottom">
                        <strong>
                          1 200 ₽ <small>/ услуга</small>
                        </strong>
                        <button
                          className="button small"
                          disabled={state.status === "finished"}
                          onClick={() => {
                            setSeller(t.id);
                            setModal("trade");
                          }}
                        >
                          Заказать <ArrowUpRight size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
              <section className="glass activity-panel trade-history">
                <div className="panel-heading">
                  <div className="panel-title">
                    <CheckCheck size={17} />
                    <h2>Завершённые A2A-сделки</h2>
                  </div>
                  <span className="pill">{state.trades.length}</span>
                </div>
                {state.trades.length === 0 ? (
                  <div className="empty-inline">
                    Пока нет сделок. Первое партнёрство начинается с вас.
                  </div>
                ) : (
                  state.trades.slice(0, 8).map((t) => (
                    <div className="trade-row" key={t.id}>
                      <CheckCircle2 size={17} />
                      <strong>
                        {state.teams.find((x) => x.id === t.buyer).name}
                      </strong>
                      <ArrowRight size={14} />
                      <strong>
                        {state.teams.find((x) => x.id === t.seller).name}
                      </strong>
                      <span>
                        {
                          {
                            analytics: "Аналитика",
                            design: "Дизайн",
                            marketing: "Маркетинг",
                          }[t.service]
                        }
                        {t.automatic ? " · авто" : ""}
                      </span>
                      <b>{rub(t.amount)}</b>
                    </div>
                  ))
                )}
              </section>
            </>
          )}
          <footer>
            <span>
              <span className="footer-logo">zero.</span> Designed for a
              humanless future.
            </span>
            <span>
              PoC · Симуляция без LLM <span className="footer-dot">·</span> Все
              суммы игровые
            </span>
            <button
              onClick={() => {
                setGuide(true);
                setMobile(false);
              }}
            >
              Сделано для больших идей <ArrowUpRight size={12} />
            </button>
          </footer>
        </main>
      </div>
      {toast && (
        <div className="toast" role="status">
          <CheckCircle2 size={18} />
          {toast}
          <button onClick={() => setToast("")} aria-label="Закрыть уведомление">
            <X size={15} />
          </button>
        </div>
      )}
      {(modal || guide) && (
        <div
          className="modal-backdrop"
          onClick={() => {
            setModal(null);
            setGuide(false);
          }}
        >
          <section
            className={`modal glass ${guide ? "guide-modal" : ""}`}
            role="dialog"
            aria-modal="true"
            aria-label={guide ? "Как это работает" : "Управление воркшопом"}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="modal-close"
              onClick={() => {
                setModal(null);
                setGuide(false);
              }}
              aria-label="Закрыть"
            >
              <X size={20} />
            </button>
            {guide ? (
              <>
                <div className="modal-icon">
                  <Sparkles size={24} />
                </div>
                <div className="eyebrow">ZERO HUMAN COMPANY</div>
                <h2>
                  Люди придумывают.
                  <br />
                  Компании работают сами.
                </h2>
                <p className="modal-intro">
                  Воркшоп о будущем бизнеса, где все операционные роли выполняют
                  автономные агенты.
                </p>
                <div className="guide-steps">
                  {[
                    [
                      "01",
                      "Одна команда — одна компания",
                      "10 столов получают по 100 000 ₽ стартового капитала и 6 агентов: CEO, Product, Developer, Marketing, Sales и Finance.",
                    ],
                    [
                      "02",
                      "Решения за вами",
                      "Выбирайте стратегию, инвестируйте в развитие и заказывайте услуги у других компаний. Каждый шаг влияет на прибыль.",
                    ],
                    [
                      "03",
                      "Побеждает результат",
                      "Каждые 5 секунд симуляция начисляет выручку и расходы. По завершении таймера побеждает максимальная чистая прибыль.",
                    ],
                  ].map(([n, h, p]) => (
                    <div key={n}>
                      <span>{n}</span>
                      <div>
                        <h3>{h}</h3>
                        <p>{p}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="info-note">
                  <Bot size={18} />
                  <p>
                    Это PoC без LLM: агенты работают по правилам симуляции.{" "}
                    {isLocalDemo
                      ? "У каждого посетителя своя сессия в браузере."
                      : "Все экраны подключены к общей сессии."}{" "}
                    Управление открыто для демонстрации, авторизация не
                    подключена.
                  </p>
                </div>
                <button
                  className="button primary wide"
                  onClick={() => setGuide(false)}
                >
                  Понятно, к игре <ArrowRight size={16} />
                </button>
              </>
            ) : modal === "strategy" ? (
              <>
                <span className="eyebrow">
                  СТОЛ {String(selected).padStart(2, "0")} · {team.name}
                </span>
                <h2>Вы задаёте направление.</h2>
                <p className="modal-intro">
                  Агенты выполняют работу. Вы выбираете, как растёт компания.
                </p>
                <h4>Стратегия компании</h4>
                <div className="strategy-options">
                  {Object.entries(strategies).map(([id, s]) => (
                    <button
                      key={id}
                      disabled={busy || state.status === "finished"}
                      className={team.strategy === id ? "selected" : ""}
                      onClick={() =>
                        action(
                          { type: "strategy", value: id },
                          `Стратегия «${s.title}» применена`,
                        )
                      }
                    >
                      <s.icon size={19} />
                      <div>
                        <strong>{s.title}</strong>
                        <small>{s.description}</small>
                      </div>
                      {team.strategy === id && <Check size={17} />}
                    </button>
                  ))}
                </div>
                <div className="investment">
                  <div>
                    <strong>Инвестировать в продукт</strong>
                    <p>+8% к выручке на каждый цикл симуляции</p>
                  </div>
                  <button
                    className="button primary small"
                    disabled={busy || state.status === "finished"}
                    onClick={() =>
                      action(
                        { type: "boost" },
                        "Инвестиция принята: производительность выросла на 8%",
                      )
                    }
                  >
                    3 000 ₽ <Plus size={14} />
                  </button>
                </div>
                <h4>
                  Команда агентов{" "}
                  <span>
                    {team.agents.filter((a) => a.active).length}/6 активны
                  </span>
                </h4>
                <div className="agent-options">
                  {team.agents.map((a, i) => (
                    <button key={i} onClick={() => openAgent(i)}>
                      <div className="agent-head">
                        <svg viewBox="-25 -100 50 65">
                          <Person variant={i} />
                        </svg>
                      </div>
                      <div>
                        <strong>{a.role}</strong>
                        <small>{a.active ? "Работает" : "На паузе"}</small>
                      </div>
                      <ChevronRight size={14} />
                    </button>
                  ))}
                </div>
                <div className="info-note">
                  <Wallet size={17} />
                  <p>
                    Доступный капитал:{" "}
                    <strong>{rub(100000 + profit(team))}</strong>. Чистая
                    прибыль учитывает все инвестиции и A2A-сделки.
                  </p>
                </div>
              </>
            ) : modal === "agent" ? (
              <>
                <div className="agent-portrait">
                  <svg viewBox="-40 -110 80 130">
                    <Person variant={agent} color={team.color} />
                  </svg>
                </div>
                <span className="eyebrow">{team.name} · AI AGENT</span>
                <h2>{team.agents[agent].role} Agent</h2>
                <p className="modal-intro">
                  {roleNames[agent]}. Автономный участник вашей компании.
                </p>
                <div className="agent-summary">
                  <div>
                    <small>Статус</small>
                    <strong className="mint">
                      {team.agents[agent].active ? "В работе" : "На паузе"}
                    </strong>
                  </div>
                  <div>
                    <small>Задач выполнено</small>
                    <strong>{team.agents[agent].tasks}</strong>
                  </div>
                  <div>
                    <small>Протокол</small>
                    <strong>A2A / v1</strong>
                  </div>
                </div>
                <div className="info-note">
                  <Activity size={17} />
                  <p>
                    Активный агент участвует в каждом цикле симуляции. Пауза
                    снижает и выручку, и операционные расходы компании.
                  </p>
                </div>
                <button
                  className="button primary wide"
                  disabled={busy || state.status === "finished"}
                  onClick={() =>
                    action({ type: "agent", agent }, "Статус агента обновлён")
                  }
                >
                  {team.agents[agent].active ? (
                    <Pause size={16} />
                  ) : (
                    <Play size={16} />
                  )}{" "}
                  {team.agents[agent].active
                    ? "Приостановить агента"
                    : "Возобновить работу"}
                </button>
                <button
                  className="text-button back-link"
                  onClick={() => setModal("strategy")}
                >
                  <ArrowLeft size={14} /> К управлению компанией
                </button>
              </>
            ) : modal === "trade" ? (
              <>
                <div className="modal-icon">
                  <Network size={23} />
                </div>
                <span className="eyebrow">AGENT TO AGENT</span>
                <h2>Новая связь. Новая ценность.</h2>
                <p className="modal-intro">
                  {team.name} заказывает услугу у{" "}
                  {state.teams.find((t) => t.id === seller)?.name}.
                </p>
                <label className="field-label" htmlFor="service">
                  Выберите услугу
                </label>
                <select
                  className="form-select"
                  id="service"
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                >
                  <option value="analytics">Аналитика рынка</option>
                  <option value="design">Дизайн продукта</option>
                  <option value="marketing">Маркетинговая кампания</option>
                </select>
                <div className="deal-summary">
                  <div>
                    <span>Стоимость</span>
                    <strong>1 200 ₽</strong>
                  </div>
                  <div>
                    <span>Эффект для вашей компании</span>
                    <strong className="mint">+8% к выручке / цикл</strong>
                  </div>
                  <div>
                    <span>Исполнение</span>
                    <strong>Мгновенно · симуляция</strong>
                  </div>
                </div>
                <button
                  className="button primary wide"
                  disabled={busy || state.status === "finished"}
                  onClick={async () => {
                    if (
                      await action(
                        { type: "trade", seller, service },
                        "A2A-сделка выполнена. Связь между компаниями создана.",
                      )
                    )
                      setModal(null);
                  }}
                >
                  Подтвердить сделку <ArrowRight size={16} />
                </button>
                <p className="form-hint">
                  1 200 ₽ будут учтены в расходах вашей компании
                  <br />и выручке партнёра. Реальные платежи не проводятся.
                </p>
              </>
            ) : modal === "settings" ? (
              <>
                <div className="modal-icon">
                  <Settings2 size={23} />
                </div>
                <span className="eyebrow">WORKSHOP CONTROL</span>
                <h2>Ритм задаёте вы.</h2>
                <p className="modal-intro">
                  {isLocalDemo
                    ? "Локальная сессия для 10 игровых команд. Результаты сохраняются в этой вкладке и не передаются другим посетителям."
                    : "Общая сессия для всех 10 команд. Изменения появятся на каждом подключённом экране."}
                </p>
                <div className="session-summary">
                  <span>До завершения</span>
                  <strong>{time}</strong>
                  <span className="pill">
                    {state.status === "running"
                      ? "LIVE"
                      : state.status === "paused"
                        ? "ПАУЗА"
                        : "ФИНИШ"}
                  </span>
                </div>
                <div className="settings-actions">
                  <button
                    className="button primary"
                    disabled={busy || state.status === "finished"}
                    onClick={() => action({ type: "toggle" })}
                  >
                    {state.status === "running" ? (
                      <Pause size={16} />
                    ) : (
                      <Play size={16} />
                    )}{" "}
                    {state.status === "running" ? "Пауза" : "Продолжить"}
                  </button>
                  <button
                    className="button"
                    disabled={state.status === "finished"}
                    onClick={() => setModal("finish")}
                  >
                    <Flag size={16} /> Завершить
                  </button>
                </div>
                <button
                  className="settings-row"
                  onClick={() => workshopClient.exportResults()}
                >
                  <Download size={17} />
                  <div>
                    <strong>Экспортировать результаты</strong>
                    <small>Все компании и финансы в формате CSV</small>
                  </div>
                  <ChevronRight size={16} />
                </button>
                <button
                  className="settings-row"
                  onClick={() => setModal("reset")}
                >
                  <RotateCcw size={17} />
                  <div>
                    <strong>Начать новую сессию</strong>
                    <small>Сбросить результаты и выбрать длительность</small>
                  </div>
                  <ChevronRight size={16} />
                </button>
                <div className="info-note">
                  <Globe size={17} />
                  <p>
                    Локальная демонстрационная платформа без авторизации.
                    Подходит для знакомства с механикой воркшопа.
                  </p>
                </div>
              </>
            ) : modal === "finish" ? (
              <>
                <div className="modal-icon">
                  <Flag size={23} />
                </div>
                <h2>Зафиксировать результат?</h2>
                <p className="modal-intro">
                  Симуляция остановится для всех команд. Рейтинг сохранится по
                  текущей чистой прибыли.
                </p>
                <div className="settings-actions">
                  <button
                    className="button"
                    onClick={() => {
                      setModal("settings");
                      setMobile(false);
                    }}
                  >
                    Назад
                  </button>
                  <button
                    className="button primary"
                    disabled={busy}
                    onClick={async () => {
                      if (
                        await action(
                          { type: "finish" },
                          "Воркшоп завершён. Итоговый рейтинг зафиксирован.",
                        )
                      ) {
                        setModal(null);
                        setPage("ranking");
                      }
                    }}
                  >
                    Завершить воркшоп <Flag size={16} />
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="modal-icon">
                  <RotateCcw size={23} />
                </div>
                <h2>Новый старт.</h2>
                <p className="modal-intro">
                  Текущие результаты всех 10 компаний и история сделок будут
                  сброшены. При необходимости сначала скачайте CSV.
                </p>
                <label className="field-label" htmlFor="duration">
                  Длительность воркшопа
                </label>
                <select
                  className="form-select"
                  id="duration"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                >
                  {[15, 30, 45, 60, 90].map((m) => (
                    <option key={m} value={m}>
                      {m} минут
                    </option>
                  ))}
                </select>
                <div className="settings-actions">
                  <button
                    className="button"
                    onClick={() => workshopClient.exportResults()}
                  >
                    <Download size={16} /> Скачать CSV
                  </button>
                  <button
                    className="button primary"
                    disabled={busy}
                    onClick={reset}
                  >
                    Сбросить и создать <ArrowRight size={16} />
                  </button>
                </div>
              </>
            )}
          </section>
        </div>
      )}
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
