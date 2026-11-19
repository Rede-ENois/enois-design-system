import { Flag, MessageCircle, ScrollText, Trash2, UserRound } from "lucide-react";

import { cn } from "../../lib/utils.js";
import { useMessages } from "../../messages/messages-context.js";
import type { ConfessionarioCardProps } from "../../types/domain/confessionario/confessionario-card-props.js";
import type { ConfessionarioReactionOffered } from "../../types/domain/confessionario/confessionario-reaction-offered.js";

import { ConfessionarioComments } from "./confessionario-comments.js";

/** O par (reação, emoji) que a interface oferece: as do tom de história, não de acolhida. */
const OFERECIDAS: { tipo: ConfessionarioReactionOffered; emoji: string }[] = [
  { tipo: "LAUGH", emoji: "😂" },
  { tipo: "WOW", emoji: "😲" },
  { tipo: "SUPPORT", emoji: "💪" },
];

const HORA = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
});

/**
 * O card de uma confissão: texto e reações contadas, SEM autor — o anonimato é do contrato (a
 * view nem recebe quem contou). As reações mostram APENAS a contagem; tocar de novo tira a minha.
 * Os comentários abrem no próprio card, sem diálogo e sem destacar ninguém.
 */
export function ConfessionarioCard({
  post,
  commentsOpen,
  comments,
  commentsState,
  reactionIcons,
  onToggleComments,
  onReact,
  onUnreact,
  onRemove,
  onComment,
  onRemoveComment,
  onReport,
}: ConfessionarioCardProps) {
  const messages = useMessages().confessionarioCard;
  const hora = HORA.format(new Date(post.createdAt));

  const rotulo = (tipo: ConfessionarioReactionOffered): string =>
    tipo === "LAUGH"
      ? messages.reactLaugh
      : tipo === "WOW"
        ? messages.reactWow
        : messages.reactSupport;

  return (
    <article className="space-y-3 rounded-2xl border border-border p-4">
      <div className="flex items-center gap-2">
        <span
          aria-hidden
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-surface-2 text-text-subtle"
        >
          <ScrollText className="h-4 w-4" />
        </span>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium">{messages.anonymous}</p>

          <p className="text-xs text-text-subtle">{hora}</p>
        </div>

        {post.isMine && (
          <button
            type="button"
            onClick={onRemove}
            className="text-text-subtle transition hover:text-text-strong"
            title={messages.remove}
            aria-label={messages.remove}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>

      <p className="whitespace-pre-wrap text-sm text-text-strong">{post.content}</p>

      <div className="flex items-center gap-2">
        {OFERECIDAS.map(({ tipo, emoji }) => {
          const minha = post.myReaction === tipo;
          const icone = reactionIcons?.[tipo];
          return (
            <button
              key={tipo}
              type="button"
              onClick={() => (minha ? onUnreact() : onReact(tipo))}
              aria-label={rotulo(tipo)}
              aria-pressed={minha}
              className={cn(
                "flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs transition",
                minha
                  ? "border-primary bg-surface-2 text-text-strong"
                  : "border-border text-text-subtle hover:bg-surface-2",
              )}
            >
              {icone ? (
                <img
                  src={icone.src}
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                  decoding="async"
                  className="h-4 w-4 object-contain"
                />
              ) : (
                <span aria-hidden="true">{emoji}</span>
              )}

              <span>{post.reactionSummary[tipo] ?? 0}</span>
            </button>
          );
        })}

        <button
          type="button"
          onClick={onToggleComments}
          aria-expanded={commentsOpen}
          className="ml-auto flex items-center gap-1 text-xs text-text-subtle transition hover:text-text-strong"
        >
          <MessageCircle className="h-4 w-4" /> {messages.comments(post.comments)}
        </button>

        {/* Denunciar é gesto de quem vê, nunca do próprio autor da história. */}
        {!post.isMine && onReport && (
          <button
            type="button"
            onClick={onReport}
            className="flex items-center gap-1 text-xs text-text-subtle transition hover:text-text-strong"
            title={messages.report}
            aria-label={messages.report}
          >
            <Flag className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {commentsOpen && (
        <ConfessionarioComments
          comments={comments}
          state={commentsState}
          onComment={onComment}
          onRemoveComment={onRemoveComment}
        />
      )}
    </article>
  );
}
