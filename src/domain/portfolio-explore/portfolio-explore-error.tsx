import type { PortfolioErrorCardProps } from "../../types/domain/portfolio-explore/portfolio-error-card-props.js";
import { Button } from "../../ui/button.js";

/**
 * O Explorar com a leitura da própria vitrine falhando: avisa e oferece tentar de novo, com a
 * mesma linha das outras salas. O hub em si não desenha a seção, então o aviso fica aqui.
 */
export function PortfolioExploreError({ message, retryLabel, onRetry }: PortfolioErrorCardProps) {
  return (
    <section className="min-w-0 px-2 py-3">
      <p className="text-[13px] text-text-date">{message}</p>

      <Button
        type="button"
        variant="outline"
        size="sm"
        className="mt-2 rounded-full"
        onClick={onRetry}
      >
        {retryLabel}
      </Button>
    </section>
  );
}
