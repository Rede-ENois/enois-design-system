import type { PortfolioEntryCardProps } from "../../types/domain/portfolio-explore/portfolio-entry-card-props.js";

import { PortfolioCard } from "./portfolio-card.js";

/** A entrada do feed principal: a vitrine de quem está lendo, ou o convite para montar a dela. */
export function PortfolioEntryCard({ mine, editorHref }: PortfolioEntryCardProps) {
  return <PortfolioCard card={mine} editorHref={editorHref} />;
}
