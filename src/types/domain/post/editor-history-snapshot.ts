import type { MentionUser } from "./mention-user.js";
import type { TextSelection } from "./text-selection.js";

/** The state of the field that undo and redo put back: text, selection and the mentioned people. */
export type EditorHistorySnapshot = {
  value: string;
  selection: TextSelection;
  mentions: Pick<MentionUser, "id" | "username">[];
};
