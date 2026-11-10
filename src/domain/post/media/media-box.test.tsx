// @vitest-environment jsdom
import { act } from "react";

import { type Root, createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { LiteVideo } from "./lite-video.js";
import { clearMediaBoxes } from "./media-box.js";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const SRC = "https://cdn.example/clip.mp4";

/**
 * A virtualized feed unmounts a card that leaves the range and mounts it again. A video that came
 * back without a box mounted short and grew when it loaded, and the list corrected the scroll each
 * time: the feed flicker. The second mount must already hold the box of the first load.
 */
describe("media box", () => {
  let root: Root;
  let container: HTMLDivElement;

  beforeEach(() => {
    clearMediaBoxes();
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => root.unmount());
    document.body.replaceChildren();
  });

  it("a video mounted again keeps the proportion of its first load", () => {
    act(() => root.render(<LiteVideo src={SRC} />));
    const first = container.querySelector("video")!;
    expect(first.style.aspectRatio).toBe("");

    Object.defineProperty(first, "videoWidth", { value: 720 });
    Object.defineProperty(first, "videoHeight", { value: 1280 });
    act(() => first.dispatchEvent(new Event("loadedmetadata")));

    act(() => root.render(<div />));
    act(() => root.render(<LiteVideo src={SRC} />));
    expect(container.querySelector("video")!.style.aspectRatio).toBe(String(720 / 1280));
  });

  it("uses the server's size from the first mount", () => {
    act(() => root.render(<LiteVideo src={SRC} width={1920} height={1080} />));
    expect(container.querySelector("video")!.style.aspectRatio).toBe("1920 / 1080");
  });
});
