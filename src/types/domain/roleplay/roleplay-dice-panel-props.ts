import type { RoleplayRollView } from "./roleplay-roll-view.js";

/** Dice: the server rolls and keeps the immutable ledger; the view sends the expression only. */
export type RoleplayDicePanelProps = {
  rolls: RoleplayRollView[];
  loading?: boolean;
  rolling?: boolean;
  onRoll: (expression: string, label: string | null) => void;
};
