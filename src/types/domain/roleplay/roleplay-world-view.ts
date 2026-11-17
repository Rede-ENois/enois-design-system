/** One atlas entry; the linked sheet only ever surfaces as a name, never an id. */
export type RoleplayWorldEntryView = {
  id: string;
  kind: "LOCALE" | "CHARACTER" | "ITEM" | "PLOT" | "LORE";
  title: string;
  body: string | null;
  tags: string[];
  linkedSheetName: string | null;
  /** The viewer may edit this entry (their own text, or the master in anything). */
  canEdit: boolean;
};
