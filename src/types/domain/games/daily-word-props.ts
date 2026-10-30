import type { DailyRankingSource } from "./daily-ranking-source.js";
import type { DailyShareStatus } from "./daily-share-status.js";
import type { UserWordStats } from "./user-word-stats.js";
import type { WordRankingItem } from "./word-ranking-item.js";
import type { WordState } from "./word-state.js";

export type DailyWordProps = {
  /** O desafio de hoje ainda está carregando / falhou. */
  loading: boolean;
  loadError: boolean;
  onRetryLoad: () => void;
  /** Há desafio de ontem em andamento (ou ele está aberto): mostra a troca. */
  canTogglePrevious: boolean;
  showPrevious: boolean;
  onTogglePrevious: () => void;
  /** O desafio exibido (hoje ou ontem). */
  state?: WordState;
  onStart: () => void;
  startPending: boolean;
  startError: boolean;
  /** Letras digitadas na linha atual. */
  draft: string;
  shakeRow: number | null;
  lastConfirmedRow: number | null;
  localError: string | null;
  guessPending: boolean;
  /** Tecla do teclado virtual ou físico ("ENTER", "⌫" ou letra A-Z). */
  onKey: (key: string) => void;
  stats: UserWordStats;
  statsOpen: boolean;
  onStatsOpenChange: (open: boolean) => void;
  onShare: () => void;
  /** Outcome of the last share, read out politely next to the button. */
  shareStatus?: DailyShareStatus;
  ranking: DailyRankingSource<WordRankingItem>;
};
