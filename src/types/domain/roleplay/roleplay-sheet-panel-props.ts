import type { RoleplaySheetCard } from "./roleplay-sheet-card.js";
import type { RoleplaySheetDerived } from "./roleplay-sheet-derived.js";
import type { RoleplaySheetField } from "./roleplay-sheet-field.js";

/** The viewer's own sheet: fill what the template asks, publish only what the server allows. */
export type RoleplaySheetPanelProps = {
  templateFields: RoleplaySheetField[];
  sheet: {
    name: string;
    values: Record<string, string>;
    derived: RoleplaySheetDerived[];
  } | null;
  /** Others' sheets as the server cut them (master sees all, player sees what was opened). */
  board: RoleplaySheetCard[];
  loading?: boolean;
  saving?: boolean;
  onSave: (name: string, values: Record<string, string>) => void;
  onPublish: (sheet: RoleplaySheetCard) => void;
  onUnpublish: (sheet: RoleplaySheetCard) => void;
};
