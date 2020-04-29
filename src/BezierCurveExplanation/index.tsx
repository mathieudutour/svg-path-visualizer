import React from "react";
import StringArt from "./StringArt";
import { CubicBezierCurveIllustration } from "./BezierCurveIllustrations";

// @ts-ignore
import sketchScreencast from "./bezier-curve-sketch.mov";

import "./index.css";

export function BezierCurveExplanation() {
  return (
    <div className="bezier-explanation">
      <h1>SVG Path and Bézier Curves</h1>
      <p>
        Bézier Curves are one of the 3 command types (with lines and arcs) of an
        SVG path. It is the mathematical name for a special type of curves that
        can be defined with 4 points: the "Start" point, the "End" point, and 2
        "Control" points.
      </p>
      <p>
        Most design tools allow you to draw Bézier curves (sometime called "Pen
        tool" as in Photoshop, Illustrator, or Figma - or "Vector tool" as in
        Sketch) and let you define those 4 points.
      </p>
      <video controls autoPlay loop muted>
        <source src={sketchScreencast}></source>
      </video>
      <p>
        The curve goes from the "Start" point to the "End" point while the
        "Control" point define its curvature.
      </p>
      <p>
        The reason why those curves are so popular is because of how "smooth"
        they look like and how fast and easy they are to compute. You might even
        have done some curve stitching and already drawn one by hand in the case
        where the 2 control points are the same (this is a special case of
        Bézier Curves but we will come back to it later).
      </p>
      <StringArt style={{ width: "50%", margin: "auto", display: "block" }} />
      <h2>How does it work?</h2>
      <p>
        To get a feel of how Bézier Curve works, imagine a plane 🛩flying between
        2 airports. The control points are the instructions from the control
        towers of the respective airports regarding the direction of the runways
        and fast the plane needs to leave 🛫/arrive 🛬. The longer the distance
        between the airport and the control point, the faster the plane needs to
        be.
      </p>
      <p>
        Between the airports, the flight needs to be as smooth as possible,
        which means turning the least possible while respect the instructions of
        the control towers.
      </p>
      <p>
        <em>
          Maybe a spaceship metaphor would be better? Also need some drawings
        </em>
      </p>
      <h2>How does it translate to SVG?</h2>
      <p>
        The command associated with a Bézier Curve is <code>C</code>. The start
        point is always a given (the position at the end of the previous command
        - or (0,0) if it's the first command).
      </p>
      <CubicBezierCurveIllustration
        style={{ width: "50%", margin: "auto", display: "block" }}
      />
      There are also some special cases of Bézier Curves which have shortcut
      notation in SVG.
      <p>TBC</p>
    </div>
  );
}
