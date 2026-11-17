import type { ContinueWritingDraft } from "./continue-writing-draft.js";

/**
 * "Continue writing": the author's article drafts kept server-side (a list — writing more than
 * one text must not lose any). The app owns the data and the routes; the view draws the list and
 * builds each resume link from the app-provided href builder.
 */
export type ContinueWritingProps = {
  /** Article drafts of the current person, most recent first. The view renders nothing when empty. */
  drafts: ContinueWritingDraft[];
  /** The in-app href that opens the given draft in the editor. */
  resumeHref: (draftId: string) => string;
  /** Discard the given draft from the list. */
  onDiscard: (draftId: string) => void;
  /** True while a discard request is in flight (buttons disable). */
  discardPending?: boolean;
};
