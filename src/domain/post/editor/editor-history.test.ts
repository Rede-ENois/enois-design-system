import { describe, expect, it } from "vitest";

import type { EditorHistorySnapshot } from "../../../types/domain/post/editor-history-snapshot.js";

import {
  HISTORY_LIMIT,
  createHistory,
  recordEdit,
  resetHistory,
  stepHistory,
} from "./editor-history.js";

const snap = (value: string, caret = value.length): EditorHistorySnapshot => ({
  value,
  selection: { start: caret, end: caret },
  mentions: [],
});
const acceptAll = () => true;

describe("editor history", () => {
  it("merges typing that continues where the last edit stopped into one step", () => {
    const history = createHistory();
    recordEdit(history, "insert", snap(""), { value: "a", caret: 1 });
    recordEdit(history, "insert", snap("a"), { value: "ab", caret: 2 });
    recordEdit(history, "insert", snap("ab"), { value: "abc", caret: 3 });

    expect(history.undo).toHaveLength(1);
    expect(stepHistory(history, "undo", snap("abc"), acceptAll)?.value).toBe("");
  });

  it("starts a new step when the caret moved away between two keystrokes", () => {
    const history = createHistory();
    recordEdit(history, "insert", snap(""), { value: "ab", caret: 2 });
    recordEdit(history, "insert", snap("ab", 0), { value: "xab", caret: 1 });

    expect(history.undo).toHaveLength(2);
  });

  it("keeps typing and deleting as separate steps", () => {
    const history = createHistory();
    recordEdit(history, "insert", snap(""), { value: "ab", caret: 2 });
    recordEdit(history, "delete", snap("ab"), { value: "a", caret: 1 });
    recordEdit(history, "delete", snap("a"), { value: "", caret: 0 });

    expect(history.undo.map((entry) => entry.kind)).toEqual(["insert", "delete"]);
  });

  it("never merges a discrete step", () => {
    const history = createHistory();
    recordEdit(history, "step", snap(""), { value: "KEKW", caret: 4 });
    recordEdit(history, "step", snap("KEKW"), { value: "KEKW Pog", caret: 8 });

    expect(history.undo).toHaveLength(2);
  });

  it("undoes and redoes, and a new edit drops the redo steps", () => {
    const history = createHistory();
    recordEdit(history, "step", snap(""), { value: "a", caret: 1 });
    recordEdit(history, "step", snap("a"), { value: "ab", caret: 2 });

    const undone = stepHistory(history, "undo", snap("ab"), acceptAll);
    expect(undone?.value).toBe("a");
    const redone = stepHistory(history, "redo", snap("a"), acceptAll);
    expect(redone).toMatchObject({ value: "ab", selection: { start: 2, end: 2 } });

    stepHistory(history, "undo", snap("ab"), acceptAll);
    recordEdit(history, "step", snap("a"), { value: "ax", caret: 2 });
    expect(history.redo).toHaveLength(0);
  });

  it("returns null with nothing to move to, or when the target is refused", () => {
    const history = createHistory();
    expect(stepHistory(history, "undo", snap(""), acceptAll)).toBeNull();
    expect(stepHistory(history, "redo", snap(""), acceptAll)).toBeNull();

    recordEdit(history, "step", snap("long text"), { value: "", caret: 0 });
    expect(stepHistory(history, "undo", snap(""), () => false)).toBeNull();
    expect(history.undo).toHaveLength(1);
    expect(history.redo).toHaveLength(0);
  });

  it("forgets everything on reset and caps the stack", () => {
    const history = createHistory();
    for (let i = 0; i < HISTORY_LIMIT + 5; i += 1) {
      recordEdit(history, "step", snap(String(i)), { value: String(i + 1), caret: 1 });
    }
    expect(history.undo).toHaveLength(HISTORY_LIMIT);
    expect(history.undo[0].value).toBe("5");

    resetHistory(history);
    expect(history.undo).toHaveLength(0);
    expect(history.last).toBeNull();
  });
});
