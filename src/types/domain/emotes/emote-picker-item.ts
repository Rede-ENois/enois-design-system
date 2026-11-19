/** Uma figurinha pronta para desenhar na grade: o código é o que o texto recebe. */
export type EmotePickerItem = {
  code: string;
  /** Imagem já resolvida pelo app (miniatura do catálogo ou arquivo do pacote). */
  src?: string;
};
