// @vitest-environment node
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const css = readFileSync(new URL("../../styles.css", import.meta.url), "utf8");

function rule(selector: string): string {
  const start = css.indexOf(`${selector} {`);
  return start < 0 ? "" : css.slice(start, css.indexOf("}", start));
}

describe("cosmetics styles", () => {
  it("keeps the absolute banner art inside its album slot", () => {
    expect(rule(".cos-art-banner")).toContain("position: absolute");
    expect(rule(".cos-album__slots li")).toContain("position: relative");
  });

  it("repaints the page tokens on a themed card so app slots stay readable", () => {
    const themed = rule(".cos-card--themed");
    for (const token of ["--text-strong", "--text-subtle", "--surface-1", "--border-soft"]) {
      expect(themed).toContain(`${token}:`);
    }
    // The primary depends on the theme tone, so it comes inline from cardThemeStyle.
    expect(themed).not.toContain("--primary:");
  });

  it("keeps each look card at its own height when another one opens its pieces", () => {
    expect(rule(".cos-shop__look-grid")).toContain("align-items: start");
  });
});
