import type { ReactNode } from "react";

import {
  Baby,
  Bell,
  ChevronRight,
  Flag,
  Heart,
  HeartPulse,
  KeyRound,
  Link2,
  type LucideIcon,
  Mail,
  Rss,
  ShieldAlert,
  ShieldCheck,
  ShieldOff,
  Trash2,
  UserCog,
  VolumeX,
} from "lucide-react";

import { cn } from "../../lib/utils.js";
import { useMessages } from "../../messages/messages-context.js";
import type { AccountSettingsProps } from "../../types/domain/account/account-settings-props.js";
import { AppLink } from "../../ui/app-link.js";
import { PageHeader } from "../../ui/page-header.js";

const ROW_CLASS =
  "flex min-h-12 w-full min-w-0 items-center gap-3.5 px-4 py-3 text-left text-[15px] font-semibold text-text-strong transition hover:bg-surface-2 focus-visible:bg-surface-2 focus-visible:outline-none [&>svg:first-child]:text-text-subtle";

/**
 * Account settings hub (issue #562): sign-in, privacy and moderation items, and account deletion
 * at the end, apart from the rest. Links come as hrefs; the dialogs stay with the app.
 */
export function AccountSettings({
  hrefs,
  onChangeEmail,
  onChangePassword,
  onOpenLinkedAccounts,
  onDeleteAccount,
  onOpenHealthyUsage,
}: AccountSettingsProps) {
  const messages = useMessages().accountSettings;

  return (
    <div className="mx-auto flex w-full max-w-2xl min-w-0 flex-col gap-4">
      <PageHeader title={messages.title} description={messages.description} icon={UserCog} />

      <Section title={messages.access}>
        <Row icon={Mail} label={messages.changeEmail} onClick={onChangeEmail} />
        <Row icon={KeyRound} label={messages.changePassword} onClick={onChangePassword} />
        <Row icon={Link2} label={messages.linkedAccounts} onClick={onOpenLinkedAccounts} />
        <Row icon={ShieldCheck} label={messages.security} href={hrefs.security} />
      </Section>

      <Section title={messages.privacy}>
        <Row icon={ShieldOff} label={messages.blockedUsers} href={hrefs.blockedUsers} />
        <Row icon={Flag} label={messages.myReports} href={hrefs.myReports} />
        <Row icon={ShieldAlert} label={messages.sanctions} href={hrefs.sanctions} />
        {hrefs.guardian && <Row icon={Baby} label={messages.guardian} href={hrefs.guardian} />}
        {hrefs.mutedUsers && (
          <Row icon={VolumeX} label={messages.mutedUsers} href={hrefs.mutedUsers} />
        )}
      </Section>

      {(hrefs.notificationPreferences || hrefs.feedPreferences || onOpenHealthyUsage) && (
        <Section title={messages.preferences}>
          {hrefs.notificationPreferences && (
            <Row
              icon={Bell}
              label={messages.notificationPreferences}
              href={hrefs.notificationPreferences}
            />
          )}
          {hrefs.feedPreferences && (
            <Row icon={Rss} label={messages.feedPreferences} href={hrefs.feedPreferences} />
          )}
          {onOpenHealthyUsage && (
            <Row icon={HeartPulse} label={messages.healthyUsage} onClick={onOpenHealthyUsage} />
          )}
        </Section>
      )}

      {hrefs.supportUs && (
        <Section title={messages.project}>
          <Row icon={Heart} label={messages.supportUs} href={hrefs.supportUs} />
        </Section>
      )}

      <Section title={messages.danger}>
        <Row icon={Trash2} label={messages.deleteAccount} onClick={onDeleteAccount} destructive />
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="min-w-0">
      <h2 className="px-2 pb-2 text-[13px] font-bold text-text-date">{title}</h2>

      <div className="divide-y divide-border-soft overflow-hidden rounded-3xl bg-surface-card shadow-[var(--shadow-table)]">
        {children}
      </div>
    </section>
  );
}

function Row({
  icon: Icon,
  label,
  href,
  onClick,
  destructive = false,
}: {
  icon: LucideIcon;
  label: string;
  href?: string;
  onClick?: () => void;
  destructive?: boolean;
}) {
  const content = (
    <>
      <Icon aria-hidden className="h-5 w-5 shrink-0" />

      <span className="min-w-0 flex-1 truncate">{label}</span>

      <ChevronRight className="h-4 w-4 shrink-0 text-text-subtle" aria-hidden />
    </>
  );
  const className = cn(ROW_CLASS, destructive && "text-destructive hover:text-destructive");

  return href ? (
    <AppLink href={href} className={className}>
      {content}
    </AppLink>
  ) : (
    <button type="button" onClick={onClick} className={className}>
      {content}
    </button>
  );
}
