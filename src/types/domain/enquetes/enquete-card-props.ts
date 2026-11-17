import type { EnqueteView } from "./enquete-view.js";

export type EnqueteCardProps = {
  enquete: EnqueteView;
  /** Um voto está em trânsito: botões desabilitados e rótulo de registrando. */
  pendente: boolean;
  /** Escolha única: dispara no clique na alternativa. */
  onVotar: (posicao: number) => void;
  /** Múltipla escolha: dispara no "Confirmar voto" com as posições marcadas. */
  onVotarMultiplo: (posicoes: number[]) => void;
};
