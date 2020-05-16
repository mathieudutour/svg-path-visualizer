import { encodeSVGPath } from "svg-pathdata";
import { SVGCommand } from "svg-pathdata/lib/types";

export function keyFor(command: SVGCommand, suffix: number | string) {
  return `${encodeSVGPath(command)}-${suffix}`;
}

export function assertNever(x: never): never {
  throw new Error("Unknown type: " + x["type"]);
}

export enum HelperType {
  default = "default",
  implicit = "implicit",
  invisible = "invisible",
  defaultChild = "defaultChild",
}

// https://www.w3.org/TR/SVG/implnote.html#ArcConversionEndpointToCenter
export const arcEllipseCenter = (
  x1: number,
  y1: number,
  rx: number,
  ry: number,
  a: number,
  fa: number,
  fs: number,
  x2: number,
  y2: number
) => {
  const phi = (a * Math.PI) / 180;

  const M = [
    [Math.cos(phi), Math.sin(phi)],
    [-Math.sin(phi), Math.cos(phi)],
  ];
  const V = [(x1 - x2) / 2, (y1 - y2) / 2];

  const [x1p, y1p] = [
    M[0][0] * V[0] + M[0][1] * V[1],
    M[1][0] * V[0] + M[1][1] * V[1],
  ];

  rx = Math.abs(rx);
  ry = Math.abs(ry);

  const lambda = (x1p * x1p) / (rx * rx) + (y1p * y1p) / (ry * ry);
  if (lambda > 1) {
    rx = Math.sqrt(lambda) * rx;
    ry = Math.sqrt(lambda) * ry;
  }

  const sign = fa === fs ? -1 : 1;

  const co =
    sign *
    Math.sqrt(
      Math.max(
        rx * rx * ry * ry - rx * rx * y1p * y1p - ry * ry * x1p * x1p,
        0
      ) /
        (rx * rx * y1p * y1p + ry * ry * x1p * x1p)
    );

  const V2 = [(rx * y1p) / ry, (-ry * x1p) / rx];
  const Cp = [V2[0] * co, V2[1] * co];

  const M2 = [
    [Math.cos(phi), -Math.sin(phi)],
    [Math.sin(phi), Math.cos(phi)],
  ];
  const V3 = [(x1 + x2) / 2, (y1 + y2) / 2];
  const C = [
    M2[0][0] * Cp[0] + M2[0][1] * Cp[1] + V3[0],
    M2[1][0] * Cp[0] + M2[1][1] * Cp[1] + V3[1],
  ];

  return { x: C[0], y: C[1] };
};

export const pointCircle = (
  center: { x: number; y: number },
  r: number,
  a: number
) => {
  const phi = (a * Math.PI) / 180;
  return {
    x: center.x + r * Math.cos(phi),
    y: center.y + r * Math.sin(phi),
  };
};
