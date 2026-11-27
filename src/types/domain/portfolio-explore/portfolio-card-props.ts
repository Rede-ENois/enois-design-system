import type { PortfolioExploreCard } from "./portfolio-explore-card.js";

/**
 * Um card de vitrine: o resumo de quem publicou, ou o convite para montar a própria quando ela
 * ainda não está no ar (`card` null).
 */
export type PortfolioCardProps = {
  card: PortfolioExploreCard | null;
  /** Endereço do editor da própria vitrine. */
  editorHref: string;
  /** A vitrine é de quem está lendo: o card diz "Sua vitrine" em vez do nome de quem publicou. */
  mine?: boolean;
};
