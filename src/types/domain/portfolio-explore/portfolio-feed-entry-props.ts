import type { PortfolioExploreCard } from "./portfolio-explore-card.js";

/** A entrada do feed enquanto a própria vitrine chega: o convite fica no lugar do quadro vazio. */
export type PortfolioFeedEntryProps = {
  /** null desenha o quadro em espera, no lugar que o card vai ocupar. */
  mine: PortfolioExploreCard | null;
  editorHref: string;
  loading?: boolean;
};
