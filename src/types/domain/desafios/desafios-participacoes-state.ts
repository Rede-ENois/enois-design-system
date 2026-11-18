/** Estado do mural de participações de um desafio: carregando, falhou, vazio ou no ar. */
export type DesafiosParticipacoesState =
  { kind: "loading" } | { kind: "error" } | { kind: "empty" } | { kind: "ready" };
