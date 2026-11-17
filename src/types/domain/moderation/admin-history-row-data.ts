/** One line of an account's administrative history: a direct warning or a sanction. */
export type AdminHistoryRowData = {
  id: string;
  /** "WARNING" for a direct warning, "SANCTION" for a punishment. */
  kind: "WARNING" | "SANCTION";
  /** Already localized label (e.g. "Advertência", "Banimento permanente"). */
  typeLabel: string;
  reason: string;
  active: boolean;
  createdAtLabel: string;
  /** Suspensions: when it becomes a permanent ban. */
  dueAtLabel?: string | null;
};
