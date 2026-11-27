import type { ReactNode } from "react";

import type { PortfolioExploreCard } from "./portfolio-explore-card.js";

/**
 * A seção de vitrines no Explorar: a de quem está lendo (ou o convite) em destaque e as demais
 * publicadas abaixo, página a página enquanto houver mais no catálogo.
 */
export type PortfolioExploreSectionProps = {
  /** A vitrine de quem está lendo, ou null quando ela ainda não está no ar. */
  mine: PortfolioExploreCard | null;
  /** As demais vitrines publicadas, já sem a de quem está lendo. */
  cards: PortfolioExploreCard[];
  /** Endereço do editor da própria vitrine. */
  editorHref: string;
  /** A página seguinte do catálogo; sem ela, o carregar mais não aparece. */
  onLoadMore?: () => void;
  /** A página seguinte está chegando: o botão fica em espera e não repete o pedido. */
  loadingMore?: boolean;
  /** O texto do carregar mais; "tentar de novo" quando a leitura falhou. */
  loadMoreLabel?: string | null;
  /** A falha da página seguinte, sem tirar da tela as vitrines que já vieram. */
  loadMoreError?: string | null;
  /** Outras seções do Explorar, para a vitrine morar dentro do hub. */
  children?: ReactNode;
};
