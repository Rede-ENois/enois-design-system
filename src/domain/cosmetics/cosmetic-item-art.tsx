import type { CSSProperties } from "react";

import { useMessages } from "../../messages/messages-context.js";
import type { CosmeticItemArtProps } from "../../types/domain/cosmetics/cosmetic-item-art-props.js";
import type { ProfileNameTheme } from "../../types/lib/theme/profile-name-theme.js";
import { UserAvatar } from "../avatar/user-avatar.js";
import { OfficialBadge } from "../badges/official-badge.js";
import { StyledName } from "../name/styled-name.js";
import { gardenStyleOf } from "../profile/profile-garden-styles.js";
import { ProfileGarden } from "../profile/profile-garden.js";

import { cardTheme } from "./card-themes.js";
import { CosmeticIcon } from "./cosmetic-icon.js";
import { Nameplate } from "./nameplate.js";
import { NAMEPLATES } from "./nameplates.js";
import { OfficialBanner } from "./official-banner.js";
import { profileEffect } from "./profile-effects.js";

/** A garden item shows its style at a mid stage: grown enough to tell the species apart. */
const GARDEN_PREVIEW = { trajectory: 2, relations: 2, contribution: 2, tenure: 2, health: 2 };

/** The picture of a shop item, on the user's own avatar and name where it applies. */
export function CosmeticItemArt({ item, user, variant }: CosmeticItemArtProps) {
  const messages = useMessages().cosmeticShop;
  const thumb = variant === "thumb";
  // Catalog ids come from the API; unknown ones paint as the default theme.
  const nameStyle = { theme: item.id as ProfileNameTheme };

  switch (item.kind) {
    case "CARD_THEME": {
      const theme = cardTheme(item.id);
      if (!theme) return null;
      const style = {
        background: `linear-gradient(180deg, ${theme.top}, ${theme.bottom})`,
        color: theme.fg,
        "--cos-accent": theme.accent,
      } as CSSProperties;
      if (thumb) return <span className="cos-art-fill" style={style} />;
      return (
        <span className="cos-art-theme" style={style}>
          <UserAvatar src={user.avatar} alt={user.name} className="h-11 w-11" />
          Aa
          <i />
        </span>
      );
    }
    case "FRAME":
      return (
        <UserAvatar
          src={user.avatar}
          alt={user.name}
          frame={item.id}
          className={thumb ? "cos-art-frame-thumb" : "cos-art-frame"}
        />
      );
    case "BADGE":
      return <OfficialBadge badge={item.id} className={thumb ? "cos-art-icon" : "cos-art-badge"} />;
    case "NAME_STYLE":
      return (
        <span className={thumb ? "cos-art-name-thumb" : "cos-art-name"}>
          <StyledName name={thumb ? messages.nameSample : user.name} style={nameStyle} />
        </span>
      );
    case "NAMEPLATE":
      if (thumb) {
        if (!Object.hasOwn(NAMEPLATES, item.id)) return null;
        return (
          <span className="cos-art-fill" style={{ background: NAMEPLATES[item.id].background }} />
        );
      }
      return (
        <Nameplate plate={item.id} className="cos-art-plate">
          {user.name}
        </Nameplate>
      );
    case "BANNER":
      return <OfficialBanner banner={item.id} className="cos-art-banner" />;
    case "PROFILE_EFFECT": {
      const effect = profileEffect(item.id);
      if (!effect) return null;
      if (thumb) return <CosmeticIcon icon={effect.icon} className="cos-art-icon" />;
      return (
        <span className="cos-art-effect">
          <CosmeticIcon icon={effect.icon} />
          {messages.effectSample}
        </span>
      );
    }
    case "GARDEN":
      return (
        <span className={thumb ? "cos-art-garden-thumb" : "cos-art-garden"}>
          <ProfileGarden garden={GARDEN_PREVIEW} style={gardenStyleOf(item.id)} />
        </span>
      );
    default:
      return null;
  }
}
