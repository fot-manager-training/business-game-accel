import { roles } from "../server/model.js";
const nextTasks = [
  "обновлять стратегию",
  "уточнять план продукта",
  "собирать новую версию",
  "запускать кампанию",
  "работать с клиентами",
  "проверять баланс",
];
export function describeDialogue(interaction) {
  const fromRole = roles[interaction.from.agent],
    toRole = roles[interaction.to.agent];
  const internal = [
    [
      "Product, уточни наши приоритеты.",
      "Принято. Обновлю план продукта.",
      "обновлять план продукта",
    ],
    [
      "Developer, собери новую версию.",
      "Принято. Начинаю разработку.",
      "разрабатывать новую версию",
    ],
    [
      "Marketing, продукт готов к запуску!",
      "Отлично. Готовлю кампанию.",
      "запускать рекламную кампанию",
    ],
    [
      "Sales, передаю новых клиентов.",
      "Принял. Свяжусь с клиентами.",
      "договариваться с клиентами",
    ],
    [
      "Finance, проверь эту сделку.",
      "Принято. Сверю доходы и расходы.",
      "проверять финансы компании",
    ],
    [
      "CEO, финансовый отчёт готов.",
      "Вижу. Скорректирую стратегию.",
      "обновлять стратегию компании",
    ],
  ];
  let line;
  switch (interaction.kind) {
    case "internal":
      line = internal[interaction.from.agent];
      break;
    case "request":
      line = [
        `${toRole}, нужна помощь с продуктом.`,
        "Принял запрос. Подготовлю предложение.",
        "готовить предложение партнёру",
      ];
      break;
    case "offer":
      line = [
        `${toRole}, стоимость — 1 200 ₽.`,
        "Согласен. Передаю задачу команде.",
        "согласовывать задачу с командой",
      ];
      break;
    case "handoff":
      line =
        interaction.from.agent === 2
          ? [
              `${toRole}, результат готов. Проверь.`,
              "Получил. Проверю новую версию.",
              "проверять результат работы",
            ]
          : [
              `${toRole}, согласуем требования?`,
              "Да. Подготовлю план выполнения.",
              "уточнять требования к продукту",
            ];
      break;
    case "settlement":
      line = [
        `${toRole}, подтвердите счёт.`,
        "Счёт проверен. Ожидаю оплату.",
        "сверять поступления",
      ];
      break;
    case "delivery":
      line = [
        `${toRole}, задача выполнена!`,
        "Получил результат. Проверяю.",
        "проверять выполненную задачу",
      ];
      break;
    case "payment":
      line = [
        `${toRole}, перевёл ${interaction.amount || 1200} ₽.`,
        "Оплату получил. Обновлю отчёт.",
        "обновлять баланс компании",
      ];
      break;
    default:
      line = [
        `${toRole}, передаю задачу.`,
        "Принято. Приступаю.",
        "выполнять следующую задачу",
      ];
  }
  return {
    from: line[0],
    to: line[1],
    fromIntent: `Иду ${nextTasks[interaction.from.agent]}.`,
    toIntent: `Иду ${line[2]}.`,
    fromRole,
    toRole,
  };
}
export function speechForCompany(team, interactions, now, status, pausedAt) {
  const time = status === "running" ? now : pausedAt || now;
  const candidates = interactions.filter(
    (i) =>
      (i.from.team === team.id || i.to.team === team.id) &&
      time - i.time >= 0 &&
      time - i.time < 9000,
  );
  const interaction =
    candidates.find((i) => i.from.team !== i.to.team) || candidates[0];
  if (!interaction) return null;
  const age = time - interaction.time,
    dialogue = describeDialogue(interaction);
  let side =
    interaction.from.team === interaction.to.team
      ? age < 1600
        ? "from"
        : "to"
      : interaction.from.team === team.id
        ? "from"
        : "to";
  let agent = interaction[side].agent;
  if (!team.agents[agent]?.active) {
    const other = side === "from" ? "to" : "from";
    if (
      interaction[other].team !== team.id ||
      !team.agents[interaction[other].agent]?.active
    )
      return null;
    side = other;
    agent = interaction[side].agent;
  }
  const intent = age >= 3200;
  return {
    agent,
    team: team.id,
    interactionId: interaction.id,
    mode: intent ? "intent" : "speaking",
    text: dialogue[intent ? `${side}Intent` : side],
    role: roles[agent],
    peer: side === "from" ? dialogue.toRole : dialogue.fromRole,
    kind: interaction.kind,
  };
}
