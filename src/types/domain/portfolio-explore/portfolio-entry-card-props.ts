import type { PortfolioExploreCard } from "./portfolio-explore-card.js";

/** A entrada do feed: só a vitrine de quem está lendo (ou o convite). */
export type PortfolioEntryCardProps = {
  mine: PortfolioExploreCard | null;
  editorHref: string;
};
