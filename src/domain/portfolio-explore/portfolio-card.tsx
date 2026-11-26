import { Briefcase, Eye, PenLine } from "lucide-react";

import { useMessages } from "../../messages/messages-context.js";
import type { PortfolioCardProps } from "../../types/domain/portfolio-explore/portfolio-card-props.js";
import { UserAvatar } from "../avatar/user-avatar.js";

/**
 * O card de uma vitrine. Com a vitrine no ar, mostra quem publicou e a primeira frase da página,
 * e abre a vitrine; sem ela, vira o convite para montar a própria, que leva ao editor.
 */
export function PortfolioCard({ card, editorHref, mine = false }: PortfolioCardProps) {
  const messages = useMessages().portfolioExplore;

  if (!card) {
    return (
      <article className="surface-card flex h-full flex-col gap-3 p-4">
        <p className="flex items-center gap-2 text-sm font-semibold text-text-strong">
          <Briefcase aria-hidden className="h-4 w-4" />

          <>{messages.mine}</>
        </p>

        <p className="line-clamp-2 text-sm font-normal text-muted-foreground">
          {messages.mineHeadline}
        </p>

        <a
          href={editorHref}
          className="mt-auto inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
        >
          <PenLine aria-hidden className="h-3.5 w-3.5" />

          <>{messages.editor}</>
        </a>
      </article>
    );
  }

  return (
    <article className="surface-card flex h-full flex-col gap-3 p-4">
      <div className="flex items-center gap-2">
        <UserAvatar src={card.avatarUrl} alt={card.name} className="h-9 w-9" />

        <p className="truncate text-sm font-semibold text-text-strong">
          {mine ? messages.mine : card.name}
        </p>
      </div>

      <p className="line-clamp-2 text-sm font-normal text-muted-foreground">
        {card.headline ?? messages.mineHeadline}
      </p>

      <a
        href={card.href}
        className="mt-auto inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
      >
        <Eye aria-hidden className="h-3.5 w-3.5" />

        <>{messages.open}</>
      </a>
    </article>
  );
}
