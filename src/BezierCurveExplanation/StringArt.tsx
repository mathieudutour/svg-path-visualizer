import React from "react";
import { useSpring, animated } from "react-spring";

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
  const [reset, setReset] = React.useState(false);

  // @ts-ignore
  const spring = useSpring<{ keyframe: number }>({
    from: {
      keyframe: 0,
    },
    to: {
      keyframe: 1,
    },
    config: {
      duration: 3500,
    },
    reset: reset,
    onRest: () => setReset(false),
  });

  React.useEffect(() => {
    if (!reset) {
      requestAnimationFrame(() => setReset(true));
    }
  }, [reset, setReset]);

  const curveLength = 162.3225555419922;

  const timing = 0.02;

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
            <animated.path
              d={`M -3,${10 * i} H3`}
              fill="none"
              stroke="lightgray"
              strokeWidth="1"
              strokeDasharray="6"
              strokeDashoffset={spring.keyframe.interpolate((k: number) =>
                k < startLine1
                  ? 6
                  : Math.max(0, (6 * (startLine1 + timing - k)) / timing)
              )}
            />
            <animated.path
              d={`M ${10 * i},97 V103`}
              fill="none"
              stroke="lightgray"
              strokeWidth="1"
              strokeDasharray="6"
              strokeDashoffset={spring.keyframe.interpolate((k: number) =>
                k < startLine2
                  ? 6
                  : Math.max(0, (6 * (startLine2 + timing - k)) / timing)
              )}
            />
            <animated.path
              d={`M 0,${10 * i} L ${10 * i},100`}
              fill="none"
              stroke={colors[i - 1]}
              opacity={0.5}
              strokeDasharray={lineLength}
              strokeDashoffset={spring.keyframe.interpolate((k: number) =>
                k < startLine
                  ? lineLength
                  : Math.max(
                      0,
                      (lineLength * (startLine + 2 * timing - k)) / (timing * 2)
                    )
              )}
            />
          </React.Fragment>
        );
      })}

      <animated.path
        d="M 0,0 Q 0,100 100,100"
        fill="none"
        stroke="black"
        strokeWidth="1"
        strokeDasharray={curveLength}
        strokeDashoffset={spring.keyframe.interpolate((k: number) =>
          k < 0.72 ? curveLength : Math.max(0, (curveLength * (0.82 - k)) / 0.1)
        )}
      />
    </svg>
  );
}
