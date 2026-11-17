import type { ProfileGalleryState } from "./profile-gallery-state.js";
import type { ProfilePhoto } from "./profile-photo.js";

/**
 * A tira de fotos do perfil: o desenho das fotos e dos estados, com o botão de carregar mais
 * quando a pessoa ainda tem fotos em páginas que não chegaram.
 */
export type ProfilePhotoCarouselProps = {
  photos: ProfilePhoto[];
  state: ProfileGalleryState;
  hasMore: boolean;
  loadingMore: boolean;
  onLoadMore: () => void;
};
