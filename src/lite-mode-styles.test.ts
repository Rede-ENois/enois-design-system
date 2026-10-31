// @vitest-environment node
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const css = readFileSync(new URL("./styles.css", import.meta.url), "utf8");

describe("lite mode styles", () => {
  it("drops the background blur, the costliest paint on weak or unaccelerated GPUs", () => {
    const start = css.indexOf("html[data-lite] *,");
    const rule = css.slice(start, css.indexOf("}", start));
    expect(rule).toContain("backdrop-filter: none !important");
    expect(rule).toContain("animation-duration: 0.01ms !important");
  });
});
