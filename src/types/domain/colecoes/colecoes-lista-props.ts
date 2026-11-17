import type { ColecaoResumo } from "./colecao-resumo.js";
import type { ColecoesEstado } from "./colecoes-estado.js";

export type ColecoesListaProps = {
  colecoes: ColecaoResumo[];
  state: ColecoesEstado;
  /** Abre a coleção (a navegação fica por conta de quem compõe). */
  onOpen: (colecaoId: string) => void;
  /** Há mais pastas salvas; sem isso o botão de carregar mais não existe. */
  hasMore: boolean;
  loadingMore: boolean;
  onLoadMore: () => void;
};
