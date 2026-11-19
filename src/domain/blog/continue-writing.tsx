import { PenLine, Trash2 } from "lucide-react";

import { useMessages } from "../../messages/messages-context.js";
import type { ContinueWritingProps } from "../../types/domain/blog/continue-writing-props.js";
import { AppLink } from "../../ui/app-link.js";
import { Button } from "../../ui/button.js";

/**
 * "Continuar escrevendo": os rascunhos de artigo da pessoa no servidor — uma lista, porque
 * quem escreve mais de um texto não pode perder material (issue dos rascunhos do blog).
 * Os dados chegam por props (a aplicação é dona da rede e das rotas); o view desenha a lista,
 * monta o link de retomada pelo href que a aplicação informa e devolve o descarte por callback.
 * Não há rascunho, não há view: a ausência é silenciosa.
 */
export function ContinueWriting({
  drafts,
  resumeHref,
  onDiscard,
  discardPending = false,
}: ContinueWritingProps) {
  const messages = useMessages().blogDrafts;

  if (drafts.length === 0) return null;

  return (
    <section className="mb-4">
      <h2 className="mb-2 text-sm font-semibold text-text-subtle">{messages.title}</h2>

      <ul className="space-y-2">
        {drafts.map((draft) => (
          <li key={draft.id} className="surface-card flex flex-wrap items-center gap-2 p-3">
            <span className="min-w-0 flex-1 truncate text-sm">
              {draft.title.trim() || messages.untitled}
              {draft.updatedAtLabel && (
                <span className="ml-2 text-xs text-text-subtle">{draft.updatedAtLabel}</span>
              )}
            </span>

            <AppLink href={resumeHref(draft.id)}>
              <Button size="sm" variant="outline" className="rounded-full gap-1.5">
                <PenLine className="h-3.5 w-3.5" aria-hidden />

                <>{messages.write}</>
              </Button>
            </AppLink>

            <Button
              size="sm"
              variant="ghost"
              className="rounded-full gap-1.5 text-destructive"
              disabled={discardPending}
              onClick={() => onDiscard(draft.id)}
            >
              <Trash2 className="h-3.5 w-3.5" aria-hidden />

              <>{messages.discard}</>
            </Button>
          </li>
        ))}
      </ul>
    </section>
  );
}
