import { useState } from "react";

import { CalendarPlus, Copy, Link2, RefreshCw, Trash2 } from "lucide-react";

import { useMessages } from "../../messages/messages-context.js";
import type { CalendarScope } from "../../types/domain/calendar/calendar-scope.js";
import type { CalendarSubscriptionCardProps } from "../../types/domain/calendar/calendar-subscription-card-props.js";
import { Button } from "../../ui/button.js";
import { ConfirmDialog } from "../../ui/confirm-dialog.js";
import { PillRow } from "../../ui/pill-row.js";
import { Pill } from "../../ui/pill.js";

const SCOPES: (CalendarScope | null)[] = [null, "SOCIAL", "PROFESSIONAL"];

/**
 * The private `.ics` subscription (fase 9, D7): the address the reader pastes into an external
 * calendar. The server keeps only a hash of the token, so the full URL exists exactly once — in
 * the response that created or regenerated it. The card says that plainly instead of pretending
 * the link can be shown again, and every destructive action asks first.
 *
 * The app owns the requests and the clipboard; the card draws and reports intent.
 */
export function CalendarSubscriptionCard({
  subscription,
  freshUrl,
  scope,
  onScopeChange,
  onCreate,
  onRegenerate,
  onRevoke,
  onCopy,
  error = null,
  pending = false,
  copied = false,
}: CalendarSubscriptionCardProps) {
  const calendar = useMessages().calendar;
  const messages = calendar.subscription;
  const [confirm, setConfirm] = useState<"regenerate" | "revoke" | null>(null);

  const scopeLabel = (value: CalendarScope | null) =>
    value === null ? messages.scopeAll : calendar.scopes[value];

  return (
    <section className="flex min-w-0 flex-col gap-4 rounded-2xl border border-border-soft bg-surface-card p-4">
      <header className="flex min-w-0 items-start gap-3">
        <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-surface-2 text-text-subtle">
          <Link2 aria-hidden className="size-4" />
        </span>

        <div className="min-w-0">
          <h2 className="text-sm font-semibold text-text-strong">{messages.title}</h2>

          <p className="text-xs leading-snug text-text-subtle">
            {subscription ? messages.activeTitle : messages.emptyHint}
          </p>
        </div>
      </header>

      {error ? (
        <p role="alert" className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      ) : null}

      {freshUrl ? (
        <div className="flex min-w-0 flex-col gap-2 rounded-xl border border-primary/40 bg-primary-soft/40 p-3">
          <p className="text-sm font-medium text-text-strong">{messages.freshTitle}</p>

          <p className="text-xs leading-snug text-text-subtle">{messages.freshHint}</p>

          <code className="block min-w-0 break-all rounded-lg bg-surface-2 px-2 py-1.5 text-xs text-text-strong">
            {freshUrl}
          </code>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              size="sm"
              className="rounded-full"
              disabled={pending}
              onClick={onCopy}
            >
              <Copy aria-hidden className="size-3.5" />
              {messages.copyLink}
            </Button>

            {copied ? (
              <span role="status" className="text-xs text-text-subtle">
                {messages.copied}
              </span>
            ) : null}
          </div>
        </div>
      ) : null}

      {subscription ? (
        <div className="flex min-w-0 flex-col gap-3">
          <p className="text-xs text-text-subtle">
            {messages.activeSince(formatDate(subscription.createdAt))}
          </p>

          {!freshUrl ? (
            <p className="rounded-lg bg-surface-2 px-3 py-2 text-xs leading-snug text-text-subtle">
              {messages.activeTokenGone}
            </p>
          ) : null}

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="rounded-full"
              disabled={pending}
              onClick={() => setConfirm("regenerate")}
            >
              <RefreshCw aria-hidden className="size-3.5" />
              {messages.regenerate}
            </Button>

            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="rounded-full text-destructive hover:text-destructive"
              disabled={pending}
              onClick={() => setConfirm("revoke")}
            >
              <Trash2 aria-hidden className="size-3.5" />
              {messages.revoke}
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex min-w-0 flex-col gap-3">
          <PillRow label={messages.title}>
            {SCOPES.map((value) => (
              <Pill
                key={value ?? "all"}
                size="sm"
                active={scope === value}
                onClick={() => onScopeChange(value)}
              >
                {scopeLabel(value)}
              </Pill>
            ))}
          </PillRow>

          <div className="flex justify-start">
            <Button
              type="button"
              size="sm"
              className="rounded-full"
              disabled={pending}
              onClick={onCreate}
            >
              <CalendarPlus aria-hidden className="size-3.5" />
              {pending ? messages.creating : messages.create}
            </Button>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={confirm === "regenerate"}
        onOpenChange={(open) => setConfirm(open ? "regenerate" : null)}
        title={messages.regenerateConfirmTitle}
        description={messages.regenerateConfirmDescription}
        confirmLabel={messages.regenerateConfirmAction}
        pending={pending}
        onConfirm={() => {
          setConfirm(null);
          onRegenerate();
        }}
      />
      <ConfirmDialog
        open={confirm === "revoke"}
        onOpenChange={(open) => setConfirm(open ? "revoke" : null)}
        title={messages.revokeConfirmTitle}
        description={messages.revokeConfirmDescription}
        confirmLabel={messages.revokeConfirmAction}
        destructive
        pending={pending}
        onConfirm={() => {
          setConfirm(null);
          onRevoke();
        }}
      />
    </section>
  );
}

/** `2026-11-10T12:00:00Z` as a short pt-BR day; an unparseable value is shown as-is. */
function formatDate(instant: string): string {
  const date = new Date(instant);
  if (Number.isNaN(date.getTime())) return instant;
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}
