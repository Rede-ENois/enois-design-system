import type { ModeratorWorkspaceTab } from "./moderator-workspace-tab.js";

export type ModeratorWorkspaceGroup = {
  id: string;
  label: string;
  tabs: ModeratorWorkspaceTab[];
};
