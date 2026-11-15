/** What the campaign directory and the campaign header read. Shaped like the API campaign so the front can pass it directly. */
export type RoleplayCampaignData = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  /** Public presentation of the rules system the table picked (name, family). */
  gameSystem: string;
  systemFamily: string;
  visibility: "PUBLIC" | "PRIVATE";
  status: "ACTIVE" | "ARCHIVED";
  members: number;
  /** The viewer's role; null when they are not in the campaign. */
  viewerRole: "GAME_MASTER" | "PLAYER" | null;
  joined: boolean;
};
