/** What a table reads: the server holds the scene and the turn, the view only shows it. */
export type RoleplayTableView = {
  id: string;
  name: string;
  /** Shown when the table has an Épapo call open; the app owns joining it. */
  voiceOpen: boolean;
  scene: string | null;
  /** Labels in turn order, resolved by the app from its member list. */
  turnOrder: string[];
  /** Label of who holds the turn now; null when nobody does. */
  activeTurn: string | null;
  /** The viewer holds the turn and may pass it. */
  canAdvanceTurn: boolean;
};
