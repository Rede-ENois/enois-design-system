import type { CSSProperties } from "react";

import type { CardTheme } from "../../types/domain/cosmetics/card-theme.js";

/** Dark card: light text on the theme colors. */
function dark(top: string, bottom: string, accent: string): CardTheme {
  return {
    top,
    bottom,
    accent,
    fg: "#f5f3ff",
    muted: "rgba(245,243,255,.7)",
    surface: "rgba(255,255,255,.09)",
    tokens: {
      // Every dark-theme accent is bright: dark ink on it as a fill, a lighter tint of it as text.
      "--primary": accent,
      "--primary-foreground": "#1c1917",
      "--primary-text": `color-mix(in srgb, ${accent} 30%, #fff)`,
      // The dark palette values of styles.css, whatever mode the page is in.
      "--opportunity-foreground": "oklch(0.94 0.05 60)",
    },
  };
}

/** Light card: dark text on pale theme colors. */
function light(top: string, bottom: string, accent: string): CardTheme {
  return {
    top,
    bottom,
    accent,
    fg: "#1c1917",
    muted: "rgba(28,25,23,.62)",
    surface: "rgba(28,25,23,.07)",
    // The light palette values of styles.css, whatever mode the page is in.
    tokens: { "--primary-text": "#5736db", "--opportunity-foreground": "oklch(0.2 0.05 60)" },
  };
}

/**
 * Card themes of the seasonal collections (`CARD_THEME` items), from the approved prototype, plus
 * the permanent Essenciais themes, which stay on sale all year.
 */
export const CARD_THEMES: Readonly<Record<string, CardTheme>> = {
  "tema-papel": light("#fdf6e3", "#f3e2c0", "#b45309"),
  "tema-noite-limpa": dark("#1e293b", "#0f172a", "#818cf8"),
  "tema-jardim": light("#ecfdf5", "#d1fae5", "#059669"),
  "tema-saci": dark("#166534", "#052e16", "#ef4444"),
  "tema-halloween": dark("#1e1b4b", "#0b0a1f", "#f97316"),
  "tema-folclore": dark("#115e59", "#042f2e", "#f59e0b"),
  "tema-natal": dark("#7f1d1d", "#14532d", "#facc15"),
  "tema-reveillon": dark("#0f172a", "#1e3a8a", "#fde047"),
  "tema-carnaval": dark("#86198f", "#1e1b4b", "#f472b6"),
  "tema-junina": dark("#7c2d12", "#1c1917", "#facc15"),
  "tema-namorados": dark("#9d174d", "#4c0519", "#fda4af"),
  "tema-flor": light("#fef9c3", "#fde68a", "#ca8a04"),
  "tema-dev": dark("#020617", "#111827", "#4ade80"),
  "tema-criancas": light("#e0f2fe", "#fef3c7", "#f43f5e"),
};

export function cardTheme(id: string | null | undefined): CardTheme | null {
  return id && Object.hasOwn(CARD_THEMES, id) ? CARD_THEMES[id] : null;
}

/**
 * The card theme as the `--p-*` custom properties read by the profile card. Without a known
 * theme it returns nothing and the card keeps the design system tokens.
 */
export function cardThemeStyle(id: string | null | undefined): CSSProperties | undefined {
  const theme = cardTheme(id);
  if (!theme) return undefined;
  return {
    "--p-top": theme.top,
    "--p-bottom": theme.bottom,
    "--p-accent": theme.accent,
    "--p-fg": theme.fg,
    "--p-muted": theme.muted,
    "--p-surface": theme.surface,
    ...theme.tokens,
  } as CSSProperties;
}
