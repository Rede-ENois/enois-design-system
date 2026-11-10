// @vitest-environment node
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const css = readFileSync(new URL("./styles.css", import.meta.url), "utf8");

/** The value of a token in the light (first) and dark (second) declaration. */
function token(name: string): [string, string] {
  const values = [...css.matchAll(new RegExp(`--${name}:\\s*(#[0-9a-f]{6})`, "gi"))].map(
    (match) => match[1],
  );
  expect(values.length, name).toBeGreaterThanOrEqual(2);
  return [values[0], values[1]];
}

function luminance(hex: string) {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = Number.parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: string, b: string) {
  const [high, low] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (high + 0.05) / (low + 0.05);
}

describe("today signal contrast (WCAG AA, 4.5:1)", () => {
  const today = token("signal-today");
  const foreground = token("signal-today-foreground");
  const soft = token("signal-today-soft");
  const ground = token("background");

  for (const [mode, i] of [
    ["light", 0],
    ["dark", 1],
  ] as const) {
    it(`${mode}: ticket text on the amber, amber text on its soft tag and on the page`, () => {
      expect(contrast(foreground[i], today[i])).toBeGreaterThanOrEqual(4.5);
      expect(contrast(today[i], soft[i])).toBeGreaterThanOrEqual(4.5);
      expect(contrast(today[i], ground[i])).toBeGreaterThanOrEqual(4.5);
    });
  }
});
