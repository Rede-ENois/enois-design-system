/** Estado da linha do tempo do Confessionário: a lista desenha o que cada caso pede. */
export type ConfessionarioFeedState =
  { kind: "loading" } | { kind: "error" } | { kind: "empty" } | { kind: "ready" };
