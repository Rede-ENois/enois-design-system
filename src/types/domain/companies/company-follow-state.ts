export type CompanyFollowState = {
  following: boolean;
  /** The toggle is on its way: the button is locked. */
  pending: boolean;
  onToggle: () => void;
};
