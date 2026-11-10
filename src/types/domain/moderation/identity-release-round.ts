import type { IdentityReleaseRoundState } from "./identity-release-round-state.js";

/** Uma rodada já executada: o registro que a auditoria lê. */
export type IdentityReleaseRound = {
  id: string;
  executedAtLabel: string;
  eligibleCount: number;
  releasedCount: number;
  minReputation: number;
  rankStart: number;
  rankEnd: number;
  state: IdentityReleaseRoundState;
  reservedCapacityUsed: number;
  /** Por que a rodada parou, quando não liberou ninguém. */
  note: string | null;
};
