import { useState } from "react";

import { Loader2, MessageCircle, Reply, Trash2 } from "lucide-react";

import { cn } from "../../lib/utils.js";
import { useMessages } from "../../messages/messages-context.js";
import type { ColagemCommentInput } from "../../types/domain/colagem/colagem-comment-input.js";
import type { ColagemCommentView } from "../../types/domain/colagem/colagem-comment-view.js";
import type { ColagemCommentsState } from "../../types/domain/colagem/colagem-comments-state.js";
import type { ColagemPhotoDetail } from "../../types/domain/colagem/colagem-photo-detail.js";
import type { ComposerMediaDraft } from "../../types/domain/post/composer-media-draft.js";
import { Button } from "../../ui/button.js";
import { Textarea } from "../../ui/textarea.js";
import { UserAvatar } from "../avatar/user-avatar.js";
import { StyledName } from "../name/styled-name.js";
import { ComposerMediaPicker } from "../post/composer-media-picker.js";

/** O teto do comentário no backend (ColagemService.MAX_COMMENT); contar aqui evita o 400. */
const MAX_COMMENT = 800;

/**
 * As contribuições da foto aberta: comentário leva texto e/ou UMA foto, e resposta a comentário
 * fotográfico é só em texto (o backend recusa foto em resposta de foto — aqui nem se oferece o
 * anexo). Remover é gesto do próprio autor; responder nunca deixa de existir.
 */
export function ColagemComments({
  photo,
  comments,
  state,
  attachment,
  onFiles,
  onRemoveAttachment,
  onComment,
  onRemoveComment,
}: {
  photo: ColagemPhotoDetail;
  comments: ColagemCommentView[];
  state: ColagemCommentsState;
  attachment: ComposerMediaDraft | null;
  onFiles: (files: File[]) => void;
  onRemoveAttachment: () => void;
  onComment: (input: ColagemCommentInput) => Promise<void>;
  onRemoveComment: (commentId: string) => void;
}) {
  const messages = useMessages().colagemComments;
  const [texto, setTexto] = useState("");
  const [respondendo, setRespondendo] = useState<ColagemCommentView | null>(null);
  const [enviando, setEnviando] = useState(false);

  const anexoBloqueado = respondendo?.mediaUrl != null;
  const subindo = Boolean(attachment && attachment.status === "checking");

  const contribuir = async () => {
    if (enviando || subindo) return;
    if (!texto.trim() && !attachment?.mediaId) return;
    setEnviando(true);
    try {
      await onComment({
        parentCommentId: respondendo?.id,
        content: texto.trim() || undefined,
        mediaId: attachment?.mediaId,
      });
      setTexto("");
      setRespondendo(null);
    } catch {
      // A recusa já foi avisada por quem compõe; aqui o rascunho fica de pé para corrigir.
    } finally {
      setEnviando(false);
    }
  };

  return (
    <section className="space-y-3">
      <h3 className="text-sm font-semibold">{messages.title(photo.comments)}</h3>

      {state.kind === "loading" && (
        <p className="flex items-center gap-2 py-4 text-sm text-text-subtle">
          <Loader2 className="h-4 w-4 animate-spin" /> {messages.loading}
        </p>
      )}

      {state.kind === "error" && <p className="text-xs text-text-subtle">{messages.error}</p>}

      {state.kind === "ready" && comments.length === 0 && (
        <p className="text-xs text-text-subtle">{messages.empty}</p>
      )}

      <ul className="space-y-3">
        {comments.map((comment) => (
          <ColagemCommentRow
            key={comment.id}
            comment={comment}
            onReply={() => setRespondendo(comment)}
            onRemove={() => onRemoveComment(comment.id)}
          />
        ))}
      </ul>

      <div className="space-y-2 rounded-xl border border-border p-3">
        {respondendo && (
          <p className="flex items-center gap-1.5 text-xs text-text-subtle">
            <MessageCircle className="h-3 w-3" />

            <span>{messages.replyPlaceholder(respondendo.authorName ?? "")}</span>

            <button type="button" onClick={() => setRespondendo(null)} title={messages.cancelReply}>
              ×
            </button>
          </p>
        )}

        <Textarea
          value={texto}
          onChange={(event) => setTexto(event.target.value)}
          placeholder={
            respondendo
              ? messages.replyPlaceholder(respondendo.authorName ?? "")
              : messages.placeholder
          }
          aria-label={messages.placeholder}
          rows={2}
          maxLength={MAX_COMMENT}
        />

        {anexoBloqueado ? (
          <p className="text-xs text-text-subtle">{messages.photoBlockedOnReply}</p>
        ) : (
          <>
            <ComposerMediaPicker
              items={attachment ? [attachment] : []}
              onFiles={onFiles}
              onRemove={onRemoveAttachment}
              multiple={false}
            />
            {!attachment && (
              <p className="flex items-center gap-1.5 text-xs text-text-subtle">
                {messages.photoInComment}
              </p>
            )}
          </>
        )}

        <Button
          size="sm"
          onClick={() => void contribuir()}
          disabled={enviando || (!texto.trim() && !attachment?.mediaId)}
          className="rounded-full"
        >
          {enviando ? messages.sending : messages.send}
        </Button>
      </div>
    </section>
  );
}

function ColagemCommentRow({
  comment,
  onReply,
  onRemove,
}: {
  comment: ColagemCommentView;
  onReply: () => void;
  onRemove: () => void;
}) {
  const messages = useMessages().colagemComments;
  const [revelada, setRevelada] = useState(!comment.mediaSpoiler);

  return (
    <li className="flex gap-2">
      <UserAvatar
        src={comment.authorAvatar}
        alt={comment.authorName}
        className="h-8 w-8 shrink-0"
      />

      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex items-center gap-2">
          <StyledName
            name={comment.authorName ?? ""}
            style={comment.authorStyle}
            className="text-xs font-medium"
          />
          {comment.isMine && (
            <button
              type="button"
              onClick={onRemove}
              className="text-text-subtle transition hover:text-text-strong"
              title={messages.removeComment}
              aria-label={messages.removeComment}
            >
              <Trash2 className="h-3 w-3" />
            </button>
          )}
        </div>
        {comment.content && <p className="text-sm text-text-strong">{comment.content}</p>}
        {comment.mediaUrl && (
          <button
            type="button"
            onClick={() => setRevelada(true)}
            disabled={revelada}
            className={cn("block", !revelada && "cursor-zoom-in")}
            title={revelada ? undefined : messages.revealPhoto}
            aria-label={revelada ? messages.photoInComment : messages.revealPhoto}
          >
            <img
              src={comment.mediaUrl}
              alt={messages.photoInComment}
              className={cn("max-h-40 rounded-lg object-cover", !revelada && "blur-md")}
              loading="lazy"
            />
          </button>
        )}
        <button
          type="button"
          onClick={onReply}
          className="flex items-center gap-1 text-xs text-text-subtle hover:text-text-strong"
        >
          <Reply className="h-3 w-3" /> {messages.reply}
        </button>
      </div>
    </li>
  );
}
