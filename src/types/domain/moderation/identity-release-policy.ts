/** As regras da rodada de liberação, como a administração vê e edita. */
export type IdentityReleasePolicy = {
  usersPerRound: number;
  intervalMinutes: number;
  minReputation: number;
  reservedQuotaPercent: number;
  maxSimultaneous: number;
  paused: boolean;
  /** Próxima rodada automática; nulo quando ainda não agendada. */
  nextRoundAtLabel: string | null;
};
