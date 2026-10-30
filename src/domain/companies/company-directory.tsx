import { useId } from "react";

import { Plus, Search } from "lucide-react";

import { FOCUS_RING } from "../../lib/focus-ring.js";
import { cn } from "../../lib/utils.js";
import { useMessages } from "../../messages/messages-context.js";
import type { CompanyDirectoryEntryView } from "../../types/domain/companies/company-directory-entry-view.js";
import type { CompanyDirectoryProps } from "../../types/domain/companies/company-directory-props.js";
import { AppLink } from "../../ui/app-link.js";
import { Button } from "../../ui/button.js";
import { Input } from "../../ui/input.js";
import { Pill } from "../../ui/pill.js";
import { Skeleton } from "../../ui/skeleton.js";

import { CompanyLogo } from "./company-logo.js";

function EntryCard({ entry }: { entry: CompanyDirectoryEntryView }) {
  const copy = useMessages().companyDirectory;
  const hiring = entry.openJobs + entry.openProjects > 0;
  const counts = [
    entry.openJobs > 0 && copy.jobs(entry.openJobs),
    entry.openProjects > 0 && copy.projects(entry.openProjects),
    !entry.external && entry.followers > 0 && copy.followers(entry.followers),
  ].filter((item): item is string => Boolean(item));

  return (
    <li className="min-w-0">
      <AppLink
        href={entry.href}
        className={cn(
          "group flex h-full min-w-0 flex-col gap-4 rounded-2xl border border-border-soft bg-surface-card p-5 shadow-soft transition-[border-color,box-shadow] hover:border-primary/40 hover:shadow-card",
          FOCUS_RING,
          "rounded-2xl",
        )}
      >
        <div className="flex min-w-0 items-start gap-3">
          <CompanyLogo name={entry.name} logo={entry.logo} />

          <div className="min-w-0 flex-1">
            <h3 className="break-words font-semibold leading-snug text-text-strong group-hover:text-primary">
              {entry.name}
            </h3>

            {(entry.sector || entry.location) && (
              <p className="mt-0.5 break-words text-sm text-text-subtle">
                {[entry.sector, entry.location].filter(Boolean).join(" · ")}
              </p>
            )}

            {entry.external && <p className="mt-1 text-xs text-text-subtle">{copy.noPage}</p>}
          </div>
        </div>

        <div className="mt-auto flex min-w-0 flex-wrap items-center justify-between gap-x-3 gap-y-2 border-t border-border-soft pt-3 text-xs text-text-subtle">
          <span className="min-w-0 tabular-nums">{counts.join(" · ")}</span>

          {hiring && (
            <span className="inline-flex shrink-0 items-center gap-1.5 font-medium text-growth">
              <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-growth" />
              {copy.hiring}
            </span>
          )}
        </div>
      </AppLink>
    </li>
  );
}

/**
 * The companies directory: a calm editorial header, search and sector filters, the viewer's own
 * pages within reach, and the companies as cards that say at a glance who is hiring. Companies
 * that only exist through job posts show up too, marked as not having a page yet.
 */
export function CompanyDirectory({
  query,
  onQueryChange,
  sectors,
  sector,
  onSectorChange,
  entries,
  loading,
  error,
  onRetry,
  myPages,
  onCreatePage,
}: CompanyDirectoryProps) {
  const copy = useMessages().companyDirectory;
  const searchId = useId();
  const filtered = query.trim().length > 0 || sector !== null;

  return (
    <div className="mx-auto w-full max-w-5xl space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0 space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-text-strong sm:text-3xl">
            {copy.title}
          </h1>

          <p className="max-w-[55ch] text-text-subtle">{copy.subtitle}</p>
        </div>

        {myPages !== null && onCreatePage && (
          <Button
            size="sm"
            variant="outline"
            className="h-9 rounded-full px-4"
            onClick={onCreatePage}
          >
            <Plus aria-hidden />
            {copy.createPage}
          </Button>
        )}
      </header>

      {myPages && myPages.length > 0 && (
        <nav aria-label={copy.myPages} className="space-y-2">
          <h2 className="text-xs font-medium text-text-subtle">{copy.myPages}</h2>

          <ul className="flex flex-wrap gap-2">
            {myPages.map((page) => (
              <li key={page.slug} className="min-w-0 max-w-full">
                <AppLink
                  href={page.href}
                  className={cn(
                    "flex min-w-0 items-center gap-2 rounded-full border border-border-soft bg-surface-card py-1 pl-1 pr-3.5 text-sm font-medium text-text-strong transition-colors hover:border-primary/40 hover:text-primary",
                    FOCUS_RING,
                    "rounded-full",
                  )}
                >
                  <CompanyLogo
                    name={page.name}
                    logo={page.logo}
                    className="h-7 w-7 rounded-full text-[0.625rem]"
                  />

                  <span className="min-w-0 truncate">{page.name}</span>
                </AppLink>
              </li>
            ))}
          </ul>
        </nav>
      )}

      <div className="space-y-3">
        <div className="relative">
          <label htmlFor={searchId} className="sr-only">
            {copy.searchLabel}
          </label>

          <Search
            aria-hidden
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-subtle"
          />
          <Input
            id={searchId}
            type="search"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder={copy.searchPlaceholder}
            className="h-11 rounded-full bg-surface-card pl-10"
          />
        </div>

        {sectors.length > 0 && (
          <div
            role="group"
            aria-label={copy.sectorsLabel}
            className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0"
          >
            <Pill size="sm" active={sector === null} onClick={() => onSectorChange(null)}>
              {copy.allSectors}
            </Pill>

            {sectors.map((item) => (
              <Pill
                key={item}
                size="sm"
                active={sector === item}
                onClick={() => onSectorChange(sector === item ? null : item)}
              >
                {item}
              </Pill>
            ))}
          </div>
        )}
      </div>

      <section aria-label={copy.title} className="space-y-4">
        <p aria-live="polite" className="text-sm text-text-subtle">
          {!loading && !error && entries.length > 0 && copy.results(entries.length)}
        </p>

        {loading ? (
          <ul
            role="status"
            aria-label={copy.loading}
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {[0, 1, 2, 3, 4, 5].map((key) => (
              <li
                key={key}
                className="space-y-4 rounded-2xl border border-border-soft bg-surface-card p-5"
              >
                <div className="flex gap-3">
                  <Skeleton className="h-12 w-12 rounded-xl" />

                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>

                <Skeleton className="h-3 w-40" />
              </li>
            ))}
          </ul>
        ) : error ? (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border-soft bg-surface-card px-5 py-4">
            <p role="alert" className="text-sm text-text-subtle">
              {copy.loadError}
            </p>

            <Button size="sm" variant="outline" className="rounded-full" onClick={onRetry}>
              {copy.retry}
            </Button>
          </div>
        ) : entries.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border-soft px-5 py-12 text-center">
            <p className="text-sm text-text-subtle">{filtered ? copy.emptyFiltered : copy.empty}</p>

            {filtered && (
              <Button
                size="sm"
                variant="ghost"
                className="rounded-full text-primary"
                onClick={() => {
                  onQueryChange("");
                  onSectorChange(null);
                }}
              >
                {copy.clearFilters}
              </Button>
            )}
          </div>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {entries.map((entry) => (
              <EntryCard key={entry.key} entry={entry} />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
