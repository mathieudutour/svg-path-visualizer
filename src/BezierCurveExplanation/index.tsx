import React from "react";
import { Helmet } from "react-helmet";
import StringArt from "./StringArt";
import {
  CubicBezierCurveIllustration,
  SmoothCubicBezierCurveIllustration,
  QuadraticBezierCurveIllustration,
  SmoothQuadraticBezierCurveIllustration,
} from "./BezierCurveIllustrations";
import { WhatPath, FullPath, StraightPath } from "./Train";

// @ts-ignore
import sketchScreencastMp4 from "./bezier-curve-sketch.mp4";
// @ts-ignore
import sketchScreencastWebm from "./bezier-curve-sketch.webm";

import "./index.css";

export function BezierCurveExplanation() {
  return (
    <div className="bezier-explanation">
      <Helmet>
        <title>SVG Path and Bézier Curves</title>
        <meta
          name="description"
          content="What are Bézier Curves, how do they work, and how do they relate to SVG Paths"
        />
      </Helmet>
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
      <video autoPlay loop muted>
        <source src={sketchScreencastWebm} type="video/webm"></source>
        <source src={sketchScreencastMp4} type="video/mp4"></source>
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
        To get a feel of how Bézier Curves work, imagine you are building a
        segment of a railway track between 2 places <span aria-hidden>🚂</span>.
        The direction and the speed of the train at the beginning and the end
        are a constraint given by the railway controllers in order for the
        traffic to be good across the line.
      </p>

      <WhatPath style={{ width: "100%", margin: "auto", display: "block" }} />
      <p>
        Between the 2 places, the journey needs to be as smooth as possible,
        which means that the track needs to turn the least possible while
        respecting the instructions of the controllers.
      </p>
      <div className="text-with-illustration">
        <p>
          In our case that means continuing in the same direction as we arrive
          while slowly turning to the right.
        </p>
        <FullPath
          style={{
            width: "50%",
            display: "block",
            flexShrink: 0,
            flexBasis: "50%",
          }}
        />
      </div>
      <div className="text-with-illustration">
        <p>
          If there was no speed contraint at the end (and so no direction), we
          could turn until we face the end and then go straight towards it.
          Otherwise we need to take some leaway to match the direction at the
          end.
        </p>
        <StraightPath
          style={{
            width: "50%",
            display: "block",
            flexShrink: 0,
            flexBasis: "50%",
          }}
        />
      </div>

      <h2>How does it translate to SVG?</h2>
      <h3>The Curve command</h3>
      <p>
        The command associated with a Bézier Curve is <code>C</code>. The start
        point is always a given (the position at the end of the previous command
        - or (0,0) if it's the first command).
      </p>
      <CubicBezierCurveIllustration
        style={{ width: "50%", margin: "auto", display: "block" }}
      />
      <h3>The Smooth Curve command</h3>
      <p>
        There are also some special cases of Bézier Curves which have shortcut
        notation in SVG.
      </p>
      <p>
        A common case is when you have multiple curves one after the other and
        you want it to snoothly transition between them. To do so, you need to
        have the first control point of the next curve be the reflection of the
        second control point of the previous curve. So as long as you specify
        one, you shouldn't need to specify the other one. That's what the{" "}
        <code>S</code> command is for (S for smooth).
      </p>
      <SmoothCubicBezierCurveIllustration
        style={{ width: "100%", margin: "auto", display: "block" }}
      />
      <p>
        If you look back at the Sketch screencast, you will notice that we
        actually define the reflection of the second control point, implictly
        preparing for the next curve segment.
      </p>
      <h3>The Quadratic Curve command</h3>
      <p>
        Another case is when both control point are superimposed. In that case,
        you also don't need to specify them both, only one is enough. That what
        the <code>Q</code> command is for (Q for quadratic).
      </p>
      <QuadraticBezierCurveIllustration
        style={{ width: "50%", margin: "auto", display: "block" }}
      />
      <p>That's our curve stitching drawing!</p>
      <h3>The Smooth Quadratic Curve command</h3>
      <p>
        Now what if we want to continue our quadratic Bézier Curve with another
        quadratic Bézier Curve? Well we only have to specify the end point! That
        what the <code>T</code> command is for (T for Smooth Quadratic
        obviously).
      </p>
      <SmoothQuadraticBezierCurveIllustration
        style={{ width: "100%", margin: "auto", display: "block" }}
      />
    </div>
  );
}
