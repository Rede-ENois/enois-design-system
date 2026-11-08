import { describe, expect, it } from "vitest";

import { contrastRatio, hexToRgb, oklchToRgb } from "../../lib/theme/color.js";

import { CARD_THEMES } from "./card-themes.js";

const AA_TEXT = 4.5;

function rgb(color: string): number[] {
  const mix = /color-mix\(in srgb, (#[0-9a-f]{6}) (\d+)%, #fff\)/.exec(color);
  if (mix) return rgb(mix[1]).map((c) => (c * Number(mix[2]) + 255 * (100 - Number(mix[2]))) / 100);
  return [1, 3, 5].map((i) => parseInt(color.slice(i, i + 2), 16));
}

function luminance(color: string): number {
  const [r, g, b] = rgb(color).map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

describe("card themes", () => {
  it.each(Object.entries(CARD_THEMES))(
    "%s: text and app primary text read on both stops",
    (_, theme) => {
      for (const stop of [theme.top, theme.bottom]) {
        expect(contrast(theme.fg, stop)).toBeGreaterThanOrEqual(AA_TEXT);
        expect(contrast(theme.tokens["--primary-text"], stop)).toBeGreaterThanOrEqual(AA_TEXT);
      }
    },
  );

  it.each(Object.entries(CARD_THEMES))("%s: button label reads on the card accent", (_, theme) => {
    const ink = theme.tokens["--primary-foreground"];
    // `light()` leaves the token to the page palette on purpose; there is no card accent to fight.
    if (!ink) return;
    const parsed = /^oklch\(([\d.]+) ([\d.]+) ([\d.]+)\)$/.exec(ink);
    const inkRgb = parsed
      ? oklchToRgb(Number(parsed[1]), Number(parsed[2]), Number(parsed[3]))
      : hexToRgb(ink);
    expect(contrastRatio(inkRgb, hexToRgb(theme.accent))).toBeGreaterThanOrEqual(AA_TEXT);
  });
});
