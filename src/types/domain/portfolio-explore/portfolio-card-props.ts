import type { PortfolioExploreCard } from "./portfolio-explore-card.js";

/**
 * Um card de vitrine: o resumo de quem publicou, ou o convite para montar a própria quando ela
 * ainda não está no ar (`card` null).
 */
export type PortfolioCardProps = {
  card: PortfolioExploreCard | null;
  /** Endereço do editor da própria vitrine. */
  editorHref: string;
};
