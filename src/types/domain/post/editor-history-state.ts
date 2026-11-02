import type { EditorEditKind } from "./editor-edit-kind.js";
import type { EditorHistorySnapshot } from "./editor-history-snapshot.js";

/** The undo and redo stacks of a field, plus the last recorded edit (what typing merges into). */
export type EditorHistoryState = {
  undo: (EditorHistorySnapshot & { kind: EditorEditKind })[];
  redo: (EditorHistorySnapshot & { kind: EditorEditKind })[];
  last: { kind: EditorEditKind; value: string; caret: number } | null;
};
