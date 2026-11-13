// @vitest-environment node
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

import { contrastRatio, hexToRgb, oklchToRgb } from "./lib/theme/color.js";
import type { RgbColor } from "./types/lib/theme/rgb-color.js";

const css = readFileSync(new URL("./styles.css", import.meta.url), "utf8");

/**
 * Valor de um token nos dois temas. O primeiro bloco de cada token é o claro, o
 * segundo o escuro — os tokens de marca chegam em hex e os semânticos em oklch.
 */
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

/** Compõe uma cor com alfa sobre um fundo opaco, como o navegador pinta o tinte. */
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

describe("calendar contrast (WCAG AA)", () => {
  const destructive = token("destructive");
  const destructiveForeground = token("destructive-foreground");
  const textDate = token("text-date");
  const borderStrong = token("border-strong");
  const surfaces = {
    card: token("surface-card"),
    "surface-1": token("surface-1"),
    "surface-2": token("surface-2"),
    "surface-3": token("surface-3"),
    background: token("background"),
  } as const;

  for (const [mode, index] of MODES) {
    // O par do erro é `text-destructive` sobre `bg-destructive/10` — o tinte do
    // próprio vermelho, que é como as telas de agenda pintam o erro.
    it(`${mode}: destructive text reads on every surface and on its own tint`, () => {
      const text = color(destructive[index]);
      for (const [name, pair] of Object.entries(surfaces)) {
        const ground = color(pair[index]);
        expect(contrastRatio(text, ground), `${name} plain`).toBeGreaterThanOrEqual(4.5);
        expect(
          contrastRatio(text, over(text, ground, 0.1)),
          `${name} over tint`,
        ).toBeGreaterThanOrEqual(4.5);
      }
    });

    // O preenchimento sólido (toast de erro, botão destrutivo) pinta o foreground
    // por cima — não pode ser o mesmo vermelho claro do texto.
    it(`${mode}: destructive-foreground reads on the solid destructive fill`, () => {
      expect(
        contrastRatio(color(destructiveForeground[index]), color(destructive[index])),
      ).toBeGreaterThanOrEqual(4.5);
    });

    // `--text-date` é o texto de data mais fraco da paleta; ele aparece sobre
    // todas as superfícies de cartão e sobre o dock (surface-2).
    it(`${mode}: text-date reads on every surface`, () => {
      const text = color(textDate[index]);
      for (const [name, pair] of Object.entries(surfaces)) {
        expect(contrastRatio(text, color(pair[index])), name).toBeGreaterThanOrEqual(4.5);
      }
    });

    // Controle não-textual (WCAG 1.4.11): a borda de estado ativo precisa de 3:1.
    it(`${mode}: border-strong is visible on the card and on surface-2`, () => {
      const border = color(borderStrong[index]);
      expect(contrastRatio(border, color(surfaces.card[index]))).toBeGreaterThanOrEqual(3);
      expect(contrastRatio(border, color(surfaces["surface-2"][index]))).toBeGreaterThanOrEqual(3);
    });
  }
});
