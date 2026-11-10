import type { IdentityReleaseOverview } from "./identity-release-overview.js";
import type { IdentityReleasePolicy } from "./identity-release-policy.js";
import type { IdentityReleaseRound } from "./identity-release-round.js";

export type IdentityReleaseSectionProps = {
  overview?: IdentityReleaseOverview;
  loading?: boolean;
  error?: boolean;
  onRefresh: () => void;
  refreshPending?: boolean;
  /** Roda uma rodada agora; idempotente — repetir não entrega convite repetido. */
  onRunRound: () => void;
  runPending?: boolean;
  /** Salva as regras da rodada. O que não veio fica como está. */
  onSavePolicy: (next: Partial<IdentityReleasePolicy>) => void;
  savePending?: boolean;
  rounds: IdentityReleaseRound[];
};
