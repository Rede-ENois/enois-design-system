import type { RoleplayCampaignData } from "./roleplay-campaign-data.js";

/** What the campaign page header reads; the join action lives with the app. */
export type RoleplayCampaignHeaderProps = {
  campaign: RoleplayCampaignData;
  /** The rules-system presentation the table picked (label from the app's catalog). */
  systemLabel: string;
  /** Viewer is not a member and the campaign accepts joining; the app opens the join flow. */
  canJoin?: boolean;
  joining?: boolean;
  onJoin?: () => void;
};
