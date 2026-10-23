import React from "react";
import { speechForCompany } from "./agent-dialogue.js";
import { companyPoses } from "./agent-motion.js";
import { useAgentMotion } from "./use-agent-motion.js";
const outfits = [
  ["#7332db", "#48209e", "#5b22bb", "#191b3d"],
  ["#737e91", "#475366", "#697589", "#1e347d"],
  ["#2a4dc7", "#213b91", "#e0e8ef", "#394556"],
  ["#8b9aac", "#63748a", "#76889d", "#384558"],
  ["#126e63", "#10554e", "#115c53", "#a06a12"],
  ["#bd8522", "#805013", "#a86d17", "#323a4d"],
];
export const PixelPerson = React.memo(function PixelPerson({
  variant = 0,
  color,
  ...props
}) {
  const [front, side, sleeve, pants] = outfits[variant % 6];
  const skin = [
      "#f1c798",
      "#c38c55",
      "#edc4a0",
      "#f0c99e",
      "#d8ae7c",
      "#dbb18b",
    ][variant % 6],
    shade = ["#dcaf75", "#a65d20", "#d8ac85", "#dfad6c", "#bd8f5a", "#be8d62"][
      variant % 6
    ];
  const hair = [
    "#342145",
    "#161d2b",
    "#151b2c",
    "#234ddb",
    "#392414",
    "#444050",
  ][variant % 6];
  return (
    <g
      {...props}
      className="person pixel-person block-person"
      shapeRendering="crispEdges"
      data-pixel-sprite="true"
    >
      <ellipse cx="0" cy="10" rx="22" ry="4" fill="#d7dce2" />
      <rect
        className="pixel-leg-left"
        x="-13"
        y="-18"
        width="14"
        height="26"
        fill={pants}
      />
      <rect
        className="pixel-leg-right"
        x="1"
        y="-18"
        width="17"
        height="26"
        fill={variant === 0 ? "#121827" : pants}
      />
      <rect x="-20" y="-44" width="37" height="29" fill={front} />
      <rect x="17" y="-43" width="12" height="25" fill={side} />
      <rect x="-27" y="-37" width="10" height="23" fill={sleeve} />
      <rect x="-22" y="-44" width="6" height="15" fill={front} />
      <rect x="-15" y="-67" width="31" height="24" fill={skin} />
      <rect x="16" y="-65" width="13" height="25" fill={shade} />
      <rect x="-15" y="-77" width="27" height="9" fill={hair} />
      <rect
        x="12"
        y="-74"
        width="7"
        height="7"
        fill={variant === 0 ? "#171422" : hair}
      />
      <rect x="-10" y="-58" width="5" height="5" fill="#151b29" />
      <rect x="1" y="-58" width="5" height="5" fill="#151b29" />
      <rect x="-5" y="-50" width="10" height="3" fill={shade} />
      <rect
        x="-14"
        y="-39"
        width="18"
        height="13"
        fill={variant === 4 ? "#d2fff0" : "#f1f5fa"}
      />
      {variant === 2 && (
        <rect x="-2" y="-31" width="6" height="7" fill="#6997ff" />
      )}
      {variant === 4 && (
        <rect x="-7" y="-20" width="11" height="12" fill="#ffe79a" />
      )}
    </g>
  );
});
export const PixelDesk = React.memo(function PixelDesk({ x, y }) {
  return (
    <g
      transform={`translate(${x} ${y})`}
      shapeRendering="crispEdges"
      aria-hidden="true"
    >
      <rect x="-31" y="8" width="5" height="23" fill="#c1c6cf" />
      <rect x="28" y="8" width="5" height="23" fill="#b1b8c3" />
      <rect x="-38" y="2" width="78" height="8" fill="#d8dce3" />
      <rect x="-37" y="-2" width="77" height="5" fill="#f3f5f8" />
      <rect x="-13" y="-32" width="36" height="26" fill="#7f8b9e" />
      <rect x="-10" y="-29" width="30" height="20" fill="#dfe9f7" />
      <rect x="0" y="-6" width="5" height="6" fill="#a9b0bd" />
      <rect x="-13" y="1" width="31" height="3" fill="#a9b4c4" />
      <rect x="28" y="-8" width="7" height="10" fill="#e2ec74" />
      <path d="M-4-23H13M-4-17H7" stroke="#8ca2c5" strokeWidth="2" />
    </g>
  );
});
function wrap(text, limit = 31) {
  const words = text.split(" "),
    lines = [""];
  for (const word of words) {
    const i = lines.length - 1;
    if ((lines[i] + " " + word).trim().length > limit) lines.push(word);
    else lines[i] = (lines[i] + " " + word).trim();
  }
  return lines
    .slice(0, 2)
    .map((line, i) => (i === 1 && lines.length > 2 ? line + "…" : line));
}
export function SpeechBubble({ speech, x, y, width = 198, tailX = x }) {
  if (!speech) return null;
  const lines = wrap(speech.text, width < 190 ? 28 : 31),
    height = 54;
  return (
    <g
      className={`agent-dialogue ${speech.mode === "intent" ? "dialogue-intent" : "dialogue-speaking"}`}
      data-interaction-id={speech.interactionId}
      data-mode={speech.mode}
      data-speaker={`${speech.team}:${speech.agent}`}
      aria-label={`${speech.role}: ${speech.text}`}
    >
      <title>
        {speech.role}: {speech.text}
      </title>
      <path
        d={`M${tailX - 6} ${y + height - 2}l6 11 6-11`}
        fill={speech.mode === "intent" ? "#edfb69" : "#151515"}
      />
      <rect
        x={x - width / 2}
        y={y}
        width={width}
        height={height}
        rx="8"
        fill={speech.mode === "intent" ? "#edfb69" : "#151515"}
      />
      <text
        x={x - width / 2 + 10}
        y={y + 13}
        fontFamily="Arial,sans-serif"
        fontSize="7.2"
        fontWeight="700"
        letterSpacing=".45"
        fill={speech.mode === "intent" ? "#5e641e" : "#effb7a"}
      >
        {speech.role.toUpperCase()}{" "}
        {speech.mode === "intent"
          ? " / СЛЕДУЮЩАЯ ЗАДАЧА"
          : ` → ${speech.peer.toUpperCase()}`}
      </text>
      {lines.map((line, i) => (
        <text
          key={i}
          x={x - width / 2 + 10}
          y={y + 29 + i * 12}
          fontFamily="Arial,sans-serif"
          fontSize="10"
          fill={speech.mode === "intent" ? "#151515" : "#fff"}
        >
          {line}
        </text>
      ))}
    </g>
  );
}
export function PixelOffice({
  team,
  onAgent,
  status,
  interactions = [],
  now = Date.now(),
  pausedAt,
}) {
  const motion = useAgentMotion(status);
  const spots = [
      [190, 190],
      [400, 190],
      [610, 190],
      [190, 355],
      [400, 355],
      [610, 355],
    ],
    speech = speechForCompany(team, interactions, now, status, pausedAt),
    poses = companyPoses(team, spots, motion.elapsed, motion.reducedMotion);
  return (
    <div
      className={`office-scene pixel-office ${status === "running" ? "is-running" : "is-paused"}`}
    >
      <svg
        viewBox="0 0 800 440"
        role="img"
        aria-label={`Пиксельный офис ${team.name}, шесть AI-агентов`}
      >
        <g shapeRendering="crispEdges">
          <path
            d="M80 58H720V68H734V392H720V402H80V392H66V68H80Z"
            fill="#d4d8de"
          />
          <rect x="80" y="72" width="640" height="316" fill="#f1f3f6" />
          {Array.from({ length: 13 }, (_, row) =>
            Array.from({ length: 28 }, (_, col) => (
              <rect
                key={`${row}-${col}`}
                x={80 + col * 23}
                y={76 + row * 24}
                width="21"
                height="22"
                fill={(row + col) % 2 ? "#eceff3" : "#e8ecf1"}
              />
            )),
          )}
          {[120, 280, 440, 600].map((x) => (
            <g key={x}>
              <rect x={x} y="46" width="83" height="27" fill="#bcc8d8" />
              <rect x={x + 5} y="50" width="73" height="17" fill="#e0eaf5" />
              <rect x={x + 40} y="50" width="3" height="17" fill="#b6c3d5" />
            </g>
          ))}
          <rect x="352" y="383" width="97" height="14" fill="#effb73" />
          {spots.map(([x, y], i) => (
            <PixelDesk key={i} x={x + 27} y={y - 31} />
          ))}
          {[96, 682].map((x) => (
            <g key={x}>
              <rect x={x} y="309" width="22" height="24" fill="#b9bdc4" />
              <rect x={x - 4} y="285" width="30" height="13" fill="#9da986" />
              <rect x={x + 5} y="275" width="13" height="35" fill="#b5c39b" />
            </g>
          ))}
        </g>
        {poses.map(({ x, y, moving, partner }, i) => (
          <g
            key={i}
            role="button"
            tabIndex="0"
            className={`scene-agent ${!team.agents[i].active ? "agent-paused" : ""}`}
            data-moving={status === "running" && moving}
            data-partner={partner}
            aria-label={`Открыть агента ${team.agents[i].role}`}
            onClick={() => onAgent(i)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onAgent(i);
              }
            }}
          >
            <g
              className={moving && status === "running" ? "agent-running" : ""}
            >
              <PixelPerson
                transform={`translate(${x} ${y}) scale(.95)`}
                variant={i}
              />
            </g>
            <rect
              x={x - 43}
              y={y + 17}
              width="86"
              height="19"
              rx="4"
              fill="#fff"
            />
            <text
              x={x}
              y={y + 30}
              textAnchor="middle"
              fontFamily="monospace"
              fontSize="10"
              fill="#333"
            >
              {team.agents[i].role}
            </text>
          </g>
        ))}
        {speech && (
          <SpeechBubble
            speech={speech}
            x={poses[speech.agent].x}
            y={poses[speech.agent].y - 151}
            width={200}
          />
        )}
        <text
          x="400"
          y="425"
          textAnchor="middle"
          fontFamily="monospace"
          fontSize="9"
          letterSpacing="5"
          fill="#8a8f98"
        >
          ZERO HUMAN COMPANY
        </text>
      </svg>
      <div className="office-location">
        <span className="tiny-dot" />
        {status === "running"
          ? "Автономный режим"
          : status === "paused"
            ? "Симуляция на паузе"
            : "Сессия завершена"}
        <span>
          {team.agents.filter((a) => a.active).length} агентов · A2A protocol
        </span>
      </div>
      <div className="scene-corner">
        PIXEL OFFICE <span>{String(team.id).padStart(2, "0")} / 10</span>
      </div>
    </div>
  );
}
