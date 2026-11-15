import { useId, useState } from "react";

import { Dices, Search } from "lucide-react";

import { cn } from "../../lib/utils.js";
import { useMessages } from "../../messages/messages-context.js";
import type { RoleplayDirectoryProps } from "../../types/domain/roleplay/roleplay-directory-props.js";
import { Button } from "../../ui/button.js";
import { EmptyState } from "../../ui/empty-state.js";
import { Input } from "../../ui/input.js";
import { LoadingState } from "../../ui/loading-state.js";

import { CreateCampaignDialog } from "./create-campaign-dialog.js";
import { RoleplayCampaignCard } from "./roleplay-campaign-card.js";

/**
 * A lista de campanhas: primeiro as da pessoa (é para onde ela volta), depois a descoberta
 * pública. A busca é do app (o filtro chega pronto em `campaigns`); aqui vive só o estado de
 * qual texto está no campo.
 */
export function RoleplayDirectory({
  campaigns,
  loading = false,
  loadError = false,
  onRetry,
  mine,
  onCreate,
  onOpen,
  systems,
  onCreateSubmit,
  creating = false,
  createError = null,
}: RoleplayDirectoryProps) {
  const messages = useMessages().roleplay;
  const id = useId();
  const [query, setQuery] = useState("");
  const [createOpen, setCreateOpen] = useState(false);

  const mineIds = new Set((mine ?? []).map((c) => c.id));
  const discover = campaigns.filter((c) => !mineIds.has(c.id));
  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      <header className="surface-card flex flex-wrap items-start justify-between gap-3 p-4 sm:p-6">
        <div className="min-w-0 space-y-1">
          <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight text-text-strong">
            <Dices aria-hidden className="h-5 w-5 shrink-0 text-primary" />

            <span className="min-w-0 break-words">{messages.title}</span>
          </h1>

          <p className="max-w-prose text-sm text-muted-foreground">{messages.subtitle}</p>
        </div>

        {onCreate && (
          <Button className="w-auto rounded-full" onClick={onCreate}>
            {messages.create}
          </Button>
        )}

        {!onCreate && onCreateSubmit && (
          <Button className="w-auto rounded-full" onClick={() => setCreateOpen(true)}>
            {messages.create}
          </Button>
        )}
      </header>

      <div className="relative">
        <Search
          aria-hidden
          className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          id={`${id}-search`}
          aria-label={messages.searchLabel}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={messages.searchPlaceholder}
          className="pl-9"
        />
      </div>

      {mine && mine.length > 0 && (
        <section aria-labelledby={`${id}-mine`} className="space-y-3">
          <h2 id={`${id}-mine`} className="text-base font-semibold text-text-strong">
            {messages.mineTitle}
          </h2>

          <ul className="space-y-3">
            {mine.map((campaign) => (
              <RoleplayCampaignCard key={campaign.id} campaign={campaign} onOpen={onOpen} />
            ))}
          </ul>
        </section>
      )}

      {mine && mine.length === 0 && (
        <p className="rounded-2xl border border-dashed border-border-soft p-6 text-center text-sm font-medium text-text-strong">
          {messages.mineEmpty}
        </p>
      )}

      <section aria-labelledby={`${id}-discover`} className="space-y-3">
        <h2 id={`${id}-discover`} className="sr-only">
          {messages.title}
        </h2>

        {loading && <LoadingState label={messages.loading} />}

        {loadError && (
          <div
            role="alert"
            className="flex flex-col items-center gap-3 rounded-xl border border-border-soft px-4 py-8 text-center"
          >
            <p className="text-sm text-text-strong">{messages.loadError}</p>

            {onRetry && (
              <Button variant="outline" size="sm" onClick={onRetry}>
                {messages.retry}
              </Button>
            )}
          </div>
        )}

        {!loading && !loadError && discover.length === 0 && (
          <EmptyState
            icon={Dices}
            title={messages.empty}
            description={query.trim() ? undefined : messages.subtitle}
          />
        )}

        <ul className={cn("space-y-3", (loading || loadError) && "hidden")}>
          {discover.map((campaign) => (
            <RoleplayCampaignCard key={campaign.id} campaign={campaign} onOpen={onOpen} />
          ))}
        </ul>
      </section>

      {onCreateSubmit && (
        <CreateCampaignDialog
          open={createOpen}
          onOpenChange={setCreateOpen}
          systems={systems}
          pending={creating}
          error={createError}
          onSubmit={onCreateSubmit}
        />
      )}
    </div>
  );
}
