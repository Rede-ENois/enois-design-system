/** A falha de leitura da própria vitrine, com o gesto de tentar de novo. */
export type PortfolioErrorCardProps = {
  message: string;
  retryLabel: string;
  onRetry: () => void;
};
