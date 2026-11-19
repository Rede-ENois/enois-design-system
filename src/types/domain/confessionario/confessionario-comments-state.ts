/** Estado do carregamento dos comentários da confissão aberta. */
export type ConfessionarioCommentsState =
  { kind: "loading" } | { kind: "error" } | { kind: "ready" };
