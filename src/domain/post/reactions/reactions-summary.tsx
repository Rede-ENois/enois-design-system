import { useRef } from "react";

import { sortReactionTabsStable } from "../../../lib/reactions/summary.js";
import { cn } from "../../../lib/utils.js";
import { useMessages } from "../../../messages/messages-context.js";
import type { ReactionsSummaryProps } from "../../../types/domain/post/reactions-summary-props.js";
import type { ReactionTab } from "../../../types/lib/reactions/reaction-tab.js";

/**
 * Resumo compacto (emoji + contagem) das reações de um post — agora clicável.
 *
 * Cada pílula alterna a reação: a minha fica destacada em roxo; clicar nela remove, clicar em
 * outra troca. Sem card no store (o blog monta o card num efeito do PostActions) a pílula vira
 * texto, para não existir alvo de clique que não tem onde gravar.
 */
export function ReactionsSummary<T extends string>({
  summary,
  emojis,
  activeType,
  clickable,
  disabled = false,
  compact = false,
  onToggle,
}: ReactionsSummaryProps<T>) {
  const messages = useMessages().reactionsSummary;

  // A ordem fica no ref: o resumo é otimista, então reordenar a cada clique moveria a pílula no
  // meio do toque. Só a entrada de um tipo novo (ou o primeiro load) reordena por contagem.
  const tabsRef = useRef<ReactionTab<T>[]>([]);
  const tabs = sortReactionTabsStable(tabsRef.current, summary);
  tabsRef.current = tabs;

  if (tabs.length === 0) return null;

  return (
    <div
      className={cn("flex flex-wrap items-center", compact ? "mt-1 gap-1 px-3" : "mt-3 gap-1.5")}
    >
      {tabs.map(({ type, count }) => {
        const mine = activeType === type;
        const emoji = emojis[type] ?? type;
        const pillClassName = cn(
          "inline-flex items-center whitespace-nowrap rounded-full border leading-none transition-colors",
          compact ? "h-6 gap-1 px-2 text-[11px]" : "h-7 gap-1.5 px-2.5 text-xs",
          mine
            ? "border-primary/40 bg-primary-soft text-text-strong hover:bg-surface-3"
            : "border-border-soft bg-surface-2 text-text-subtle hover:bg-surface-3 hover:text-text-strong",
        );
        const content = (
          <>
            <span
              className={cn(
                "inline-flex items-center justify-center leading-none",
                compact ? "h-3.5 text-sm" : "h-4 text-base",
                !mine && "grayscale-[0.3] opacity-80",
              )}
            >
              {emoji}
            </span>

            <span className="tabular-nums leading-none">{count}</span>
          </>
        );

        if (!clickable) {
          return (
            <span key={type} className={pillClassName}>
              {content}
            </span>
          );
        }

        return (
          <button
            key={type}
            type="button"
            aria-pressed={mine}
            disabled={disabled}
            onClick={() => onToggle(type)}
            title={mine ? messages.removeWith(emoji) : messages.reactWith(emoji)}
            aria-label={mine ? messages.removeWith(emoji) : messages.reactWith(emoji)}
            // Área de toque acessível: a pílula tem h-7 (~28px), abaixo dos 44px exigidos; o
            // pseudo-elemento before infla só o alvo de toque, sem alterar o visual.
            className={cn(
              pillClassName,
              "relative before:absolute before:-inset-y-2 before:-inset-x-1 before:content-['']",
            )}
          >
            {content}
          </button>
        );
      })}
    </div>
  );
}
