import type { Adapters } from "../../adapters/adapters.js";

import type { EditorSticker } from "./editor-sticker.js";

/** What the rich text block and inline renderers share. */
export type RichTextContext = Pick<
  Adapters,
  "isOwnMediaUrl" | "resolveMediaOriginalUrl" | "appPathOf"
> & {
  linkClass: string;
  mentionHref: (username: string) => string;
  spoilerLabel: string;
  inlineStickers?: Record<string, EditorSticker>;
  /** A figurinha do código, já resolvida: `undefined` quando o texto não a cita. */
  stickerFor: (code: string) => EditorSticker | undefined;
  /** O desenho da figurinha inline, quando o app diz qual é (ver `RichTextProps.figurinha`). */
  figurinha?: {
    classe: string;
    ehFigurinha: (url: string, ehMidiaNossa: (url: string) => boolean) => boolean;
  };
};
