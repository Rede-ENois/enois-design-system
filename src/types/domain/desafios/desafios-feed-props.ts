import type { ReactNode } from "react";

import type { DesafioView } from "./desafio-view.js";
import type { DesafiosFeedState } from "./desafios-feed-state.js";

/**
 * A linha do tempo dos Desafios: cronológica, sem ranking — o desafio mais novo abre a lista e
 * todos os convites valem a mesma coisa. Estados de carga e vazio e o botão de carregar mais
 * são desenhados aqui; cada card é montado por quem usa, via `renderCard`.
 */
export type DesafiosFeedProps = {
  desafios: DesafioView[];
  state: DesafiosFeedState;
  hasMore: boolean;
  loadingMore: boolean;
  onLoadMore: () => void;
  renderCard: (desafio: DesafioView) => ReactNode;
};
