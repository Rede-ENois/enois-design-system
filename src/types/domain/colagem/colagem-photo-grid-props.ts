import type { ColagemGridState } from "./colagem-grid-state.js";
import type { ColagemPhotoSummary } from "./colagem-photo-summary.js";

export type ColagemPhotoGridProps = {
  photos: ColagemPhotoSummary[];
  state: ColagemGridState;
  /** Abre o detalhe da foto (o diálogo fica por conta de quem compõe). */
  onOpen: (photoId: string) => void;
  /** Há mais páginas no mural; sem isso o botão de carregar mais não existe. */
  hasMore: boolean;
  loadingMore: boolean;
  onLoadMore: () => void;
};
