import type { PortfolioFeedEntryProps } from "../../types/domain/portfolio-explore/portfolio-feed-entry-props.js";
import { Skeleton } from "../../ui/skeleton.js";

import { PortfolioCard } from "./portfolio-card.js";

/** A entrada do feed principal, no lugar em que o card da própria vitrine vai aparecer. */
export function PortfolioFeedEntry({ mine, editorHref, loading = false }: PortfolioFeedEntryProps) {
  if (loading) return <Skeleton className="h-28 w-full rounded-2xl" />;
  return <PortfolioCard card={mine} editorHref={editorHref} />;
}
