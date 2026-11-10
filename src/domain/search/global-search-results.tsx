import { useMessages } from "../../messages/messages-context.js";
import type { GlobalSearchResultsProps } from "../../types/domain/search/global-search-results-props.js";
import { UserAvatar } from "../avatar/user-avatar.js";

export function GlobalSearchResults({
  items,
  query,
  isFetching,
  onSelect,
}: GlobalSearchResultsProps) {
  const messages = useMessages().globalSearchResults;

  return (
    <>
      {items.length === 0 && !isFetching && (
        <p className="px-4 py-6 text-center text-sm text-text-subtle">
          {messages.noResults(query)}
        </p>
      )}

      <ul className="max-h-80 overflow-y-auto">
        {items.map((item) => (
          <li key={`${item.type}-${item.id}`}>
            <button
              type="button"
              onClick={() => onSelect(item)}
              className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-surface-3"
            >
              {item.icon ? (
                <span
                  aria-hidden
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-[34%] text-white"
                  style={{ background: item.color ?? "var(--color-primary)" }}
                >
                  <item.icon className="h-[18px] w-[18px]" />
                </span>
              ) : (
                <UserAvatar src={item.image} alt={item.title} className="h-10 w-10" />
              )}

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-normal text-text-strong">{item.title}</p>

                <p className="truncate text-xs text-text-subtle">{item.subtitle}</p>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}
