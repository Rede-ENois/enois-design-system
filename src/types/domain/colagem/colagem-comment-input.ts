/**
 * O que a linha de contribuição entrega: texto e/ou foto (o mediaId o app já segura) e, numa
 * resposta, o comentário pai. Foto em resposta a foto o backend recusa — a view nem oferece.
 */
export type ColagemCommentInput = {
  parentCommentId?: string;
  content?: string;
  mediaId?: string;
};
