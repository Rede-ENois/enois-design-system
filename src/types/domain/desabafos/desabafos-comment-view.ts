import type { AuthorNameStyle } from "../name/author-name-style.js";

/** Uma acolhida num desabafo: texto puro, com o autor para o nome estilizado. */
export type DesabafosCommentView = {
  id: string;
  authorName: string | null;
  authorAvatar: string | null;
  authorStyle: AuthorNameStyle | null;
  content: string;
  /** Quem vê é quem escreveu: a view mostra o gesto de remover a própria. */
  isMine: boolean;
};
