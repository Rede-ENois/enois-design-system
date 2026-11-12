/** What the owner of a `MentionTextarea` can do through its `ref`. */
export type MentionTextareaHandle = {
  /**
   * Inserts `text` (for example a sticker code) at the caret, replacing the selection. Spaces are
   * added around it when the neighbours are not whitespace. The caret is remembered while the field
   * has no focus (a dialog is open), so the insert lands where the person was writing. Goes through
   * the same mention reconciliation as a typed edit and never exceeds `maxLength`.
   * Returns `false` when nothing was inserted.
   */
  insertAtCaret: (text: string) => boolean;
  /** Puts the focus back in the field, caret where it was. */
  focus: () => void;
};
