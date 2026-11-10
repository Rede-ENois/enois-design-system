// @vitest-environment jsdom
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { MediaGrid } from "./media-grid.js";

const image = (id: string, size?: { width: number; height: number }) => ({
  id,
  cdnUrl: `https://cdn.exemplo/${id}.webp`,
  mimeType: "image/webp",
  ...size,
});

function images(markup: string) {
  const host = document.createElement("div");
  host.innerHTML = markup;
  return [...host.querySelectorAll("img")];
}

describe("MediaGrid", () => {
  it("reserves the box of a single image whose size is known, before it loads", () => {
    const [single] = images(
      renderToStaticMarkup(<MediaGrid items={[image("a", { width: 1200, height: 900 })]} />),
    );

    expect(single.getAttribute("width")).toBe("1200");
    expect(single.getAttribute("height")).toBe("900");
    expect(single.getAttribute("style")).toContain("aspect-ratio:1200 / 900");
  });

  it("leaves an image of unknown size to its natural height", () => {
    const [single] = images(renderToStaticMarkup(<MediaGrid items={[image("a")]} />));

    expect(single.hasAttribute("width")).toBe(false);
    expect(single.getAttribute("style")).toBeNull();
  });

  it("keeps the fixed square tiles of several images", () => {
    const tiles = images(
      renderToStaticMarkup(
        <MediaGrid
          items={[
            image("a", { width: 1200, height: 900 }),
            image("b", { width: 600, height: 1200 }),
          ]}
        />,
      ),
    );

    expect(tiles).toHaveLength(2);
    for (const tile of tiles) {
      expect(tile.className).toContain("aspect-square");
      expect(tile.hasAttribute("width")).toBe(false);
    }
  });
});
