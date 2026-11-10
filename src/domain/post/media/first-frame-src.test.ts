import { describe, expect, it } from "vitest";

import { firstFrameSrc } from "./first-frame-src.js";

describe("firstFrameSrc", () => {
  it("pede o primeiro quadro pelo fragmento de mídia", () => {
    expect(firstFrameSrc("https://cdn.exemplo/video.mp4")).toBe(
      "https://cdn.exemplo/video.mp4#t=0.001",
    );
  });

  it("não duplica fragmento nem quebra playlist", () => {
    expect(firstFrameSrc("https://cdn.exemplo/video.mp4#t=12")).toBe(
      "https://cdn.exemplo/video.mp4#t=12",
    );
    expect(firstFrameSrc("https://cdn.exemplo/live.m3u8")).toBe("https://cdn.exemplo/live.m3u8");
  });
});
