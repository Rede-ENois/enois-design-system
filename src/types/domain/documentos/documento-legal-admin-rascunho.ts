export type DocumentoLegalAdminRascunho = {
  estado: "inicial" | "enviando" | "falhou" | "criado";
  /** A versão que o servidor deu ao rascunho (das 1 em diante). */
  versao: number | null;
};
