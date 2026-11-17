import type { ReactNode } from "react";

export type ReactionPickerProps<T extends string = string> = {
  /** Emoji of each reaction type, in the order the picker shows them. */
  emojis: Record<T, string>;
  /** Reação atual de quem está vendo (fica realçada no seletor). */
  activeType: T | null;
  /** Chamado com o emoji escolhido — por clique ou no fim do gesto de segurar e arrastar. */
  onReact: (type: T) => void;
  /** Classes do botão-gatilho (cada superfície tem as suas). */
  buttonClassName: string;
  /** Texto do `title` do gatilho. */
  buttonTitle: string;
  /** Conteúdo visual do gatilho (ícone, emoji ou o texto "Reagir"). */
  children: ReactNode;
  /**
   * Quantos emojis ficam visíveis sem expandir (a primeira fileira). O restante aparece ao tocar
   * em "+". Padrão 5; um conjunto menor que isso mostra tudo de uma vez.
   */
  collapsedCount?: number;
};
