export type EmoteCellProps = {
  code: string;
  /** Sem imagem: a figurinha saiu do catálogo e não há miniatura guardada. */
  src?: string;
  onSelect: (code: string) => void;
  /**
   * Gesto de segurar a figurinha (denunciar, banir). Sem ele a célula só responde ao clique: quem
   * não pode agir sobre a figurinha não ganha um gesto que não leva a nada.
   */
  onHold?: (code: string) => void;
  /** Rótulo do gesto de segurar, para leitor de tela e para o teclado. */
  holdLabel?: string;
};
