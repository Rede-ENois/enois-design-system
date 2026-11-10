// @vitest-environment node
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const css = readFileSync(new URL("./styles.css", import.meta.url), "utf8");

const batataStart = css.indexOf("html[data-batata] {");
const resetStart = css.indexOf("html[data-batata] *,");
const resetRule = css.slice(resetStart, css.indexOf("}", resetStart));

describe("batata mode styles", () => {
  it("has its own layer instead of reusing the lite rules", () => {
    expect(batataStart).toBeGreaterThan(-1);
    expect(resetStart).toBeGreaterThan(batataStart);
  });

  it("removes the paint and compositing costs the browser repeats every frame", () => {
    expect(resetRule).toContain("box-shadow: none !important");
    expect(resetRule).toContain("text-shadow: none !important");
    expect(resetRule).toContain("backdrop-filter: none !important");
    expect(resetRule).toContain("filter: none !important");
    expect(resetRule).toContain("will-change: auto !important");
    expect(resetRule).toContain("border-radius: 0 !important");
    expect(resetRule).toContain("animation-duration: 0.01ms !important");
    expect(resetRule).toContain("transition-duration: 0.01ms !important");
  });

  // `ring-*` is a box-shadow: dropping every shadow would drop the keyboard focus
  // indicator with it. This rule is the accessibility guard for that trade-off.
  it("replaces the shadow-based focus ring with a real outline", () => {
    const start = css.indexOf("html[data-batata] :focus-visible");
    expect(start).toBeGreaterThan(-1);
    const rule = css.slice(start, css.indexOf("}", start));
    expect(rule).toContain("outline: 2px solid var(--ring) !important");
  });

  // The accent word prints with `background-clip: text` and a transparent color:
  // without the gradient it would render as nothing.
  it("keeps the gradient-text word readable when the gradient is gone", () => {
    const start = css.indexOf("html[data-batata] .gradient-text");
    expect(start).toBeGreaterThan(-1);
    const rule = css.slice(start, css.indexOf("}", start));
    expect(rule).toContain("color: var(--primary) !important");
    expect(rule).toContain("-webkit-text-fill-color: currentColor !important");
  });

  it("switches the typography to the system stack and flattens the theme tokens", () => {
    const tokens = css.slice(batataStart, css.indexOf("}", batataStart));
    expect(tokens).toContain("--font-sans: system-ui");
    expect(tokens).toContain("--font-display: var(--font-sans)");
    expect(tokens).toContain("--radius: 0px");
    expect(tokens).toContain("--shadow-card: none");
    expect(tokens).toContain("--gradient-primary: none");
  });
});

// The profile theme tokens live on the profile container, not on `<html>`: without
// repeating the flattening there, a profile dressed in a dark preset would keep its own
// radius and the brand font inside BATATA.
describe("batata mode inside a themed profile", () => {
  it("flattens the radius and the typography of the profile container too", () => {
    const start = css.indexOf("html[data-batata] .profile-scope {");
    expect(start).toBeGreaterThan(-1);
    const rule = css.slice(start, css.indexOf("}", start));
    expect(rule).toContain("--radius: 0px");
    expect(rule).toContain("--radius-3xl: 0px");
    expect(rule).toContain("--font-sans: system-ui");
  });
});
