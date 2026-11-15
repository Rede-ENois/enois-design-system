/** A roll the master asked a player for; the player answers by rolling, not by typing a total. */
export type RoleplayRollRequestView = {
  id: string;
  expression: string;
  label: string | null;
  reason: string | null;
  pending: boolean;
};
