import { describe, expect, it } from "vitest";

import { palette } from "./theme-collections.js";

const spec = (radius?: string) =>
  palette({
    background: "#101418",
    surface: "#1a2028",
    muted: "#222a33",
    border: "#2a323c",
    primary: "#3b82f6",
    onPrimary: "#ffffff",
    text: { strong: "#ffffff", subtle: "#9ca3af", date: "#9ca3af" },
    ...(radius ? { radius } : {}),
  }) as Record<string, string>;

describe("palette radius tokens", () => {
  it("derives the radii in pixels from a rem base, so cards stay rounded rectangles", () => {
    const tokens = spec();

    expect(tokens["--radius"]).toBe("0.875rem");
    expect(tokens["--radius-sm"]).toBe("10px");
    expect(tokens["--radius-xl"]).toBe("18px");
    expect(tokens["--radius-2xl"]).toBe("22px");
    expect(tokens["--radius-3xl"]).toBe("26px");
  });

  it("keeps a square theme square", () => {
    const tokens = spec("0px");

    expect(tokens["--radius-sm"]).toBe("0px");
    expect(tokens["--radius-3xl"]).toBe("0px");
  });
});
