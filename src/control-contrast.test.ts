// @vitest-environment node
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

import { contrastRatio, hexToRgb, oklchToRgb } from "./lib/theme/color.js";
import type { RgbColor } from "./types/lib/theme/rgb-color.js";

const css = readFileSync(new URL("./styles.css", import.meta.url), "utf8");

function token(name: string): [string, string] {
  const pattern = new RegExp(`--${name}:\\s*(#[0-9a-f]{6}|oklch\\([^)]*\\))`, "gi");
  const values = [...css.matchAll(pattern)].map((match) => match[1]);
  expect(values.length, name).toBeGreaterThanOrEqual(2);
  return [values[0], values[1]];
}

function color(value: string): RgbColor {
  if (value.startsWith("#")) return hexToRgb(value);
  const [lightness, chroma, hue] = value.slice("oklch(".length, -1).trim().split(/\s+/).map(Number);
  return oklchToRgb(lightness, chroma, hue);
}

function over(foreground: RgbColor, background: RgbColor, alpha: number): RgbColor {
  return {
    r: foreground.r * alpha + background.r * (1 - alpha),
    g: foreground.g * alpha + background.g * (1 - alpha),
    b: foreground.b * alpha + background.b * (1 - alpha),
  };
}

const MODES = [
  ["light", 0],
  ["dark", 1],
] as const;

/**
 * Alvo de toque sem texto visível: o ícone é o rótulo, então a WCAG pede 3:1
 * (1.4.11), não os 4,5:1 de texto. O `text-destructive/70` da lixeira do
 * comentário e do chevron do banner de erro é exatamente esse caso, e o teste
 * fixa o critério para que ninguém o submeta ao de texto — nem afrouxe o valor
 * até ele cair abaixo de 3.
 */
describe("icon-only controls (WCAG 1.4.11, 3:1)", () => {
  const destructive = token("destructive");
  const textSubtle = token("text-subtle");
  const surfaces = {
    card: token("surface-card"),
    "surface-1": token("surface-1"),
    "surface-2": token("surface-2"),
    "surface-3": token("surface-3"),
    background: token("background"),
  } as const;

  for (const [mode, index] of MODES) {
    it(`${mode}: destructive icon at 70% stays visible on every surface`, () => {
      for (const [name, pair] of Object.entries(surfaces)) {
        // O ícone é composto sobre a superfície em que o botão está.
        const ground = color(pair[index]);
        const painted = over(color(destructive[index]), ground, 0.7);
        expect(contrastRatio(painted, ground), name).toBeGreaterThanOrEqual(3);
      }
    });

    // O tinte de hover é o pior fundo: o ícone fica sobre `destructive/10`.
    it(`${mode}: destructive icon at 70% stays visible on its own hover tint`, () => {
      for (const [name, pair] of Object.entries(surfaces)) {
        const ground = color(pair[index]);
        const tint = over(color(destructive[index]), ground, 0.1);
        expect(
          contrastRatio(over(color(destructive[index]), tint, 0.7), tint),
          name,
        ).toBeGreaterThanOrEqual(3);
      }
    });

    it(`${mode}: text-subtle chevrons of the agenda read on every surface`, () => {
      for (const [name, pair] of Object.entries(surfaces)) {
        expect(
          contrastRatio(color(textSubtle[index]), color(pair[index])),
          name,
        ).toBeGreaterThanOrEqual(3);
      }
    });
  }
});
