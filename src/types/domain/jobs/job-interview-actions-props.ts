import type { JobInterviewSummary } from "./job-interview-summary.js";

/**
 * The interview row of an application: schedule when there is none, reschedule or cancel when
 * there is. The app owns the requests and the dialog; this row only reports the intent.
 */
export type JobInterviewActionsProps = {
  /** The interview already scheduled, or absent to offer scheduling. */
  interview?: JobInterviewSummary | null;
  onSchedule: () => void;
  onReschedule: () => void;
  onCancel: () => void;
  /** Shown when the last request failed, so the reader knows the row did not change. */
  error?: string | null;
  /** Draws the top rule that separates the row from the triage above it. */
  separated?: boolean;
};
