import type { ReactNode } from "react";

import type { PortfolioExploreCard } from "./portfolio-explore-card.js";

/**
 * A seção de vitrines no Explorar: a de quem está lendo (ou o convite) em destaque e as demais
 * publicadas abaixo. Sem catálogo de vitrines no backend, a lista pode vir só com a própria.
 */
export type PortfolioExploreSectionProps = {
  /** A vitrine de quem está lendo, ou null quando ela ainda não está no ar. */
  mine: PortfolioExploreCard | null;
  /** As demais vitrines publicadas, já sem a de quem está lendo. */
  cards: PortfolioExploreCard[];
  /** Endereço do editor da própria vitrine. */
  editorHref: string;
  /** Outras seções do Explorar, para a vitrine morar dentro do hub. */
  children?: ReactNode;
};
