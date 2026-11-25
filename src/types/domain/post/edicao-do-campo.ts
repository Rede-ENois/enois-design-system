import type { StickerQueryState } from "./sticker-query-state.js";

/** Uma edição pendente do campo, feita por fora do render (a ref do campo a solta no layout). */
export type EdicaoDoCampo =
  | { tipo: "inserir"; texto: string }
  | { tipo: "substituirTermo"; codigo: string; termo: StickerQueryState }
  | { tipo: "focar" };
