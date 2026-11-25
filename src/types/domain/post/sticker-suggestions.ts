import type { RefObject } from "react";

import type { ComposerStickerSuggestionsProps } from "../emotes/composer-sticker-suggestions-props.js";

import type { StickerQueryState } from "./sticker-query-state.js";

/**
 * Autocomplete de figurinhas do campo: o dono do campo busca e desenha o menu, o campo lê o
 * `:palavra` sob o cursor e manda as teclas (setas, Enter/Tab, Esc) para o menu escolhido.
 */
export type StickerSuggestions = {
  /** Dá o `state` quando o `:palavra` está sob o cursor e `null` quando não está. */
  resolve: (texto: string, cursor: number) => StickerQueryState | null;
  /** Como desenhar o menu; `null` esconde. Recebe o `anchor` do campo para se posicionar. */
  render: (anchor: RefObject<HTMLElement | null>) => ComposerStickerSuggestionsProps | null;
  /** Trata a tecla com o menu aberto: `true` quando o campo não deve fazer mais nada com ela. */
  onKeyDown?: (evento: KeyboardEvent) => boolean;
};
