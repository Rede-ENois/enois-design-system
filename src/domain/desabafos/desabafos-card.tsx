import { Flag, MessageCircle, Trash2 } from "lucide-react";

import { cn } from "../../lib/utils.js";
import { useMessages } from "../../messages/messages-context.js";
import type { DesabafosCardProps } from "../../types/domain/desabafos/desabafos-card-props.js";
import type { DesabafosReactionOffered } from "../../types/domain/desabafos/desabafos-reaction-offered.js";
import { UserAvatar } from "../avatar/user-avatar.js";
import { StyledName } from "../name/styled-name.js";

import { DesabafosComments } from "./desabafos-comments.js";

/** O par que a interface oferece: as reações de apoio. O tipo extra vem do mapa de emoji. */
const OFERECIDAS: { tipo: DesabafosReactionOffered; emoji: string }[] = [
  { tipo: "LOVE", emoji: "❤️" },
  { tipo: "SUPPORT", emoji: "💪" },
];

const HORA = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
});

/**
 * O card de um desabafo: autor, texto e apoio contado. As reações são só as de apoio e mostram
 * APENAS a contagem — nunca a lista de quem reagiu; tocar de novo tira o meu apoio. As acolhidas
 * abrem no próprio card, sem diálogo e sem destacar ninguém: aqui não há ranking nem destaque.
 */
export function DesabafosCard({
  post,
  commentsOpen,
  comments,
  commentsState,
  onToggleComments,
  onReact,
  onUnreact,
  onRemove,
  onComment,
  onRemoveComment,
  onReport,
}: DesabafosCardProps) {
  const messages = useMessages().desabafosCard;
  const hora = HORA.format(new Date(post.createdAt));

  return (
    <article className="space-y-3 rounded-2xl border border-border p-4">
      <div className="flex items-center gap-2">
        <UserAvatar src={post.authorAvatar} alt={post.authorName} className="h-9 w-9 shrink-0" />

        <div className="min-w-0 flex-1">
          <StyledName
            name={post.authorName ?? ""}
            style={post.authorStyle}
            className="text-sm font-medium"
          />

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
          return (
            <button
              key={tipo}
              type="button"
              onClick={() => (minha ? onUnreact() : onReact(tipo))}
              aria-label={tipo === "LOVE" ? messages.reactLove : messages.reactSupport}
              aria-pressed={minha}
              className={cn(
                "flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs transition",
                minha
                  ? "border-primary bg-surface-2 text-text-strong"
                  : "border-border text-text-subtle hover:bg-surface-2",
              )}
            >
              <span aria-hidden="true">{emoji}</span>

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
          <MessageCircle className="h-4 w-4" /> {messages.acolhidas(post.comments)}
        </button>

        {/* Denunciar é gesto de quem vê, nunca do próprio autor do desabafo. */}
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
        <DesabafosComments
          comments={comments}
          state={commentsState}
          onComment={onComment}
          onRemoveComment={onRemoveComment}
        />
      )}
    </article>
  );
}
