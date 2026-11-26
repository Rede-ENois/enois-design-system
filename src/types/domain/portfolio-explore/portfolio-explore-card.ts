/** Uma vitrine publicada, resumida num card: no Explorar e na entrada do feed. */
export type PortfolioExploreCard = {
  username: string;
  name: string;
  avatarUrl: string | null;
  /** Primeira frase da página publicada; null quando a página não tem texto. */
  headline: string | null;
  href: string;
};
