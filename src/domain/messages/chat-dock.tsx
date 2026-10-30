import { ChevronDown, ChevronUp, MessageCircle } from "lucide-react";

import { cn } from "../../lib/utils.js";
import { useMessages } from "../../messages/messages-context.js";
import type { ChatDockProps } from "../../types/domain/messages/chat-dock-props.js";

/**
 * Dock de mensagens flutuante — fixo no canto inferior direito, só no desktop.
 *
 * 3 estados visuais:
 * 1. Barra colapsada (ícone + selo de não lidas)
 * 2. Lista de conversas (painel expandido)
 * 3. Mini-janelas de conversa aberta (ao lado da barra/lista)
 */
export function ChatDock({
  expanded,
  onToggleExpanded,
  unreadCount,
  windows,
  children,
  empty,
  hasMore,
  loadingMore,
  onLoadMore,
  contextLabel,
}: ChatDockProps) {
  const messages = useMessages().chatDock;

  return (
    <div className="fixed bottom-0 right-4 z-50 hidden items-end gap-2 lg:flex">
      {windows}

      {/* Painel principal: barra colapsada ou lista expandida */}
      <div className="flex flex-col">
        {/* One header only: the bar below opens and closes the list. The list grows with its
            content up to the screen height, instead of a tall empty panel over the page. */}
        {expanded && (
          <div className="flex max-h-[calc(100vh-8rem)] min-h-40 w-80 flex-col overflow-hidden rounded-t-2xl border border-b-0 border-border-soft bg-surface-card shadow-xl">
            <ul className="flex-1 overflow-y-auto overscroll-contain">
              {empty ? (
                <li className="px-4 py-12 text-center text-sm text-text-subtle">
                  {messages.empty}
                </li>
              ) : (
                children
              )}

              {hasMore && (
                <li className="px-4 py-3 text-center">
                  <button
                    type="button"
                    onClick={onLoadMore}
                    disabled={loadingMore}
                    className="text-xs text-primary transition hover:underline"
                  >
                    {loadingMore ? messages.loadingMore : messages.loadMore}
                  </button>
                </li>
              )}
            </ul>
          </div>
        )}

        <button
          type="button"
          onClick={onToggleExpanded}
          aria-expanded={expanded}
          aria-label={messages.title}
          className={cn(
            "flex w-80 items-center gap-3 border border-border-soft bg-surface-card px-4 py-3 shadow-lg transition hover:bg-surface-2",
            // Expanded, the bar is the foot of the list (one block); collapsed, a tab of its own.
            expanded ? "rounded-none" : "rounded-t-2xl",
          )}
        >
          <MessageCircle className="h-5 w-5 text-primary" />

          <span className="flex min-w-0 flex-1 items-baseline gap-1.5 text-left">
            <span className="text-sm font-medium text-text-strong">{messages.title}</span>

            {contextLabel && (
              <span className="truncate text-xs text-text-subtle">{contextLabel}</span>
            )}
          </span>

          {unreadCount > 0 && (
            <span className="grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1.5 text-xs font-semibold text-primary-foreground">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}

          {expanded ? (
            <ChevronDown className="h-4 w-4 text-text-subtle" />
          ) : (
            <ChevronUp className="h-4 w-4 text-text-subtle" />
          )}
        </button>
      </div>
    </div>
  );
}
