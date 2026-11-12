/** One saved set ("kit") of the badge history, most recent first. */
export type BadgeKit = {
  id: string;
  /** The badge addresses that were on the profile, in their order. */
  badges: string[];
  /** Pre-formatted save date, ready to show. */
  createdAtLabel: string;
};
