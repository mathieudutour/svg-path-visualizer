import React from "react";
import { Globals } from "@react-spring/web";
import { StaticRouter } from "react-router";
import type {
  PrerenderArguments,
  PrerenderResult,
} from "vite-prerender-plugin";
import { App } from "./App";
import {
  curveMetadata,
  homeMetadata,
  metadataElements,
} from "./metadata";

Globals.assign({ frameLoop: "demand", skipAnimation: true });

export async function prerender({
  url,
}: PrerenderArguments): Promise<PrerenderResult> {
  const metadata = url === "/bezier-curve" ? curveMetadata : homeMetadata;
  const { renderToString } = await import("react-dom/server");
  const html = renderToString(
    <StaticRouter location={url}>
      <App />
    </StaticRouter>
  );

  // The plugin bundles React's browser server renderer, whose scheduler keeps
  // a MessagePort referenced in Node after rendering. It is safe to unref once
  // the synchronous render is complete so the Vite build can exit normally.
  const processWithHandles = process as NodeJS.Process & {
    _getActiveHandles: () => Array<{
      constructor?: { name?: string };
      unref?: () => void;
    }>;
  };
  for (const handle of processWithHandles._getActiveHandles()) {
    if (handle.constructor?.name === "MessagePort") {
      handle.unref?.();
    }
  }

  return {
    head: {
      title: metadata.title,
      elements: new Set(metadataElements(metadata)),
    },
    html,
  };
}
