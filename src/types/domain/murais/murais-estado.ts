/** Estado da lista de murais (ou das contribuições) que a página está mostrando. */
export type MuraisEstado = { kind: "loading" | "error" | "empty" | "ready" };
