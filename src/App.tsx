import React from "react";
import { SVGPathData, encodeSVGPath } from "svg-pathdata";
import { useTransition, animated } from "react-spring";
import SVGViewer from "./SVGViewer";
import CommandExplainer from "./CommandExplainer";
import GitHubCorner from "./GitHubCorner";
import Examples from "./Examples";
import { BezierCurveExplanation } from "./BezierCurveExplanation";

import "./App.css";

const defaultPath = `M140 20C73 20 20 74 20 140c0 135 136 170 228 303 88-132 229-173 229-303 0-66-54-120-120-120-48 0-90 28-109 69-19-41-60-69-108-69z`;

function App() {
  const [pathString, setPathString] = React.useState("");
  const [pathData, setPathData] = React.useState({
    commands: new SVGPathData("").commands,
    bounds: new SVGPathData("").getBounds(),
  });
  const [
    showingBezierCurveExplanation,
    setShowingBezierCurveExplanation,
  ] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);
  const [hovering, setHovering] = React.useState<string | null>(null);

  React.useEffect(() => {
    const hash = decodeURIComponent(window.location.hash.replace(/^#/, ""));

    if (hash === "bezier-curve") {
      setShowingBezierCurveExplanation(true);
      setPathString(defaultPath);
    } else {
      setPathString(hash || defaultPath);
    }
  }, []);

  React.useEffect(() => {
    try {
      const data = new SVGPathData(pathString);
      const shouldUpdateHash =
        !showingBezierCurveExplanation &&
        (data.commands.length || pathData.commands.length);
      setPathData({ commands: data.commands, bounds: data.getBounds() });
      setError(null);
      if (shouldUpdateHash) {
        window.location.hash = encodeURIComponent(pathString);
      }
    } catch (err) {
      setError(err);
    }
  }, [pathString, showingBezierCurveExplanation]);

  const updateString = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setPathString(event.target.value);
    },
    [setPathString]
  );

  React.useEffect(() => {
    if (showingBezierCurveExplanation) {
      window.scrollTo({
        behavior: "smooth",
        top: 0,
      });
      window.location.hash = "bezier-curve";
    } else {
      window.location.hash = encodeURIComponent(pathString);
    }
  }, [showingBezierCurveExplanation]);

  const overlayTransitions = useTransition(
    showingBezierCurveExplanation,
    null,
    {
      from: { transform: "translate(-100%, 0)" },
      enter: { transform: "translate(0, 0)" },
      leave: { transform: "translate(-100%, 0)" },
    }
  );

  const explanationTransitions = useTransition(
    pathData,
    (p) => encodeSVGPath(p.commands),
    {
      from: { transform: "translate(-100%, 0)" },
      enter: { transform: "translate(0, 0)" },
      leave: { transform: "translate(-100%, 0)", position: "absolute" },
    }
  );

  const showBezierCurveExplanation = React.useCallback(
    (ev: any) => {
      setShowingBezierCurveExplanation(true);
      ev.preventDefault();
    },
    [setShowingBezierCurveExplanation]
  );

  const hideBezierCurveExplanation = React.useCallback(
    (ev: any) => {
      if (!ev.defaultPrevented) {
        setShowingBezierCurveExplanation(false);
      }
    },
    [setShowingBezierCurveExplanation]
  );

  return (
    <div className="App">
      <div className="viewer-wrapper">
        <div className="sticky">
          <GitHubCorner url="https://github.com/mathieudutour/svg-path-visualizer" />
          <SVGViewer
            pathData={pathData}
            hovering={hovering}
            setHovering={setHovering}
          />
        </div>
      </div>
      <div className="cards" onClick={hideBezierCurveExplanation}>
        <div className="card">
          <h1>
            SVG Path Visualizer{" "}
            <span role="img" aria-hidden>
              📐
            </span>
          </h1>
          <p>
            Enter an SVG path data (the string inside the <code>d</code>{" "}
            attribute) to visualize it and discover all its different commands
          </p>
          <input
            value={pathString}
            onChange={updateString}
            placeholder="Enter a SVG path..."
          />
          {error ? <div className="error-message">{error.message}</div> : null}
          <p>Or explore some examples</p>
          <Examples setPathString={setPathString} pathString={pathString} />
        </div>
        {pathData.commands.length
          ? explanationTransitions.map(
              ({ item, key, props }) =>
                item && (
                  <animated.div
                    className="animation-wrapper"
                    key={key}
                    style={props}
                  >
                    <div className="card">
                      <h2>Explanations</h2>
                      <CommandExplainer
                        showBezierCurveExplanation={showBezierCurveExplanation}
                        pathData={pathData}
                        hovering={hovering}
                        setHovering={setHovering}
                      />
                    </div>
                  </animated.div>
                )
            )
          : null}
        <div className="explanations">
          {overlayTransitions.map(
            ({ item, key, props }) =>
              item && (
                <animated.div
                  className="animation-wrapper"
                  key={key}
                  style={props}
                >
                  <div className="card" onClick={(e) => e.preventDefault()}>
                    <button
                      className="cancel-button"
                      onClick={hideBezierCurveExplanation}
                    >
                      Cancel
                    </button>
                    <BezierCurveExplanation />
                    <button
                      className="done-button"
                      onClick={hideBezierCurveExplanation}
                    >
                      Got it
                    </button>
                  </div>
                </animated.div>
              )
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
