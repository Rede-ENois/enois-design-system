import type { ProfileContentTab } from "./profile-content-tab.js";

export type ProfileContentTabsProps = {
  /** Currently active tab. */
  activeTab: ProfileContentTab;
  /** Called when the user selects a different tab. */
  onTabChange: (tab: ProfileContentTab) => void;
  /** Whether the viewer owns this profile. When false, REPLIES shows a lock icon and is disabled. */
  isOwner: boolean;
};
