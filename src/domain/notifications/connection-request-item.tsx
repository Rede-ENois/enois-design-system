import { Check, X } from "lucide-react";

import { useAdapters } from "../../adapters/adapters-context.js";
import { useMessages } from "../../messages/messages-context.js";
import type { ConnectionRequestItemProps } from "../../types/domain/notifications/connection-request-item-props.js";
import { AppLink } from "../../ui/app-link.js";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar.js";

/** Card de solicitação de conexão dentro do sininho. O perfil já vem resolvido pelo pai. */
export function ConnectionRequestItem({
  request,
  onAccept,
  onReject,
  accepting,
  rejecting,
  onNavigate,
}: ConnectionRequestItemProps) {
  const messages = useMessages().connectionRequestItem;
  const { resolveMediaUrl } = useAdapters();
  const profile = request.profile;
  const name = profile?.name ?? messages.someone;
  const username = profile?.username;
  const avatar = profile?.avatar;
  const headline = profile?.headline;

  const avatarImage = (
    <Avatar className="h-11 w-11">
      {avatar && <AvatarImage src={resolveMediaUrl(avatar)} alt={name} />}
      <AvatarFallback className="bg-surface-2 text-sm font-bold text-text-subtle">
        {name[0]?.toUpperCase() ?? "?"}
      </AvatarFallback>
    </Avatar>
  );

  return (
    <div className="flex items-start gap-3 px-4 py-3.5">
      {request.profileHref ? (
        <AppLink href={request.profileHref} onClick={onNavigate} className="shrink-0 rounded-full">
          {avatarImage}
        </AppLink>
      ) : (
        <span className="shrink-0">{avatarImage}</span>
      )}

      <div className="min-w-0 flex-1">
        <p className="text-[15px] leading-snug">
          <span className="font-extrabold text-text-strong">{name}</span>
          {username && <span className="ml-1 text-text-subtle">@{username}</span>}
        </p>

        {headline && <p className="mt-0.5 truncate text-sm text-text-subtle">{headline}</p>}

        <div className="mt-2.5 flex gap-2">
          <button
            type="button"
            disabled={accepting || rejecting}
            onClick={() => onAccept(request.fromUserId)}
            className="inline-flex h-9 items-center gap-1.5 rounded-full bg-primary px-4 text-sm font-bold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-60"
          >
            <Check aria-hidden className="h-4 w-4" />
            {messages.accept}
          </button>

          <button
            type="button"
            disabled={accepting || rejecting}
            onClick={() => onReject(request.fromUserId)}
            className="inline-flex h-9 items-center gap-1.5 rounded-full bg-surface-2 px-4 text-sm font-bold text-text-strong transition hover:bg-primary-soft disabled:opacity-60"
          >
            <X aria-hidden className="h-4 w-4" />
            {messages.reject}
          </button>
        </div>
      </div>

      <span className="shrink-0 pt-0.5 text-[13px] text-text-date">{request.dateLabel}</span>
    </div>
  );
}
