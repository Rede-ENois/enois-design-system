/** Um comentário numa confissão: texto puro, SEM autor — o anonimato vale para comentário também. */
export type ConfessionarioCommentView = {
  id: string;
  content: string;
  /** Quem vê é quem escreveu: a view mostra o gesto de remover o próprio. */
  isMine: boolean;
};
