import { describe, expect, it } from "vitest";

import type { ThemeCollectionTokens } from "../../types/lib/theme/theme-collection-tokens.js";

import { contrastRatio, hexToRgb } from "./color.js";
import { THEME_COLLECTIONS_GENERATIONS } from "./theme-collections-generations.js";
import { THEME_COLLECTIONS, THEME_COLLECTION_IDS } from "./theme-collections.js";
import { THEME_TOKEN_NAMES } from "./theme-tokens.js";

/**
 * A nova geração: 25 temas em quatro famílias, com identidade estrutural própria.
 *
 * Estes testes são o contrato da galeria — identificador estável (o backend valida
 * e a conta guarda), cobertura de tokens, contraste de leitura e nenhuma animação.
 */

/** Primeira cor sólida do valor (fundo e cartão podem ser degradê ou textura). */
function solidColor(value: string): string {
  const hex = value.match(/#[0-9a-fA-F]{6}\b/);
  if (hex) return hex[0];
  const rgb = value.match(/rgba?\(\s*[\d.]+[,\s]+[\d.]+[,\s]+[\d.]+/);
  if (rgb) {
    const [r, g, b] = rgb[0].match(/[\d.]+/g) ?? ["255", "255", "255"];
    const channel = (v: string) => Math.round(Number(v)).toString(16).padStart(2, "0");
    return `#${channel(r)}${channel(g)}${channel(b)}`;
  }
  return "#ffffff";
}

/**
 * Texto sutil EFETIVO: um tema pode re-declarar a variável dentro do cartão (é o caso
 * do Workbench, cujo desktop é escuro e a janela é clara). O token sozinho mediria a
 * cor do texto do desktop, não a que a pessoa lê no cartão.
 */
function strongOnCard(theme: { css?: string; tokens: ThemeCollectionTokens }): string {
  const override = theme.css?.match(/--text-strong:\s*(#[0-9a-fA-F]{6})/);
  return override ? override[1] : (theme.tokens["--text-strong"] as string);
}

function subtleOnCard(theme: { css?: string; tokens: ThemeCollectionTokens }): string {
  const override = theme.css?.match(/--text-subtle:\s*(#[0-9a-fA-F]{6})/);
  return override ? override[1] : (theme.tokens["--text-subtle"] as string);
}

function ratio(foreground: string, background: string): number {
  return contrastRatio(hexToRgb(solidColor(foreground)), hexToRgb(solidColor(background)));
}

function modesOf(tokens: { light: ThemeCollectionTokens; dark?: ThemeCollectionTokens }) {
  return [tokens.light, tokens.dark ?? tokens.light];
}

describe("nova geração de temas", () => {
  it("distribui as quatro coleções novas nas famílias existentes, sem identificador repetido", () => {
    const byCategory = (category: string) =>
      THEME_COLLECTIONS_GENERATIONS.filter((theme) => theme.category === category).map((t) => t.id);

    // Desktop clássico, web da virada do milênio, jogos e computação de terminal entraram
    // nas famílias que já existiam com esse sentido — a galeria não ganha categoria repetida.
    expect(byCategory("retro")).toHaveLength(6);
    expect(byCategory("web2000")).toHaveLength(6);
    expect(byCategory("jogos")).toHaveLength(8);
    expect(byCategory("maquinas")).toHaveLength(5);

    const families = new Set(THEME_COLLECTIONS.map((theme) => theme.category));
    expect(families.size).toBeLessThanOrEqual(6);

    const ids = THEME_COLLECTIONS_GENERATIONS.map((theme) => theme.id);
    expect(new Set(ids).size).toBe(ids.length);
    // Cada tema novo também está no registro que a galeria lê e o backend valida.
    for (const id of ids) expect(THEME_COLLECTION_IDS).toContain(id);
  });

  it("não colide com nenhum tema anterior", () => {
    const ids = THEME_COLLECTIONS.map((theme) => theme.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("cobre todos os tokens da marca nos dois modos", () => {
    for (const theme of THEME_COLLECTIONS_GENERATIONS) {
      for (const tokens of modesOf(theme.tokens)) {
        for (const name of THEME_TOKEN_NAMES) {
          expect(tokens[name], `${theme.id} sem ${name}`).toBeTruthy();
        }
      }
    }
  });

  it("mantém a leitura: texto forte ≥ 4.5:1 no fundo e no cartão", () => {
    for (const theme of THEME_COLLECTIONS_GENERATIONS) {
      for (const tokens of modesOf(theme.tokens)) {
        expect(
          ratio(tokens["--text-strong"] as string, tokens["--background"] as string),
          `${theme.id}: texto × fundo`,
        ).toBeGreaterThanOrEqual(4.5);
        expect(
          ratio(strongOnCard({ css: theme.css, tokens }), tokens["--card"] as string),
          `${theme.id}: texto × cartão`,
        ).toBeGreaterThanOrEqual(4.5);
      }
    }
  });

  it("texto secundário continua legível no cartão (≥ 3:1)", () => {
    for (const theme of THEME_COLLECTIONS_GENERATIONS) {
      for (const tokens of modesOf(theme.tokens)) {
        expect(
          ratio(subtleOnCard({ css: theme.css, tokens }), tokens["--card"] as string),
          `${theme.id}: texto sutil × cartão`,
        ).toBeGreaterThanOrEqual(3);
      }
    }
  });

  it("cada tema tem CSS estrutural escopado nele mesmo — e nada de animação", () => {
    for (const theme of THEME_COLLECTIONS_GENERATIONS) {
      expect(theme.css, `${theme.id} sem CSS estrutural`).toBeTruthy();
      expect(theme.css).toContain(`data-theme="${theme.id}"`);
      expect(theme.css, `${theme.id} anima`).not.toMatch(/animation|transition|@keyframes/);
    }
  });

  it("cada família tem uma identidade própria, não só uma paleta", () => {
    const ids = THEME_COLLECTIONS_GENERATIONS.map((theme) => theme.id);
    const fundos = new Set(
      THEME_COLLECTIONS_GENERATIONS.map((theme) =>
        solidColor(theme.tokens.light["--background"] as string),
      ),
    );
    // Um tema por cor de fundo: dois temas iguais não são dois temas.
    expect(fundos.size).toBe(ids.length);

    const famílias = new Map<string, string[]>();
    for (const theme of THEME_COLLECTIONS_GENERATIONS) {
      const family = theme.category ?? "retro";
      famílias.set(family, [...(famílias.get(family) ?? []), theme.css ?? ""]);
    }
    // Dentro de cada família, o relevo/textura muda de tema para tema.
    for (const [family, css] of famílias) {
      expect(new Set(css).size, `${family} repete o mesmo CSS`).toBe(css.length);
    }
  });

  it("toda amostra de galeria é desenhável", () => {
    for (const theme of THEME_COLLECTIONS_GENERATIONS) {
      expect(theme.preview.background).toBeTruthy();
      expect(theme.preview.surface).toBeTruthy();
      expect(theme.preview.primary).toBeTruthy();
      expect(theme.preview.onPrimary).toBeTruthy();
      expect(theme.preview.border).toBeTruthy();
    }
  });
});
