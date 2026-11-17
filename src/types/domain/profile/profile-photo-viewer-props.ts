import type { ProfilePhoto } from "./profile-photo.js";

/**
 * O visualizador das fotos do perfil: a foto aberta com zoom e a navegação entre as fotos da
 * galeria. `index` é `null` com o visualizador fechado; abrir é dizer qual foto mostrar.
 */
export type ProfilePhotoViewerProps = {
  photos: ProfilePhoto[];
  index: number | null;
  onIndexChange: (index: number | null) => void;
};
