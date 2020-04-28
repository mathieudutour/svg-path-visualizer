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
            ? `previous point ${point.y < 0 ? "-" : "+"} `
            : `${point.y < 0 ? "-" : ""}`}
          {Math.abs(point.y)}{" "}
        </span>
        {"}"}
      </>
    );
  }

  function printRelativePoint(
    point: { x?: number; y?: number },
    c: SVGCommand,
    suffix: number | string
  ) {
    return (
      <>
        <span {...style(keyFor(c, `${suffix}-x`))}>
          {!point.x
            ? ""
            : point.x < 0
            ? `left ${Math.abs(point.x)}`
            : `right ${Math.abs(point.x)}`}
        </span>
        {point.x && point.y ? " and " : ""}
        <span {...style(keyFor(c, `${suffix}-y`))}>
          {!point.y
            ? ""
            : point.y < 0
            ? `top ${Math.abs(point.y)}`
            : `bottom ${Math.abs(point.y)}`}
        </span>
      </>
    );
  }

  return (
    <ul>
      {pathData.commands.map((c, i, a) => {
        const penCommand =
          c.type === SVGPathData.MOVE_TO &&
          (!a[i - 1] || a[i - 1].type !== SVGPathData.MOVE_TO)
            ? "Pick up the pen and "
            : a[i - 1] && a[i - 1].type === SVGPathData.MOVE_TO
            ? "Put down the pen and "
            : "";
        let child: React.ReactNode;
        switch (c.type) {
          case SVGPathData.MOVE_TO:
            child = (
              <div>
                <code>
                  <span {...style(keyFor(c, `${i}-command`))}>
                    {c.relative ? "m" : "M"}{" "}
                  </span>
                  <span {...style(keyFor(c, `${i}-x`))}>{c.x}</span>
                  <span {...style(keyFor(c, i))}>,</span>
                  <span {...style(keyFor(c, `${i}-y`))}>{c.y}</span>
                </code>
                <p>
                  {penCommand}
                  {c.relative ? (
                    <span>
                      <span {...style(keyFor(c, `${i}-command`))}>Move</span> it{" "}
                      {printRelativePoint(c, c, i)} from the current position
                    </span>
                  ) : (
                    <span>
                      <span {...style(keyFor(c, `${i}-command`))}>Move</span> it
                      to {printPoint(c, c, i)}
                    </span>
                  )}
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
                <p>
                  {penCommand}
                  Draw a line straight back to the start
                </p>
              </div>
            );
            break;
          case SVGPathData.LINE_TO:
            child = (
              <div>
                <code>
                  <span {...style(keyFor(c, `${i}-command`))}>
                    {c.relative ? "l" : "L"}{" "}
                  </span>
                  <span {...style(keyFor(c, `${i}-x`))}>{c.x}</span>
                  <span {...style(keyFor(c, i))}>,</span>
                  <span {...style(keyFor(c, `${i}-y`))}>{c.y}</span>
                </code>
                <p>
                  {penCommand}
                  {c.relative ? (
                    <span>
                      Move {printRelativePoint(c, c, i)} from the current
                      position
                    </span>
                  ) : (
                    <span>
                      Draw a{" "}
                      <span {...style(keyFor(c, `${i}-command`))}>line</span> to{" "}
                      {printPoint(c, c, i)}
                    </span>
                  )}
                </p>
              </div>
            );
            break;
          case SVGPathData.HORIZ_LINE_TO:
            child = (
              <div>
                <code>
                  <span {...style(keyFor(c, `${i}-command`))}>
                    {c.relative ? "h" : "H"}{" "}
                  </span>
                  <span {...style(keyFor(c, `${i}-x`))}>{c.x}</span>
                </code>
                <p>
                  {penCommand}
                  {c.relative ? (
                    <span>
                      Move {printRelativePoint(c, c, i)} from the current
                      position
                    </span>
                  ) : (
                    <span>
                      Move{" "}
                      <span {...style(keyFor(c, `${i}-command`))}>
                        horizontally
                      </span>{" "}
                      to <span {...style(keyFor(c, `${i}-x`))}>{c.x}</span>
                    </span>
                  )}
                </p>
              </div>
            );
            break;
          case SVGPathData.VERT_LINE_TO:
            child = (
              <div>
                <code>
                  <span {...style(keyFor(c, `${i}-command`))}>
                    {c.relative ? "v" : "V"}{" "}
                  </span>
                  <span {...style(keyFor(c, `${i}-y`))}>{c.y}</span>
                </code>
                <p>
                  {penCommand}
                  {c.relative ? (
                    <span>
                      Move {printRelativePoint(c, c, i)} from the current
                      position
                    </span>
                  ) : (
                    <span>
                      Move{" "}
                      <span {...style(keyFor(c, `${i}-command`))}>
                        vertically
                      </span>{" "}
                      to <span {...style(keyFor(c, `${i}-y`))}>{c.y}</span>
                    </span>
                  )}
                </p>
              </div>
            );
            break;
          case SVGPathData.CURVE_TO:
            child = (
              <div>
                <code>
                  <span {...style(keyFor(c, `${i}-command`))}>
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
                  {penCommand}
                  Draw a Bézier{" "}
                  <span {...style(keyFor(c, `${i}-command`))}>curve</span> from
                  the current point to a new point {printPoint(c, c, i)}
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
                  <span {...style(keyFor(c, `${i}-command`))}>
                    {c.relative ? "s" : "S"}{" "}
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
                  {penCommand}
                  Draw a{" "}
                  <span {...style(keyFor(c, `${i}-command`))}>smooth</span>{" "}
                  Bézier curve from the current point to a new point{" "}
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
                  <span {...style(keyFor(c, `${i}-command`))}>
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
                  {penCommand}
                  Draw a{" "}
                  <span {...style(keyFor(c, `${i}-command`))}>
                    quadratic
                  </span>{" "}
                  Bézier curve from the current point to a new point{" "}
                  {printPoint(c, c, i)}
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
                  <span {...style(keyFor(c, `${i}-command`))}>
                    {c.relative ? "t" : "T"}{" "}
                  </span>
                  <span {...style(keyFor(c, `${i}-x`))}>{c.x}</span>
                  <span {...style(keyFor(c, i))}>,</span>
                  <span {...style(keyFor(c, `${i}-y`))}>{c.y}</span>
                </code>
                <p>
                  {penCommand}
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
                  <span {...style(keyFor(c, `${i}-command`))}>
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
                  {penCommand}
                  Draw an <span {...style(keyFor(c, `${i}-command`))}>
                    Arc
                  </span>{" "}
                  curve from the current point to a new point{" "}
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
