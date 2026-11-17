import type { MuraisEstado } from "./murais-estado.js";
import type { MuralResumo } from "./mural-resumo.js";

export type MuraisListaProps = {
  murais: MuralResumo[];
  state: MuraisEstado;
  /** Abre o mural (a navegação fica por conta de quem compõe). */
  onOpen: (muralId: string) => void;
  /** Há mais páginas no Explorar; sem isso o botão de carregar mais não existe. */
  hasMore: boolean;
  loadingMore: boolean;
  onLoadMore: () => void;
};
