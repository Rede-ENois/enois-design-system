import type { AuthorNameStyle } from "../name/author-name-style.js";

/** Um comentário na foto aberta: texto e/ou UMA foto, com o autor para o nome estilizado. */
export type ColagemCommentView = {
  id: string;
  authorName: string | null;
  authorAvatar: string | null;
  authorStyle: AuthorNameStyle | null;
  content: string | null;
  mediaUrl: string | null;
  mediaSpoiler: boolean;
  /** Quem vê é o autor: a view mostra o gesto de remover o próprio comentário. */
  isMine: boolean;
};
