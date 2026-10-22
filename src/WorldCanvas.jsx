import React from "react";
import { PixelPerson, PixelDesk, SpeechBubble } from "./PixelArt.jsx";
import { speechForCompany } from "./agent-dialogue.js";
const positions = Array.from({ length: 10 }, (_, i) => ({
  x: 26 + (i % 5) * 244,
  y: i < 5 ? 28 : 428,
}));
const point = (endpoint) => {
  const p = positions[endpoint.team - 1];
  return {
    x: p.x + 43 + (endpoint.agent % 3) * 62,
    y: p.y + 143 + Math.floor(endpoint.agent / 3) * 130 - 25,
  };
};
function route(interaction, index) {
  const a = point(interaction.from),
    b = point(interaction.to);
  if (interaction.from.team === interaction.to.team)
    return `M ${a.x} ${a.y} H ${(a.x + b.x) / 2} V ${b.y} H ${b.x}`;
  const source = positions[interaction.from.team - 1],
    target = positions[interaction.to.team - 1],
    corridor = 365 + (index % 5) * 10;
  return `M ${a.x} ${a.y} H ${source.x + 205} V ${corridor} H ${target.x + 11} V ${b.y} H ${b.x}`;
}
export default function WorldCanvas({
  state,
  now,
  zoom,
  filter,
  shownWires,
  focus,
  running,
  reducedMotion,
  inspectAgent,
}) {
  const speeches = state.teams.map((team) =>
    speechForCompany(
      team,
      state.interactions || [],
      now,
      state.status,
      state.updatedAt,
    ),
  );
  return (
    <svg
      className="world-map"
      viewBox="0 0 1240 790"
      style={{
        width: `${zoom * 100}%`,
        minWidth: `calc(var(--world-min-width, 0px) * ${zoom})`,
      }}
      aria-label="Карта десяти пиксельных компаний и шестидесяти агентов"
    >
      <defs>
        <pattern
          id="world-grid"
          width="20"
          height="20"
          patternUnits="userSpaceOnUse"
        >
          <path d="M20 0H0V20" fill="none" stroke="#111" strokeOpacity=".035" />
        </pattern>
        <marker
          id="wire-arrow"
          markerWidth="5"
          markerHeight="5"
          refX="4"
          refY="2.5"
          orient="auto"
        >
          <path d="M0 0L5 2.5L0 5" fill="#454555" />
        </marker>
      </defs>
      <rect width="1240" height="790" fill="url(#world-grid)" />
      <path
        d="M12 367H1228M12 409H1228"
        stroke="#a0a8b2"
        strokeWidth=".6"
        strokeDasharray="3 9"
      />
      <text
        x="620"
        y="392"
        textAnchor="middle"
        fontSize="8"
        fontFamily="Arial,sans-serif"
        letterSpacing="3"
        fill="#9b9da2"
      >
        РАЗНЫЕ КОМАНДЫ. ОБЩАЯ ЭКОНОМИКА.
      </text>
      {state.teams.map((team, index) => {
        const p = positions[index],
          dim = Boolean(filter && filter !== team.id);
        return (
          <g
            key={team.id}
            className={`world-company ${dim ? "dimmed" : ""}`}
            data-team-id={team.id}
          >
            <rect
              x={p.x + 3}
              y={p.y + 5}
              width="216"
              height="316"
              rx="10"
              fill="#d7dbe2"
              opacity=".55"
            />
            <rect
              x={p.x}
              y={p.y}
              width="216"
              height="316"
              rx="10"
              fill="#fff"
              stroke={filter === team.id ? "#111" : "#cbd0d8"}
              strokeWidth={filter === team.id ? 2 : 1}
            />
            <path
              d={`M${p.x + 1} ${p.y + 36}H${p.x + 215}V${p.y + 304}Q${p.x + 215} ${p.y + 315} ${p.x + 204} ${p.y + 315}H${p.x + 12}Q${p.x + 1} ${p.y + 315} ${p.x + 1} ${p.y + 304}Z`}
              fill="#edf0f4"
            />
            <g shapeRendering="crispEdges">
              {Array.from({ length: 12 }, (_, row) =>
                Array.from({ length: 10 }, (_, col) => (
                  <rect
                    key={`${row}-${col}`}
                    x={p.x + 8 + col * 20}
                    y={p.y + 44 + row * 22}
                    width="18"
                    height="20"
                    fill={(row + col) % 2 ? "#e8ecf1" : "#edf0f5"}
                  />
                )),
              )}
              <rect
                x={p.x + 80}
                y={p.y + 308}
                width="56"
                height="7"
                fill="#e7f66a"
              />
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <PixelDesk
                  key={i}
                  x={p.x + 53 + (i % 3) * 62}
                  y={p.y + 111 + Math.floor(i / 3) * 130}
                />
              ))}
            </g>
            <text
              x={p.x + 12}
              y={p.y + 23}
              fill="#171717"
              fontFamily="Arial,sans-serif"
              fontSize="12"
              fontWeight="600"
            >
              {team.name}
            </text>
            <rect
              x={p.x + 184}
              y={p.y + 10}
              width="22"
              height="17"
              rx="7"
              fill="#edfb69"
            />
            <text
              x={p.x + 195}
              y={p.y + 22}
              textAnchor="middle"
              fill="#222"
              fontFamily="Arial,sans-serif"
              fontSize="8"
            >
              {String(team.id).padStart(2, "0")}
            </text>
          </g>
        );
      })}
      <g className="world-wires" aria-hidden="true">
        {shownWires.map((link, index) => {
          const path = route(link, index),
            isRecent = running && now - link.time < 7500,
            isFocused = link.id === focus,
            internal = link.from.team === link.to.team,
            color = internal
              ? "#8c72ba"
              : link.kind === "payment"
                ? "#222"
                : "#3861b8";
          return (
            <g
              key={link.id}
              className={`world-wire ${isRecent ? "wire-recent" : ""} ${isFocused ? "wire-focused" : ""}`}
              opacity={
                focus && !isFocused
                  ? 0.1
                  : isFocused
                    ? 1
                    : isRecent
                      ? 0.75
                      : 0.16
              }
            >
              <path
                d={path}
                fill="none"
                stroke={color}
                strokeWidth={isFocused ? 2.8 : 1.2}
                strokeDasharray={internal ? "3 5" : "5 7"}
                markerEnd="url(#wire-arrow)"
              />
              {isRecent && !reducedMotion && (
                <rect
                  x="-3"
                  y="-3"
                  width="6"
                  height="6"
                  rx="1"
                  fill={link.kind === "payment" ? "#d4e33b" : color}
                >
                  <animateMotion
                    dur={internal ? "1.6s" : "3s"}
                    repeatCount="indefinite"
                    path={path}
                  />
                </rect>
              )}
            </g>
          );
        })}
      </g>
      {state.teams.map((team, index) => {
        const p = positions[index],
          speech = speeches[index];
        return (
          <g
            key={team.id}
            className={filter && filter !== team.id ? "dimmed" : ""}
          >
            {team.agents.map((agent, i) => {
              const x = p.x + 43 + (i % 3) * 62,
                y = p.y + 143 + Math.floor(i / 3) * 130;
              return (
                <g
                  key={i}
                  className={`world-agent ${agent.active ? "" : "agent-paused"} ${speech?.agent === i ? "agent-talking" : ""}`}
                  role="button"
                  tabIndex="0"
                  aria-label={`Стол ${String(team.id).padStart(2, "0")}: ${agent.role}`}
                  onClick={() => inspectAgent(team.id, i)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      inspectAgent(team.id, i);
                    }
                  }}
                >
                  <rect
                    x={x - 24}
                    y={y - 53}
                    width="48"
                    height="72"
                    fill="transparent"
                  />
                  <g
                    className={
                      speech?.agent === i &&
                      speech.mode === "intent" &&
                      running &&
                      !reducedMotion
                        ? "agent-walk"
                        : ""
                    }
                  >
                    <PixelPerson
                      transform={`translate(${x} ${y}) scale(.60)`}
                      variant={i}
                    />
                  </g>
                  <rect
                    x={x - 26}
                    y={y + 10}
                    width="52"
                    height="13"
                    rx="4"
                    fill="#fff"
                  />
                  <text
                    x={x}
                    y={y + 19}
                    textAnchor="middle"
                    fontFamily="Arial,sans-serif"
                    fontSize="8"
                    fill="#42464d"
                  >
                    {agent.role}
                  </text>
                </g>
              );
            })}
          </g>
        );
      })}
      {speeches.map((speech, index) => {
        if (!speech) return null;
        const p = positions[index],
          x = p.x + 43 + (speech.agent % 3) * 62,
          y = p.y + 143 + Math.floor(speech.agent / 3) * 130;
        return (
          <g
            key={index}
            className={filter && filter !== speech.team ? "dimmed" : ""}
          >
            <SpeechBubble
              speech={speech}
              x={p.x + 108}
              tailX={x}
              y={y - 110}
              width={200}
            />
          </g>
        );
      })}
    </svg>
  );
}
