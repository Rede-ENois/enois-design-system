export type DoacaoPixView = {
  id: string;
  /** BR Code (Pix copia e cola) que o servidor emitiu para esta doação. */
  pixCopyAndPaste: string;
  /** Valor da doação em centavos, já definido no codigo. */
  amountCents: number;
};
