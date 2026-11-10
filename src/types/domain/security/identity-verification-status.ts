import type { IdentityVerificationState } from "./identity-verification-state.js";

export type IdentityVerificationStatus = {
  state?: IdentityVerificationState | null;
  verified?: boolean;
  provider?: string | null;
  providerAvailable?: boolean;
  /** A vez da pessoa chegou: o convite da rodada de liberação progressiva. */
  released?: boolean;
  /** Resumo do backend: `UNAVAILABLE`, `WAITING` ou `RELEASED`. */
  releaseStatus?: string | null;
};
