/** Estado da lista de coleções (ou dos posts guardados) que a página está mostrando. */
export type ColecoesEstado = { kind: "loading" | "error" | "empty" | "ready" };
