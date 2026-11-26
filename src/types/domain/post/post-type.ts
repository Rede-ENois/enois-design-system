export type PostType =
  | "INSIGHT"
  | "ARTICLE"
  | "QUESTION"
  | "PROJECT"
  | "OPPORTUNITY"
  | "PAGE"
  | "NEWS"
  | "TUTORIAL"
  | "REVIEW"
  | "BUSINESS"
  | "DIVERTIDO"
  | "MOMENT"
  /** Instante: efêmero curto — some sozinho em 1 hora da publicação. */
  | "INSTANTE"
  /** Ponteiro de um post de blog: o conteúdo mora em /blog/{username}. */
  | "BLOG"
  /** Ponteiro de uma vitrine: o conteúdo mora em /portfolio/{username}. */
  | "PORTFOLIO"
  /** Enquete: título no content e alternativas/votos guardados no app (slot `poll` do card). */
  | "POLL"
  /** Reclamação: desabafo/denúncia de problema — pedido do painel de suporte (pedido #sup). */
  | "COMPLAINT";
