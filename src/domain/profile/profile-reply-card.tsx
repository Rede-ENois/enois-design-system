import { MessageCircleReply } from "lucide-react";

import { useMessages } from "../../messages/messages-context.js";
import type { ProfileReplyCardProps } from "../../types/domain/profile/profile-reply-card-props.js";
import { UserAvatar } from "../avatar/user-avatar.js";

export function ProfileReplyCard({
  authorName,
  authorAvatar,
  content,
  renderContent,
  replyToAuthor,
  replyToSnippet,
  onClick,
}: ProfileReplyCardProps) {
  const messages = useMessages().profileReplyCard;

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-xl border border-border-soft bg-surface-1 p-4 text-left transition-colors hover:bg-muted"
    >
      {replyToAuthor && (
        <p className="mb-2 flex items-center gap-1 truncate text-xs text-muted-foreground">
          <MessageCircleReply className="size-3.5 shrink-0" aria-hidden="true" />
          {messages.replyTo(replyToAuthor)}
        </p>
      )}
      {replyToSnippet && (
        <p className="mb-3 line-clamp-2 text-xs text-muted-foreground">{replyToSnippet}</p>
      )}
      <div className="flex items-start gap-3">
        <UserAvatar src={authorAvatar} alt={authorName} className="h-8 w-8 shrink-0" />

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-text-strong">{authorName}</p>

          <div className="mt-1 whitespace-pre-wrap break-words text-sm text-text-subtle">
            {renderContent ? renderContent(content) : content}
          </div>
        </div>
      </div>
    </button>
  );
}
