/** Um selo oficial de contribuição, já mapeado pelo app (o nível vem calculado do backend). */
export type ProfileSeal = {
  /** Tipo do selo: a chave estável do card. */
  type: string;
  /** Categoria do selo: o app a usa para paginar as evidências. */
  category: string;
  name: string;
  categoryName: string;
  description: string;
  /** Faixa do nível: `maxCount` nulo é a faixa aberta ("50+"). */
  minCount: number;
  maxCount: number | null;
  evidenceCount: number;
  grantedAtLabel: string;
  /** Emblema fixo do nível (URL da imagem); sem ele, o selo usa o ícone genérico. */
  emblemSrc?: string;
};
