/** Coleção é privada: quem vê a página é sempre o dono — não há autor de coleção exposto. */
export type ColecaoResumo = {
  id: string;
  title: string;
  description: string | null;
  postCount: number;
  createdAt: string;
};
