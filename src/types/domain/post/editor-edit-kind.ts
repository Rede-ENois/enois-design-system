/**
 * How an edit enters the field history: typing and deleting merge into one step while they run
 * back to back; everything else (sticker, mention, emoji, paste, cut, format) is a step of its own.
 */
export type EditorEditKind = "insert" | "delete" | "step";
