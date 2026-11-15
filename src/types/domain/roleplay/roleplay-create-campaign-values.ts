/** What the create form sends up: the system id plus the family the app resolved from its catalog. */
export type RoleplayCreateCampaignValues = {
  name: string;
  description: string | null;
  setting: string | null;
  gameSystem: string;
  systemFamily: string | null;
  visibility: "PUBLIC" | "PRIVATE";
};
