import type { NoticeTheme } from "../../types/domain/notices/notice-theme.js";

/** The custom properties a published notice may declare, keyed like the {@link NoticeTheme}. */
export const NOTICE_THEME_PROPERTIES = {
  primary: "--notice-primary",
  background: "--notice-background",
  surface: "--notice-surface",
  text: "--notice-text",
  muted: "--notice-muted",
  border: "--notice-border",
  buttonText: "--notice-button-text",
} as const;

/**
 * Reads the identity the published HTML declares on its `:root` — the frame → container direction
 * of the theme integration. The frame document is readable because the sandbox keeps same-origin
 * (the same fact the height measurement uses); no script runs inside, and nothing is written back.
 *
 * Unset or empty properties stay out of the result, so every consumer falls back to the platform
 * identity through its own `var(--notice-*, …)` chain.
 */
export function extractNoticeTheme(doc: Document | null): NoticeTheme {
  if (!doc?.documentElement) return {};
  const declared = getComputedStyle(doc.documentElement);
  const theme: NoticeTheme = {};
  for (const [key, property] of Object.entries(NOTICE_THEME_PROPERTIES)) {
    const value = declared.getPropertyValue(property).trim();
    if (value) theme[key as keyof NoticeTheme] = value;
  }
  return theme;
}

/**
 * Text color with readable contrast on the declared primary — used by the confirm button when the
 * HTML declares a primary but no button text. Returns the near-white or near-black end of the
 * WCAG 2.x relative-luminance comparison; null when the primary is missing or in a format we do
 * not parse (then the button keeps its token color).
 *
 * These two values cannot be theme tokens: they are derived from author-declared data outside the
 * platform palette, the same way the frame's `light-dark()` author defaults are literals.
 */
export function readableTextOn(primary: string | undefined): string | null {
  const luminance = relativeLuminance(primary);
  if (luminance === null) return null;
  const againstWhite = 1.05 / (luminance + 0.05);
  const againstBlack = (luminance + 0.05) / 0.05;
  return againstWhite >= againstBlack ? "#f4f2ff" : "#111015";
}

/** WCAG 2.x relative luminance, or null for color formats outside the parser. */
function relativeLuminance(color: string | undefined): number | null {
  const channels = parseColorChannels(color);
  if (!channels) return null;
  const [r, g, b] = channels.map((channel) => {
    const scaled = channel / 255;
    return scaled <= 0.03928 ? scaled / 12.92 : ((scaled + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** `#rgb`, `#rrggbb`, `#rrggbbaa`, `rgb()` and `rgba()` (comma or space syntax). */
function parseColorChannels(color: string | undefined): [number, number, number] | null {
  if (!color) return null;
  const hex = /^#([0-9a-f]{3,8})$/i.exec(color.trim());
  if (hex) {
    const digits = hex[1];
    if (digits.length === 3 || digits.length === 4) {
      return digits
        .slice(0, 3)
        .split("")
        .map((digit) => Number.parseInt(digit + digit, 16)) as [number, number, number];
    }
    if (digits.length === 6 || digits.length === 8) {
      return [0, 2, 4].map((at) => Number.parseInt(digits.slice(at, at + 2), 16)) as [
        number,
        number,
        number,
      ];
    }
    return null;
  }
  const rgb = /^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)(?:[\s,]+[\d.]+)?\s*\)$/i.exec(
    color.trim(),
  );
  if (rgb) {
    return [rgb[1], rgb[2], rgb[3]].map((channel) => Number.parseFloat(channel)) as [
      number,
      number,
      number,
    ];
  }
  return null;
}
