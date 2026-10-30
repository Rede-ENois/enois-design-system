import { useState } from "react";

import { CircleCheck, Flag, Heart, MessageCircle, Pencil, Pin, PinOff, Trash2 } from "lucide-react";

import { useAdapters } from "../../../adapters/adapters-context.js";
import { hideExternalPageUrls } from "../../../lib/shared-links.js";
import { useMessages } from "../../../messages/messages-context.js";
import type { CommentItemProps } from "../../../types/domain/post/comment-item-props.js";
import { AppLink } from "../../../ui/app-link.js";
import { Button } from "../../../ui/button.js";
import { ReadMore } from "../../../ui/read-more.js";
import { UserAvatar } from "../../avatar/user-avatar.js";
import { UserBadges } from "../../badges/user-badges.js";
import { ContributorTag } from "../../name/contributor-tag.js";
import { StyledName } from "../../name/styled-name.js";
import { LinkPreviews } from "../media/link-previews.js";
import { ReactionPicker } from "../reactions/reaction-picker.js";
import { ReactionsSummary } from "../reactions/reactions-summary.js";

/** Um comentário (com responder, reagir e excluir). */
export function CommentItem<T extends string>({
  comment,
  content,
  edited,
  profileHref,
  timeLabel,
  replyingTo,
  isOwner,
  canPin,
  pinning = false,
  canAccept = false,
  acceptPending = false,
  onAccept,
  onUnaccept,
  emojis,
  reaction,
  onReact,
  reactionSummary,
  onShowReactions,
  onReply,
  onTogglePin,
  onDelete,
  onReport,
  saving = false,
  editError,
  onSaveEdit,
  onCancelEdit,
  renderRichText,
  renderMediaGrid,
  renderEditField,
  reportDialog,
  reactionsDialog,
  renderAuthorTrigger,
}: CommentItemProps<T>) {
  const messages = useMessages().commentItem;
  const { isOwnMediaUrl } = useAdapters();
  const [editing, setEditing] = useState(false);
  const [editDraft, setEditDraft] = useState(content);
  // Com o resumo, o total acompanha as pílulas otimistas; sem ele, vale o total do servidor.
  const reactionTotal = reactionSummary
    ? Object.values<number | undefined>(reactionSummary).reduce<number>(
        (total, count) => total + (count ?? 0),
        0,
      )
    : (comment.reactionCount ?? 0);

  const saveEdit = async () => {
    const next = editDraft.trim();
    if (!next || next === content) {
      setEditing(false);
      setEditDraft(content);
      return;
    }
    if (await onSaveEdit(next)) setEditing(false);
  };

  // Nome e foto levam ao perfil de quem comentou (quando o perfil existe).
  const profileLink = renderAuthorTrigger ? (
    <span className="min-w-0 max-w-full text-xs font-medium text-text-strong hover:underline">
      {renderAuthorTrigger(
        <StyledName name={comment.authorName} style={comment.authorStyle} />,
        "name",
      )}
    </span>
  ) : profileHref ? (
    <AppLink
      href={profileHref}
      className="min-w-0 max-w-full text-xs font-medium text-text-strong hover:underline"
    >
      <StyledName name={comment.authorName} style={comment.authorStyle} />
    </AppLink>
  ) : (
    <span className="min-w-0 max-w-full text-xs font-medium text-text-strong">
      <StyledName name={comment.authorName} style={comment.authorStyle} />
    </span>
  );

  const avatar = (
    <UserAvatar
      frame={comment.authorAvatarFrame}
      src={comment.authorAvatar}
      alt={comment.authorName}
      className="h-8 w-8 shrink-0"
    />
  );

  return (
    <div className="flex gap-3">
      {renderAuthorTrigger ? (
        <span className="shrink-0">{renderAuthorTrigger(avatar, "avatar")}</span>
      ) : profileHref ? (
        <AppLink
          href={profileHref}
          className="shrink-0 transition hover:opacity-80"
          aria-label={messages.viewProfile(comment.authorName)}
        >
          {avatar}
        </AppLink>
      ) : (
        avatar
      )}

      <div className="min-w-0 flex-1">
        <div
          className={`rounded-xl bg-surface-1 px-3 py-2 ${
            comment.accepted ? "border-l-2 border-growth/70" : ""
          }`}
        >
          {comment.accepted && (
            <p className="mb-1 flex items-center gap-1 text-[11px] font-medium text-growth">
              <CircleCheck className="h-3 w-3" aria-hidden />
              {messages.accepted}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-2">
            {profileLink}

            {comment.authorContributor && (
              <ContributorTag color={comment.authorContributor.color} />
            )}

            <UserBadges badges={comment.authorBadges} badge={comment.authorBadge} />
            {replyingTo && (
              <span className="text-xs font-normal text-text-subtle">
                {messages.replyingTo(replyingTo)}
              </span>
            )}
            {comment.pinned && (
              <span className="inline-flex items-center gap-1 rounded-full bg-primary-soft px-2 py-0.5 text-[11px] font-medium text-primary-text">
                <Pin className="h-3 w-3" />

                <>{messages.pinned}</>
              </span>
            )}

            <span className="text-xs font-normal text-text-subtle">
              {timeLabel}
              {edited ? ` · ${messages.edited}` : ""}
            </span>
          </div>

          {editing ? (
            <div className="mt-1 space-y-2">
              {renderEditField(editDraft, setEditDraft, () => {
                if (!saving && editDraft.trim()) void saveEdit();
              })}

              {editError && <p className="text-xs text-destructive">{editError}</p>}

              <div className="flex flex-wrap items-center gap-2">
                <Button
                  size="sm"
                  className="rounded-full"
                  disabled={saving || !editDraft.trim()}
                  onClick={() => void saveEdit()}
                >
                  {saving ? messages.saving : messages.save}
                </Button>

                <Button
                  size="sm"
                  variant="ghost"
                  className="rounded-full"
                  onClick={() => {
                    setEditing(false);
                    setEditDraft(content);
                    onCancelEdit();
                  }}
                >
                  {messages.cancel}
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="mt-0.5">
                <ReadMore
                  clampClassName="line-clamp-5"
                  moreLabel={messages.readMore}
                  lessLabel={messages.readLess}
                >
                  {renderRichText({
                    content: hideExternalPageUrls(content, isOwnMediaUrl),
                    mediaSpoiler: comment.mediaSpoiler,
                    className:
                      "whitespace-pre-line break-words text-sm font-normal leading-relaxed text-text-strong",
                  })}
                </ReadMore>
              </div>

              {comment.mediaIds && comment.mediaIds.length > 0 && (
                <div className="mt-2 max-w-full">
                  {renderMediaGrid({
                    mediaIds: comment.mediaIds,
                    compact: true,
                    mediaSpoiler: comment.mediaSpoiler,
                  })}
                </div>
              )}

              <LinkPreviews content={content} />
            </>
          )}
        </div>

        {reactionSummary && (
          <ReactionsSummary
            summary={reactionSummary}
            emojis={emojis}
            activeType={reaction}
            clickable
            compact
            onToggle={onReact}
          />
        )}

        <div className="mt-1 flex flex-wrap items-center gap-x-1 gap-y-0.5 px-3 text-text-subtle">
          <ReactionPicker
            emojis={emojis}
            activeType={reaction}
            onReact={onReact}
            buttonClassName={`flex h-7 items-center gap-1 rounded-full px-1.5 transition-colors hover:bg-surface-2 hover:text-primary ${
              reaction ? "text-primary" : ""
            }`}
            buttonTitle={messages.react}
          >
            {reaction ? (
              <span className="text-sm leading-none">{emojis[reaction]}</span>
            ) : (
              <Heart className="h-3.5 w-3.5" />
            )}
          </ReactionPicker>

          {reactionTotal > 0 &&
            (onShowReactions ? (
              <button
                type="button"
                onClick={onShowReactions}
                title={messages.seeWho(reactionTotal)}
                aria-label={messages.seeWho(reactionTotal)}
                aria-haspopup="dialog"
                className="flex h-7 items-center rounded-full px-1 text-xs tabular-nums transition-colors hover:bg-surface-2 hover:text-primary hover:underline hover:decoration-dotted hover:underline-offset-4"
              >
                {reactionTotal}
              </button>
            ) : (
              <span className="text-xs tabular-nums">{reactionTotal}</span>
            ))}

          <button
            onClick={onReply}
            title={messages.reply}
            aria-label={messages.reply}
            className="grid h-7 w-7 place-items-center rounded-full transition-colors hover:bg-surface-2 hover:text-primary"
          >
            <MessageCircle className="h-3.5 w-3.5" />
          </button>

          {canPin && !editing && (
            <button
              onClick={onTogglePin}
              disabled={pinning}
              title={comment.pinned ? messages.unpin : messages.pin}
              aria-label={comment.pinned ? messages.unpin : messages.pin}
              className={`grid h-7 w-7 place-items-center rounded-full transition-colors hover:bg-surface-2 hover:text-primary disabled:opacity-50 ${
                comment.pinned ? "text-primary" : ""
              }`}
            >
              {comment.pinned ? (
                <PinOff className="h-3.5 w-3.5" />
              ) : (
                <Pin className="h-3.5 w-3.5" />
              )}
            </button>
          )}

          {canAccept && !editing && (comment.accepted ? onUnaccept : onAccept) && (
            <button
              type="button"
              onClick={comment.accepted ? onUnaccept : onAccept}
              disabled={acceptPending}
              aria-busy={acceptPending || undefined}
              className={`flex h-7 items-center gap-1 rounded-full px-2 text-xs transition-colors hover:bg-surface-2 disabled:opacity-50 ${
                comment.accepted ? "hover:text-text-strong" : "hover:text-growth"
              }`}
            >
              <CircleCheck className="h-3.5 w-3.5" aria-hidden />
              {comment.accepted ? messages.unaccept : messages.accept}
            </button>
          )}

          {isOwner && !editing && (
            <button
              onClick={() => {
                setEditDraft(content);
                setEditing(true);
              }}
              title={messages.edit}
              aria-label={messages.edit}
              className="grid h-7 w-7 place-items-center rounded-full transition-colors hover:bg-surface-2 hover:text-primary"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
          )}

          {isOwner && (
            <button
              onClick={onDelete}
              title={messages.delete}
              aria-label={messages.delete}
              className="grid h-7 w-7 place-items-center rounded-full text-destructive/70 transition-colors hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}

          {!isOwner && (
            <button
              onClick={onReport}
              title={messages.report}
              aria-label={messages.report}
              className="grid h-7 w-7 place-items-center rounded-full transition-colors hover:bg-surface-2 hover:text-primary"
            >
              <Flag className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {reportDialog}
      {reactionsDialog}
    </div>
  );
}
