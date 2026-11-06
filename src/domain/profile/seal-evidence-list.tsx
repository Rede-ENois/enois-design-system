import { ChevronDown, ExternalLink, Loader2 } from "lucide-react";

import { safeHref } from "../../lib/safe-href.js";
import { useMessages } from "../../messages/messages-context.js";
import type { SealEvidenceListProps } from "../../types/domain/profile/seal-evidence-list-props.js";
import { Button } from "../../ui/button.js";

/**
 * Evidências paginadas de um selo. O cartão conhece o TOTAL, mas o app só carrega as páginas
 * enquanto a lista está aberta — "Carregar mais" busca o resto sob demanda.
 */
export function SealEvidenceList({
  total,
  open,
  onOpenChange,
  loading,
  error,
  items,
  hasMore,
  loadingMore,
  onLoadMore,
}: SealEvidenceListProps) {
  const messages = useMessages().sealEvidenceList;

  if (total <= 0) return null;

  return (
    <details
      open={open}
      className="group min-w-0 overflow-hidden rounded-xl border border-border-soft px-3 py-2"
      onToggle={(event) => onOpenChange(event.currentTarget.open)}
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-2 text-xs font-medium text-text-subtle [&::-webkit-details-marker]:hidden">
        <span>
          {messages.evidence} ({total})
        </span>

        <ChevronDown
          className="h-3.5 w-3.5 shrink-0 transition-transform group-open:rotate-180"
          aria-hidden
        />
      </summary>

      {open && (
        <div className="mt-2 space-y-2">
          {loading ? (
            <p className="flex items-center gap-2 text-xs text-text-subtle">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              {messages.loadingEvidence}
            </p>
          ) : error ? (
            <p className="text-xs text-destructive">{messages.evidenceError}</p>
          ) : (
            <ul className="max-h-64 space-y-1 overflow-y-auto pr-1">
              {items.map((evidence) => (
                <li
                  key={`${evidence.repository}-${evidence.kind}-${evidence.number}`}
                  className="min-w-0"
                >
                  <a
                    href={safeHref(evidence.url) ?? undefined}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex min-w-0 items-center gap-1 text-xs text-primary hover:underline"
                  >
                    <span className="truncate">
                      {evidence.kind === "ISSUE" ? messages.issue : messages.pullRequest} ·{" "}
                      {evidence.repository} #{evidence.number} · {evidence.title}
                    </span>

                    <ExternalLink className="h-3 w-3 shrink-0" aria-hidden />
                  </a>
                </li>
              ))}
            </ul>
          )}

          {hasMore && (
            <Button
              size="sm"
              variant="outline"
              className="rounded-full gap-1.5"
              disabled={loadingMore}
              onClick={onLoadMore}
            >
              {loadingMore ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  {messages.loadingEvidence}
                </>
              ) : (
                messages.loadMore
              )}
            </Button>
          )}
        </div>
      )}
    </details>
  );
}
