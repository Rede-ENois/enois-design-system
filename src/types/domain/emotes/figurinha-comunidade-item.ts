/** Uma figurinha pronta para o cartão do catálogo: imagem pública, código e quem enviou. */
export type FigurinhaComunidadeItem = {
  id: string;
  /** Código como entra no texto, com os dois-pontos (`:nomedacomunidade:`). */
  codigo: string;
  nome: string;
  imagem: string;
  autor: string;
  /** Usar no texto (quem oferece a ação decide quando ela existe). */
  onUsar?: () => void;
  onDenunciar?: () => void;
  onRemover?: () => void;
};
