import type { InlineFormat } from "./inline-format.js";

/** Marcacao de um formato que cerca o trecho: onde ela comeca e acaba, com os marcadores. */
export interface Wrap {
  start: number;
  end: number;
  kind: InlineFormat;
  marker: string;
}
