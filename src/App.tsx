import React from "react";
import { BrowserRouter as Router, Link, useRouteMatch } from "react-router-dom";
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
  const [error, setError] = React.useState<Error | null>(null);
  const [hovering, setHovering] = React.useState<string | null>(null);
  const showBezierCurveExplanation = useRouteMatch("/bezier-curve");

  React.useEffect(() => {
    const hash = decodeURIComponent(window.location.hash.replace(/^#/, ""));

    setPathString(hash || defaultPath);
  }, []);

  React.useEffect(() => {
    try {
      const data = new SVGPathData(pathString);
      setPathData({ commands: data.commands, bounds: data.getBounds() });
      setError(null);
      window.location.hash = encodeURIComponent(pathString);
    } catch (err) {
      setError(err);
    }
  }, [pathString]);

  const updateString = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setPathString(event.target.value);
    },
    [setPathString]
  );

  const overlayTransitions = useTransition(showBezierCurveExplanation, null, {
    from: { transform: "translate(-100%, 0)" },
    enter: { transform: "translate(0, 0)" },
    leave: { transform: "translate(-100%, 0)" },
  });

  const explanationTransitions = useTransition(
    pathData,
    (p) => encodeSVGPath(p.commands),
    {
      from: { transform: "translate(-100%, 0)" },
      enter: { transform: "translate(0, 0)" },
      leave: { transform: "translate(-100%, 0)", position: "absolute" },
    }
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
      <div className="cards">
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
                    <Link className="cancel-button" to="/">
                      Cancel
                    </Link>
                    <BezierCurveExplanation />
                    <Link className="done-button" to="/">
                      Got it
                    </Link>
                  </div>
                </animated.div>
              )
          )}
        </div>
      </div>
    </div>
  );
}

export default () => (
  <Router>
    <App />
  </Router>
);
