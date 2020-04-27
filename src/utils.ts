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
}
