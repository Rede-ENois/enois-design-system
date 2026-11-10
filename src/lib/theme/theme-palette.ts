import type { RgbColor } from "../../types/lib/theme/rgb-color.js";
import type { PaletteSpec } from "../../types/lib/theme/theme-collection-palette-spec.js";
import type { ThemeCollectionTokens } from "../../types/lib/theme/theme-collection-tokens.js";

import { withAlpha } from "./build-background-style.js";
import {
  contrastRatio,
  hexToRgb,
  readableForeground,
  relativeLuminance,
  rgbToHex,
  textSafeAccent,
} from "./color.js";

/**
 * Motor de paleta: a expansão de `PaletteSpec` nos tokens da marca e o escopo do CSS
 * estrutural dos temas.
 *
 * Vive num módulo próprio porque tanto as coleções históricas quanto a nova geração
 * (e, no futuro, pacotes publicados) expandem paletas — se ele morasse junto de uma
 * das listas, as duas se importariam em ciclo e a segunda nasceria vazia.
 */

/** Mistura `color-mix(in srgb, a p%, b)` canal a canal (o que o CSS faz, sem CSS). */
function mixSrgb(
  a: { r: number; g: number; b: number },
  b: { r: number; g: number; b: number },
  p: number,
) {
  return {
    r: a.r * p + b.r * (1 - p),
    g: a.g * p + b.g * (1 - p),
    b: a.b * p + b.b * (1 - p),
  };
}

/**
 * Expande a especificação no mapa completo de tokens.
 *
 * Regra de derivar: superfícies alternativas (`surface-1/2/3`) vêm do fundo e do
 * muted; tints (`*-soft`, gradiente suave) saem de `color-mix` com o destaque.
 * Um tema declarou tudo o que a marca tinge quando este mapa sai completo.
 */
/**
 * Cor SÓLIDA representativa de um valor de fundo: alguns temas declaram o fundo
 * como GRADIENTE — toda a matemática de contraste precisa de uma cor; a primeira
 * parada do gradiente representa o topo da página, que é onde o texto nasce.
 */
