import { useState } from "react";

import { Search } from "lucide-react";

import { useMessages } from "../../messages/messages-context.js";
import type { ExploreHubProps } from "../../types/domain/explore/explore-hub-props.js";
import type { ExploreItemData } from "../../types/domain/explore/explore-item-data.js";
import type { ExploreSectionData } from "../../types/domain/explore/explore-section-data.js";
import { AppLink } from "../../ui/app-link.js";
import { Signal } from "../../ui/signal.js";

/** Lowercase without accents, so "noticias" finds "Notícias". */
function fold(text: string) {
  return text
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

function matches(item: ExploreItemData, query: string) {
  const haystack = fold([item.label, item.description, ...(item.keywords ?? [])].join(" "));
  return fold(query)
    .split(/\s+/)
    .filter(Boolean)
    .every((word) => haystack.includes(word));
}

/** One room: the colored icon says where it lives, the line says what it is for. */
function Tile({ item }: { item: ExploreItemData }) {
  const Icon = item.icon;

  return (
    <AppLink
      href={item.href}
      className="group relative flex min-h-[7rem] min-w-0 flex-col gap-2.5 rounded-[1.375rem] bg-surface-card p-3.5 shadow-[var(--shadow-table)] transition hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <span
        aria-hidden
        className="grid h-10 w-10 shrink-0 place-items-center rounded-[34%] text-white shadow-[var(--shadow-table)]"
        style={{ background: item.color }}
      >
        <Icon className="h-[19px] w-[19px]" />
      </span>

      <span className="text-[15px] font-extrabold leading-tight text-text-strong">
        {item.label}
      </span>

      <span className="-mt-1 text-[13px] leading-snug text-text-date">{item.description}</span>
      {item.signal && <Signal signal={item.signal} className="absolute right-3.5 top-3.5" />}
    </AppLink>
  );
}

/** The quick jumps to each section: only the ones that have rooms to show. */
function SectionChips({ sections }: { sections: ExploreSectionData[] }) {
  const messages = useMessages().exploreHub;

  return (
    <div className="-mx-1 flex min-w-0 gap-2 overflow-x-auto px-1 pb-1">
      {sections.map((section) => (
        <AppLink
          key={section.id}
          href={`#explorar-${section.id}`}
          className="flex shrink-0 items-baseline gap-1.5 rounded-full bg-surface-card px-3.5 py-1.5 text-[13px] font-bold text-text-strong shadow-[var(--shadow-table)] transition hover:bg-surface-2"
        >
          {section.title}
          <span className="text-[12px] font-semibold text-text-date">
            {messages.rooms(section.items.length)}
          </span>
        </AppLink>
      ))}
    </div>
  );
}

/**
 * Everything that is not on the dock or in the menu, as rooms with a line on what each is for.
 * Nothing in the app is out of reach: the filter finds any room by name or by what it does.
 *
 * O hub tem três estados de verdade: enquanto as contagens e preferências chegam (loading), se
 * elas falham (error, com o gesto de tentar de novo) e quando há salas (ready). O vazio da busca
 * é outra coisa: é a lista pronta sem resultado para o termo.
 */
export function ExploreHub({ sections, state = { kind: "ready" }, onRetry }: ExploreHubProps) {
  const messages = useMessages().exploreHub;
  const [query, setQuery] = useState("");
  const filtered = sections
    .map((section) => ({ ...section, items: section.items.filter((item) => matches(item, query)) }))
    .filter((section) => section.items.length > 0);

  if (state.kind === "loading") {
    return (
      <div className="mx-auto flex w-full max-w-3xl min-w-0 flex-col gap-3 px-1 py-10">
        <h1 className="text-2xl font-extrabold tracking-tight text-text-strong">
          {messages.title}
        </h1>

        <p className="text-[15px] text-text-subtle">{messages.loading}</p>
      </div>
    );
  }

  if (state.kind === "error") {
    return (
      <div className="mx-auto flex w-full max-w-3xl min-w-0 flex-col gap-3 px-1 py-10">
        <h1 className="text-2xl font-extrabold tracking-tight text-text-strong">
          {messages.title}
        </h1>

        <p className="text-[15px] text-text-subtle">{messages.error}</p>

        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="self-start rounded-full bg-primary px-4 py-2 text-[14px] font-bold text-primary-foreground transition hover:opacity-90"
          >
            {messages.retry}
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl min-w-0 flex-col gap-2">
      <h1 className="px-1 text-2xl font-extrabold tracking-tight text-text-strong">
        {messages.title}
      </h1>

      <label className="mt-1 flex h-12 items-center gap-2.5 rounded-full bg-surface-card px-4 text-text-date shadow-[var(--shadow-table)] focus-within:ring-2 focus-within:ring-ring">
        <Search aria-hidden className="h-[18px] w-[18px] shrink-0" />

        <span className="sr-only">{messages.searchLabel}</span>

        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={messages.searchPlaceholder}
          className="h-full min-w-0 flex-1 bg-transparent text-base md:text-[15px] text-text-strong outline-none placeholder:text-text-date"
        />
      </label>

      {/* Com a busca em uso, os chips atrapalham: eles pulam para uma seção, não filtram. */}
      {query.trim() === "" && filtered.length > 1 && <SectionChips sections={filtered} />}

      {filtered.length === 0 ? (
        <p className="px-2 py-10 text-center text-[15px] text-text-subtle">{messages.empty}</p>
      ) : (
        filtered.map((section) => (
          <section key={section.id} id={`explorar-${section.id}`} className="min-w-0 scroll-mt-4">
            <h2 className="px-2 pb-2 pt-3 text-[13px] font-bold text-text-date">{section.title}</h2>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {section.items.map((item) => (
                <Tile key={item.href} item={item} />
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  );
}
