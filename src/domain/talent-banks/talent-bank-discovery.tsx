import { Search } from "lucide-react";

import { useMessages } from "../../messages/messages-context.js";
import type { TalentBankDiscoveryProps } from "../../types/domain/talent-banks/talent-bank-discovery-props.js";
import { AppLink } from "../../ui/app-link.js";
import { Badge } from "../../ui/badge.js";
import { Button } from "../../ui/button.js";
import { EmptyState } from "../../ui/empty-state.js";
import { Input } from "../../ui/input.js";
import { LoadingState } from "../../ui/loading-state.js";
import { Select } from "../../ui/select.js";

/**
 * The public showcase of talent banks: every open bank, who publishes it and what it asks for.
 *
 * <p>The showcase never shows the people enrolled: an open bank is a public description of the
 * recruiter, and the enrolled people only exist for the recruiter who owns the bank.</p>
 */
export function TalentBankDiscovery({
  banks,
  search,
  onSearchChange,
  areas,
  area,
  onAreaChange,
  state = { kind: "ready" },
  onRetry,
}: TalentBankDiscoveryProps) {
  const messages = useMessages().talentBank.discovery;

  return (
    <section className="mx-auto flex w-full max-w-4xl min-w-0 flex-col gap-4">
      <header className="min-w-0">
        <h1 className="text-2xl font-extrabold tracking-tight text-text-strong">
          {messages.title}
        </h1>

        <p className="mt-1 text-[15px] text-text-subtle">{messages.intro}</p>
      </header>

      <div className="flex flex-col gap-2 sm:flex-row">
        <label className="flex h-10 flex-1 items-center gap-2 rounded-full bg-surface-card px-3 shadow-[var(--shadow-table)] focus-within:ring-2 focus-within:ring-ring">
          <Search aria-hidden className="h-4 w-4 shrink-0 text-text-date" />

          <span className="sr-only">{messages.searchLabel}</span>

          <Input
            type="search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder={messages.searchPlaceholder}
            aria-label={messages.searchLabel}
            showCounter={false}
            className="h-full min-w-0 flex-1 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
          />
        </label>

        <Select
          aria-label={messages.areaLabel}
          value={area}
          onChange={(event) => onAreaChange(event.target.value)}
          className="h-10 sm:w-56"
        >
          <option value="">{messages.areaAll}</option>

          {areas.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </Select>
      </div>

      {state.kind === "loading" && <LoadingState label={messages.loading} />}

      {state.kind === "error" && (
        <div className="flex flex-col items-center gap-3 py-8 text-center">
          <p className="text-sm text-text-subtle" role="alert">
            {messages.error}
          </p>

          {onRetry && (
            <Button variant="outline" size="sm" onClick={onRetry}>
              {messages.retry}
            </Button>
          )}
        </div>
      )}

      {state.kind === "ready" && banks.length === 0 && <EmptyState title={messages.empty} />}

      {state.kind === "ready" && banks.length > 0 && (
        <ul className="grid gap-3 sm:grid-cols-2">
          {banks.map((bank) => (
            <li key={bank.id} className="min-w-0">
              <article className="surface-card flex h-full min-w-0 flex-col gap-2 rounded-2xl p-4 shadow-[var(--shadow-table)]">
                <div className="min-w-0">
                  <h2 className="truncate text-base font-bold text-text-strong">{bank.title}</h2>

                  <p className="mt-0.5 truncate text-[13px] text-text-date">
                    {messages.byRecruiter(bank.recruiter.name)}
                  </p>
                </div>

                <p className="line-clamp-3 text-sm leading-snug text-text-subtle">{bank.purpose}</p>

                {bank.focusArea && (
                  <div>
                    <Badge variant="outline">
                      {messages.focusArea}: {bank.focusArea}
                    </Badge>
                  </div>
                )}

                {bank.requestedFields.length > 0 && (
                  <div className="min-w-0">
                    <p className="text-[12px] font-semibold text-text-date">
                      {messages.requestedFields}
                    </p>

                    <ul className="mt-1 flex flex-wrap gap-1">
                      {bank.requestedFields.map((field) => (
                        <li key={field.key}>
                          <Badge variant="secondary">{field.label}</Badge>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <AppLink
                  href={bank.href}
                  aria-label={messages.openBank(bank.title)}
                  className="mt-auto inline-flex w-fit items-center rounded-full border border-border-soft px-3 py-1.5 text-[13px] font-semibold text-text-strong transition hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {messages.openBank(bank.title)}
                </AppLink>
              </article>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
