import { ArrowLeft } from "lucide-react";

import { useMessages } from "../../messages/messages-context.js";
import type { ConversationHeaderProps } from "../../types/domain/messages/conversation-header-props.js";
import { AppLink } from "../../ui/app-link.js";
import { UserAvatar } from "../avatar/user-avatar.js";
import { UserBadges } from "../badges/user-badges.js";
import { StyledName } from "../name/styled-name.js";

/** Cabeçalho do filão: quem é o outro, voltar para a lista e a ação da tela. */
export function ConversationHeader({
  conversationTitle,
  peer,
  profileHref,
  onBack,
  action,
}: ConversationHeaderProps) {
  const messages = useMessages().conversationHeader;
  const title = conversationTitle ?? peer?.name ?? messages.conversationFallback;
  // A titled thread (proposal, hiring) names the subject; who is on the other side goes below it.
  const subtitle = conversationTitle
    ? [peer?.name, peer?.headline].filter(Boolean).join(" · ")
    : peer?.headline;

  return (
    <header className="flex items-center gap-3 border-b border-border p-4">
      <div className="flex items-center gap-3 min-w-0">
        {onBack && (
          <button
            onClick={onBack}
            aria-label={messages.back}
            title={messages.back}
            className="grid h-8 w-8 shrink-0 place-items-center rounded-full hover:bg-muted md:hidden"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
        )}
        <AppLink href={profileHref}>
          <UserAvatar src={peer?.avatar} alt={title} className="h-10 w-10 shrink-0" />
        </AppLink>

        <div className="min-w-0">
          <span className="flex items-center gap-1.5">
            <span className="truncate font-semibold">
              {conversationTitle ?? <StyledName name={title} style={peer?.nameStyle} />}
            </span>

            <UserBadges badges={peer?.badges} badge={peer?.badge} />
          </span>
          {subtitle && <p className="truncate text-xs text-muted-foreground">{subtitle}</p>}
        </div>
      </div>

      {action && <div className="ml-auto shrink-0">{action}</div>}
    </header>
  );
}
