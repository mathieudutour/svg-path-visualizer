import React from "react";

import "./Examples.css";

const examples = [
  { name: "Line", path: "M2,2 L8,8", viewBox: "0 0 10 10" },
  { name: "Triangle", path: "M2,8 L5,2 L8,8", viewBox: "0 0 10 10" },
  { name: "Quad", path: "M2,2 Q8,2 8,8", viewBox: "0 0 10 10" },
  { name: "Curve", path: "M2,5 C2,8 8,8 8,5", viewBox: "0 0 10 10" },
  {
    name: "ZigZag",
    path: "M2,2 L8,2 L2,5 L8,5 L2,8 L8,8",
    viewBox: "0 0 10 10",
  },
  { name: "Arc", path: "M1,5 A 5 3 20 0 1 8 8", viewBox: "0 0 10 10" },
  { name: "Smooth", path: "M2,5 S2,-2 4,5 S7,8 8,4", viewBox: "0 0 10 10" },
  {
    name: "Heart",
    path: "M140 20C73 20 20 74 20 140c0 135 136 170 228 303 88-132 229-173 229-303 0-66-54-120-120-120-48 0-90 28-109 69-19-41-60-69-108-69z",
    viewBox: "-50 -50 550 550",
    strokeWidth: "50",
  },
  {
    name: "Banana",
    path: "M 8,223 c 0,0 143,3 185,-181 c 2,-11 -1,-20 1,-33 h 16 c 0,0 -3,17 1,30 c 21,68 -4,242 -204,196 L 8,223 z M 8,230 c 0,0 188,40 196,-160",
    viewBox: "0 0 228 253",
    strokeWidth: "15",
  },
];

function Examples({
  pathString,
  setPathString,
}: {
  pathString: string;
  setPathString: (string: string) => void;
}) {
  return (
    <div className="examples">
      {examples.map((ex) => (
        <div
          className={`example ${
            ex.path === pathString ? "example-selected" : ""
          }`}
          key={ex.name}
          onClick={() => setPathString(ex.path)}
        >
          <svg viewBox={ex.viewBox}>
            <path d={ex.path} fill="none" strokeWidth={ex.strokeWidth} />
          </svg>
          <span>{ex.name}</span>
        </div>
      ))}
    </div>
  );
}

export default Examples;
