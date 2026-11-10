import type { ProfileLookFont } from "../../types/lib/theme/profile-look-font.js";
import type { ProfileLook } from "../../types/lib/theme/profile-look.js";
import type { ThemeAccent } from "../../types/lib/theme/theme-accent.js";
import type { ThemeCollection } from "../../types/lib/theme/theme-collection.js";
import type { Theme } from "../../types/lib/theme/theme.js";

import { ACCENT_OVERRIDE_KEYS } from "./build-collection-css.js";
import { buildAccentTokens } from "./build-theme-tokens.js";
import { hexToRgb, rgbToOklch } from "./color.js";
import { THEME_COLLECTIONS } from "./theme-collections.js";
import { solidColorOf } from "./theme-palette.js";

/**
 * CSS de um tema "vestido" por um perfil.
 *
 * A diferença para `buildCollectionCss`: aqui os tokens não vão para `html:root`, vão para
 * o CONTAINER do perfil. Assim o visual escolhido pelo dono vale dentro da vitrine e não
 * vaza para o resto do app — quem visita continua com o tema da própria conta no menu, nas
 * notificações e em qualquer porta que abra por cima.
 *
 * O CSS estrutural do preset é o mesmo: as regras já vêm escopadas em `html:root[data-theme]`
 * e são reescritas para o container. Nada de duplicar identidade — o perfil herda relevos,
 * sombras, bordas e texturas exatamente como no tema global.
 */

/** Famílias seguras: nenhuma carrega arquivo novo (a fonte da marca já está na página). */
const FONT_STACKS: Record<ProfileLookFont, string> = {
  sans: '"Manrope", ui-sans-serif, system-ui, sans-serif',
  serif: 'Georgia, "Times New Roman", serif',
  mono: 'ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace',
  rounded: 'ui-rounded, "Trebuchet MS", "Segoe UI", system-ui, sans-serif',
  display: '"Trebuchet MS", "Segoe UI", system-ui, sans-serif',
};

const RADIUS_ROUNDED = "0.875rem";

export function themeCollectionById(
  collectionId: string | null | undefined,
): ThemeCollection | null {
  if (!collectionId) return null;
  return THEME_COLLECTIONS.find((collection) => collection.id === collectionId) ?? null;
}

/**
 * Cor escolhida (hex) no formato que o motor de destaque entende.
 *
 * A faixa é a mesma da personalização livre (brilho 0.38–0.62, croma até 0.28). Fora dela o
 * ajuste de contraste do motor empurraria o valor de qualquer jeito — melhor limitar aqui e
 * deixar o resultado previsível.
 */
function accentFromHex(hex: string): ThemeAccent {
  const { lightness, chroma, hue } = rgbToOklch(hexToRgb(hex));
  return {
    hue,
    chroma: Math.min(chroma, 0.28),
    lightness: Math.min(Math.max(lightness, 0.38), 0.62),
  };
}

function rescope(css: string | undefined, collectionId: string): string {
  if (!css) return "";
  const global = `html:root[data-theme="${collectionId}"], html:root.dark[data-theme="${collectionId}"]`;
  const dark = `html:root.dark[data-theme="${collectionId}"]`;
  const light = `html:root[data-theme="${collectionId}"]`;
  const scoped = `[data-profile-theme="${collectionId}"]`;
  return css.split(global).join(scoped).split(dark).join(scoped).split(light).join(scoped);
}

/** Regras que traduzem os ajustes finos do perfil em propriedades previsíveis. */
function lookRules(selector: string, look: ProfileLook): string[] {
  const rules: string[] = [];

  const font = look.font ? FONT_STACKS[look.font] : null;
  if (font) {
    rules.push(
      `${selector} { --font-sans: ${font}; --font-display: ${font}; font-family: ${font}; }`,
    );
  }

  if (look.borders === "square") {
    rules.push(`${selector} { --radius: 0px; }`);
  } else if (look.borders === "rounded") {
    rules.push(`${selector} { --radius: ${RADIUS_ROUNDED}; }`);
  }

  if (look.textures === false) {
    // "Sem textura" é literal: os relevos seguem (borda, sombra), o padrão sai do fundo da
    // vitrine e das superfícies. O fundo fica na cor sólida do topo (ver `buildProfileCss`).
    rules.push(
      `${selector}, ${selector} .surface-card, ${selector} .bg-card, ${selector} .bg-surface-card, ${selector} .bg-popover { background-image: none; }`,
    );
  }

  // Cabeçalho: três tratamentos do banner do cartão de perfil, todos com a mesma caixa.
  rules.push(
    `${selector} .cos-card__banner::after { content: ""; position: absolute; inset: 0; pointer-events: none; }`,
  );
  if (look.header === "solid") {
    rules.push(
      `${selector} .cos-card__banner::after { background: color-mix(in oklab, var(--card) 90%, var(--primary)); }`,
    );
  } else if (look.header === "gradient") {
    rules.push(
      `${selector} .cos-card__banner::after { background: linear-gradient(180deg, transparent 40%, color-mix(in oklab, var(--card) 92%, transparent)); }`,
    );
  } else if (look.header === "clean") {
    rules.push(`${selector} .cos-card__banner::after { background: none; }`);
  }

  return rules;
}

/**
 * Identidade do preset dentro do container + os ajustes finos por cima.
 *
 * Devolve string vazia quando o look não escolheu tema: sem preset não existe "visual do
 * perfil", e o front deixa a página com o tema da plataforma.
 */
export function buildProfileCss(
  collection: ThemeCollection,
  look: ProfileLook,
  mode: Theme,
): string {
  const tokens =
    mode === "dark" ? (collection.tokens.dark ?? collection.tokens.light) : collection.tokens.light;

  let effective: Record<string, string> = tokens;
  if (look.accent) {
    const accent = buildAccentTokens(accentFromHex(look.accent), mode);
    effective = { ...effective };
    for (const key of ACCENT_OVERRIDE_KEYS) {
      const value = accent[key];
      if (value !== undefined) effective[key] = value;
    }
  }

  const selector = `[data-profile-theme="${collection.id}"]`;
  const declarations = Object.entries(effective)
    .map(([name, value]) => `  ${name}: ${value};`)
    .join("\n");

  const blocks = [
    `${selector} {\n${declarations}\n  color: var(--foreground);\n  background-color: var(--background);\n}`,
  ];

  // `--background` gradiente não vale como `background-color`: a cor sólida do topo fica por
  // baixo, e é ela que aparece quando a pessoa desliga as texturas.
  const background = effective["--background"] ?? "";
  if (background.includes("gradient")) {
    blocks.push(
      `${selector} { background-color: ${solidColorOf(background)}; background-image: ${background}; }`,
    );
  }

  blocks.push(rescope(collection.css, collection.id));
  blocks.push(...lookRules(selector, look));

  // Nível nulo = não escolheu: fica a decoração discreta, a mesma de quem nunca abriu a opção.
  const decoration = look.decoration ?? 1;
  blocks.push(
    `${selector} { --profile-decoration: ${decoration === 0 ? 0 : decoration === 1 ? 0.35 : 0.8}; }`,
  );

  return blocks.filter(Boolean).join("\n");
}
