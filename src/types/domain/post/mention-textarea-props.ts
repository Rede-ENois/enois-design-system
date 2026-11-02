import type { ComponentPropsWithoutRef, Ref } from "react";

import type { EditorSticker } from "./editor-sticker.js";
import type { MentionTextareaHandle } from "./mention-textarea-handle.js";
import type { MentionUser } from "./mention-user.js";

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
};
