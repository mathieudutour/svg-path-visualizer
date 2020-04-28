import React from "react";

import "./Examples.css";

const examples = [
  { name: "Line", path: "M2,2 L8,8" },
  { name: "Triangle", path: "M2,8 L5,2 L8,8" },
  { name: "Quad", path: "M2,2 Q8,2 8,8" },
  { name: "Curve", path: "M2,5 C2,8 8,8 8,5" },
  { name: "ZigZag", path: "M2,2 L8,2 L2,5 L8,5 L2,8 L8,8" },
  { name: "Arc", path: "M2,5 A 5 25 0 0 1 8 8" },
  { name: "Smooth", path: "M2,5 S2,-2 4,5 S7,8 8,4" },
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
          <svg viewBox="0 0 10 10">
            <path d={ex.path} stroke="black" fill="none" />
          </svg>
          <span>{ex.name}</span>
        </div>
      ))}
    </div>
  );
}

export default Examples;
