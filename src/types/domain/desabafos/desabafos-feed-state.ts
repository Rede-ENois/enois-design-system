/** Estado da linha do tempo dos Desabafos: a lista desenha o que cada caso pede. */
export type DesabafosFeedState =
  { kind: "loading" } | { kind: "error" } | { kind: "empty" } | { kind: "ready" };
