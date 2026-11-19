import { useEffect, useRef } from "react";

import { useAdapters } from "../../adapters/adapters-context.js";
import { cn } from "../../lib/utils.js";
import { useMessages } from "../../messages/messages-context.js";
import type { ProfileCardProps } from "../../types/domain/cosmetics/profile-card-props.js";
import { round, seededRandom } from "../avatar/avatar-frames.js";
import { UserAvatar } from "../avatar/user-avatar.js";
import { UserBadges } from "../badges/user-badges.js";
import { StyledName } from "../name/styled-name.js";

import { cardTheme, cardThemeStyle } from "./card-themes.js";
import { CosmeticIcon } from "./cosmetic-icon.js";
import { motionAllowed, tiltAllowed } from "./motion-allowed.js";
import { OfficialBanner } from "./official-banner.js";
import { OFFICIAL_BANNERS } from "./official-banners.js";
import { ProfileEffect } from "./profile-effect.js";
import { profileEffect } from "./profile-effects.js";

const TILT_X_DEG = 5;
const TILT_Y_DEG = 6;
const TILT_PROPS = ["--rx", "--ry", "--sheen"];

/** Where the ambient sparkles of an equipped effect sit, the same on server and browser. */
const AMBIENT = (() => {
  const rnd = seededRandom(77);
  return Array.from({ length: 16 }, () => ({
    left: `${round(rnd() * 94)}%`,
    top: `${round(4 + rnd() * 92)}%`,
    animationDelay: `${round(-rnd() * 2.4)}s`,
    animationDuration: `${round(2 + rnd() * 2)}s`,
    transform: `scale(${round(0.6 + rnd() * 0.6)})`,
  }));
})();

/**
 * The profile card, Discord style: banner, avatar with frame, status bubble, styled name,
 * badges, meta line and bio, painted by the card theme. Without cosmetics it uses the design
 * system tokens. On hover-capable pointers it tilts a little and catches a sheen.
 */
export function ProfileCard({
  profile,
  onAvatarClick,
  bannerSlot,
  nameAddon,
  meta,
  bio,
  actions,
  children,
  effectReplayKey,
  compact = false,
  className,
}: ProfileCardProps) {
  const messages = useMessages().profileCard;
  const { resolveMediaUrl } = useAdapters();
  const cardRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (compact || !card || !window.matchMedia?.("(hover: hover)").matches || !motionAllowed()) {
      return;
    }
    const leave = () => TILT_PROPS.forEach((prop) => card.style.removeProperty(prop));
    const move = (event: PointerEvent) => {
      // Read on every move so the person's switch applies at once, without remounting the card.
      if (!tiltAllowed()) {
        leave();
        return;
      }
      const box = card.getBoundingClientRect();
      const x = (event.clientX - box.left) / box.width;
      const y = (event.clientY - box.top) / box.height;
      card.style.setProperty("--ry", `${round((x - 0.5) * TILT_Y_DEG)}deg`);
      card.style.setProperty("--rx", `${round((0.5 - y) * TILT_X_DEG)}deg`);
      card.style.setProperty("--mx", `${round(x * 100)}%`);
      card.style.setProperty("--my", `${round(y * 100)}%`);
      card.style.setProperty("--sheen", "1");
    };
    card.addEventListener("pointermove", move);
    card.addEventListener("pointerleave", leave);
    return () => {
      card.removeEventListener("pointermove", move);
      card.removeEventListener("pointerleave", leave);
      leave();
    };
  }, [compact]);

  const badges = (profile.badges?.length ? profile.badges : [profile.badge]).filter(
    (badge): badge is string => Boolean(badge),
  );
  const officialBanner =
    profile.bannerItem && Object.hasOwn(OFFICIAL_BANNERS, profile.bannerItem)
      ? profile.bannerItem
      : null;
  const photo = resolveMediaUrl(profile.banner);
  const effect = profileEffect(profile.profileEffect);
  const metaLine =
    meta ??
    [profile.username ? `@${profile.username}` : null, profile.pronouns]
      .filter(Boolean)
      .join(" · ");
  const status = profile.statusText?.trim();

  return (
    <article
      ref={cardRef}
      className={cn(
        "cos-card",
        compact && "cos-card--compact",
        cardTheme(profile.cardTheme) && "cos-card--themed",
        className,
      )}
      style={cardThemeStyle(profile.cardTheme)}
      aria-label={messages.label(profile.name)}
    >
      <div className="cos-card__banner">
        {officialBanner ? (
          <OfficialBanner banner={officialBanner} />
        ) : (
          (bannerSlot ?? (photo && <img src={photo} alt="" className="object-cover" />))
        )}
      </div>

      <div className="cos-card__head">
        {onAvatarClick ? (
          <button
            type="button"
            aria-label={messages.avatarAction}
            onClick={onAvatarClick}
            className="cos-card__avatar cos-card__avatar--action"
          >
            <span className="cos-card__avatar-ring" aria-hidden />
            <UserAvatar
              src={profile.avatar}
              alt={profile.name}
              frame={profile.avatarFrame}
              className="h-full w-full"
            />
          </button>
        ) : (
          <div className="cos-card__avatar">
            <span className="cos-card__avatar-ring" aria-hidden />
            <UserAvatar
              src={profile.avatar}
              alt={profile.name}
              frame={profile.avatarFrame}
              className="h-full w-full"
            />
          </div>
        )}

        {status && (
          <p className="cos-card__status">
            <CosmeticIcon icon={profile.statusIcon} />

            <span>
              <span className="sr-only">{messages.status}: </span>
              {status}
            </span>
          </p>
        )}
      </div>

      <div className="cos-card__body">
        <div className="cos-card__title">
          <h2 className="cos-card__name">
            <StyledName name={profile.name} style={profile.nameStyle} />
          </h2>
          {nameAddon}
        </div>

        {(metaLine || badges.length > 0) && (
          <div className="cos-card__meta">
            {metaLine && <span>{metaLine}</span>}
            {badges.length > 0 && (
              <span className="cos-card__badges">
                <UserBadges badges={badges} />
              </span>
            )}
          </div>
        )}

        {bio ?? (profile.bio && <p className="cos-card__bio">{profile.bio}</p>)}
        {actions && <div className="cos-card__actions">{actions}</div>}
        {children}
      </div>

      {effect && !compact && (
        <span className="cos-card__ambient" aria-hidden>
          {AMBIENT.map((style, i) => (
            <span key={i} className="cos-anim cos-blink" style={style}>
              <CosmeticIcon icon={effect.icon} />
            </span>
          ))}
        </span>
      )}
      {!compact && <ProfileEffect effect={profile.profileEffect} replayKey={effectReplayKey} />}
    </article>
  );
}
