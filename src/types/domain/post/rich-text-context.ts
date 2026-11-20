import type { Adapters } from "../../adapters/adapters.js";

/** What the rich text block and inline renderers share. */
export type RichTextContext = Pick<
  Adapters,
  "isOwnMediaUrl" | "resolveMediaOriginalUrl" | "appPathOf"
> & {
  linkClass: string;
  mentionHref: (username: string) => string;
  spoilerLabel: string;
};
