import type { DesafiosParticipacoesProps } from "./desafios-participacoes-props.js";

/**
 * O desafio aberto em tela cheia: o convite no topo (quem convocou, o que pedia e a janela) e o
 * mural das participações embaixo. A camada ocupa a tela inteira e rola por dentro, então o feed
 * não anda junto. Fechar é sempre o mesmo gesto (Escape, o X ou o clique no fundo) e passa por
 * `onOpenChange`.
 */
export type DesafiosDetalheProps = {
  /** O desafio está aberto em tela cheia? */
  open: boolean;
  /** Chamada com `false` quando a camada fecha, quem quer que tenha fechado. */
  onOpenChange: (open: boolean) => void;
  /** Quanto resta da janela, em palavras ("termina em 3 dias"); nulo = sem prazo. */
  timeLeft: string | null;
} & DesafiosParticipacoesProps;
