import type { EditorEditKind } from "../../../types/domain/post/editor-edit-kind.js";
import type { EditorHistorySnapshot } from "../../../types/domain/post/editor-history-snapshot.js";
import type { EditorHistoryState } from "../../../types/domain/post/editor-history-state.js";

/**
 * The field draws its own DOM, which wipes the browser undo stack, so it keeps its own history of
 * values. Pure functions over a plain object: the component owns it in a ref.
 */

/** Steps kept; the oldest one is dropped past it. */
export const HISTORY_LIMIT = 200;

export function createHistory(): EditorHistoryState {
  return { undo: [], redo: [], last: null };
}

/** Forgets everything: the text was replaced from outside, so old steps no longer apply. */
export function resetHistory(history: EditorHistoryState): void {
  history.undo = [];
  history.redo = [];
  history.last = null;
}

/**
 * Records an edit that is about to be (or was just) applied. `before` is the state it started from
 * and `after` where it ended. Consecutive typing, or consecutive deleting, that continues exactly
 * where the previous edit stopped joins that step instead of adding one.
 */
export function recordEdit(
  history: EditorHistoryState,
  kind: EditorEditKind,
  before: EditorHistorySnapshot,
  after: { value: string; caret: number },
): void {
  const last = history.last;
  const continuesRun =
    kind !== "step" &&
    last !== null &&
    last.kind === kind &&
    last.value === before.value &&
    last.caret === before.selection.start &&
    before.selection.start === before.selection.end;
  if (!continuesRun) {
    history.undo.push({ ...before, kind });
    if (history.undo.length > HISTORY_LIMIT) history.undo.shift();
  }
  history.redo = [];
  history.last = { kind, value: after.value, caret: after.caret };
}

/**
 * Moves one step through the history. `current` is what the field shows now and goes onto the
 * opposite stack. Returns the state to show, or null when there is nothing to move to or `accepts`
 * refuses it (the step then stays where it is).
 */
export function stepHistory(
  history: EditorHistoryState,
  direction: "undo" | "redo",
  current: EditorHistorySnapshot,
  accepts: (target: EditorHistorySnapshot) => boolean,
): EditorHistorySnapshot | null {
  const from = direction === "undo" ? history.undo : history.redo;
  const to = direction === "undo" ? history.redo : history.undo;
  const entry = from[from.length - 1];
  if (!entry || !accepts(entry)) return null;
  from.pop();
  to.push({ ...current, kind: "step" });
  history.last = null;
  return { value: entry.value, selection: entry.selection, mentions: entry.mentions };
}
