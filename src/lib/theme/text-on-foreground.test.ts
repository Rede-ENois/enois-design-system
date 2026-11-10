import { describe, expect, it } from "vitest";

import { contrastRatio, hexToRgb } from "./color.js";
import { THEME_COLLECTIONS } from "./theme-collections.js";

/** `#rrggbb` or `color-mix(in srgb, #rrggbb N%, transparent)` composed over `ground`. */
function effective(value: string, ground: { r: number; g: number; b: number }) {
  const hex = /#[0-9a-fA-F]{6}/.exec(value)?.[0];
  if (!hex) throw new Error(`not a hex colour: ${value}`);
  const percent = /(\d+(?:\.\d+)?)%/.exec(value);
  const alpha = percent ? Number(percent[1]) / 100 : 1;
  const color = hexToRgb(hex);
  return {
    r: color.r * alpha + ground.r * (1 - alpha),
    g: color.g * alpha + ground.g * (1 - alpha),
    b: color.b * alpha + ground.b * (1 - alpha),
  };
}

/**
 * Text drawn on `bg-foreground` (the selected shop chip, the remove-attachment badge) uses
 * `--on-foreground`: unlike `--background` (maybe a gradient) or `--card` (maybe translucent), it is
 * always a solid colour, and it has to read against the foreground fill.
 */
describe("text on a foreground fill", () => {
  const cases = THEME_COLLECTIONS.flatMap((collection) =>
    (["light", "dark"] as const)
      .filter((mode) => collection.tokens[mode])
      .map((mode) => ({
        id: collection.id,
        mode,
        tokens: collection.tokens[mode] as Record<string, string>,
      })),
  );

  it.each(cases)("$id ($mode) reads at 4.5:1", ({ tokens }) => {
    const fill = hexToRgb(/#[0-9a-fA-F]{6}/.exec(tokens["--foreground"])![0]);
    const text = effective(tokens["--on-foreground"] ?? tokens["--card"], fill);

    expect(contrastRatio(text, fill)).toBeGreaterThanOrEqual(4.5);
  });
});
