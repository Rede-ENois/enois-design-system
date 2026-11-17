import type { RoleplayTableView } from "./roleplay-table-view.js";

/** Tables of the campaign: the master opens them, everyone sees scene and turn. */
export type RoleplayTablesPanelProps = {
  tables: RoleplayTableView[];
  loading?: boolean;
  /** The viewer may open new tables (the master). */
  canCreateTable?: boolean;
  onCreateTable?: (name: string) => void;
  creatingTable?: boolean;
  onJoinVoice: (table: RoleplayTableView) => void;
  joiningVoiceId?: string | null;
  /** Master-only scene editing; a viewer sees the scene read-only. */
  canEditScene?: boolean;
  onSaveScene: (table: RoleplayTableView, scene: string) => void;
  onAdvanceTurn: (table: RoleplayTableView) => void;
};
