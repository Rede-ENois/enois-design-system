import type { WrappedRetrospectiva } from "./wrapped-retrospectiva.js";

/** O estado da retrospectiva na tela. Os `status` do backend sem resultado viram esses estados. */
export type WrappedEstado =
  | { kind: "loading" }
  | { kind: "ready"; retrospectiva: WrappedRetrospectiva }
  | { kind: "sem-dados" }
  | { kind: "nao-pronta" }
  | { kind: "fora-da-janela" }
  | { kind: "error"; message: string };
