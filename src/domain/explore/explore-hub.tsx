import { useState } from "react";

import { Search } from "lucide-react";

import { useMessages } from "../../messages/messages-context.js";
import type { ExploreHubProps } from "../../types/domain/explore/explore-hub-props.js";
import type { ExploreItemData } from "../../types/domain/explore/explore-item-data.js";
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

function Tile({ item }: { item: ExploreItemData }) {
  const Icon = item.icon;

  return (
    <AppLink
      href={item.href}
      className="relative flex min-h-[6.5rem] min-w-0 flex-col gap-2 rounded-[1.375rem] bg-surface-card p-3.5 shadow-[var(--shadow-table)] transition hover:bg-surface-2"
    >
      <span
        aria-hidden
        className="grid h-9 w-9 place-items-center rounded-[34%] text-white"
        style={{ background: item.color }}
      >
        <Icon className="h-[18px] w-[18px]" />
      </span>

      <span className="text-[15px] font-extrabold text-text-strong">{item.label}</span>

      <span className="-mt-1.5 text-[13px] leading-snug text-text-date">{item.description}</span>
      {item.signal && <Signal signal={item.signal} className="absolute right-3.5 top-3.5" />}
    </AppLink>
  );
}

/**
 * Everything that is not on the dock or in the menu, as rooms with a line on what each is for.
 * Nothing in the app is out of reach: the filter finds any room by name or by what it does.
 */
export function ExploreHub({ sections }: ExploreHubProps) {
  const messages = useMessages().exploreHub;
  const [query, setQuery] = useState("");
  const filtered = sections
    .map((section) => ({ ...section, items: section.items.filter((item) => matches(item, query)) }))
    .filter((section) => section.items.length > 0);

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

      {filtered.length === 0 ? (
        <p className="px-2 py-10 text-center text-[15px] text-text-subtle">{messages.empty}</p>
      ) : (
        filtered.map((section) => (
          <section key={section.id} className="min-w-0">
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
