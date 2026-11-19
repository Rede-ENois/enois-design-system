export type PanicModeSectionProps = {
  active: boolean;
  /** Panic mode is forced by the environment: the toggle is disabled. */
  envLocked: boolean;
  loading?: boolean;
  /** The toggle is being saved. */
  pending?: boolean;
  /** Called after the confirmation dialog. */
  onActivate: () => void;
  onDeactivate: () => void;
};
