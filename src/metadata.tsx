import { useEffect } from "react";

export type PageMetadata = {
  description: string;
  ogSiteName: string;
  ogTitle: string;
  ogUrl: string;
  title: string;
  twitterImageAlt: string;
};

const homeDescription =
  "Enter an SVG path data (the string inside the `d` attribute) to visualize it and discover all its different commands.";
const curveDescription =
  "What are Bézier Curves, how do they work, and how do they relate to SVG Paths";

export const homeMetadata: PageMetadata = {
  description: homeDescription,
  ogSiteName: "SVG Path Visualizer",
  ogTitle: "SVG Path Visualizer",
  ogUrl: "/",
  title: "SVG Path Visualizer",
  twitterImageAlt: homeDescription,
};

export const curveMetadata: PageMetadata = {
  description: curveDescription,
  ogSiteName: "SVG Path and Bézier Curves",
  ogTitle: "SVG Path and Bézier Curves",
  ogUrl: "/bezier-curve",
  title: "SVG Path and Bézier Curves",
  twitterImageAlt: curveDescription,
};

export function metadataElements(
  metadata: PageMetadata
): Array<{ type: string; props: Record<string, string> }> {
  return [
    { type: "meta", props: { name: "description", content: metadata.description } },
    { type: "meta", props: { property: "og:title", content: metadata.ogTitle } },
    {
      type: "meta",
      props: { property: "og:description", content: metadata.description },
    },
    { type: "meta", props: { property: "og:url", content: metadata.ogUrl } },
    {
      type: "meta",
      props: { property: "og:site_name", content: metadata.ogSiteName },
    },
    {
      type: "meta",
      props: { name: "twitter:image:alt", content: metadata.twitterImageAlt },
    },
  ];
}

export function Metadata({ metadata }: { metadata: PageMetadata }) {
  useEffect(() => {
    document.title = metadata.title;

    for (const { props } of metadataElements(metadata)) {
      const identity = props.name
        ? (`meta[name="${props.name}"]` as const)
        : (`meta[property="${props.property}"]` as const);
      let element = document.head.querySelector<HTMLMetaElement>(identity);

      if (!element) {
        element = document.createElement("meta");
        if (props.name) {
          element.name = props.name;
        } else if (props.property) {
          element.setAttribute("property", props.property);
        }
        document.head.append(element);
      }

      element.content = props.content;
    }
  }, [metadata]);

  return null;
}
