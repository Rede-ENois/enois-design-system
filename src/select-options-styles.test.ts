// @vitest-environment node
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const css = readFileSync(new URL("./styles.css", import.meta.url), "utf8");

describe("native select options", () => {
  it("take their colors from the popover tokens so the open list follows the theme", () => {
    const rule = css.match(/select option\s*\{([^}]*)\}/)?.[1] ?? "";
    expect(rule).toContain("background-color: var(--popover)");
    expect(rule).toContain("color: var(--popover-foreground)");
  });
});
