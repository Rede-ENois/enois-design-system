import type { ComponentPropsWithoutRef } from "react";

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
  /**
   * Recolhe a barra de formatação atrás de um botão de três pontos no canto superior direito,
   * em vez de gastar uma linha acima do campo. A seleção do texto continua valendo com o menu
   * aberto.
   */
  toolbarMenu?: boolean;
  /** Imagens coladas no campo (Ctrl+V): o dono do campo decide subir e anexar. */
  onPasteImages?: (files: File[]) => void;
  /** Ctrl+Enter (Cmd+Enter no Mac): o dono do campo decide o que é "enviar". Sem ela, não há atalho. */
  onSubmitShortcut?: () => void;
  /** Users matching the current @mention term (the app searches from two characters on). */
  mentionResults: MentionUser[];
  /** The @mention term being typed ("" when there is none). */
  onMentionQueryChange: (query: string) => void;
};
