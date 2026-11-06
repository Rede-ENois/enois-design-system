import { Plus } from "lucide-react";

import { useMessages } from "../../messages/messages-context.js";
import type { AuthorInfoProps } from "../../types/domain/post/author-info-props.js";
import { AppLink } from "../../ui/app-link.js";
import { UserAvatar } from "../avatar/user-avatar.js";
import { UserBadges } from "../badges/user-badges.js";
import { ContributorTag } from "../name/contributor-tag.js";
import { StyledName } from "../name/styled-name.js";

/**
 * Avatar + Informações empilhadas verticalmente (Nome, Bio/Cargo, Timestamp)
 * e botão de ação primária (+ Seguir) no topo à direita.
 */
export function AuthorInfo({
  authorName,
  authorStyle,
  authorContributor,
  authorAvatar,
  authorAvatarFrame,
  authorBadge,
  authorBadges,
  authorHref,
  timeLabel,
  community,
  fallbackClassName,
  onFollowCommunity,
  followPending,
  renderAuthorTrigger,
  authorHeadline,
  authorBio,
  authorConnectionDegree,
  onFollowAuthor,
  followAuthorPending,
  isFollowingAuthor,
}: AuthorInfoProps) {
  const messages = useMessages().authorInfo;
  const avatar = (
    <UserAvatar
      frame={authorAvatarFrame}
      src={authorAvatar}
      alt={authorName}
      fallbackClassName={fallbackClassName}
      className="h-12 w-12 rounded-full shrink-0"
    />
  );
  const name = <StyledName name={authorName} style={authorStyle} />;

  const followAction = onFollowAuthor ? (
    <button
      type="button"
      onClick={onFollowAuthor}
      disabled={followAuthorPending}
      className="flex items-center gap-1 text-sm font-semibold text-primary transition hover:text-primary-hover disabled:opacity-60 shrink-0 self-start mt-0.5"
    >
      <Plus className="h-4 w-4" />

      <span>{isFollowingAuthor ? "Seguindo" : "Seguir"}</span>
    </button>
  ) : community && !community.joined && onFollowCommunity ? (
    <button
      type="button"
      onClick={onFollowCommunity}
      disabled={followPending}
      className="flex items-center gap-1 text-sm font-semibold text-primary transition hover:text-primary-hover disabled:opacity-60 shrink-0 self-start mt-0.5"
    >
      <Plus className="h-4 w-4" />

      <span>{followPending ? messages.sending : messages.follow}</span>
    </button>
  ) : null;

  return (
    <div className="flex min-w-0 flex-[1_1_16rem] items-start gap-3">
      {renderAuthorTrigger ? (
        renderAuthorTrigger(avatar, "avatar")
      ) : (
        <AppLink href={authorHref} className="shrink-0">
          {avatar}
        </AppLink>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Linha 1: Nome (em destaque/bold) + Badges + Conexão */}
        <div className="flex min-w-0 flex-wrap items-baseline gap-x-1.5 gap-y-0.5">
          {renderAuthorTrigger ? (
            <span className="min-w-0 max-w-full truncate text-sm font-bold text-text-strong hover:underline">
              {renderAuthorTrigger(name, "name")}
            </span>
          ) : (
            <AppLink
              href={authorHref}
              className="min-w-0 max-w-full truncate text-sm font-bold text-text-strong hover:underline"
            >
              {name}
            </AppLink>
          )}

          {authorConnectionDegree && (
            <span className="text-xs font-normal text-text-subtle">• {authorConnectionDegree}</span>
          )}

          <UserBadges badges={authorBadges} badge={authorBadge} />
        </div>

        {/* Linha 2: Bio/Cargo/Comunidade (texto menor, secundária/cinza) */}
        {(authorHeadline || authorBio || community) && (
          <div className="mt-0.5 truncate text-xs text-text-subtle leading-tight">
            {authorHeadline ||
              authorBio ||
              (community ? (
                <span>
                  {messages.publishedIn}{" "}
                  <AppLink
                    href={community.href}
                    className="font-medium text-text-subtle hover:text-primary hover:underline"
                  >
                    {community.name}
                  </AppLink>
                </span>
              ) : null)}
          </div>
        )}

        {/* Linha 3: Timestamp (texto menor, cinza) */}
        <div className="mt-0.5 flex items-center gap-1.5 text-xs text-text-date leading-tight">
          <span>{timeLabel.startsWith("há") ? timeLabel : messages.time(timeLabel)}</span>
        </div>

        {authorContributor && (
          <div className="mt-1">
            <ContributorTag color={authorContributor.color} />
          </div>
        )}
      </div>

      {/* Ação primária no topo à direita */}
      {followAction}
    </div>
  );
}
