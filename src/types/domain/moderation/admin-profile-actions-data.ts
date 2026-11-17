/** The account the direct administrative actions are about, as the confirmation shows it. */
export type AdminProfileActionsData = {
  /** "@" without the sign, used on the wires and in the labels. */
  username: string;
  /** Name shown on screen when it differs from the "@". */
  displayName?: string | null;
  /** Direct warnings still in force, for the hint under the reason field. */
  activeWarnings: number;
};
