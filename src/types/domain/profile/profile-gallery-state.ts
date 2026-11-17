/** De onde vem a galeria do perfil: carregando, sem fotos, ou pronta com as fotos na mão. */
export type ProfileGalleryState = {
  kind: "loading" | "error" | "empty" | "ready";
};
