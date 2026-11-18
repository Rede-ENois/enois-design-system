/** Um mural ou coleção do dono, na ótica de um post: `tem` marca se o post já está lá. */
export type PostDestinoItem = {
  id: string;
  title: string;
  description: string | null;
  /** Quantos itens o destino já tem (publicações coladas ou posts guardados). */
  count: number;
  /** O post já está neste destino: o seletor marca e nem tenta duplicar. */
  tem: boolean;
};
