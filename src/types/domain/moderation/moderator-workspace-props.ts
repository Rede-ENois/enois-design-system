import type { ReactNode } from "react";

import type { ModeratorWorkspaceGroup } from "./moderator-workspace-group.js";

export type ModeratorWorkspaceProps = {
  groups: ModeratorWorkspaceGroup[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  children: ReactNode;
};
