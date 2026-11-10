import type { ReactNode } from "react";

export type AuthenticatedAppHeaderProps = {
  /** Where the brand navigates. */
  homeHref: string;
  /** Opens the mobile navigation drawer. */
  onOpenNavigation: () => void;
  /** Something new behind the menu (a place off the dock has news): a dot on the menu button. */
  navigationHasNews?: boolean;
  /** Search slot (global search). */
  search: ReactNode;
  /** Right-side actions (theme toggle, notifications, account menu). */
  actions: ReactNode;
};
