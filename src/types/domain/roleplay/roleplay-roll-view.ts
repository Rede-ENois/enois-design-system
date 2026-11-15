/** One line of the roll ledger: the server rolled, the view only reports it. */
export type RoleplayRollView = {
  id: string;
  expression: string;
  dice: number[];
  total: number;
  label: string | null;
};
