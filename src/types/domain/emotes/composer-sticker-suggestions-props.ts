import type { RefObject } from "react";

import type { ComposerStickerSuggestion } from "./composer-sticker-suggestion.js";

export type ComposerStickerSuggestionsProps = {
  /** Id do `listbox`, referenciado pelo `aria-controls`/`aria-activedescendant` do campo. */
  id: string;
  opcoes: ComposerStickerSuggestion[];
  destaque: number;
  /** Id do item em destaque, para o `aria-activedescendant` do campo. */
  destaqueId?: string;
  carregando?: boolean;
  loadingLabel: string;
  listLabel: string;
  onEscolher: (codigo: string) => void;
  onDestacar: (indice: number) => void;
  /** Elemento ao qual o menu se ancora (o campo de escrita). */
  anchor: RefObject<HTMLElement | null>;
};
