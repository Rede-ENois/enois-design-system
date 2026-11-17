export type DiarioMessages = {
  diario: {
    publicacao: string;
    comentario: string;
    repost: string;
    vazio: string;
    carregarMais: string;
    carregandoMais: string;
    /** Linha de contexto do post original por trás de comentário e repost. */
    contextoDe: (autorNome: string) => string;
  };
};
