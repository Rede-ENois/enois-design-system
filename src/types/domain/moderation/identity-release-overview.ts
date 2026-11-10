import type { IdentityReleasePolicy } from "./identity-release-policy.js";
import type { IdentityReleaseRound } from "./identity-release-round.js";

/**
 * O painel da verificação de identidade: fila, consumo do ciclo e a última rodada. Só números
 * operacionais — nenhum documento, resultado biométrico ou dado da pessoa chega até aqui.
 */
export type IdentityReleaseOverview = {
  totalUsers: number;
  releasedUsers: number;
  inFlight: number;
  startedThisCycle: number;
  remainingCapacity: number;
  /** Consumo estimado do ciclo, já formatado em dólar. */
  estimatedSpentUsdLabel: string;
  budgetUsdLabel: string;
  monthlyLimit: number;
  policy: IdentityReleasePolicy;
  lastRound: IdentityReleaseRound | null;
  /** Sem provedor configurado a fila fica parada: a tela diz isso, não finge que roda. */
  providerAvailable: boolean;
};
