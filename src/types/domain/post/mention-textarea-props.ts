import type { ComponentPropsWithoutRef, ReactNode, Ref } from "react";

import type { EditorSticker } from "./editor-sticker.js";
import type { MentionTextareaHandle } from "./mention-textarea-handle.js";
import type { MentionUser } from "./mention-user.js";
import type { StickerQueryState } from "./sticker-query-state.js";
import type { StickerSuggestions } from "./sticker-suggestions.js";

export type MentionTextareaProps = Pick<
  ComponentPropsWithoutRef<"textarea">,
  "placeholder" | "className" | "maxLength" | "rows"
> & {
  value: string;
  onChange: (value: string, mentionedUserIds: string[]) => void;
  /** Exibe o contador interno quando há maxLength; padrão: true. */
  showCounter?: boolean;
  /** Mostra a barra de formatacao (negrito, lista, citacao...) acima do campo. */
  toolbar?: boolean;
  /**
   * Draws the formatting bar; default true. A compact composer hides it until asked: the
   * shortcuts (Ctrl+B, Ctrl+I...) keep working while it is hidden.
   */
  toolbarVisible?: boolean;
  /**
   * Recolhe a barra de formatação atrás de um botão de três pontos no canto superior direito,
   * em vez de gastar uma linha acima do campo. A seleção do texto continua valendo com o menu
   * aberto.
   */
  toolbarMenu?: boolean;
  /**
   * Botões do dono do campo que entram no fim da barra de formatação (o seletor de figurinhas, por
   * exemplo). Só aparecem com a barra visível.
   */
  toolbarActions?: ReactNode;
  /**
   * Botões no fim do campo, abaixo do texto (o seletor de figurinhas da barra compacta, que não tem
   * a linha de cima). Recebem o mesmo tratamento de foco do resto do campo.
   */
  trailingButtons?: ReactNode;
  /** Imagens coladas no campo (Ctrl+V): o dono do campo decide subir e anexar. */
  onPasteImages?: (files: File[]) => void;
  /** Ctrl+Enter (Cmd+Enter no Mac): o dono do campo decide o que é "enviar". Sem ela, não há atalho. */
  onSubmitShortcut?: () => void;
  /** Users matching the current @mention term (the app searches from two characters on). */
  mentionResults: MentionUser[];
  /**
   * Stickers by code. A whitespace-delimited word equal to a code is drawn as an inline image that
   * the caret skips and Backspace/Delete remove whole; the value and `onChange` keep the plain code.
   * Without it the field shows text only.
   */
  stickers?: Record<string, EditorSticker>;
  /** Imperative handle: insert text at the caret, focus the field. */
  ref?: Ref<MentionTextareaHandle>;
  /** The @mention term being typed ("" when there is none). */
  onMentionQueryChange: (query: string) => void;
  /**
   * Autocomplete de figurinhas (`:palavra`): o campo acha o termo sob o cursor e repassa as teclas
   * ao menu enquanto ele está aberto. Sem ela o `:` continua sendo só texto.
   */
  stickerSuggestions?: StickerSuggestions;
  /** O termo de figurinha sob o cursor (ou `null`): o dono do campo busca as figurinhas. */
  onStickerQueryChange?: (state: StickerQueryState | null) => void;
};
