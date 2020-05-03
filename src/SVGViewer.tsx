import React from "react";
import { SVGPathData, encodeSVGPath } from "svg-pathdata";
import { SVGCommand } from "svg-pathdata/lib/types";
import { keyFor, assertNever, HelperType } from "./utils";
import { useWindowSize } from "./hooks/useWindowSize";
import { red, blue } from "./colors";

let resetTimeout: NodeJS.Timeout;

function SVGViewer({
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
              : type === HelperType.invisible
              ? "transparent"
              : "black",
          pointerEvents: (type === HelperType.invisible
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
        "data-key": type === HelperType.invisible ? undefined : key,
        onMouseEnter: () => {
          if (type === HelperType.invisible) {
            return;
          }
          if (resetTimeout) {
            clearTimeout(resetTimeout);
          }
          setHovering(key);
        },
        onMouseLeave: () => {
          if (type === HelperType.invisible) {
            return;
          }
          resetTimeout = setTimeout(() => setHovering(null), 50);
        },
      };
    },
    [stroke, hovering, setHovering]
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
          const cp1 = {
            x:
              previousCommand &&
              (previousCommand.type === SVGPathData.SMOOTH_CURVE_TO ||
                previousCommand.type === SVGPathData.CURVE_TO)
                ? previousCommand.relative
                  ? prev.current.x - previousCommand.x2
                  : prev.current.x - (previousCommand.x2 - prev.current.x)
                : prev.current.x,
            y:
              previousCommand &&
              (previousCommand.type === SVGPathData.SMOOTH_CURVE_TO ||
                previousCommand.type === SVGPathData.CURVE_TO)
                ? previousCommand.relative
                  ? prev.current.y - previousCommand.y2
                  : prev.current.y - (previousCommand.y2 - prev.current.y)
                : prev.current.y,
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
                  ? currentPoint.x - previousCommand.x1
                  : currentPoint.x - (previousCommand.x1 - currentPoint.x),
                y: previousCommand.relative
                  ? currentPoint.y - previousCommand.y1
                  : currentPoint.y - (previousCommand.y1 - currentPoint.y),
              };
            }
            if (previousCommand.type === SVGPathData.SMOOTH_QUAD_TO) {
              const previousCP = backTrackCP(index - 1, {
                x: previousCommand.relative
                  ? currentPoint.x - previousCommand.x
                  : previousCommand.x,
                y: previousCommand.relative
                  ? currentPoint.y - previousCommand.y
                  : previousCommand.y,
              });

              return {
                x: currentPoint.x - (previousCP.x - currentPoint.x),
                y: currentPoint.y - (previousCP.y - currentPoint.y),
              };
            }
            return currentPoint;
          };

          const cp1 = backTrackCP(i, prev.current);

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
        default: {
          assertNever(c);
        }
      }
      return prev;
    },
    {
      grid: [] as React.ReactNode[],
      elems: [] as React.ReactNode[],
      overlay: [] as React.ReactNode[],
      current: { x: 0, y: 0 },
      start: { x: NaN, y: NaN },
    }
  );

  const margin = stroke * 10;

  const bounds = [
    pathData.bounds.minX - margin,
    pathData.bounds.minY - margin,
    pathData.bounds.maxX + margin,
    pathData.bounds.maxY + margin,
  ];

  const width = bounds[2] - bounds[0];
  const height = bounds[3] - bounds[1];

  if (windowSize.width && windowSize.height) {
    const containerSize = {
      width: windowSize.width / 2,
      height: windowSize.height,
    };
    if (width / height > containerSize.width / containerSize.height) {
      const left =
        (width / height - containerSize.width / containerSize.height) * height;
      bounds[1] -= left / 2;
      bounds[3] += left / 2;
    } else {
      const left =
        (containerSize.width / containerSize.height - width / height) * width;
      bounds[0] -= left / 2;
      bounds[2] += left / 2;
    }
  }

  const gridProps = {
    'x': {
      min: bounds[0],
      max: bounds[2],
      delta: bounds[2] - bounds[0],
    },
    'y': {
      min: bounds[1],
      max: bounds[3],
      delta: bounds[3] - bounds[1],
    }
  } as any; // TODO TS to fix

  // we need the labels to be always on top of the lines, but since SVG doesn't support z-index via CSS
  // we need to generate them separately and then push them in the right order in the "data.grid" element
  const gridElements = {
    lines: [],
    labels: [],
  } as any; // TODO TS to fix

  // TODO: discuss in PR if is really needed, or we can assume they have the same scale
  // TODO explain what the "power of ten scale" is
  const gridTenScaleX = Math.pow(10, Math.floor(Math.log10(gridProps['x'].delta)));
  const gridTenScaleY = Math.pow(10, Math.floor(Math.log10(gridProps['y'].delta)));
  gridProps['scalePow10'] = Math.min(gridTenScaleX, gridTenScaleY);

  // TODO explain what a "step" is
  gridProps['step'] = gridProps['scalePow10'] / 5;

  ['x', 'y'].forEach((axis) => {
    // not very elegant, but it works
    // TODO alternative, use some "magic" code that uses "object.keys(gridProps) and works out the "other" key ?
    const otherAxis = axis === 'x' ? 'y' : 'x';
    const firstLine = gridProps[otherAxis].min - (gridProps[otherAxis].min % gridProps['step']);
    const intervals = gridProps[otherAxis].delta / gridProps['step'];

    for (let i = 1; i < intervals; i++) {
      const currAxisValue = firstLine + i * gridProps['step'];
      const isMultipleOfPow10Scale = currAxisValue % gridProps['scalePow10'] === 0;
      const classNames = []
      if (currAxisValue === 0) {
        classNames.push('grid-main');
      } else {
        classNames.push('grid-sub');
        if (!isMultipleOfPow10Scale) {
          classNames.push('grid-dashed');
        }
      }
      const lineCoordinates = {} as any; // TODO TS to fix
      lineCoordinates[`${axis}1`] = gridProps[axis].min;
      lineCoordinates[`${axis}2`] = gridProps[axis].max;
      lineCoordinates[`${otherAxis}1`] = currAxisValue;
      lineCoordinates[`${otherAxis}2`] = currAxisValue;

      gridElements.lines.push(
        <line key={`grid-${axis}${i}`} className={classNames.join(' ')} {...lineCoordinates} />
      );

      if (isMultipleOfPow10Scale) {
        const labelCoordinates = {} as any; // TODO TS to fix
        labelCoordinates[axis] = -10 * gridProps['scalePow10'] / 100; // TODO use a better calculation based on the grid[x/y].delta which is more precise?
        labelCoordinates[otherAxis] = currAxisValue;

        gridElements.labels.push(
          <text key={`grid-${axis}${i}-label`} className="grid-label" {...labelCoordinates}>{currAxisValue}</text>
        );
      }
    }
    data.grid.push(gridElements.lines, gridElements.labels);
  })

  return (
    <svg className="svg-viewer" viewBox={bounds.join(" ")}>
      {/*
      // @ts-ignore */}
      <g className="grid" style={{ '--grid-scale-factor-pow10': gridProps['scalePow10'], '--grid-stroke': stroke }}>
        {data.grid}
      </g>
      {data.elems}
      {data.overlay}
    </svg>
  );
}

export default SVGViewer;
