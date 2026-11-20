/** Transfer feedback supplied by the caller, not a moderation decision. */
export type ComposerMediaTransport =
  | {
      phase: "sending";
      /** Measured remaining bytes for this file, when available. */
      bytesRemaining?: number;
      onCancel?: () => void;
    }
  /** The caller has confirmed transfer completion but has no final response yet. */
  | { phase: "awaiting-response" }
  /** A technical failure, not a refusal under the content policy. */
  | { phase: "failed"; onRetry?: () => void };
