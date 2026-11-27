import { Loader2 } from "lucide-react";

import { useMessages } from "../../messages/messages-context.js";
import type { PortfolioExploreSectionProps } from "../../types/domain/portfolio-explore/portfolio-explore-section-props.js";
import { Button } from "../../ui/button.js";

import { PortfolioCard } from "./portfolio-card.js";

/**
 * As vitrines no Explorar: a de quem está lendo primeiro (ou o convite para montar a dela) e as
 * demais publicadas ao lado, com o carregar mais enquanto o catálogo tiver página seguinte. As
 * outras seções do Explorar vêm como `children`, então a vitrine é mais uma seção do hub, com o
 * mesmo título e o mesmo espaçamento.
 */
export function PortfolioExploreSection({
  mine,
  cards,
  editorHref,
  onLoadMore,
  loadingMore = false,
  loadMoreLabel = null,
  loadMoreError = null,
  children,
}: PortfolioExploreSectionProps) {
  const messages = useMessages().portfolioExplore;

  return (
    <>
      <section id="explorar-vitrines" className="min-w-0 scroll-mt-4">
        <h2 className="px-2 pb-2 pt-3 text-[13px] font-bold text-text-date">{messages.title}</h2>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <PortfolioCard card={mine} editorHref={editorHref} mine />

          {cards.map((card) => (
            <PortfolioCard key={card.username} card={card} editorHref={editorHref} />
          ))}
        </div>

        {loadMoreError !== null ? (
          <p className="px-2 pt-2 text-[13px] text-text-date">{loadMoreError}</p>
        ) : null}

        {onLoadMore && loadMoreLabel ? (
          <div className="flex justify-center px-2 py-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-full"
              disabled={loadingMore}
              onClick={onLoadMore}
            >
              {loadingMore ? <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden /> : null}

              <>{loadingMore ? messages.loading : loadMoreLabel}</>
            </Button>
          </div>
        ) : null}
      </section>

      {children}
    </>
  );
}
