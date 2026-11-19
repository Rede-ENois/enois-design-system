import type { ReactNode } from "react";

/** Two stacked slots of the admin block on a community/group page: destructive actions, then members. */
export type AdminEntityPanelProps = {
  actions: ReactNode;
  members: ReactNode;
  /**
   * True while the member list is closed: the panel then shows this button to open it. False when
   * the list is already rendered, so the caller does not draw its own button.
   */
  membersCollapsed: boolean;
  membersLabel: string;
  onOpenMembers: () => void;
};
