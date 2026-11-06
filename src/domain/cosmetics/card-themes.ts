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
 * Card themes of the shop (`CARD_THEME` items): the seasonal collections from the approved
 * prototype, then one for each of the 85 appearance themes, drawn from that theme's own gradient
 * and accent. Every card reads at AA on both stops (`card-themes.test.ts`).
 */
export const CARD_THEMES: Readonly<Record<string, CardTheme>> = {
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
  "tema-blahaj": dark("#0c1c2e", "#2a1a3a", "#5bcefa"),
  "tema-intersection": dark("#1b0625", "#230830", "#7902aa"),
  "tema-venus": dark("#300b00", "#3e0e00", "#d62900"),
  "tema-aquiles": dark("#061d18", "#08261f", "#078d70"),
  "tema-twomoons": dark("#0d0918", "#110b1f", "#d60270"),
  "tema-silver-jonny": dark("#07070a", "#09090d", "#fcee0a"),
  "tema-caravana-do-vento": dark("#30170a", "#3e1e0d", "#c96a2b"),
  "tema-bruma-silenciosa": dark("#141714", "#1a1e1a", "#9aa38a"),
  "tema-laboratorio-alaranjado": dark("#121518", "#181b1f", "#ff7a00"),
  "tema-vale-esmeralda": dark("#0b1810", "#0e1f15", "#3a7d44"),
  "tema-cidade-suspensa": dark("#181410", "#1f1a14", "#1f6f6b"),
  "tema-ilhota-de-tinta": dark("#101618", "#151c1f", "#204e5c"),
  "tema-vagao-noturno": dark("#0d0d0e", "#101012", "#c23b22"),
  "tema-jardim-de-luz": dark("#09101d", "#0b1526", "#7fd1e8"),
  "tema-brasas-cinzentas": dark("#0e0e0f", "#121213", "#c46a1f"),
  "tema-reino-do-bloco": dark("#12170f", "#171e13", "#5d7c3a"),
  "tema-cume-celeste": dark("#0e0e1d", "#121226", "#ff8fab"),
  "tema-peste-dourada": dark("#16120a", "#1c170d", "#8a6d2b"),
  "tema-kart-tropical": dark("#0b1a25", "#0e2130", "#e8443a"),
  "tema-estrela-de-papel": dark("#140f0d", "#1a1310", "#d03a2b"),
  "tema-prompt-do-dos": dark("#000000", "#000000", "#c8c8c8"),
  "tema-bancada-amiga": dark("#00162c", "#001c39", "#ff8800"),
  "tema-estacao-preta": dark("#0e0e0f", "#121213", "#d0d0d0"),
  "tema-listras-amarelas": dark("#101013", "#151519", "#cc9900"),
  "tema-toca-de-palmeira": dark("#131610", "#191c15", "#4a5d23"),
  "tema-tijolo-confiavel": dark("#060d06", "#081008", "#9be87a"),
  "tema-tela-verde": dark("#092409", "#0c2f0c", "#8bac0f"),
  "tema-papel-e-maquina": dark("#0a0a0a", "#0d0d0d", "#2b2b2b"),
  "tema-conde-noturno": dark("#0d0a13", "#100d19", "#bd93f9"),
  "tema-norte-frio": dark("#161a23", "#1d222d", "#88c0d0"),
  "tema-caixa-rustica": dark("#121415", "#181a1b", "#fabd2f"),
  "tema-sol-e-sombra": dark("#09131a", "#0b1921", "#268bd2"),
  "tema-contraste-puro": dark("#000000", "#000000", "#ffff00"),
  "tema-oceano": dark("#081b30", "#0a233e", "#0f3057"),
  "tema-floresta": dark("#0e1a10", "#122115", "#1b2e1b"),
  "tema-deserto-ao-entardecer": dark("#25170a", "#301e0d", "#c96a2b"),
  "tema-aurora": dark("#060d14", "#08101a", "#0d1b2a"),
  "tema-lavanda": dark("#1b1425", "#231a30", "#7e57c2"),
  "tema-musgo": dark("#171d12", "#1e2617", "#5a7d4a"),
  "tema-pessego": dark("#251b14", "#30231a", "#ff8a65"),
  "tema-grafite": dark("#0d0f12", "#111317", "#aab4be"),
  "tema-champanhe": dark("#1d180a", "#261f0d", "#b8963e"),
  "tema-oliva": dark("#161b0d", "#1c2310", "#6b7a3a"),
  "tema-tinta": dark("#080808", "#0a0a0a", "#1a1a1a"),
  "tema-papel-kraft": dark("#1b160e", "#231c12", "#5d4a2f"),
  "tema-gelo": dark("#101d24", "#15262f", "#5fa8c9"),
  "tema-vinho": dark("#17080b", "#1e0a0e", "#c94f5f"),
  "tema-madrugada": dark("#0a0f16", "#0d131d", "#5c7cfa"),
  "tema-swing-metal": dark("#30343b", "#3a3f47", "#8fb4e8"),
  "tema-swing-ocean": dark("#0f1e33", "#16283f", "#6fb3ff"),
  "tema-swing-nimbus": dark("#2e3238", "#383d44", "#7fb0e8"),
  "tema-swing-motif": dark("#3a352f", "#47413a", "#d08a5a"),
  "tema-swing-windows": dark("#2a2d31", "#3a3e44", "#3e6fd0"),
  "tema-swing-dark": dark("#1b1d21", "#25282d", "#6ea8ff"),
  "tema-web2000": dark("#1b3a8c", "#0e2352", "#0000ee"),
  "tema-web2000-forum": dark("#1f2529", "#262d33", "#4fa3d1"),
  "tema-web2000-cybercafe": dark("#0b0620", "#1a0b3a", "#ff3fd0"),
  "tema-web2000-glass": dark("#0d1826", "#16263a", "#7fc4ff"),
  "tema-web2000-portal": dark("#15181c", "#1d2126", "#ff5c5c"),
  "tema-web2000-pixel": dark("#101116", "#14151a", "#ff5c93"),
  "tema-arcade-8bit": dark("#0a0612", "#0d0818", "#00e5ff"),
  "tema-arcade-16bit": dark("#101a3a", "#1a2650", "#f0c040"),
  "tema-arcade-dungeon": dark("#211c17", "#241f19", "#e07a2a"),
  "tema-arcade-space": dark("#04070f", "#0a1220", "#48e0ff"),
  "tema-arcade-wasteland": dark("#2a2118", "#2c2319", "#c46a1f"),
  "tema-arcade-strategy": dark("#201a12", "#2a2318", "#d4b06a"),
  "tema-arcade-rpg": dark("#241a12", "#2f2217", "#d4af37"),
  "tema-arcade-terminal": dark("#000000", "#031003", "#4dff7a"),
  "tema-unix-classic": dark("#101010", "#1a1a1a", "#d8d8d8"),
  "tema-terminal-green": dark("#010601", "#020a03", "#39ff74"),
  "tema-amber-crt": dark("#0d0700", "#120a00", "#ffb000"),
  "tema-workbench": dark("#073a73", "#073a73", "#ff9a33"),
  "tema-industrial-desktop": dark("#26282b", "#303338", "#ff7a00"),
  "tema-win95": dark("#2b2b2e", "#2b2b2e", "#2b52c4"),
  "tema-win98": dark("#2c2d33", "#2c2d33", "#3a5fc8"),
  "tema-win2000": dark("#33343a", "#33343a", "#5b8fc9"),
  "tema-luna": dark("#16273c", "#1f3249", "#4c8bf5"),
  "tema-aero-glass": dark("#0b1524", "#14243a", "#5aa7e8"),
  "tema-frutiger-aero": dark("#0b2028", "#123c33", "#22d3ee"),
  "tema-metro": dark("#171717", "#262626", "#a78bfa"),
  "tema-terminal": dark("#050805", "#0a120a", "#33ff66"),
  "tema-vaporwave": dark("#2b1055", "#5b2a9e", "#ff71ce"),
  "tema-synthwave": dark("#1a1030", "#241543", "#ff2975"),
  "tema-y2k": dark("#101220", "#14161f", "#8a94ff"),
  "tema-neumorfismo": dark("#2c3038", "#2c3038", "#7c6cff"),
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
