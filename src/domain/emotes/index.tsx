import { Smile } from "lucide-react";

export {
  composerSuggestionsAria,
  ComposerStickerSuggestions,
} from "./composer-sticker-suggestions.js";
export type { ComposerStickerSuggestion } from "../../types/domain/emotes/composer-sticker-suggestion.js";
export type { ComposerStickerSuggestionsProps } from "../../types/domain/emotes/composer-sticker-suggestions-props.js";
export type { FigurinhaComunidadeCatalogoProps } from "../../types/domain/emotes/figurinha-comunidade-catalogo-props.js";
export type { FigurinhaComunidadeEnvioProps } from "../../types/domain/emotes/figurinha-comunidade-envio-props.js";
export type { FigurinhaComunidadeItem } from "../../types/domain/emotes/figurinha-comunidade-item.js";
export { EmoteCell, EmotePageButton } from "./emote-cell.js";
export { EmotePickerDialogView, EmotePickerTriggerButton } from "./emote-picker-dialog-view.js";
export { FigurinhaComunidadeCatalogo } from "./figurinha-comunidade-catalogo.js";
export { FigurinhaComunidadeEnvio } from "./figurinha-comunidade-envio.js";
export {
  FigurinhaComunidadeCard,
  FigurinhaComunidadeGrid,
  FigurinhaComunidadePagination,
  FigurinhaComunidadeRow,
} from "./figurinha-comunidade-view.js";

/** Ícone do botão que abre o seletor (o botão é o `EmotePickerTriggerButton`). */
export function EmotePickerIcon() {
  return <Smile className="h-3.5 w-3.5" />;
}
