import React from "react";

import {
  red,
  blue,
  pink,
  purple,
  teal,
  green,
  olive,
  orange,
  yellow,
} from "../colors";

const colors = [red, orange, yellow, green, olive, teal, blue, purple, pink];

export default function StringArt({ style }: { style?: React.CSSProperties }) {
  const curveLength = 162.3225555419922;

  const timing = 0.02;
  const duration = 3.5;

  return (
    <svg viewBox="-10 -10 120 120" style={style}>
      <path d="M 0,0 V100 H100" fill="none" stroke="lightgray" />
      <circle cx="0" cy="100" r="3" fill="lightgray" />
      <circle cx="0" cy="0" r="3" fill="black" />
      <circle cx="100" cy="100" r="3" fill="black" />

      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => {
        const lineLength = Math.sqrt(
          (100 - 10 * i) * (100 - 10 * i) + 10 * i * (10 * i)
        );
        const startLine1 = timing * (i - 1);
        const startLine2 = timing * (i + 8);
        const startLine = timing * 18 + timing * 2 * (i - 1);
        return (
          <React.Fragment key={i}>
            <path
              d={`M -3,${10 * i} H3`}
              fill="none"
              stroke="lightgray"
              strokeWidth="1"
              strokeDasharray="6"
              strokeDashoffset="6"
            >
              <animate
                attributeName="stroke-dashoffset"
                values="6; 6; 0; 0"
                repeatCount="indefinite"
                keyTimes={`0; ${startLine1}; ${startLine1 + timing}; 1`}
                dur={`${duration}s`}
              />
            </path>
            <path
              d={`M ${10 * i},97 V103`}
              fill="none"
              stroke="lightgray"
              strokeWidth="1"
              strokeDasharray="6"
            >
              <animate
                attributeName="stroke-dashoffset"
                values="6; 6; 0; 0"
                repeatCount="indefinite"
                keyTimes={`0; ${startLine2}; ${startLine2 + timing}; 1`}
                dur={`${duration}s`}
              />
            </path>
            <path
              d={`M 0,${10 * i} L ${10 * i},100`}
              fill="none"
              stroke={colors[i - 1]}
              opacity={0.5}
              strokeDasharray={lineLength}
              strokeDashoffset={lineLength}
            >
              <animate
                attributeName="stroke-dashoffset"
                values={`${lineLength}; ${lineLength}; 0; 0`}
                repeatCount="indefinite"
                keyTimes={`0; ${startLine}; ${startLine + 2 * timing}; 1`}
                dur={`${duration}s`}
              />
            </path>
          </React.Fragment>
        );
      })}

      <path
        d="M 0,0 Q 0,100 100,100"
        fill="none"
        stroke="black"
        strokeWidth="1"
        strokeDasharray={curveLength}
        strokeDashoffset={curveLength}
      >
        <animate
          attributeName="stroke-dashoffset"
          values={`${curveLength}; ${curveLength}; 0; 0`}
          repeatCount="indefinite"
          keyTimes={`0; 0.72; 0.82; 1`}
          dur={`${duration}s`}
        />
      </path>
    </svg>
  );
}
