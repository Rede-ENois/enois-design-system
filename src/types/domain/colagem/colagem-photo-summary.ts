/**
 * Uma foto da Colagem no tamanho da grade: o que o ladrilho desenha sem abrir o detalhe.
 * Os campos são o piso comum entre a grade e o diálogo; quem abre o detalhe usa `ColagemPhotoDetail`.
 */
export type ColagemPhotoSummary = {
  id: string;
  mediaUrl: string;
  description: string | null;
  /** Sensível nasce velado na grade; revelar é gesto de quem vê, na view. */
  mediaSpoiler: boolean;
  authorName: string | null;
  reactions: number;
  comments: number;
};
