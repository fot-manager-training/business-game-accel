export const roles = [
  "CEO",
  "Product",
  "Developer",
  "Marketing",
  "Sales",
  "Finance",
];
const names = [
  "Nexus AI",
  "Orbit Studio",
  "Neuro Labs",
  "Flow Systems",
  "Pulse Digital",
  "Nova Works",
  "Echo Agency",
  "Vertex Tech",
  "Spark Cloud",
  "Axiom Group",
];
const sectors = [
  "AI-автоматизация",
  "Дизайн и креатив",
  "Аналитика данных",
  "Бизнес-процессы",
  "Digital-маркетинг",
  "Разработка продуктов",
  "Контент и медиа",
  "IT-консалтинг",
  "Облачные решения",
  "Финансовые сервисы",
];
export const colors = [
  "#b6f389",
  "#b9adff",
  "#8edbfa",
  "#ffbc95",
  "#f2a9d1",
  "#f2df8d",
  "#89d9c5",
  "#a3bcff",
  "#e6a284",
  "#c6d8a1",
];
export function seed(duration = 60) {
  const profits = [
    24850, 32400, 28750, 19320, 21900, 17400, 15280, 14100, 12500, 9600,
  ];
  return {
    version: 1,
    status: "running",
    duration,
    elapsed: 15 * 60 + 22,
    round: 18,
    updatedAt: Date.now(),
    teams: names.map((name, i) => ({
      id: i + 1,
      name,
      sector: sectors[i],
      color: colors[i],
      revenue:
        profits[i] +
        [18300, 22500, 19200, 15700, 17300, 14000, 13000, 12000, 11000, 9700][
          i
        ],
      expenses: [
        18300, 22500, 19200, 15700, 17300, 14000, 13000, 12000, 11000, 9700,
      ][i],
      strategy: "balanced",
      boosts: 0,
      agents: roles.map((role, j) => ({
        id: j,
        role,
        active: true,
        tasks: 12 + i + j * 3,
      })),
      history: [
        0,
        1800,
        3200,
        2700,
        6200,
        7800,
        7100,
        10500,
        13400,
        14100,
        16700,
        18300,
        profits[i],
      ],
      deals: 8 + i,
    })),
    events: [
      {
        id: "e1",
        team: 1,
        role: "Sales",
        text: "закрыл сделку с Orbit Studio",
        amount: 2400,
        time: Date.now() - 20000,
      },
      {
        id: "e2",
        team: 1,
        role: "Developer",
        text: "завершил интеграцию продукта",
        time: Date.now() - 45000,
      },
      {
        id: "e3",
        team: 1,
        role: "Marketing",
        text: "запустил новую кампанию",
        time: Date.now() - 80000,
      },
    ],
    trades: [],
  };
}
export const profit = (t) => t.revenue - t.expenses;
export function pushEvent(s, team, role, text, amount) {
  s.events.unshift({
    id: crypto.randomUUID(),
    team,
    role,
    text,
    amount,
    time: Date.now(),
  });
  s.events = s.events.slice(0, 80);
}
export function tick(s, seconds) {
  if (s.status !== "running") return;
  const remaining = s.duration * 60 - s.elapsed;
  s.elapsed = Math.min(s.duration * 60, s.elapsed + seconds);
  if (remaining <= seconds) {
    s.status = "finished";
    return;
  }
  s.round++;
  for (const t of s.teams) {
    const active = t.agents.filter((a) => a.active).length;
    const multiplier = { balanced: 1, growth: 1.42, efficient: 0.84 }[
      t.strategy
    ];
    const earned = Math.round(
      (((290 + ((s.round * 17 + t.id * 43) % 170)) * active) / 6) *
        multiplier *
        (1 + t.boosts * 0.08),
    );
    const cost = Math.round(
      ((145 + ((t.id * 11 + s.round * 7) % 60)) *
        { balanced: 1, growth: 1.6, efficient: 0.56 }[t.strategy] *
        active) /
        6,
    );
    t.revenue += earned;
    t.expenses += cost;
    t.agents.forEach((a) => {
      if (a.active) a.tasks++;
    });
    t.history = [...t.history.slice(-23), profit(t)];
  }
  const t = s.teams[(s.round - 1) % 10];
  const messages = [
    ["Sales", "закрыл новую клиентскую сделку", 480],
    ["Developer", "выпустил обновление продукта"],
    ["Marketing", "привлёк новых клиентов"],
    ["Finance", "оптимизировал операционные расходы"],
    ["Product", "проверил продуктовую гипотезу"],
  ];
  const m = messages[(s.round + Math.floor(s.round / 10)) % messages.length];
  pushEvent(s, t.id, ...m);
  // Autonomous inter-company contracts: one deal every 30 real seconds.
  if (s.round % 6 === 0) {
    const buyer = s.teams[(Math.floor(s.round / 6) - 1) % 10];
    const seller = s.teams[(buyer.id + 2) % 10];
    if (
      buyer.agents[0].active &&
      buyer.agents[4].active &&
      seller.agents[4].active &&
      100000 + profit(buyer) >= 1200
    ) {
      act(s, {
        type: "trade",
        team: buyer.id,
        seller: seller.id,
        service: ["analytics", "design", "marketing"][
          Math.floor(s.round / 6) % 3
        ],
      });
      s.trades[0].automatic = true;
      for (const company of [buyer, seller])
        company.history[company.history.length - 1] = profit(company);
    }
  }
}
export function act(s, a) {
  if (!a || typeof a.type !== "string") throw Error("Некорректное действие");
  if (a.type === "toggle") {
    if (s.status === "finished") throw Error("Воркшоп завершён");
    s.status = s.status === "running" ? "paused" : "running";
    return;
  }
  if (a.type === "finish") {
    s.status = "finished";
    return;
  }
  if (s.status === "finished")
    throw Error("Воркшоп завершён. Начните новую сессию.");
  const t = s.teams.find((t) => t.id === a.team);
  if (!t) throw Error("Компания не найдена");
  if (a.type === "strategy") {
    if (!["balanced", "growth", "efficient"].includes(a.value))
      throw Error("Неизвестная стратегия");
    t.strategy = a.value;
    pushEvent(s, t.id, "CEO", "обновил стратегию компании");
  } else if (a.type === "agent") {
    const agent = t.agents.find((x) => x.id === a.agent);
    if (!agent) throw Error("Агент не найден");
    agent.active = !agent.active;
    pushEvent(
      s,
      t.id,
      agent.role,
      agent.active ? "вернулся к работе" : "приостановил работу",
    );
  } else if (a.type === "boost") {
    if (100000 + profit(t) < 3000) throw Error("Недостаточно средств");
    t.boosts++;
    t.expenses += 3000;
    pushEvent(s, t.id, "CEO", "инвестировал в развитие продукта", -3000);
  } else if (a.type === "trade") {
    const seller = s.teams.find((x) => x.id === a.seller);
    if (!seller || seller.id === t.id) throw Error("Выберите другую компанию");
    if (!["analytics", "design", "marketing"].includes(a.service))
      throw Error("Услуга не найдена");
    if (100000 + profit(t) < 1200) throw Error("Недостаточно средств");
    t.expenses += 1200;
    seller.revenue += 1200;
    t.boosts++;
    t.deals++;
    seller.deals++;
    s.trades.unshift({
      id: crypto.randomUUID(),
      buyer: t.id,
      seller: seller.id,
      service: a.service,
      amount: 1200,
      time: Date.now(),
    });
    pushEvent(s, t.id, "CEO", `заказал услугу у ${seller.name}`, -1200);
    pushEvent(s, seller.id, "Sales", `выполнил заказ для ${t.name}`, 1200);
  } else throw Error("Неизвестное действие");
}
