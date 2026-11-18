import type { TermometroJanelaPainel } from "./termometro-janela-painel.js";
import type { TermometroPanelState } from "./termometro-panel-state.js";
import type { TermometroPeriodo } from "./termometro-periodo.js";

/** A seleção do painel: as janelas, o estado de carregamento e a janela mostrada agora.
 *
 * Quem usa controla a troca de período e o retry (sem estado interno escondido); o componente
 * só desenha o que a janela traz — e nunca inventa dado que o backend não mandou.
 */
export type TermometroPanelProps = {
  janelas: TermometroJanelaPainel[] | null;
  estado: TermometroPanelState;
  /** A janela selecionada; `onPeriodoChange` troca sem recarregar o mundo. */
  periodo: TermometroPeriodo;
  onPeriodoChange: (periodo: TermometroPeriodo) => void;
  onRetry: () => void;
};
