import React from "react";
import { BrowserRouter as Router, Link, useRouteMatch } from "react-router-dom";
import { SVGPathData, encodeSVGPath } from "svg-pathdata";
import { useTransition, animated, useSpring } from "react-spring";
import SVGViewer from "./SVGViewer";
import CommandExplainer from "./CommandExplainer";
import GitHubCorner from "./GitHubCorner";
import Examples from "./Examples";
import { BezierCurveExplanation } from "./BezierCurveExplanation";
import { useWindowSize } from "./hooks/useWindowSize";
import ScrollToTop from "./ScrollToTop";

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
  const [hidingCards, setHidingCards] = React.useState(false);
  const windowSize = useWindowSize();

  // on load, get the hash and set it as the svg path
  // so that users can share the url with their svg path
  React.useEffect(() => {
    if (navigator.userAgent === "ReactSnap") {
      return;
    }
    const hash = decodeURIComponent(window.location.hash.replace(/^#/, ""));
    setPathString(hash || defaultPath);
  }, []);

  // when the svg path changes, parse it and encode it in the hash
  React.useEffect(() => {
    try {
      const data = new SVGPathData(pathString);
      setPathData({ commands: data.commands, bounds: data.getBounds() });
      setError(null);
      if (!showBezierCurveExplanation) {
        window.location.hash = encodeURIComponent(pathString);
      }
    } catch (err) {
      setError(err);
    }
  }, [pathString]); // eslint-disable-line react-hooks/exhaustive-deps

  const updateString = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setPathString(event.target.value);
    },
    [setPathString]
  );

  const showCards = React.useCallback(
    (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      if (windowSize.width && windowSize.width < 850 && hidingCards) {
        event.preventDefault();
        setHidingCards(false);
      }
    },
    [windowSize, setHidingCards, hidingCards]
  );
  const hideCards = React.useCallback(
    (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      if (windowSize.width && windowSize.width < 850 && !hidingCards) {
        event.preventDefault();
        setHidingCards(true);
      }
    },
    [windowSize, setHidingCards, hidingCards]
  );

  const overlayTransitions = useTransition(showBezierCurveExplanation, null, {
    initial: { transform: "translate(0, 0)" },
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

  const cardsSpring = useSpring({
    transform: `translate(${hidingCards ? "-100%" : "0%"}, 0) translate(${
      hidingCards ? "50px" : "0px"
    }, 0)`,
  });

  return (
    <div className="App">
      <div className="viewer-wrapper">
        <div className="sticky" onClick={hideCards}>
          <GitHubCorner url="https://github.com/mathieudutour/svg-path-visualizer" />
          <SVGViewer
            pathData={pathData}
            hovering={hovering}
            setHovering={setHovering}
          />
        </div>
      </div>
      <animated.div className="cards" style={cardsSpring}>
        <div className="card" onClick={showCards}>
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
                    <div className="card" onClick={showCards}>
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
                  <div className="card" onClick={showCards}>
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
      </animated.div>
    </div>
  );
}

const AppWithRouter = () => (
  <Router>
    <ScrollToTop />
    <App />
  </Router>
);

export default AppWithRouter;
