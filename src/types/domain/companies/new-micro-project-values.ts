export type NewMicroProjectValues = {
  title: string;
  problem: string;
  scope: string | null;
  /** One item per line of the field, trimmed, empty lines dropped. */
  deliverables: string[];
  acceptance: string[];
  budget: string | null;
  /** ISO date (yyyy-mm-dd). */
  deadline: string | null;
};
