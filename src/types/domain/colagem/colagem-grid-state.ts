/** Estado do carregamento do mural: a grade desenha o que cada caso pede (feito nos textos do DS). */
export type ColagemGridState =
  { kind: "loading" } | { kind: "error" } | { kind: "empty" } | { kind: "ready" };
