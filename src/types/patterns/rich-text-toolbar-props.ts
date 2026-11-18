import type { ReactNode } from "react";

import type { RichTextFormat } from "../lib/rich-text/rich-text-format.js";

export type RichTextToolbarProps = {
  onFormat: (format: RichTextFormat) => void;
  /** Rótulo acessível do grupo de botões. */
  label: string;
  className?: string;
  /**
   * Botões do campo que não são formatação (o seletor de figurinhas, por exemplo): entram no fim
   * da barra, depois do emoji, com o mesmo tamanho dos outros.
   */
  extraActions?: ReactNode;
  /**
   * Recebe o emoji escolhido no seletor. Sem esta função a barra não mostra o botão de emoji —
   * é assim que um campo que não aceita emoji (ou que já tem o seu) fica sem ele.
   */
  onEmoji?: (emoji: string) => void;
};
