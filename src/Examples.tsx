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
  { name: "Arc", path: "M2,5 A 5 25 0 0 1 8 8", viewBox: "0 0 10 10" },
  { name: "Smooth", path: "M2,5 S2,-2 4,5 S7,8 8,4", viewBox: "0 0 10 10" },
  {
    name: "Heart",
    path:
      "M140 20C73 20 20 74 20 140c0 135 136 170 228 303 88-132 229-173 229-303 0-66-54-120-120-120-48 0-90 28-109 69-19-41-60-69-108-69z",
    viewBox: "-50 -50 550 550",
    strokeWidth: "50",
  },
  {
    name: "Banana",
    path:
      "M8.64,223.948c0,0,143.468,3.431,185.777-181.808c2.673-11.702-1.23-20.154,1.316-33.146h16.287c0,0-3.14,17.248,1.095,30.848 c21.392,68.692-4.179,242.343-204.227,196.59L8.64,223.948z M8.767,230.326c0,0,188.246,40.154,196.485-160.139",
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
            <path
              d={ex.path}
              stroke="black"
              fill="none"
              strokeWidth={ex.strokeWidth}
            />
          </svg>
          <span>{ex.name}</span>
        </div>
      ))}
    </div>
  );
}

export default Examples;
