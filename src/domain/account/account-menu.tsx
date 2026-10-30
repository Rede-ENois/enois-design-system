import {
  Flag,
  Gavel,
  Heart,
  HeartPulse,
  KeyRound,
  LifeBuoy,
  Link2,
  LogOut,
  Mail,
  Settings2,
  ShieldAlert,
  ShieldCheck,
  ShieldOff,
  Store,
  Trash2,
  User,
  Zap,
} from "lucide-react";

import { cn } from "../../lib/utils.js";
import { useMessages } from "../../messages/messages-context.js";
import type { AccountMenuProps } from "../../types/domain/account/account-menu-props.js";
import { AppLink } from "../../ui/app-link.js";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover.js";
import { UserAvatar } from "../avatar/user-avatar.js";

import { ACCOUNT_MENU_ITEM_CLASS as ITEM_CLASS } from "./account-menu-item-class.js";

export function AccountMenu({
  profile,
  hrefs,
  open,
  onOpenChange,
  onChangeEmail,
  onChangePassword,
  onOpenLinkedAccounts,
  onOpenHealthyUsage,
  onDeleteAccount,
  onLogout,
  loggingOut,
  pushToggle,
  identitySlot,
}: AccountMenuProps) {
  const messages = useMessages().accountMenu;
  const close = () => onOpenChange(false);

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <button
          className="flex items-center gap-2 rounded-full pr-3 transition hover:bg-surface-2"
          aria-label={messages.trigger}
        >
          <span className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-visible">
            <UserAvatar
              frame={profile.avatarFrame}
              src={profile.avatar}
              alt={profile.name}
              className="h-8 w-8"
            />
          </span>

          <span className="hidden text-sm font-normal text-text-strong sm:inline">
            {messages.triggerLabel}
          </span>
        </button>
      </PopoverTrigger>

      {/* A aba já tem MUITAS opções: a lista rola por dentro (flex + min-h-0), com o cabeçalho
          e as ações destrutivas sempre à vista. Sem isso o fim do menu ficava fora da tela. */}
      <PopoverContent
        align="end"
        className="flex max-h-[min(80dvh,44rem)] w-[min(calc(100vw-2rem),17rem)] flex-col overflow-hidden rounded-2xl border-border-soft bg-surface-card p-0 shadow-card"
      >
        <div className="flex shrink-0 items-center gap-3 border-b border-border-soft px-4 py-3">
          <UserAvatar
            frame={profile.avatarFrame}
            src={profile.avatar}
            alt={profile.name}
            className="h-9 w-9"
          />

          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-text-strong">{profile.name}</p>

            <p className="truncate text-xs text-text-subtle">{profile.email}</p>
          </div>
        </div>

        {identitySlot && (
          <div className="border-b border-border-soft px-4 py-2">{identitySlot}</div>
        )}

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain py-1">
          <AppLink href={hrefs.profile} onClick={close} className={ITEM_CLASS}>
            <User className="h-4 w-4" />

            <>{messages.profile}</>
          </AppLink>

          <AppLink href={hrefs.corporateProfile} onClick={close} className={ITEM_CLASS}>
            <User className="h-4 w-4" />

            <>{messages.corporateProfile}</>
          </AppLink>

          <AppLink href={hrefs.wallet} onClick={close} className={ITEM_CLASS}>
            <Zap className="h-4 w-4" />

            <>{messages.wallet}</>
          </AppLink>

          <AppLink href={hrefs.marketplace} onClick={close} className={ITEM_CLASS}>
            <Store className="h-4 w-4" />

            <>{messages.marketplace}</>
          </AppLink>

          <button type="button" onClick={onChangeEmail} className={ITEM_CLASS}>
            <Mail className="h-4 w-4" />

            <>{messages.changeEmail}</>
          </button>

          <AppLink href={hrefs.support} onClick={close} className={ITEM_CLASS}>
            <LifeBuoy className="h-4 w-4" />

            <>{messages.support}</>
          </AppLink>

          <AppLink href={hrefs.security} onClick={close} className={ITEM_CLASS}>
            <ShieldCheck className="h-4 w-4" />

            <>{messages.security}</>
          </AppLink>

          <AppLink href={hrefs.blockedUsers} onClick={close} className={ITEM_CLASS}>
            <ShieldOff className="h-4 w-4" />

            <>{messages.blockedUsers}</>
          </AppLink>

          <AppLink href={hrefs.myReports} onClick={close} className={ITEM_CLASS}>
            <Flag className="h-4 w-4" />

            <>{messages.myReports}</>
          </AppLink>

          <AppLink href={hrefs.sanctions} onClick={close} className={ITEM_CLASS}>
            <ShieldAlert className="h-4 w-4" />

            <>{messages.sanctions}</>
          </AppLink>

          <button type="button" onClick={onChangePassword} className={ITEM_CLASS}>
            <KeyRound className="h-4 w-4" />

            <>{messages.changePassword}</>
          </button>

          <button type="button" onClick={onOpenLinkedAccounts} className={ITEM_CLASS}>
            <Link2 className="h-4 w-4" />

            <>{messages.linkedAccounts}</>
          </button>

          <button type="button" onClick={onOpenHealthyUsage} className={ITEM_CLASS}>
            <HeartPulse className="h-4 w-4" />

            <>{messages.healthyUsage}</>
          </button>

          <AppLink href={hrefs.guardian} onClick={close} className={ITEM_CLASS}>
            <ShieldCheck className="h-4 w-4" />

            <>{messages.guardian}</>
          </AppLink>

          <AppLink href={hrefs.moderator} onClick={close} className={ITEM_CLASS}>
            <Gavel className="h-4 w-4" />

            <>{messages.moderator}</>
          </AppLink>

          {pushToggle}

          {hrefs.notificationPreferences && (
            <AppLink href={hrefs.notificationPreferences} onClick={close} className={ITEM_CLASS}>
              <Settings2 className="h-4 w-4" />

              <>{messages.notificationPreferences}</>
            </AppLink>
          )}

          <AppLink href={hrefs.apoie} onClick={close} className={ITEM_CLASS}>
            <Heart className="h-4 w-4 text-primary" />

            <span className="text-primary">{messages.apoie}</span>
          </AppLink>
        </div>

        <div className="shrink-0 border-t border-border-soft py-1">
          <button
            type="button"
            onClick={onDeleteAccount}
            className={cn(ITEM_CLASS, "text-destructive hover:text-destructive")}
          >
            <Trash2 className="h-4 w-4" />

            <>{messages.deleteAccount}</>
          </button>
        </div>

        <div className="shrink-0 border-t border-border-soft py-1">
          <button
            type="button"
            onClick={onLogout}
            disabled={loggingOut}
            className={cn(ITEM_CLASS, "text-destructive hover:text-destructive")}
          >
            <LogOut className="h-4 w-4" />

            <>{loggingOut ? messages.loggingOut : messages.logout}</>
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
