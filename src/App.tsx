import React from "react";
import { SVGPathData } from "svg-pathdata";
import SVGViewer from "./SVGViewer";
import CommandExplainer from "./CommandExplainer";
import GitHubCorner from "./GitHubCorner";

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

  React.useEffect(() => {
    setPathString(
      decodeURIComponent(window.location.hash.replace(/^#/, "")) || defaultPath
    );
  }, []);

  React.useEffect(() => {
    try {
      const data = new SVGPathData(pathString);
      setPathData({ commands: data.commands, bounds: data.getBounds() });
      window.location.hash = encodeURIComponent(pathString);
      setError(null);
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

  return (
    <div className="App">
      <div className="left">
        <div className="card">
          <h1>SVG Path Visualizer 📐</h1>
          <p>
            Enter an SVG path data (the string inside the <code>d</code>{" "}
            attribute) to visualize it and discover all its different commands
          </p>
          <input
            value={pathString}
            onChange={updateString}
            placeholder="Enter a SVG path..."
          />
          {error ? <div>{error.message}</div> : null}
        </div>
        <div className="card">
          <h2>Explanations</h2>
          <CommandExplainer
            pathData={pathData}
            hovering={hovering}
            setHovering={setHovering}
          />
        </div>
      </div>
      <div className="right">
        <GitHubCorner url="https://github.com/mathieudutour/svg-path-visualizer" />
        <SVGViewer
          pathData={pathData}
          hovering={hovering}
          setHovering={setHovering}
        />
      </div>
    </div>
  );
}

export default App;
