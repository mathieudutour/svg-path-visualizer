import React from "react";

import { red, blue, teal, orange } from "../colors";

export function CubicBezierCurveIllustration({
  style,
}: {
  style?: React.CSSProperties;
}) {
  return (
    <svg viewBox="-10 -10 120 120" style={style}>
      <path d="M 0,100 C 10,0 90,0 100,100" fill="none" stroke="black" />
      <line x1="0" y1="100" x2="10" y2="0" stroke="lightgray" />
      <line x1="100" y1="100" x2="90" y2="0" stroke="lightgray" />
      <circle cx="10" cy="0" r="3" fill={blue} />
      <circle cx="90" cy="0" r="3" fill={teal} />

      <circle cx="0" cy="100" r="3" fill={red} />
      <circle cx="100" cy="100" r="3" fill={orange} />
      <g
        transform="translate(9, 80)"
        style={{
          fontSize: 6,
        }}
      >
        <text style={{ fill: "gray" }}>M</text>
        <text x={7} style={{ fill: red }}>
          0,100
        </text>
        <text x={5} y={10} style={{ fill: red }}>
          Start
        </text>
        <text x={25} style={{ fill: "black" }}>
          C
        </text>
        <text x={32} style={{ fill: blue }}>
          10,0
        </text>
        <text x={20} y={10} style={{ fill: blue }}>
          Control 1
        </text>
        <text x={46} style={{ fill: teal }}>
          90,0
        </text>
        <text x={46} y={10} style={{ fill: teal }}>
          Control 2
        </text>
        <text x={61} style={{ fill: orange }}>
          100,100
        </text>
        <text x={73} y={10} style={{ fill: orange }}>
          End
        </text>
      </g>
    </svg>
  );
}

export function SmoothCubicBezierCurveIllustration() {
  return (
    <svg viewBox="-10 -10 120 120">
      <path d="M 0,100 C 10,0 90,0 100,100" fill="none" stroke="black" />
      <line x1="0" y1="100" x2="10" y2="0" stroke="lightgray" />
      <line x1="100" y1="100" x2="90" y2="0" stroke="lightgray" />
      <circle cx="10" cy="0" r="3" fill={blue} />
      <circle cx="90" cy="0" r="3" fill={teal} />

      <circle cx="0" cy="100" r="3" fill={red} />
      <circle cx="100" cy="100" r="3" fill={orange} />
      <g
        transform="translate(15, 80)"
        style={{
          fontSize: 5,
        }}
      >
        <text style={{ fill: "gray" }}>M</text>
        <text x={6} style={{ fill: red }}>
          0,100
        </text>
        <text x={6} style={{ fill: red }}>
          Start
        </text>
        <text x={22} style={{ fill: "black" }}>
          C
        </text>
        <text x={28} style={{ fill: blue }}>
          10,0
        </text>
        <text x={40} style={{ fill: teal }}>
          90,0
        </text>
        <text x={53} style={{ fill: orange }}>
          100,100
        </text>
      </g>
    </svg>
  );
}
