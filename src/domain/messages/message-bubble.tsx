import { Check, CheckCheck, CornerUpLeft, Flag, Smile } from "lucide-react";

import { useMessages } from "../../messages/messages-context.js";
import type { MessageBubbleProps } from "../../types/domain/messages/message-bubble-props.js";
import { AppLink } from "../../ui/app-link.js";
import { UserAvatar } from "../avatar/user-avatar.js";
import { UserBadges } from "../badges/user-badges.js";
import { ReactionPicker } from "../post/reactions/reaction-picker.js";

/** Um balão da conversa: avatar do outro, texto, mídia, hora e reações. */
export function MessageBubble({
  message,
  isMe,
  peer,
  profileHref,
  content,
  media,
  timeLabel,
  emojis,
  selecting,
  selected,
  onToggleSelect,
  onReact,
  readByOther = false,
  onReport,
  onReply,
  replyQuote,
}: MessageBubbleProps) {
  const messages = useMessages().messageBubble;

  return (
    <div
      onClick={onToggleSelect}
      className={`flex items-end gap-2 ${isMe ? "justify-end" : "justify-start"} ${
        selecting ? "cursor-pointer" : ""
      }`}
    >
      {!isMe && (
        <AppLink href={profileHref}>
          <span className="relative mb-1 inline-block">
            <UserAvatar src={peer?.avatar} alt={peer?.name} className="h-7 w-7" />
            {/* No avatar, só o primeiro emblema: é enfeite da foto, não a
                linha do nome — empilhar cinco ali viraria borrão. */}
            <UserBadges
              badge={peer?.badge}
              className="absolute -bottom-0.5 -right-0.5 h-3 w-3 ring-1 ring-card"
            />
          </span>
        </AppLink>
      )}
      <div
        className={`min-w-0 max-w-[75%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
          isMe
            ? "rounded-br-md bg-primary text-primary-foreground"
            : "rounded-bl-md bg-card text-foreground"
        } ${selected ? "ring-2 ring-destructive/70" : ""}`}
      >
        {replyQuote && (
          <div
            className={`mb-2 rounded-lg border-l-2 px-2.5 py-1.5 text-xs ${
              isMe
                ? "border-primary-foreground/40 bg-primary-foreground/10 text-primary-foreground/80"
                : "border-primary/40 bg-muted text-text-subtle"
            }`}
          >
            <p className="font-medium">
              {replyQuote.isMe ? "Você" : replyQuote.from}
            </p>

            <p className="line-clamp-2">{replyQuote.text}</p>
          </div>
        )}

        {content}

        {media && <div className="mt-1">{media}</div>}

        <p
          className={`mt-1 flex items-center gap-1 text-xs ${
            isMe ? "justify-end text-primary-foreground/70" : "text-muted-foreground"
          }`}
        >
          {timeLabel}

          {isMe && (
            <span
              title={readByOther ? messages.readReceiptRead : messages.readReceiptSent}
              aria-label={readByOther ? messages.readReceiptRead : messages.readReceiptSent}
            >
              {readByOther ? (
                <CheckCheck className="h-3.5 w-3.5" />
              ) : (
                <Check className="h-3.5 w-3.5" />
              )}
            </span>
          )}
        </p>

        {/* Reações: mesmos emojis dos comentários. A pílula alterna a reação e
            o botão abre o seletor completo. */}
        <div
          className={`mt-1 flex flex-wrap items-center gap-1 ${isMe ? "justify-end" : "justify-start"}`}
          onClick={(event) => event.stopPropagation()}
        >
          {Object.entries(message.reactions ?? {}).map(([type, count]) => (
            <button
              key={type}
              type="button"
              onClick={() => onReact?.(type)}
              className={`inline-flex h-6 items-center gap-1 rounded-full px-1.5 text-xs leading-none transition ${
                message.myReaction === type
                  ? "bg-primary/20 text-primary-text ring-1 ring-primary/40"
                  : isMe
                    ? "bg-primary-foreground/15 text-primary-foreground"
                    : "bg-muted text-text-subtle hover:bg-muted/80"
              }`}
              title={type.toLowerCase()}
            >
              <span className="inline-flex h-4 items-center justify-center text-sm leading-none">
                {emojis[type] ?? type}
              </span>

              <span className="tabular-nums leading-none">{count}</span>
            </button>
          ))}

          <ReactionPicker
            emojis={emojis}
            activeType={message.myReaction ?? null}
            onReact={(type) => onReact?.(type)}
            buttonClassName={`inline-flex h-6 w-6 items-center justify-center rounded-full transition ${
              isMe
                ? "text-primary-foreground/70 hover:bg-primary-foreground/15"
                : "text-text-subtle hover:bg-muted"
            }`}
            buttonTitle={messages.react}
          >
            <Smile className="h-3.5 w-3.5" />
          </ReactionPicker>

          {onReply && (
            <button
              type="button"
              onClick={onReply}
              className={`inline-flex h-6 w-6 items-center justify-center rounded-full transition ${
                isMe
                  ? "text-primary-foreground/70 hover:bg-primary-foreground/15"
                  : "text-text-subtle hover:bg-muted"
              }`}
              title={messages.reply}
              aria-label={messages.reply}
            >
              <CornerUpLeft className="h-3 w-3" />
            </button>
          )}

          {!isMe && onReport && (
            <button
              type="button"
              onClick={onReport}
              className="inline-flex h-6 w-6 items-center justify-center rounded-full text-text-subtle transition hover:bg-destructive/10 hover:text-destructive"
              title={messages.report}
              aria-label={messages.report}
            >
              <Flag className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
