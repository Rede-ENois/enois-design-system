import { useState } from "react";

import { Loader2, Trash2, UserRound } from "lucide-react";

import { useMessages } from "../../messages/messages-context.js";
import type { DesabafosCommentInput } from "../../types/domain/desabafos/desabafos-comment-input.js";
import type { DesabafosCommentView } from "../../types/domain/desabafos/desabafos-comment-view.js";
import type { DesabafosCommentsState } from "../../types/domain/desabafos/desabafos-comments-state.js";
import { Button } from "../../ui/button.js";
import { Textarea } from "../../ui/textarea.js";

/** O teto da acolhida no backend (DesabafosService.MAX_COMMENT); contar aqui evita o 400. */
const MAX_COMMENT = 800;

/**
 * As acolhidas do desabafo aberto: lista plana de palavras de apoio, sem resposta a resposta —
 * toda acolhida responde o desabafo direto, e TODAS são anônimas (a view nem recebe autor).
 * Remover é gesto do próprio autor, reconhecido pelo `isMine` que o servidor calculou.
 */
export function DesabafosComments({
  comments,
  state,
  onComment,
  onRemoveComment,
}: {
  comments: DesabafosCommentView[];
  state: DesabafosCommentsState;
  onComment: (input: DesabafosCommentInput) => Promise<void>;
  onRemoveComment: (commentId: string) => void;
}) {
  const messages = useMessages().desabafosComments;
  const [texto, setTexto] = useState("");
  const [enviando, setEnviando] = useState(false);

  const vazio = !texto.trim();
  const acolher = async () => {
    if (vazio || enviando) return;
    setEnviando(true);
    try {
      await onComment({ content: texto.trim() });
      setTexto("");
    } catch {
      // A recusa já foi avisada por quem compõe; aqui o rascunho fica de pé para corrigir.
    } finally {
      setEnviando(false);
    }
  };

  return (
    <section className="space-y-3 border-t border-border pt-3">
      {state.kind === "loading" && (
        <p className="flex items-center gap-2 py-2 text-sm text-text-subtle">
          <Loader2 className="h-4 w-4 animate-spin" /> {messages.loading}
        </p>
      )}

      {state.kind === "error" && <p className="text-xs text-text-subtle">{messages.error}</p>}

      {state.kind === "ready" && comments.length === 0 && (
        <p className="text-xs text-text-subtle">{messages.empty}</p>
      )}

      <ul className="space-y-3">
        {comments.map((comment) => (
          <li key={comment.id} className="flex gap-2">
            <span
              aria-hidden
              className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-surface-2 text-text-subtle"
            >
              <UserRound className="h-3.5 w-3.5" />
            </span>

            <div className="min-w-0 flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <p className="text-xs font-medium">{messages.anonymous}</p>
                {comment.isMine && (
                  <button
                    type="button"
                    onClick={() => onRemoveComment(comment.id)}
                    className="text-text-subtle transition hover:text-text-strong"
                    title={messages.remove}
                    aria-label={messages.remove}
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                )}
              </div>

              <p className="text-sm text-text-strong">{comment.content}</p>
            </div>
          </li>
        ))}
      </ul>

      <div className="space-y-2">
        <Textarea
          value={texto}
          onChange={(event) => setTexto(event.target.value)}
          placeholder={messages.placeholder}
          aria-label={messages.placeholder}
          rows={2}
          maxLength={MAX_COMMENT}
        />

        <div className="flex items-center justify-between gap-2">
          <Button
            size="sm"
            onClick={() => void acolher()}
            disabled={enviando || vazio}
            className="rounded-full"
          >
            {enviando ? messages.sending : messages.send}
          </Button>
        </div>
      </div>
    </section>
  );
}
