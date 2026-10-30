import { Users } from "lucide-react";

import { useAdapters } from "../../adapters/adapters-context.js";
import { useMessages } from "../../messages/messages-context.js";
import { LocationLine } from "../../patterns/location/location-line.js";
import type { CommunityCardProps } from "../../types/domain/communities/community-card-props.js";
import { AppLink } from "../../ui/app-link.js";
import { Button } from "../../ui/button.js";

/** Card de comunidade na aba de comunidades: capa, estrela de favorito e entrar/sair. */
export function CommunityCard({
  community,
  href,
  joinPending,
  leavePending,
  ownerBlocked,
  onJoin,
  onLeave,
  favorite,
}: CommunityCardProps) {
  const c = community;
  const messages = useMessages().communityCard;
  const { resolveMediaUrl } = useAdapters();

  return (
    <AppLink href={href} className="min-w-0">
      <article className="surface-card relative overflow-hidden cursor-pointer transition hover:shadow-[var(--shadow-card)]">
        {c.cover ? (
          <img src={resolveMediaUrl(c.cover)} alt="" className="h-32 w-full object-cover" />
        ) : (
          <div className="h-32 w-full bg-gradient-to-br from-primary/20 to-primary/5" />
        )}

        {favorite && <div className="absolute right-3 top-3">{favorite}</div>}

        <div className="p-5">
          <div className="mb-3 flex items-center gap-3">
            {c.avatar && (
              <img
                src={resolveMediaUrl(c.avatar)}
                alt=""
                className="h-10 w-10 rounded-full object-cover ring-2 ring-border"
              />
            )}

            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-wider text-primary">
                {c.topicLabel}
              </p>

              <h3 className="truncate font-semibold">{c.name}</h3>
            </div>
          </div>

          {c.description && (
            <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">{c.description}</p>
          )}

          <LocationLine city={c.city} state={c.state} className="mt-3 flex" />

          <div className="mt-4 flex items-center justify-between gap-2">
            <span className="inline-flex min-w-0 items-center gap-1.5 text-xs text-muted-foreground">
              <Users className="h-3.5 w-3.5 shrink-0" />

              {/* O tipo diz que `members` sempre vem; o `?? 0` segura a lista se a API mandar sem. */}
              <span className="truncate">{messages.members(c.members ?? 0)}</span>
            </span>

            <Button
              size="sm"
              variant={c.joined ? "secondary" : "default"}
              className="shrink-0 whitespace-nowrap rounded-full"
              disabled={joinPending || leavePending}
              onClick={(e) => {
                e.preventDefault();
                if (c.joined) onLeave();
                else onJoin();
              }}
            >
              {c.joined ? messages.participating : messages.enter}
            </Button>
          </div>

          {ownerBlocked && (
            <p className="mt-2 text-xs text-destructive">{messages.ownerLeaveBlocked}</p>
          )}
        </div>
      </article>
    </AppLink>
  );
}
