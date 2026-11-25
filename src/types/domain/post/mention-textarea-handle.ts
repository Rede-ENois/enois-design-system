import type { StickerQueryState } from "./sticker-query-state.js";

/** What the owner of a `MentionTextarea` can do through its `ref`. */
export type MentionTextareaHandle = {
  /**
   * Inserts `text` (for example a sticker code) at the caret, replacing the selection. Spaces are
   * added around it when the neighbours are not whitespace. The caret is remembered while the field
   * has no focus (a dialog is open), so the insert lands where the person was writing. Goes through
   * the same mention reconciliation as a typed edit and never exceeds `maxLength`.
   *
   * The edit is applied after the render (the text and the selection are the ones the field has
   * at that moment), so `maxLength` can only be checked there: this returns `true` and `onChange`
   * is what tells whether anything went in.
   */
  insertAtCaret: (text: string) => boolean;
  /**
   * Troca o `:palavra` sob o cursor (`tipo`) pelo código completo da figurinha (`:codigo:`) e põe o
   * cursor depois dele. Com o cursor fora do termo, entra como `insertAtCaret`.
   */
  replaceStickerQuery: (codigo: string, tipo: StickerQueryState) => boolean;
  /** Puts the focus back in the field, caret where it was. */
  focus: () => void;
};
