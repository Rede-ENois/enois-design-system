/** O que o dono do campo recebe quando o código de figurinha digitado muda. */
export type StickerQueryState = {
  /** O trecho entre os dois-pontos, já começado (`""` logo depois de `:`). */
  query: string;
  /** O `:` de abertura, como offset no texto. */
  start: number;
  /** O cursor depois do termo, como offset no texto. */
  end: number;
};
