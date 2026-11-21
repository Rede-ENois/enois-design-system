/**
 * The "also publish in the professional feed" offer under the composer, for a personal account
 * that has an active professional profile. Only the check state and the copy come here; whether
 * the chosen type can be cross-posted is decided by the app (`canCrossPost`).
 */
export type ComposerCrossPostProps = {
  /** Unticked by default: the container decides the initial state and remembers the choice. */
  checked: boolean;
  onChange: (checked: boolean) => void;
  /** Why the type cannot be cross-posted right now (shown instead of the offer). */
  unavailableReason?: string | null;
  /** Why the publish failed (e.g. no active professional profile), shown under the offer. */
  error?: string | null;
};
