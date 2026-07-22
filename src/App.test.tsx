import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders the SVG path visualizer", () => {
  render(<App />);

  expect(
    screen.getByRole("heading", { name: /svg path visualizer/i })
  ).toBeInTheDocument();
});
