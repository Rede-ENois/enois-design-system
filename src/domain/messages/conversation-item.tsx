import { Loader2 } from "lucide-react";

import { useMessages } from "../../messages/messages-context.js";
import type { ConversationItemProps } from "../../types/domain/messages/conversation-item-props.js";
import { AppLink } from "../../ui/app-link.js";
import { UserAvatar } from "../avatar/user-avatar.js";
import { UserBadges } from "../badges/user-badges.js";
import { StyledName } from "../name/styled-name.js";

/** Uma linha da lista de conversas. Vive fora da rota para o dock poder reaproveitá-la. */
export function ConversationItem({
  conversation,
  peer,
  profileHref,
  timeLabel,
  isActive,
  onSelect,
  selecting,
  selected,
  previewLoading,
}: ConversationItemProps) {
  const messages = useMessages().conversationItem;
  // Person first: a titled thread (proposal, hiring) shows who it is with, and the subject goes
  // in front of the preview. Without a known person, the subject is the name.
  const subject = peer?.name ? conversation.title : null;
  const name = peer?.name ?? conversation.title ?? messages.conversationFallback;
  const preview = [subject, conversation.lastMessage].filter(Boolean).join(" · ");

  return (
    <li>
      <button
        onClick={onSelect}
        className={`flex w-full items-center gap-3 px-4 py-3 text-left transition ${
          selected ? "bg-primary-soft" : isActive ? "bg-primary-soft" : "hover:bg-muted"
        }`}
      >
        {selecting && (
          <span
            aria-hidden
            className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border ${
              selected ? "border-primary bg-primary text-primary-foreground" : "border-border-soft"
            }`}
          >
            {selected ? "✓" : ""}
          </span>
        )}
        <AppLink href={profileHref}>
          <UserAvatar src={peer?.avatar} alt={name} className="h-11 w-11 shrink-0" />
        </AppLink>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between">
            <span className="flex min-w-0 items-center gap-1.5">
              <span className="truncate text-sm font-medium">
                <StyledName name={name} style={peer?.name ? peer.nameStyle : null} />
              </span>

              <UserBadges badges={peer?.badges} badge={peer?.badge} />
            </span>

            <span className="text-xs text-muted-foreground shrink-0 ml-2">{timeLabel}</span>
          </div>

          <div className="flex items-center justify-between gap-2">
            {previewLoading ? (
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                <Loader2 className="h-3 w-3 animate-spin" />
              </span>
            ) : (
              <p className="truncate text-xs text-muted-foreground">{preview}</p>
            )}
            {conversation.unread > 0 && (
              <span className="grid h-5 min-w-5 shrink-0 place-items-center rounded-full bg-primary px-1.5 text-xs font-semibold text-primary-foreground">
                {conversation.unread}
              </span>
            )}
          </div>
        </div>
      </button>
    </li>
  );
}
