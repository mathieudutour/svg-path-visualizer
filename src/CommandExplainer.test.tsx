import React from "react";
import { render } from "@testing-library/react";
import { SVGPathData } from "svg-pathdata";
import CommandExplainer from "./CommandExplainer";

function renderExplanation(path: string) {
  const pathData = new SVGPathData(path);

  return render(
    <CommandExplainer
      pathData={{
        commands: pathData.commands,
        bounds: pathData.getBounds(),
      }}
      hovering={null}
      setHovering={() => {}}
    />
  );
}

test("describes an initial relative moveto as absolute coordinates", () => {
  const { getAllByRole } = renderExplanation("m 5,5 l 10,10");
  const commands = getAllByRole("listitem");

  expect(commands[0]).toHaveTextContent(
    "Pick up the pen and Move it to { x: 5, y: 5 }"
  );
  expect(commands[1]).toHaveTextContent(
    "Move right 10 and down 10 from the current position"
  );
});

test("keeps later relative movetos relative", () => {
  const { getAllByRole } = renderExplanation("M 5,5 m -2,-3");
  const commands = getAllByRole("listitem");

  expect(commands[1]).toHaveTextContent(
    "Put down the pen and Move it left 2 and up 3 from the current position"
  );
});
