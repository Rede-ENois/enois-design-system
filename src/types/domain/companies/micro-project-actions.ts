export type MicroProjectActions = {
  onPropose: (id: string) => void;
  onShowProposals: (id: string) => void;
  onComplete: (id: string) => void;
  signInHref: string;
  professionalSetupHref: string;
  /** The project whose action is on its way: its buttons are locked. */
  busyId: string | null;
};
