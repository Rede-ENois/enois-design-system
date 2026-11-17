/** Um evento do diário de atividade do perfil, já filtrado pelo backend conforme quem lê. */
export type DiarioEvento = {
  tipo: "PUBLICACAO" | "COMENTARIO" | "REPOST";
  /** Momento do evento em ISO; a linha do tempo agrupa por dia no fuso de quem lê. */
  quando: string;
  /** Post que o clique abre: o próprio, em publicação; o original, em comentário e repost. */
  postId: string;
  /** Excerto do conteúdo do próprio evento (ou do original, no repost). */
  trecho: string | null;
  /** Post original por trás de comentário e repost; null em publicação. */
  contexto: {
    autorNome: string | null;
    autorUsername: string | null;
    trecho: string | null;
  } | null;
};
