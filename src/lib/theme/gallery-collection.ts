import type { GalleryThemePackage } from "../../types/lib/theme/gallery-theme-package.js";
import type { PaletteSpec } from "../../types/lib/theme/theme-collection-palette-spec.js";
import type { ThemeCollection } from "../../types/lib/theme/theme-collection.js";

import { hexToRgb, readableForeground, rgbToHex } from "./color.js";
import { palette } from "./theme-palette.js";

/**
 * Temas da COMUNIDADE como coleções do motor de temas.
 *
 * A galeria publica um pacote de cores (background, surface, border, primary e o texto);
 * antes, "Aplicar" só derivava um destaque e um fundo a partir delas — o resto do tema
 * (superfícies, bordas, texto) ficava de fora, e um tema de destaque parecido com o da
 * marca parecia "não ter mudado nada". Aqui o pacote vira uma `ThemeCollection` de
 * verdade: a MESMA função que monta os temas da casa (`palette()`) expande as cores
 * recebidas em todos os tokens, então superfície, borda, texto e relevos acompanham.
 */

/** Prefixo do id — separa os temas da comunidade dos temas da casa em qualquer lugar. */
export const GALLERY_COLLECTION_PREFIX = "galeria-";

export function galleryCollectionId(themeId: string): string {
  return GALLERY_COLLECTION_PREFIX + themeId;
}

/** É um tema da comunidade? (Os da casa são os únicos que a conta do backend conhece.) */
export function isGalleryCollectionId(id: string | null | undefined): boolean {
  return Boolean(id && id.startsWith(GALLERY_COLLECTION_PREFIX));
}

/**
 * Pacote → `ThemeCollection`. O pacote é um SUBCONJUNTO da paleta da casa; o que ele não
 * declara é derivado aqui (`onPrimary` pela luminância do destaque, `muted` misturando
 * superfície e fundo, `text.date` a partir do texto sutil). Declaração do autor tem prioridade
 * sobre a derivação: `muted` é o fundo do item selecionado da navegação (`--surface-2`), e um
 * tema que escolhe essa cor espera vê-la na tela — derivação é plano B para o pacote antigo,
 * não substituição do que foi publicado.
 *
 * Como o pacote vale para um modo só (`modeDefault`), os mesmos tokens vão para claro e escuro
 * — o tema não muda de cara ao trocar o modo, que é o comportamento dos temas da casa presos a
 * um modo.
 */
export function buildGalleryCollection(theme: GalleryThemePackage): ThemeCollection {
  const pkg = parsePackage(theme.packageJson);
  const raw = pkg.palette ?? {};
  const dark = theme.modeDefault === "dark";

  const background = colorOr(raw.background, dark ? "#141420" : "#ffffff");
  const surface = colorOr(raw.surface, background);
  const border = colorOr(raw.border, surface);
  const primary = colorOr(raw.primary, "#7c3aed");
  const strong = colorOr(raw.text?.strong, dark ? "#f8f8f2" : "#111111");
  const subtle = colorOr(raw.text?.subtle, strong);
  const onPrimary = colorOr(raw.onPrimary, readableForeground(hexToRgb(primary), 0).css);

  const spec: PaletteSpec = {
    background,
    surface,
    // "Blocos alternativos/hovers": sem declaração, uma mistura sólida entre superfície e
    // fundo. Hex (e não color-mix) porque a expansão dos tokens faz matemática de contraste
    // com esse valor.
    muted: colorOr(raw.muted, mixHex(surface, background, 0.6)),
    border,
    primary,
    onPrimary,
    gradient: typeof raw.gradient === "string" ? raw.gradient : undefined,
    text: { strong, subtle, date: colorOr(raw.text?.date, subtle) },
  };

  const tokens = palette(spec);
  return {
    id: galleryCollectionId(theme.id),
    name: theme.name,
    description: theme.description || "Tema da comunidade.",
    metaColor: background,
    tokens: { light: tokens, dark: tokens },
    preview: {
      background,
      surface,
      primary,
      onPrimary,
      border,
      effect: spec.gradient ? "gradient" : "flat",
    },
  };
}

function parsePackage(json: string): {
  palette?: {
    background?: string;
    surface?: string;
    muted?: string;
    border?: string;
    primary?: string;
    onPrimary?: string;
    gradient?: string;
    text?: { strong?: string; subtle?: string; date?: string };
  };
} {
  try {
    const parsed = JSON.parse(json) as ReturnType<typeof parsePackage>;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    // Pacote ilegível: o backend valida no publish, mas o registro local pode ser antigo.
    // Um tema quebrado não pode derrubar a tela — cai no padrão da marca.
    return {};
  }
}

/** Hex de 6 dígitos, ou o fallback (os valores vêm de um pacote já validado na porta). */
function colorOr(value: string | undefined, fallback: string): string {
  return typeof value === "string" && /^#[0-9a-fA-F]{6}$/.test(value) ? value : fallback;
}

/**
 * Mistura `p` de `a` com `1-p` de `b`, canal a canal.
 *
 * `hexToRgb` devolve canal em 0–1 (não 0–255), então a média é em 0–1 e quem volta para hex
 * é `rgbToHex`. Misturar em 0–255 aqui arredondava todo canal para 0 e todo tema publicado
 * ganhava `--muted`/`--surface-2` em `#000000` — o item selecionado da navegação em preto.
 */
function mixHex(a: string, b: string, p: number): string {
  const first = hexToRgb(a);
  const second = hexToRgb(b);
  const channel = (x: number, y: number) => x * p + y * (1 - p);
  return rgbToHex({
    r: channel(first.r, second.r),
    g: channel(first.g, second.g),
    b: channel(first.b, second.b),
  });
}
