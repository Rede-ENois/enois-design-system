import type { PapoPanelState } from "./papo-panel-state.js";
import type { PapoPublicacaoView } from "./papo-publicacao-view.js";

/** As publicações que falaram do assunto aberto: o recorte filtrado do Papo Reto, do lado de
 * dentro. Nula enquanto carrega; a lista vazia é um vazio honesto, não um erro. */
export type PapoPublicacoesProps = {
  subject: string;
  publicacoes: PapoPublicacaoView[] | null;
  estado: PapoPanelState;
  onRetry: () => void;
};
