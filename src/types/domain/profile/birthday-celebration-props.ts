export type BirthdayCelebrationProps = {
  /** Quem faz aniversário: o nome entra no tíquete de parabéns. */
  name: string;
  /** URLs das figurinhas felizes que voam pela tela (o pacote É Nóis é do app). */
  stickers: readonly string[];
  className?: string;
};
