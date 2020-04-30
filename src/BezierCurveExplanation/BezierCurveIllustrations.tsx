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
          0,10
        </text>
        <text x={5} y={10} style={{ fill: red }}>
          Start
        </text>
        <text x={25} style={{ fill: "black" }}>
          C
        </text>
        <text x={32} style={{ fill: blue }}>
          1,0
        </text>
        <text x={20} y={10} style={{ fill: blue }}>
          Control 1
        </text>
        <text x={46} style={{ fill: teal }}>
          9,0
        </text>
        <text x={46} y={10} style={{ fill: teal }}>
          Control 2
        </text>
        <text x={61} style={{ fill: orange }}>
          10,10
        </text>
        <text x={73} y={10} style={{ fill: orange }}>
          End
        </text>
      </g>
    </svg>
  );
}

export function SmoothCubicBezierCurveIllustration({
  style,
}: {
  style?: React.CSSProperties;
}) {
  return (
    <svg viewBox="-10 -10 220 120" style={style}>
      <path
        d="M 0,50 C 10,0 90,0 100,50 S 190,100 200,50"
        fill="none"
        stroke="black"
      />
      <path d="M 0,50 C 10,0 90,0 100,50" fill="none" stroke="lightgray" />
      <line x1="90" y1="0" x2="100" y2="50" stroke="lightgray" />
      <line
        x1="110"
        y1="100"
        x2="100"
        y2="50"
        stroke="lightgray"
        strokeDasharray={2}
      />
      <line x1="200" y1="50" x2="190" y2="100" stroke="lightgray" />
      <circle cx="90" cy="0" r="3" fill="lightgray" />
      <circle cx="110" cy="100" r="3" fill={blue} />
      <circle cx="190" cy="100" r="3" fill={teal} />

      <circle cx="100" cy="50" r="3" fill={red} />
      <circle cx="200" cy="50" r="3" fill={orange} />
      <g
        transform="translate(15, 53)"
        style={{
          fontSize: 6,
        }}
      >
        <text style={{ fill: "gray" }}>M 0,5 C 1,0</text>
        <text x={35} style={{ fill: blue }}>
          9,0
        </text>
        <text x={15} y={-10} style={{ fill: blue }}>
          Reflection of Control 1
        </text>
        <text x={50} style={{ fill: red }}>
          10,5
        </text>
        <text x={50} y={10} style={{ fill: red }}>
          Start
        </text>
        <text x={110} style={{ fill: "black" }}>
          S
        </text>
        <text x={120} style={{ fill: teal }}>
          19,10
        </text>
        <text x={110} y={10} style={{ fill: teal }}>
          Control 2
        </text>
        <text x={140} style={{ fill: orange }}>
          20,5
        </text>
        <text x={142} y={10} style={{ fill: orange }}>
          End
        </text>
      </g>
    </svg>
  );
}

export function QuadraticBezierCurveIllustration({
  style,
}: {
  style?: React.CSSProperties;
}) {
  return (
    <svg viewBox="-10 -10 120 120" style={style}>
      <path d="M 0,0 Q 0,100 100,100" fill="none" stroke="black" />
      <line x1="0" y1="100" x2="0" y2="0" stroke="lightgray" />
      <line x1="100" y1="100" x2="0" y2="100" stroke="lightgray" />
      <circle cx="0" cy="100" r="3" fill={blue} />
      <circle cx="0" cy="100" r="3" fill={teal} />

      <circle cx="0" cy="0" r="3" fill={red} />
      <circle cx="100" cy="100" r="3" fill={orange} />
      <g
        transform="translate(15, 25)"
        style={{
          fontSize: 6,
        }}
      >
        <text style={{ fill: "gray" }}>M</text>
        <text x={7} style={{ fill: red }}>
          0,0
        </text>
        <text x={5} y={10} style={{ fill: red }}>
          Start
        </text>
        <text x={25} style={{ fill: "black" }}>
          Q
        </text>
        <text x={38} style={{ fill: teal }}>
          0,10
        </text>
        <text x={30} y={10} style={{ fill: blue }}>
          Control 1
        </text>
        <text x={30} y={20} style={{ fill: teal }}>
          Control 2
        </text>
        <text x={61} style={{ fill: orange }}>
          10,10
        </text>
        <text x={62} y={10} style={{ fill: orange }}>
          End
        </text>
      </g>
    </svg>
  );
}

export function SmoothQuadraticBezierCurveIllustration({
  style,
}: {
  style?: React.CSSProperties;
}) {
  return (
    <svg viewBox="-10 -10 220 120" style={style}>
      <path d="M 0,0 Q 0,100 100,100 T 200,0" fill="none" stroke="black" />
      <path d="M 0,0 Q 0,100 100,100" fill="none" stroke="lightgray" />
      <line x1="0" y1="100" x2="100" y2="100" stroke="lightgray" />
      <line x1="0" y1="100" x2="0" y2="0" stroke="lightgray" />
      <line
        x1="100"
        y1="100"
        x2="200"
        y2="100"
        stroke="lightgray"
        strokeDasharray={2}
      />
      <line
        x1="200"
        y1="100"
        x2="200"
        y2="0"
        stroke="lightgray"
        strokeDasharray={2}
      />
      <circle cx="0" cy="100" r="3" fill="lightgray" />
      <circle cx="200" cy="100" r="3" fill={blue} />
      <circle cx="200" cy="100" r="3" fill={teal} />

      <circle cx="100" cy="100" r="3" fill={red} />
      <circle cx="200" cy="0" r="3" fill={orange} />
      <g
        transform="translate(15, 53)"
        style={{
          fontSize: 6,
        }}
      >
        <text style={{ fill: "gray" }} x={10}>
          M 0,5 Q
        </text>
        <text x={35} style={{ fill: blue }}>
          10,0
        </text>
        <text x={15} y={-10} style={{ fill: blue }}>
          Reflection of Control 1
        </text>
        <text x={15} y={-20} style={{ fill: teal }}>
          Reflection of Control 2
        </text>
        <text x={50} style={{ fill: red }}>
          10,10
        </text>
        <text x={50} y={10} style={{ fill: red }}>
          Start
        </text>
        <text x={110} style={{ fill: "black" }}>
          T
        </text>
        <text x={120} style={{ fill: orange }}>
          20,0
        </text>
        <text x={122} y={10} style={{ fill: orange }}>
          End
        </text>
      </g>
    </svg>
  );
}
