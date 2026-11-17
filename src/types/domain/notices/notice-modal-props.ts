import type { ThemeName } from "../../patterns/theme-name.js";

import type { NoticeTheme } from "./notice-theme.js";

/**
 * The notice dialog as one surface that takes its identity from the published HTML: the frame
 * document declares `--notice-*` properties, the container reads them and paints itself — header,
 * footer and content become parts of the same interface instead of a card inside a card. Without
 * declared properties the platform identity applies.
 */
export type NoticeModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Notice title; also the frame's accessible name. */
  title: string;
  /** Sanitized published HTML, rendered inside the sandboxed frame. */
  html: string;
  /** App theme, forwarded to the frame so author CSS follows the app instead of the OS. */
  theme: ThemeName;
  /** Id of the `<style>` element where the app writes its theme CSS (frame watches it). */
  themeStyleElementId?: string;
  /** Publication date, already formatted by the app — content, not microcopy. */
  publishedAtLabel?: string;
  /**
   * Confirmed reading. Without it the confirm button just closes: the dismissal contract stays
   * with the app either way.
   */
  onConfirm?: () => void;
};
