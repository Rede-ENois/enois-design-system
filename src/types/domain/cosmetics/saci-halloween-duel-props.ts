import type { SaciHalloweenTeam } from "./saci-halloween-team.js";

export type SaciHalloweenDuelProps = {
  active: boolean;
  /** The duel has not opened yet (`active` is false before the start too). */
  upcoming?: boolean;
  counts: Record<SaciHalloweenTeam, number>;
  myChoice: SaciHalloweenTeam | null;
  /** Set after the duel closes; a tie closes with `null` and equal counts. */
  winner: SaciHalloweenTeam | null;
  /** The choice is being saved. */
  pending?: boolean;
  onChoose: (team: SaciHalloweenTeam) => void;
  className?: string;
};
