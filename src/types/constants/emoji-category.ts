import type { EmojiEntry } from "./emoji-entry.js";

/** Um assunto do seletor de emojis (ver constants/emoji-catalog.ts). */
export type EmojiCategory = {
  id: string;
  label: string;
  emojis: EmojiEntry[];
};
