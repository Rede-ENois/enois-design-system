import type { RoleplayCampaignHeaderProps } from "./roleplay-campaign-header-props.js";
import type { RoleplayChatPanelProps } from "./roleplay-chat-panel-props.js";
import type { RoleplayDicePanelProps } from "./roleplay-dice-panel-props.js";
import type { RoleplaySheetPanelProps } from "./roleplay-sheet-panel-props.js";
import type { RoleplayTablesPanelProps } from "./roleplay-tables-panel-props.js";
import type { RoleplayWorldPanelProps } from "./roleplay-world-panel-props.js";

/** Everything the campaign page shows, wired panel by panel; the app owns routing and data. */
export type RoleplayCampaignPageProps = {
  header: RoleplayCampaignHeaderProps;
  /** Only rendered when the viewer is in the campaign. */
  panels?: {
    tables: RoleplayTablesPanelProps;
    sheet: RoleplaySheetPanelProps;
    dice: RoleplayDicePanelProps;
    chat: RoleplayChatPanelProps;
    world: RoleplayWorldPanelProps;
  };
  /** Shown to a non-member instead of the panels. */
  memberOnlyMessage?: string;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
};
