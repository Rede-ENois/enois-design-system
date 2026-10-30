import { useId } from "react";

import { ArrowUpRight, Hash, MapPin } from "lucide-react";

import { useAdapters } from "../../adapters/adapters-context.js";
import { useMessages } from "../../messages/messages-context.js";
import { LocationLine } from "../../patterns/location/location-line.js";
import type { LocalCommunitiesSectionProps } from "../../types/domain/communities/local-communities-section-props.js";
import { AppLink } from "../../ui/app-link.js";
import { Button } from "../../ui/button.js";
import { EmptyState } from "../../ui/empty-state.js";
import { Skeleton } from "../../ui/skeleton.js";

/** "Perto de você": communities in the viewer's city, then the rest of their state. */
export function LocalCommunitiesSection({
  viewerCity,
  viewerState,
  items,
  loading,
  error,
  onRetry,
  onSetCity,
}: LocalCommunitiesSectionProps) {
  const allMessages = useMessages();
  const messages = allMessages.localCommunitiesSection;
  const { resolveMediaUrl } = useAdapters();
  const titleId = useId();

  let body;
  if (!viewerCity) {
    body = (
      <EmptyState icon={MapPin} title={messages.noCityTitle} description={messages.noCityBody}>
        <Button size="sm" variant="secondary" className="mt-2 rounded-full" onClick={onSetCity}>
          {messages.setCity}
        </Button>
      </EmptyState>
    );
  } else if (loading) {
    body = (
      <div role="status" aria-label={messages.loading} className="space-y-1 px-4 py-3 sm:px-5">
        {[0, 1, 2].map((index) => (
          <div key={index} className="flex items-center gap-3 py-2">
            <Skeleton className="h-9 w-9 rounded-xl" />

            <div className="flex-1 space-y-2">
              <Skeleton className="h-3.5 w-2/5" />
              <Skeleton className="h-3 w-1/4" />
            </div>
          </div>
        ))}
      </div>
    );
  } else if (error) {
    body = (
      <div role="alert" className="flex flex-col items-start gap-3 px-4 py-5 sm:px-5">
        <p className="text-sm text-text-subtle">{messages.error}</p>

        <Button size="sm" variant="secondary" className="rounded-full" onClick={onRetry}>
          {messages.retry}
        </Button>
      </div>
    );
  } else if (items.length === 0) {
    body = (
      <EmptyState icon={MapPin} title={messages.emptyTitle} description={messages.emptyBody} />
    );
  } else {
    body = (
      <ul className="divide-y divide-border-soft">
        {items.map((community) => (
          <li key={community.id}>
            <AppLink
              href={community.href}
              className="group flex items-center gap-3 px-4 py-3 transition-colors hover:bg-primary/5 focus-visible:bg-primary/5 focus-visible:outline-none sm:px-5"
            >
              {community.avatar ? (
                <img
                  src={resolveMediaUrl(community.avatar)}
                  alt=""
                  className="h-9 w-9 shrink-0 rounded-xl object-cover ring-1 ring-border-soft"
                />
              ) : (
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-surface-2 text-primary">
                  <Hash className="h-4 w-4" aria-hidden="true" />
                </span>
              )}

              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium text-text-strong">
                  {community.name}
                </span>

                <span className="mt-0.5 flex min-w-0 items-center gap-3 text-xs text-text-subtle">
                  <LocationLine city={community.city} state={community.state} />

                  <span className="shrink-0">
                    {allMessages.communityCard.members(community.members ?? 0)}
                  </span>
                </span>
              </span>

              <ArrowUpRight
                className="h-4 w-4 shrink-0 text-text-subtle transition group-hover:text-primary motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </AppLink>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <section
      aria-labelledby={titleId}
      aria-busy={loading || undefined}
      className="overflow-hidden rounded-2xl border border-border-soft bg-surface-card"
    >
      <header className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 border-b border-border-soft px-4 py-4 sm:px-5">
        <h2 id={titleId} className="text-base font-medium text-text-strong">
          {messages.title}
        </h2>

        <LocationLine city={viewerCity} state={viewerState} />
      </header>

      {body}
    </section>
  );
}
