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
  /** Ponteiro de um post de blog: o conteúdo mora em /blog/{username}. */
  | "BLOG"
  /** Enquete: título no content e alternativas/votos guardados no app (slot `poll` do card). */
  | "POLL";
