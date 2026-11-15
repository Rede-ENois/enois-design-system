import type { RoleplayWorldEntryView } from "./roleplay-world-view.js";

/** The campaign atlas: everyone writes their own entries, the master in anything. */
export type RoleplayWorldPanelProps = {
  entries: RoleplayWorldEntryView[];
  loading?: boolean;
  /** Filter is a server read; the view only reports the chosen kind. */
  kind?: "LOCALE" | "CHARACTER" | "ITEM" | "PLOT" | "LORE" | null;
  onKindChange?: (kind: "LOCALE" | "CHARACTER" | "ITEM" | "PLOT" | "LORE" | null) => void;
  onSaveEntry: (
    values: { kind: string; title: string; body: string | null; tags: string[] },
    entry: RoleplayWorldEntryView | null,
  ) => void;
  onDeleteEntry: (entry: RoleplayWorldEntryView) => void;
  savingEntry?: boolean;
};