export function solidColorOf(valor: string): string {
  const hex = valor.match(/#[0-9a-fA-F]{6}\b/);
  if (hex) return hex[0];
  const rgb = valor.match(/rgba?\(\s*[\d.]+[,\s]+[\d.]+[,\s]+[\d.]+/);
  if (rgb) {
    const [r, g, b] = rgb[0].match(/[\d.]+/g) ?? ["255", "255", "255"];
    const canal = (v: string) => Math.round(Number(v)).toString(16).padStart(2, "0");
    return `#${canal(r)}${canal(g)}${canal(b)}`;
  }
  return "#ffffff";
}

/**
 * Cor EFETIVA de um token que pode ser translúcido, composta sobre o fundo da página.
 *
 * `solidColorOf` ignora o alpha, e isso engana a conta de contraste: um branco a 38%
 * sobre um azul claro é um azul quase branco, não branco puro; um azul a 14% sobre o
 * mesmo fundo é um azul pálido, não o azul cheio. O texto só pode ser escolhido contra
 * o que a pessoa realmente vê.
 */
function corSobre(valor: string, backdrop: RgbColor): RgbColor {
  const hex = valor.match(/#([0-9a-fA-F]{6})\b/);
  if (hex) return hexToRgb(`#${hex[1]}`);
  const match = valor.match(
    /rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:\s*[,/]\s*([\d.]+))?\s*\)/,
  );
  if (!match) return backdrop;
  const r = Number(match[1]) / 255;
  const g = Number(match[2]) / 255;
  const b = Number(match[3]) / 255;
  const alpha = match[4] === undefined ? 1 : Math.min(1, Math.max(0, Number(match[4])));
  return {
    r: r * alpha + backdrop.r * (1 - alpha),
    g: g * alpha + backdrop.g * (1 - alpha),
    b: b * alpha + backdrop.b * (1 - alpha),
  };
}

/** Todas as paradas de cor de um fundo (degradê ou cor sólida), já compostas. */
function paradasDoFundo(valor: string, backdrop: RgbColor): RgbColor[] {
  const found = [...valor.matchAll(/#[0-9a-fA-F]{6}\b|rgba?\([^)]*\)/g)].map((match) =>
    corSobre(match[0], backdrop),
  );
  return found.length > 0 ? found : [backdrop];
}

export function palette(spec: PaletteSpec): ThemeCollectionTokens {
  const { primary, onPrimary, surface, muted, border } = spec;
  const bgSolido = solidColorOf(spec.background);
  // O soft é um WASH (fundo sutil): no contexto claro fica MAIS CLARO que o primário,
  // no escuro MAIS ESCURO. Alguns temas declararam um soft do lado oposto (tom
  // profundo no claro) — aí nenhum texto alcança 3:1 contra ele e o par
  // bg-primary-soft + text-primary fica ilegível; esses caem no mix padrão.
  const primaryRgb = hexToRgb(primary);
  const backgroundRgb = hexToRgb(bgSolido);
  const claro = relativeLuminance(backgroundRgb) > relativeLuminance(primaryRgb);
  const mixPadrao = `color-mix(in srgb, ${primary} 14%, ${bgSolido})`;
  const mixSoft = mixSrgb(primaryRgb, backgroundRgb, 0.14);
  const softRgb = spec.soft ? corSobre(spec.soft, backgroundRgb) : mixSoft;
  const softNoLadoCerto = claro
    ? relativeLuminance(softRgb) > relativeLuminance(primaryRgb)
    : relativeLuminance(softRgb) < relativeLuminance(primaryRgb);
  const softFinal = softNoLadoCerto ? (spec.soft ?? mixPadrao) : mixPadrao;
  const softFinalRgb = softNoLadoCerto ? softRgb : mixSoft;
  const mutedRgb = corSobre(muted, backgroundRgb);
  const bgStops = paradasDoFundo(spec.background, backgroundRgb);
  const secondary = spec.secondary ?? `color-mix(in oklab, ${primary} 45%, ${bgSolido})`;
  // O accent é um PREENCHIMENTO (selo DIVERTIDO): o texto em cima dele precisa ser
  // escolhido pela luminância do accent, não herdado do texto da página. Sem isso, um
  // tema escuro com accent claro (grafite) ficava com branco sobre cinza-claro (1.7:1).
  const accentValue = spec.accent ?? muted;
  const accentRgb = corSobre(accentValue, backgroundRgb);
  const accentForeground = spec.onAccent ?? readableForeground(accentRgb, 0).css;
  // O texto que usa o destaque como COR (links, "Entrar", chips de habilidade) não pode
  // sumir quando o primário do tema é claro demais para o fundo — e também não pode
  // empatar com o soft (bg-primary-soft), com a superfície-2 (chips bg-surface-2) nem
  // com a parada mais escura de um fundo em degradê, por isso todos entram na conta.
  const primaryText = textSafeAccent(primaryRgb, [...bgStops, softFinalRgb, mutedRgb]);
  // A data do post fica dentro do CARD, não no fundo da página: o token do tema é
  // ajustado contra a superfície real (composta, quando o card é translúcido) para
  // não ficar em 2.0–2.9:1 em temas de superfície clara/escura.
  // `corSobre`, not `hexToRgb`: a surface may come as `rgb(r g b / a)` (vaporwave, synthwave), which
  // `hexToRgb` turned into NaN for the date colour and the text on a foreground fill.
  const surfaceSolidRgb = corSobre(surface, backgroundRgb);
  const surfaceAlpha = Math.min(100, Math.max(0, spec.surfaceAlpha ?? 100)) / 100;
  const surfaceRgb =
    surfaceAlpha >= 1
      ? surfaceSolidRgb
      : {
          r: surfaceSolidRgb.r * surfaceAlpha + backgroundRgb.r * (1 - surfaceAlpha),
          g: surfaceSolidRgb.g * surfaceAlpha + backgroundRgb.g * (1 - surfaceAlpha),
          b: surfaceSolidRgb.b * surfaceAlpha + backgroundRgb.b * (1 - surfaceAlpha),
        };
  const dateText = textSafeAccent(hexToRgb(spec.text.date), [surfaceRgb, backgroundRgb]);
  // `--on-foreground` pinta o texto de quem usa o `--foreground` como PREENCHIMENTO. O cartão
  // costuma servir (fundo claro num tema de texto escuro), mas não sempre: no Workbench a página
  // é azul com texto claro e a janela é cinza clara — o cartão sozinho dava 1.4:1. Quando ele não
  // alcança texto normal, o próprio contraste contra o `--foreground` escolhe o lado.
  const foregroundRgb = corSobre(spec.text.strong, backgroundRgb);
  const onForeground =
    contrastRatio(surfaceRgb, foregroundRgb) >= 4.5
      ? rgbToHex(surfaceRgb)
      : rgbToHex(readableForeground(foregroundRgb, 0).rgb);

  return {
    // Destaque
    "--primary": primary,
    "--primary-foreground": onPrimary,
    "--primary-text": primaryText,
    "--primary-soft": softFinal,
    "--secondary": secondary,
    "--secondary-foreground": spec.onSecondary ?? onPrimary,
    "--accent": accentValue,
    "--accent-foreground": accentForeground,
    "--ring": spec.ring ?? primary,
    "--gradient-primary":
      spec.gradient ??
      `linear-gradient(135deg, ${primary}, color-mix(in oklab, ${primary} 70%, white))`,
    "--gradient-soft": `linear-gradient(135deg, ${bgSolido}, color-mix(in srgb, ${primary} 8%, ${bgSolido}))`,
    "--shadow-soft": spec.shadows?.soft ?? "none",
    "--shadow-card": spec.shadows?.card ?? "none",
    "--mentorship-button": primary,
    "--highlight-project": softFinal,
    "--highlight-project-text": primaryText,
    "--background-user-project": softFinal,
    "--project-text": primaryText,
    // Superfícies
    "--background": spec.background,
    "--card": withAlpha(surface, spec.surfaceAlpha ?? 100),
    // Text on a `bg-foreground` fill: the card as the reader sees it, always a solid colour (the
    // background may be a gradient and the card may be translucent, neither works as a text colour).
    "--on-foreground": onForeground,
    "--popover": withAlpha(surface, spec.surfaceAlpha ?? 100),
    "--muted": muted,
    "--border": border,
    "--input": spec.input ?? border,
    "--sidebar": withAlpha(surface, spec.surfaceAlpha ?? 100),
    "--sidebar-border": border,
    "--surface-card": withAlpha(surface, spec.surfaceAlpha ?? 100),
    "--surface-1": spec.background,
    "--surface-2": muted,
    "--surface-3": surface,
    "--border-soft": border,
    // Leitura (o tema é dono do texto; é isso que o mantém legível nos dois modos)
    "--foreground": spec.text.strong,
    "--card-foreground": spec.text.strong,
    "--popover-foreground": spec.text.strong,
    "--sidebar-foreground": spec.text.strong,
    "--muted-foreground": spec.text.subtle,
    "--text-strong": spec.text.strong,
    "--text-subtle": spec.text.subtle,
    "--text-date": dateText,
    // Estrutura. Os raios DERIVADOS (sm/md/xl/2xl/3xl) são calc(var(--radius) ± N) no CSS
    // da marca — com raio 0 eles devolviam pixels (2xl = +8) e os cartões do Win95/Metro
    // continuavam arredondados. O tema emite os seis coerentes com o raio dele.
    // The deltas are pixels: added to a rem base they turned 0.875rem into a 12.875rem (206px)
    // `--radius-3xl`, and every card of a theme without its own radius came out oval.
    ...(() => {
      const parsed = /^([\d.]+)(px|rem)$/.exec(spec.radius ?? "0.875rem");
      const base = parsed ? Number(parsed[1]) : 14;
      const unit = parsed ? parsed[2] : "px";
      const basePx = unit === "rem" ? base * 16 : base;
      // A square theme (radius 0) stays square at every size.
      const radiusToken = (delta: number) =>
        basePx === 0 ? "0px" : `${Math.max(0, basePx + delta)}px`;
      return {
        "--radius": `${base}${unit}`,
        "--radius-sm": radiusToken(-4),
        "--radius-md": radiusToken(-2),
        "--radius-lg": radiusToken(0),
        "--radius-xl": radiusToken(4),
        "--radius-2xl": radiusToken(8),
        "--radius-3xl": radiusToken(12),
      };
    })(),
    ...(spec.fontSans ? { "--font-sans": spec.fontSans, "--font-display": spec.fontSans } : {}),
    ...(spec.fontDisplay ? { "--font-display": spec.fontDisplay } : {}),
    ...spec.extra,
  } satisfies ThemeCollectionTokens;
}

/** Prefixa cada regra com o escopo do tema, nas duas variantes de modo. */
export function scopedCss(id: string, rules: string[]): string {
  const base = `html:root[data-theme="${id}"]`;
  const dark = `html:root.dark[data-theme="${id}"]`;
  return rules
    .map((rule) => {
      const at = rule.indexOf(" {");
      const selectors = rule
        .slice(0, at)
        .split(",")
        .map((selector) => `${base} ${selector.trim()}, ${dark} ${selector.trim()}`)
        .join(", ");
      return selectors + rule.slice(at + 1);
    })
    .join("\n");
}
