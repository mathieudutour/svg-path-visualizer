import React from "react";
import { SVGPathData } from "svg-pathdata";
import { SVGCommand } from "svg-pathdata/lib/types";
import { keyFor, assertNever, HelperType } from "./utils";

function CommandExplainer({
  pathData,
  hovering,
  setHovering,
}: {
  pathData: {
    commands: SVGCommand[];
    bounds: {
      minX: number;
      maxX: number;
      minY: number;
      maxY: number;
    };
  };
  hovering: string | null;
  setHovering: (newHover: string | null) => void;
}) {
  const style = React.useCallback(
    (key: string, type?: HelperType) => {
      return {
        style: {
          color:
            hovering === key || (hovering && key.startsWith(hovering))
              ? "red"
              : hovering?.startsWith(key)
              ? "blue"
              : "black",
        },
        onMouseEnter: () => setHovering(key),
        onMouseLeave: () => setHovering(null),
      };
    },
    [hovering, setHovering]
  );

  function printPoint(
    point: { x: number; y: number },
    c: SVGCommand,
    suffix: number | string
  ) {
    return (
      <>
        {"{"}
        <span {...style(keyFor(c, `${suffix}-x`))}>
          {" "}
          x:{" "}
          {"relative" in c && c.relative
            ? `previous point ${point.x < 0 ? "-" : "+"} `
            : `${point.x < 0 ? "-" : ""}`}
          {Math.abs(point.x)}
        </span>
        ,
        <span {...style(keyFor(c, `${suffix}-y`))}>
          {" "}
          y:{" "}
          {"relative" in c && c.relative
            ? `previous point ${point.x < 0 ? "-" : "+"} `
            : `${point.x < 0 ? "-" : ""}`}
          {Math.abs(point.y)}{" "}
        </span>
        {"}"}
      </>
    );
  }

  return (
    <ul>
      {pathData.commands.map((c, i) => {
        let child: React.ReactNode;
        switch (c.type) {
          case SVGPathData.MOVE_TO:
            child = (
              <div>
                <code>
                  <span {...style(keyFor(c, i))}>
                    {c.relative ? "m" : "M"}{" "}
                  </span>
                  <span {...style(keyFor(c, `${i}-x`))}>{c.x}</span>
                  <span {...style(keyFor(c, i))}>,</span>
                  <span {...style(keyFor(c, `${i}-y`))}>{c.y}</span>
                </code>
                <p>
                  Move the current point{i === 0 ? " (0, 0)" : ""} to a new
                  point {printPoint(c, c, i)}
                </p>
              </div>
            );
            break;
          case SVGPathData.CLOSE_PATH:
            child = (
              <div>
                <code>
                  <span {...style(keyFor(c, i))}>Z</span>
                </code>
                <p>Close the path</p>
              </div>
            );
            break;
          case SVGPathData.LINE_TO:
            child = (
              <div>
                <code>
                  <span {...style(keyFor(c, i))}>
                    {c.relative ? "l" : "L"}{" "}
                  </span>
                  <span {...style(keyFor(c, `${i}-x`))}>{c.x}</span>
                  <span {...style(keyFor(c, i))}>,</span>
                  <span {...style(keyFor(c, `${i}-y`))}>{c.y}</span>
                </code>
                <p>
                  Draw a line from the current point to a new point{" "}
                  {printPoint(c, c, i)}
                </p>
              </div>
            );
            break;
          case SVGPathData.HORIZ_LINE_TO:
            child = (
              <div>
                <code>
                  <span {...style(keyFor(c, i))}>
                    {c.relative ? "h" : "H"}{" "}
                  </span>
                  <span {...style(keyFor(c, `${i}-x`))}>{c.x}</span>
                </code>
                <p>
                  Draw a horizontal line from the current point{" "}
                  {c.relative ? "of length" : "to"}{" "}
                  <span {...style(keyFor(c, `${i}-x`))}>{c.x}</span>
                </p>
              </div>
            );
            break;
          case SVGPathData.VERT_LINE_TO:
            child = (
              <div>
                <code>
                  <span {...style(keyFor(c, i))}>
                    {c.relative ? "v" : "V"}{" "}
                  </span>
                  <span {...style(keyFor(c, `${i}-y`))}>{c.y}</span>
                </code>
                <p>
                  Draw a vertical line from the current point{" "}
                  {c.relative ? "of length" : "to"}{" "}
                  <span {...style(keyFor(c, `${i}-y`))}>{c.y}</span>
                </p>
              </div>
            );
            break;
          case SVGPathData.CURVE_TO:
            child = (
              <div>
                <code>
                  <span {...style(keyFor(c, i))}>
                    {c.relative ? "c" : "C"}{" "}
                  </span>
                  <span {...style(keyFor(c, `${i}-cp1-x`))}>{c.x1}</span>
                  <span {...style(keyFor(c, `${i}-cp1`))}>,</span>
                  <span {...style(keyFor(c, `${i}-cp1-y`))}>{c.y1}</span>
                  <span {...style(keyFor(c, i))}> </span>
                  <span {...style(keyFor(c, `${i}-cp2-x`))}>{c.x2}</span>
                  <span {...style(keyFor(c, `${i}-cp2`))}>,</span>
                  <span {...style(keyFor(c, `${i}-cp2-y`))}>{c.y2}</span>
                  <span {...style(keyFor(c, i))}> </span>
                  <span {...style(keyFor(c, `${i}-x`))}>{c.x}</span>
                  <span {...style(keyFor(c, i))}>,</span>
                  <span {...style(keyFor(c, `${i}-y`))}>{c.y}</span>
                </code>
                <p>
                  Draw a Bézier curve from the current point to a new point{" "}
                  {printPoint(c, c, i)}
                </p>
                <p>
                  The{" "}
                  <span {...style(keyFor(c, `${i}-cp1`))}>
                    start control point
                  </span>{" "}
                  is {printPoint({ x: c.x1, y: c.y1 }, c, `${i}-cp1`)} and the{" "}
                  <span {...style(keyFor(c, `${i}-cp2`))}>
                    end control point
                  </span>{" "}
                  is {printPoint({ x: c.x2, y: c.y2 }, c, `${i}-cp2`)}
                </p>
              </div>
            );
            break;
          case SVGPathData.SMOOTH_CURVE_TO:
            child = (
              <div>
                <code>
                  <span {...style(keyFor(c, i))}>
                    {c.relative ? "c" : "C"}{" "}
                  </span>
                  <span {...style(keyFor(c, `${i}-cp2-x`))}>{c.x2}</span>
                  <span {...style(keyFor(c, `${i}-cp2`))}>,</span>
                  <span {...style(keyFor(c, `${i}-cp2-y`))}>{c.y2}</span>
                  <span {...style(keyFor(c, i))}> </span>
                  <span {...style(keyFor(c, `${i}-x`))}>{c.x}</span>
                  <span {...style(keyFor(c, i))}>,</span>
                  <span {...style(keyFor(c, `${i}-y`))}>{c.y}</span>
                </code>
                <p>
                  Draw a Bézier curve from the current point to a new point{" "}
                  {printPoint(c, c, i)}
                </p>
                <p>
                  The{" "}
                  <span {...style(keyFor(c, `${i}-cp1`))}>
                    start control point
                  </span>{" "}
                  is{" "}
                  <span {...style(keyFor(c, `${i}-cp1`))}>
                    the reflection of the end control point of the previous
                    curve command
                  </span>{" "}
                  and the{" "}
                  <span {...style(keyFor(c, `${i}-cp2`))}>
                    end control point
                  </span>{" "}
                  is {printPoint({ x: c.x2, y: c.y2 }, c, `${i}-cp2`)}
                </p>
              </div>
            );
            break;
          case SVGPathData.QUAD_TO:
            child = (
              <div>
                <code>
                  <span {...style(keyFor(c, i))}>
                    {c.relative ? "q" : "Q"}{" "}
                  </span>
                  <span {...style(keyFor(c, `${i}-cp-x`))}>{c.x1}</span>
                  <span {...style(keyFor(c, `${i}-cp`))}>,</span>
                  <span {...style(keyFor(c, `${i}-cp-y`))}>{c.y1}</span>
                  <span {...style(keyFor(c, i))}> </span>
                  <span {...style(keyFor(c, `${i}-x`))}>{c.x}</span>
                  <span {...style(keyFor(c, i))}>,</span>
                  <span {...style(keyFor(c, `${i}-y`))}>{c.y}</span>
                </code>
                <p>
                  Draw a quadratic Bézier curve from the current point to a new
                  point {printPoint(c, c, i)}
                </p>
                <p>
                  The{" "}
                  <span {...style(keyFor(c, `${i}-cp`))}>control point</span> is{" "}
                  {printPoint({ x: c.x1, y: c.y1 }, c, `${i}-cp`)}
                </p>
              </div>
            );
            break;
          case SVGPathData.SMOOTH_QUAD_TO:
            child = (
              <div>
                <code>
                  <span {...style(keyFor(c, i))}>
                    {c.relative ? "t" : "T"}{" "}
                  </span>
                  <span {...style(keyFor(c, `${i}-x`))}>{c.x}</span>
                  <span {...style(keyFor(c, i))}>,</span>
                  <span {...style(keyFor(c, `${i}-y`))}>{c.y}</span>
                </code>
                <p>
                  Draw a quadratic Bézier curve from the current point to a new
                  point {printPoint(c, c, i)}
                </p>
                <p>
                  The{" "}
                  <span {...style(keyFor(c, `${i}-cp`))}>control point</span> is{" "}
                  <span {...style(keyFor(c, `${i}-cp`))}>
                    the reflection of the end control point of the previous
                    curve command
                  </span>
                </p>
              </div>
            );
            break;
          case SVGPathData.ARC:
            child = (
              <div>
                <code>
                  <span {...style(keyFor(c, i))}>
                    {c.relative ? "a" : "A"}{" "}
                  </span>
                  <span {...style(keyFor(c, i))}>
                    {c.rX},{c.rY} {c.xRot} {c.lArcFlag} {c.sweepFlag}{" "}
                  </span>
                  <span {...style(keyFor(c, `${i}-x`))}>{c.x}</span>
                  <span {...style(keyFor(c, i))}>,</span>
                  <span {...style(keyFor(c, `${i}-y`))}>{c.y}</span>
                </code>
                <p>
                  Draw an Arc curve from the current point to a new point{" "}
                  {printPoint(c, c, i)}
                </p>
              </div>
            );
            break;
          default: {
            assertNever(c);
          }
        }

        return <li key={keyFor(c, i)}>{child}</li>;
      })}
    </ul>
  );
}

export default CommandExplainer;
