/** Estado do feed de desafios: a lista desenha o que cada caso pede. */
export type DesafiosFeedState =
  { kind: "loading" } | { kind: "error" } | { kind: "empty" } | { kind: "ready" };
