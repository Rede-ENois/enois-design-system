/** Uma acolhida num desabafo: texto puro, SEM autor — o anonimato vale para comentário também. */
export type DesabafosCommentView = {
  id: string;
  content: string;
  /** Quem vê é quem escreveu: a view mostra o gesto de remover a própria. */
  isMine: boolean;
};
