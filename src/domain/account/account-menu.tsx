import type { ReactNode } from "react";

import {
  ChevronRight,
  CircleUserRound,
  Gavel,
  LifeBuoy,
  LogOut,
  Palette,
  Settings2,
  ShieldCheck,
  Zap,
} from "lucide-react";

import { cn } from "../../lib/utils.js";
import { useMessages } from "../../messages/messages-context.js";
import type { AccountMenuProps } from "../../types/domain/account/account-menu-props.js";
import { AppLink } from "../../ui/app-link.js";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover.js";
import { UserAvatar } from "../avatar/user-avatar.js";

import { ACCOUNT_MENU_ITEM_CLASS as ITEM_CLASS } from "./account-menu-item-class.js";

function Group({ children }: { children: ReactNode }) {
  return <div className="rounded-[1.375rem] bg-surface-2/60 p-1">{children}</div>;
}

/**
 * The account menu: who you are, which interface you are in, and six quick entries. Account,
 * privacy and preference items live on the "Conta e segurança" page, so the menu never grows.
 */
export function AccountMenu({
  profile,
  hrefs,
  open,
  onOpenChange,
  walletLabel,
  onLogout,
  loggingOut,
  identitySlot,
  themeSlot,
}: AccountMenuProps) {
  const messages = useMessages().accountMenu;
  const close = () => onOpenChange(false);

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <button
          className="grid h-11 w-11 shrink-0 place-items-center rounded-full transition hover:bg-surface-2"
          aria-label={messages.trigger}
        >
          <UserAvatar
            frame={profile.avatarFrame}
            src={profile.avatar}
            alt={profile.name}
            className="h-9 w-9"
          />
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        className="flex max-h-[min(85dvh,40rem)] w-[min(calc(100vw-1.5rem),20rem)] flex-col gap-2.5 overflow-y-auto overscroll-contain rounded-[1.75rem] border-border-soft bg-surface-card p-2.5 shadow-[var(--shadow-float)]"
      >
        <AppLink
          href={hrefs.profile}
          onClick={close}
          className="flex items-center gap-3 rounded-2xl px-2 py-2 transition hover:bg-surface-2"
        >
          <UserAvatar
            frame={profile.avatarFrame}
            src={profile.avatar}
            alt={profile.name}
            className="h-12 w-12"
          />

          <div className="min-w-0">
            <p className="truncate text-base font-extrabold text-text-strong">{profile.name}</p>
            {profile.username && (
              <p className="truncate text-[13px] text-text-date">@{profile.username}</p>
            )}
          </div>
        </AppLink>

        {identitySlot}

        <Group>
          <AppLink href={hrefs.profile} onClick={close} className={ITEM_CLASS}>
            <CircleUserRound aria-hidden />

            <span className="min-w-0 flex-1 truncate">{messages.profile}</span>
          </AppLink>

          <AppLink href={hrefs.wallet} onClick={close} className={ITEM_CLASS}>
            <Zap aria-hidden />

            <span className="min-w-0 flex-1 truncate">{messages.wallet}</span>
            {walletLabel && (
              <span className="shrink-0 text-sm font-extrabold tabular-nums text-signal-today">
                {walletLabel}
              </span>
            )}
          </AppLink>

          <AppLink href={hrefs.account} onClick={close} className={ITEM_CLASS}>
            <Settings2 aria-hidden />

            <span className="min-w-0 flex-1 truncate">{messages.account}</span>

            <ChevronRight aria-hidden className="!h-4 !w-4 text-text-date" />
          </AppLink>

          <AppLink href={hrefs.support} onClick={close} className={ITEM_CLASS}>
            <LifeBuoy aria-hidden />

            <span className="min-w-0 flex-1 truncate">{messages.support}</span>
          </AppLink>

          {hrefs.guardian && (
            <AppLink href={hrefs.guardian} onClick={close} className={ITEM_CLASS}>
              <ShieldCheck aria-hidden />

              <span className="min-w-0 flex-1 truncate">{messages.guardian}</span>
            </AppLink>
          )}

          {hrefs.moderator && (
            <AppLink href={hrefs.moderator} onClick={close} className={ITEM_CLASS}>
              <Gavel aria-hidden />

              <span className="min-w-0 flex-1 truncate">{messages.moderator}</span>
            </AppLink>
          )}
        </Group>

        <Group>
          {themeSlot && (
            <div className={cn(ITEM_CLASS, "hover:bg-transparent")}>
              <Palette aria-hidden />

              <span className="min-w-0 flex-1 truncate">{messages.theme}</span>
              {themeSlot}
            </div>
          )}

          <button
            type="button"
            onClick={onLogout}
            disabled={loggingOut}
            className={cn(ITEM_CLASS, "text-signal-love [&>svg]:text-signal-love")}
          >
            <LogOut aria-hidden />

            <span>{loggingOut ? messages.loggingOut : messages.logout}</span>
          </button>
        </Group>
      </PopoverContent>
    </Popover>
  );
}
