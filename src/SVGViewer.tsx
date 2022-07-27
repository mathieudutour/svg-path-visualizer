import React from "react";
import { SVGPathData, encodeSVGPath } from "svg-pathdata";
import { SVGCommand } from "svg-pathdata/lib/types";
import {
  keyFor,
  assertNever,
  HelperType,
  arcEllipseCenter,
  pointCircle,
} from "./utils";
import { useWindowSize } from "./hooks/useWindowSize";
import { red, blue } from "./colors";

let resetTimeout: NodeJS.Timeout;

function SVGViewer({
  pathData,
  hovering,
  setHovering,
  scrollTo,
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
  scrollTo: (key: string) => void;
}) {
  const windowSize = useWindowSize();

  const stroke =
    Math.min(
      pathData.bounds.maxX - pathData.bounds.minX,
      pathData.bounds.maxY - pathData.bounds.minY
    ) / 100;

  const style = React.useCallback(
    (key: string, type?: HelperType) => {
      return {
        style: {
          color:
            hovering === key
              ? red
              : hovering?.startsWith(key)
              ? blue
              : type === HelperType.default || type === HelperType.implicit
              ? "lightgrey"
              : type === HelperType.invisibleFull ||
                type === HelperType.invisible ||
                type === HelperType.defaultChild
              ? "transparent"
              : "black",
          pointerEvents: (type === HelperType.invisibleFull ||
          type === HelperType.invisible
            ? "none"
            : "initial") as "none" | "initial",
        },
        stroke: "currentColor",
        fill: "none",
        strokeDasharray:
          type === HelperType.implicit || type === HelperType.invisible
            ? stroke * 2
            : "none",
        strokeWidth: stroke,
        "data-key":
          type === HelperType.invisibleFull || type === HelperType.invisible
            ? undefined
            : key,
        onMouseEnter: () => {
          if (
            type === HelperType.invisibleFull ||
            type === HelperType.invisible
          ) {
            return;
          }
          if (resetTimeout) {
            clearTimeout(resetTimeout);
          }
          setHovering(key);
        },
        onMouseLeave: () => {
          if (
            type === HelperType.invisibleFull ||
            type === HelperType.invisible
          ) {
            return;
          }
          resetTimeout = setTimeout(() => setHovering(null), 50);
        },
        onClick: () => {
          if (
            type === HelperType.invisibleFull ||
            type === HelperType.invisible
          ) {
            return;
          }
          scrollTo(key);
        },
      };
    },
    [stroke, hovering, setHovering, scrollTo]
  );

  function pointHelpers(
    from: { x: number; y: number },
    to: { x: number; y: number },
    c: SVGCommand,
    suffix: number | string
  ) {
    const keys = [keyFor(c, `${suffix}-x`), keyFor(c, `${suffix}-y`)];
    return [
      <line
        key={keys[0]}
        x1={"relative" in c && c.relative ? from.x : 0}
        y1={to.y}
        x2={to.x}
        y2={to.y}
        {...style(keys[0], HelperType.invisible)}
      />,
      <line
        key={keys[1]}
        x1={to.x}
        y1={"relative" in c && c.relative ? from.y : 0}
        x2={to.x}
        y2={to.y}
        {...style(keys[1], HelperType.invisible)}
      />,
    ];
  }

  if (!pathData.commands.length) {
    return null;
  }

  const data = pathData.commands.reduce(
    (prev, c, i, commands) => {
      switch (c.type) {
        case SVGPathData.MOVE_TO: {
          const next = {
            x: c.relative ? prev.current.x + c.x : c.x,
            y: c.relative ? prev.current.y + c.y : c.y,
          };
          const key = keyFor(c, i);
          prev.elems.push(
            <line
              key={key}
              x1={prev.current.x}
              y1={prev.current.y}
              x2={next.x}
              y2={next.y}
              {...style(key, HelperType.implicit)}
            />
          );
          prev.overlay.push(...pointHelpers(prev.current, next, c, i));
          prev.start = next;
          prev.current = next;
          break;
        }
        case SVGPathData.LINE_TO: {
          if (isNaN(prev.start.x)) {
            prev.start = prev.current;
          }
          const next = {
            x: c.relative ? prev.current.x + c.x : c.x,
            y: c.relative ? prev.current.y + c.y : c.y,
          };
          const key = keyFor(c, i);
          prev.elems.push(
            <line
              key={key}
              x1={prev.current.x}
              y1={prev.current.y}
              x2={next.x}
              y2={next.y}
              {...style(key)}
            />
          );
          prev.overlay.push(...pointHelpers(prev.current, next, c, i));
          prev.current = next;
          break;
        }
        case SVGPathData.HORIZ_LINE_TO: {
          if (isNaN(prev.start.x)) {
            prev.start = prev.current;
          }
          const next = {
            x: c.relative ? prev.current.x + c.x : c.x,
            y: prev.current.y,
          };
          const key = keyFor(c, i);
          prev.elems.push(
            <line
              key={key}
              x1={prev.current.x}
              y1={prev.current.y}
              x2={next.x}
              y2={next.y}
              {...style(key)}
            />
          );
          prev.overlay.push(...pointHelpers(prev.current, next, c, i));
          prev.current = next;
          break;
        }
        case SVGPathData.VERT_LINE_TO: {
          if (isNaN(prev.start.x)) {
            prev.start = prev.current;
          }
          const next = {
            x: prev.current.x,
            y: c.relative ? prev.current.y + c.y : c.y,
          };
          const key = keyFor(c, i);
          prev.elems.push(
            <line
              key={key}
              x1={prev.current.x}
              y1={prev.current.y}
              x2={next.x}
              y2={next.y}
              {...style(key)}
            />
          );
          prev.overlay.push(...pointHelpers(prev.current, next, c, i));
          prev.current = next;
          break;
        }
        case SVGPathData.CLOSE_PATH: {
          if (isNaN(prev.start.x)) {
            break;
          }
          const next = prev.start;
          const key = keyFor(c, i);
          prev.elems.push(
            <line
              key={key}
              x1={prev.current.x}
              y1={prev.current.y}
              x2={next.x}
              y2={next.y}
              {...style(key)}
            />
          );
          prev.current = next;
          prev.start = { x: NaN, y: NaN };
          break;
        }
        case SVGPathData.CURVE_TO: {
          if (isNaN(prev.start.x)) {
            prev.start = prev.current;
          }
          const next = {
            x: c.relative ? prev.current.x + c.x : c.x,
            y: c.relative ? prev.current.y + c.y : c.y,
          };
          const cp1 = {
            x: c.relative ? prev.current.x + c.x1 : c.x1,
            y: c.relative ? prev.current.y + c.y1 : c.y1,
          };
          const cp2 = {
            x: c.relative ? prev.current.x + c.x2 : c.x2,
            y: c.relative ? prev.current.y + c.y2 : c.y2,
          };
          const key = keyFor(c, i);
          const keyCp1 = keyFor(c, `${i}-cp1`);
          const keyCp2 = keyFor(c, `${i}-cp2`);
          prev.elems.push(
            <line
              key={keyCp1}
              x1={prev.current.x}
              y1={prev.current.y}
              x2={cp1.x}
              y2={cp1.y}
              {...style(keyCp1, HelperType.default)}
            />
          );
          prev.elems.push(
            <circle
              key={keyCp1 + "circle"}
              cx={cp1.x}
              cy={cp1.y}
              r={stroke * 1.5}
              {...style(keyCp1, HelperType.default)}
              fill="currentColor"
            />
          );
          prev.overlay.push(...pointHelpers(prev.current, cp1, c, `${i}-cp1`));
          prev.elems.push(
            <line
              key={keyCp2}
              x1={next.x}
              y1={next.y}
              x2={cp2.x}
              y2={cp2.y}
              {...style(keyCp2, HelperType.default)}
            />
          );
          prev.elems.push(
            <circle
              key={keyCp2 + "circle"}
              cx={cp2.x}
              cy={cp2.y}
              r={stroke * 1.5}
              {...style(keyCp2, HelperType.default)}
              fill="currentColor"
            />
          );
          prev.overlay.push(...pointHelpers(prev.current, cp2, c, `${i}-cp2`));
          prev.elems.push(
            <path
              key={key}
              d={`M ${prev.current.x},${prev.current.y} ${encodeSVGPath(c)}`}
              {...style(key)}
            />
          );
          prev.overlay.push(...pointHelpers(prev.current, next, c, i));
          prev.current = next;
          break;
        }
        case SVGPathData.SMOOTH_CURVE_TO: {
          if (isNaN(prev.start.x)) {
            prev.start = prev.current;
          }
          const next = {
            x: c.relative ? prev.current.x + c.x : c.x,
            y: c.relative ? prev.current.y + c.y : c.y,
          };
          const previousCommand = commands[i - 1];
          const reflectedCp1 = {
            x:
              previousCommand &&
              (previousCommand.type === SVGPathData.SMOOTH_CURVE_TO ||
                previousCommand.type === SVGPathData.CURVE_TO)
                ? previousCommand.relative
                  ? previousCommand.x2 - previousCommand.x
                  : previousCommand.x2 - prev.current.x
                : 0,
            y:
              previousCommand &&
              (previousCommand.type === SVGPathData.SMOOTH_CURVE_TO ||
                previousCommand.type === SVGPathData.CURVE_TO)
                ? previousCommand.relative
                  ? previousCommand.y2 - previousCommand.y
                  : previousCommand.y2 - prev.current.y
                : 0,
          };
          const cp1 = {
            x: prev.current.x - reflectedCp1.x,
            y: prev.current.y - reflectedCp1.y,
          };
          const cp2 = {
            x: c.relative ? prev.current.x + c.x2 : c.x2,
            y: c.relative ? prev.current.y + c.y2 : c.y2,
          };
          const key = keyFor(c, i);
          const keyCp1 = keyFor(c, `${i}-cp1`);
          const keyCp2 = keyFor(c, `${i}-cp2`);
          prev.elems.push(
            <line
              key={keyCp1}
              x1={prev.current.x}
              y1={prev.current.y}
              x2={cp1.x}
              y2={cp1.y}
              {...style(keyCp1, HelperType.implicit)}
            />
          );
          prev.elems.push(
            <circle
              key={keyCp1 + "circle"}
              cx={cp1.x}
              cy={cp1.y}
              r={stroke * 1.5}
              {...style(keyCp1, HelperType.implicit)}
              fill="currentColor"
            />
          );
          prev.overlay.push(...pointHelpers(prev.current, cp1, c, `${i}-cp1`));
          prev.elems.push(
            <line
              key={keyCp2}
              x1={next.x}
              y1={next.y}
              x2={cp2.x}
              y2={cp2.y}
              {...style(keyCp2, HelperType.default)}
            />
          );
          prev.elems.push(
            <circle
              key={keyCp2 + "circle"}
              cx={cp2.x}
              cy={cp2.y}
              r={stroke * 1.5}
              {...style(keyCp2, HelperType.default)}
              fill="currentColor"
            />
          );
          prev.overlay.push(...pointHelpers(prev.current, cp2, c, `${i}-cp2`));
          prev.elems.push(
            <path
              key={key}
              d={`M ${prev.current.x},${prev.current.y} ${encodeSVGPath({
                type: SVGPathData.CURVE_TO,
                relative: false,
                ...next,
                x1: cp1.x,
                y1: cp1.y,
                x2: cp2.x,
                y2: cp2.y,
              })}`}
              {...style(key)}
            />
          );
          prev.overlay.push(...pointHelpers(prev.current, next, c, i));
          prev.current = next;
          break;
        }
        case SVGPathData.QUAD_TO: {
          if (isNaN(prev.start.x)) {
            prev.start = prev.current;
          }
          const next = {
            x: c.relative ? prev.current.x + c.x : c.x,
            y: c.relative ? prev.current.y + c.y : c.y,
          };
          const cp1 = {
            x: c.relative ? prev.current.x + c.x1 : c.x1,
            y: c.relative ? prev.current.y + c.y1 : c.y1,
          };
          const key = keyFor(c, i);
          const keyCp = keyFor(c, `${i}-cp`);
          prev.elems.push(
            <line
              key={keyCp}
              x1={prev.current.x}
              y1={prev.current.y}
              x2={cp1.x}
              y2={cp1.y}
              {...style(keyCp, HelperType.default)}
            />
          );
          prev.elems.push(
            <line
              key={keyCp + "line2"}
              x1={next.x}
              y1={next.y}
              x2={cp1.x}
              y2={cp1.y}
              {...style(keyCp, HelperType.default)}
            />
          );
          prev.elems.push(
            <circle
              key={keyCp + "circle"}
              cx={cp1.x}
              cy={cp1.y}
              r={stroke * 1.5}
              {...style(keyCp, HelperType.default)}
              fill="currentColor"
            />
          );
          prev.overlay.push(...pointHelpers(prev.current, cp1, c, `${i}-cp`));
          prev.elems.push(
            <path
              key={key}
              d={`M ${prev.current.x},${prev.current.y} ${encodeSVGPath(c)}`}
              {...style(key)}
            />
          );
          prev.overlay.push(...pointHelpers(prev.current, next, c, i));
          prev.current = next;
          break;
        }
        case SVGPathData.SMOOTH_QUAD_TO: {
          if (isNaN(prev.start.x)) {
            prev.start = prev.current;
          }
          const next = {
            x: c.relative ? prev.current.x + c.x : c.x,
            y: c.relative ? prev.current.y + c.y : c.y,
          };

          const backTrackCP = (
            index: number,
            currentPoint: { x: number; y: number }
          ): { x: number; y: number } => {
            const previousCommand = commands[index - 1];
            if (!previousCommand) {
              return currentPoint;
            }
            if (previousCommand.type === SVGPathData.QUAD_TO) {
              return {
                x: previousCommand.relative
                  ? currentPoint.x - (previousCommand.x1 - previousCommand.x)
                  : currentPoint.x - (previousCommand.x1 - currentPoint.x),
                y: previousCommand.relative
                  ? currentPoint.y - (previousCommand.y1 - previousCommand.y)
                  : currentPoint.y - (previousCommand.y1 - currentPoint.y),
              };
            }
            if (previousCommand.type === SVGPathData.SMOOTH_QUAD_TO) {
              if (!prev.previousCP) {
                return currentPoint;
              }
              return {
                x: currentPoint.x - (prev.previousCP.x - currentPoint.x),
                y: currentPoint.y - (prev.previousCP.y - currentPoint.y),
              };
            }
            return currentPoint;
          };

          const cp1 = backTrackCP(i, prev.current);

          prev.previousCP = cp1;

          const key = keyFor(c, i);
          const keyCp = keyFor(c, `${i}-cp`);
          prev.elems.push(
            <line
              key={keyCp}
              x1={prev.current.x}
              y1={prev.current.y}
              x2={cp1.x}
              y2={cp1.y}
              {...style(keyCp, HelperType.implicit)}
            />
          );
          prev.elems.push(
            <line
              key={keyCp + "line2"}
              x1={next.x}
              y1={next.y}
              x2={cp1.x}
              y2={cp1.y}
              {...style(keyCp, HelperType.implicit)}
            />
          );
          prev.elems.push(
            <circle
              key={keyCp + "circle"}
              cx={cp1.x}
              cy={cp1.y}
              r={stroke * 1.5}
              {...style(keyCp, HelperType.implicit)}
              fill="currentColor"
            />
          );
          prev.overlay.push(...pointHelpers(prev.current, cp1, c, `${i}-cp`));
          prev.elems.push(
            <path
              key={key}
              d={`M ${prev.current.x},${prev.current.y} ${encodeSVGPath({
                type: SVGPathData.QUAD_TO,
                relative: false,
                ...next,
                x1: cp1.x,
                y1: cp1.y,
              })}`}
              {...style(key)}
            />
          );
          prev.overlay.push(...pointHelpers(prev.current, next, c, i));
          prev.current = next;
          break;
        }
        case SVGPathData.ARC: {
          if (isNaN(prev.start.x)) {
            prev.start = prev.current;
          }
          const next = {
            x: c.relative ? prev.current.x + c.x : c.x,
            y: c.relative ? prev.current.y + c.y : c.y,
          };

          const key = keyFor(c, i);

          const center = arcEllipseCenter(
            prev.current.x,
            prev.current.y,
            c.rX,
            c.rY,
            c.xRot,
            c.lArcFlag,
            c.sweepFlag,
            next.x,
            next.y
          );

          prev.elems.push(
            <path
              key={`${key}-oval-${c.lArcFlag ? 0 : 1}-${c.sweepFlag ? 0 : 1}`}
              d={`M ${prev.current.x},${prev.current.y} A ${c.rX} ${c.rY} ${
                c.xRot
              } ${c.lArcFlag ? 0 : 1} ${c.sweepFlag ? 0 : 1} ${next.x} ${
                next.y
              }`}
              {...style(`${key}-oval`, HelperType.implicit)}
            />
          );

          prev.elems.push(
            <path
              key={`${key}-oval-${c.lArcFlag ? 0 : 1}-${c.sweepFlag}`}
              d={`M ${prev.current.x},${prev.current.y} A ${c.rX} ${c.rY} ${
                c.xRot
              } ${c.lArcFlag ? 0 : 1} ${c.sweepFlag} ${next.x} ${next.y}`}
              {...style(`${key}-oval`, HelperType.invisible)}
            />
          );
          prev.elems.push(
            <path
              key={`${key}-oval-${c.lArcFlag}-${c.sweepFlag ? 0 : 1}`}
              d={`M ${prev.current.x},${prev.current.y} A ${c.rX} ${c.rY} ${
                c.xRot
              } ${c.lArcFlag} ${c.sweepFlag ? 0 : 1} ${next.x} ${next.y}`}
              {...style(`${key}-oval`, HelperType.invisible)}
            />
          );

          const radius1 = pointCircle(center, c.rX, c.xRot);
          const radius2 = pointCircle(center, c.rY, c.xRot + 90);
          prev.elems.push(
            <path
              key={`${key}-radius`}
              d={`M ${center.x},${center.y} L ${radius1.x},${radius1.y} M ${center.x},${center.y} L ${radius2.x},${radius2.y}`}
              {...style(`${key}-radius`, HelperType.default)}
            />
          );

          prev.elems.push(
            <line
              key={`${key}-radius-x`}
              x1={center.x}
              y1={center.y}
              x2={radius1.x}
              y2={radius1.y}
              {...style(`${key}-radius-x`, HelperType.defaultChild)}
            />
          );
          prev.elems.push(
            <line
              key={`${key}-radius-y`}
              x1={center.x}
              y1={center.y}
              x2={radius2.x}
              y2={radius2.y}
              {...style(`${key}-radius-y`, HelperType.defaultChild)}
            />
          );

          const rot = pointCircle(center, c.rX / 2, c.xRot);
          const flags = [0, c.xRot < 0 ? 0 : 1];
          prev.elems.push(
            <path
              key={`${key}-rotation`}
              d={`M ${center.x},${center.y} L ${center.x + c.rX},${
                center.y
              } M ${center.x + c.rX / 2},${center.y} A ${c.rX / 2},${
                c.rX / 2
              } 0 ${flags.join(" ")} ${rot.x},${rot.y}`}
              {...style(`${key}-rotation`, HelperType.invisible)}
            />
          );

          prev.overlay.push(
            ...pointHelpers(prev.current, center, c, `${i}-center`)
          );

          prev.elems.push(
            <path
              key={key}
              d={`M ${prev.current.x},${prev.current.y} ${encodeSVGPath(c)}`}
              {...style(key)}
            />
          );

          prev.elems.push(
            <path
              key={`${key}-oval-${c.lArcFlag}-${c.sweepFlag}`}
              d={`M ${prev.current.x},${prev.current.y} A ${c.rX} ${c.rY} ${c.xRot} ${c.lArcFlag} ${c.sweepFlag} ${next.x} ${next.y}`}
              {...style(`${key}-oval`, HelperType.invisibleFull)}
            />
          );

          prev.elems.push(
            <path
              key={`${key}-oval-large-${c.sweepFlag}`}
              d={`M ${prev.current.x},${prev.current.y} A ${c.rX} ${c.rY} ${c.xRot} ${c.lArcFlag} ${c.sweepFlag} ${next.x} ${next.y}`}
              {...style(`${key}-oval-large`, HelperType.invisibleFull)}
            />
          );

          prev.elems.push(
            <path
              key={`${key}-oval-large-${c.sweepFlag ? 0 : 1}`}
              d={`M ${prev.current.x},${prev.current.y} A ${c.rX} ${c.rY} ${
                c.xRot
              } ${c.lArcFlag} ${c.sweepFlag ? 0 : 1} ${next.x} ${next.y}`}
              {...style(`${key}-oval-large`, HelperType.invisibleFull)}
            />
          );

          prev.elems.push(
            <path
              key={`${key}-oval-sweep-${c.lArcFlag}`}
              d={`M ${prev.current.x},${prev.current.y} A ${c.rX} ${c.rY} ${c.xRot} ${c.lArcFlag} ${c.sweepFlag} ${next.x} ${next.y}`}
              {...style(`${key}-oval-sweep`, HelperType.invisibleFull)}
            />
          );

          prev.elems.push(
            <path
              key={`${key}-oval-sweep-${c.lArcFlag ? 0 : 1}`}
              d={`M ${prev.current.x},${prev.current.y} A ${c.rX} ${c.rY} ${
                c.xRot
              } ${c.lArcFlag ? 0 : 1} ${c.sweepFlag} ${next.x} ${next.y}`}
              {...style(`${key}-oval-sweep`, HelperType.invisibleFull)}
            />
          );

          prev.overlay.push(...pointHelpers(prev.current, next, c, i));

          prev.current = next;
          break;
        }
        default: {
          assertNever(c);
        }
      }
      return prev;
    },
    {
      elems: [] as React.ReactNode[],
      overlay: [] as React.ReactNode[],
      current: { x: 0, y: 0 },
      start: { x: NaN, y: NaN },
      previousCP: { x: NaN, y: NaN },
    }
  );

  const margin = stroke * 10;

  const viewBox = [
    pathData.bounds.minX - margin,
    pathData.bounds.minY - margin,
    pathData.bounds.maxX - pathData.bounds.minX + margin * 2,
    pathData.bounds.maxY - pathData.bounds.minY + margin * 2,
  ];

  const width = viewBox[2];
  const height = viewBox[3];

  if (windowSize.width && windowSize.height) {
    const containerSize = {
      width: windowSize.width / 2,
      height: windowSize.height,
    };
    if (width / height > containerSize.width / containerSize.height) {
      // portrait
      const additionalViewBoxHeight =
        (width / height - containerSize.width / containerSize.height) * height;
      viewBox[1] -= additionalViewBoxHeight / 2;
      viewBox[3] += additionalViewBoxHeight;
    } else {
      // landscape
      const additionalViewBoxWidth =
        (containerSize.width / containerSize.height - width / height) * width;
      viewBox[0] -= additionalViewBoxWidth / 2;
      viewBox[2] += additionalViewBoxWidth;
    }
  }

  return (
    <svg className="svg-viewer" viewBox={viewBox.join(" ")}>
      {data.elems}
      {data.overlay}
    </svg>
  );
}

export default SVGViewer;
