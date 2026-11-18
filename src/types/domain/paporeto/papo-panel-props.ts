import type { PapoIntervaloView } from "./papo-intervalo-view.js";
import type { PapoJanela } from "./papo-janela.js";
import type { PapoPanelState } from "./papo-panel-state.js";
import type { PapoStatus } from "./papo-status.js";
import type { PapoSubjectView } from "./papo-subject-view.js";

/** O que o painel do Papo Reto recebe: os assuntos agregados do escopo e a contagem de falas
 * da última janela. Nada aqui identifica ninguém — o tipo nem teria campo para isso. */
export type PapoPanelProps = {
  assuntos: PapoSubjectView[] | null;
  estado: PapoPanelState;
  /** Quantas falas a última janela de corte analisou (a honestidade da amostra em número). */
  falasAnalisadas: number | null;
  /** O filtro de trajetória; nulo é "todos". */
  filtro: PapoStatus | null;
  onFiltroChange: (filtro: PapoStatus | null) => void;
  /** O subject aberto; `onSubjectChange` abre e fecha a timeline sem recarregar o mundo. */
  subjectAberto: string | null;
  onSubjectChange: (subject: string | null) => void;
  /** A timeline do subject aberto, já na janela escolhida; nula enquanto não carrega. */
  timeline: PapoIntervaloView[] | null;
  janela: PapoJanela;
  onJanelaChange: (janela: PapoJanela) => void;
  onRetry: () => void;
};
