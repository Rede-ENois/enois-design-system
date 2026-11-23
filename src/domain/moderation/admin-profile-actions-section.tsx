import { useState } from "react";

import { AlertTriangle, Ban, Gavel, History, ShieldAlert, Trash2 } from "lucide-react";

import { useMessages } from "../../messages/messages-context.js";
import { ListRowSkeletons } from "../../patterns/skeletons/list-row-skeletons.js";
import type { AdminAccountAction } from "../../types/domain/moderation/admin-account-action.js";
import type { AdminProfileActionsSectionProps } from "../../types/domain/moderation/admin-profile-actions-section-props.js";
import { Button } from "../../ui/button.js";
import { ConfirmDialog } from "../../ui/confirm-dialog.js";
import { EmptyState } from "../../ui/empty-state.js";
import { Input } from "../../ui/input.js";
import { PillRow } from "../../ui/pill-row.js";
import { Pill } from "../../ui/pill.js";

/** Suspension lengths the selector offers; the permanent ban is the third choice. */
const SUSPENSION_DAYS = [7, 30];

/**
 * Direct administrative actions on an account: warning, punishment and the account's history —
 * no report, no vote. Only administrators see it; the backend refuses everyone else.
 *
 * Every action needs a reason (10+ characters) and an explicit confirmation, because none of them
 * can be undone from this screen: a warning is revoked (and stays in the history), a ban revokes
 * the sessions, and removing the account anonymizes the profile for good.
 *
 * The punishment is chosen in one selector and confirmed once. Before, the two bans were buttons
 * of the same weight side by side: a click on the wrong one went straight to the confirmation of a
 * permanent ban.
 */
export function AdminProfileActionsSection({
  profile,
  history,
  loading = false,
  error = false,
  pending = false,
  onWarn,
  onSanction,
  onRevokeWarning,
  onDeleteAccount,
}: AdminProfileActionsSectionProps) {
  const messages = useMessages().adminProfileActionsSection;
  const [reason, setReasonState] = useState("");

  const setReason = (value: string) => {
    setReasonState(value);
    if (showTooShort) setShowTooShort(false);
    if (sanctionFailed) setSanctionFailed(false);
  };
  const [action, setAction] = useState<AdminAccountAction | null>(null);
  const [days, setDays] = useState<number | null>(SUSPENSION_DAYS[0]);
  const [showTooShort, setShowTooShort] = useState(false);
  const [sanctionFailed, setSanctionFailed] = useState(false);
  const [revokeFailed, setRevokeFailed] = useState(false);
  const [revoking, setRevoking] = useState<string | null>(null);
  const [revokeReason, setRevokeReason] = useState("");

  const target = profile.displayName || `@${profile.username}`;
  const clean = reason.trim();
  const revokeClean = revokeReason.trim();
  const tooShort = clean.length > 0 && clean.length < 10;

  if (loading) return <ListRowSkeletons />;
  if (error) return null;

  const confirm = async () => {
    const current = action;
    if (!current) return;
    if (current !== "DELETE" && tooShort) {
      setAction(null);
      setShowTooShort(true);
      return;
    }
    const ok =
      current === "WARN"
        ? await onWarn(clean)
        : current === "DELETE"
          ? await (onDeleteAccount?.(clean) ?? Promise.resolve(false))
          : await onSanction(days !== null ? { type: "BAN", days } : { type: "PERMABAN" }, clean);
    setAction(null);
    if (ok) {
      setReason("");
      setSanctionFailed(false);
    } else setSanctionFailed(true);
  };

  const revoke = async (warningId: string) => {
    const ok = await onRevokeWarning(warningId, revokeClean);
    setRevoking(null);
    if (ok) {
      setRevokeReason("");
      setRevokeFailed(false);
    } else setRevokeFailed(true);
  };

  return (
    <section className="space-y-3" aria-label={messages.title}>
      <div className="flex items-center gap-2">
        <ShieldAlert className="h-4 w-4 text-primary" />

        <h2 className="text-sm font-semibold uppercase tracking-widest text-text-subtle">
          {messages.title}
        </h2>
      </div>

      <div className="surface-card space-y-3 p-4">
        <p className="text-sm text-text-subtle">{messages.description(target)}</p>

        <Input
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          placeholder={messages.reasonPlaceholder}
          maxLength={2000}
          aria-label={messages.reasonPlaceholder}
        />

        {showTooShort && (
          <p role="alert" className="text-xs text-text-subtle">
            {messages.reasonTooShort}
          </p>
        )}

        <p className="text-xs font-medium text-text-subtle">{messages.sanctionLabel}</p>

        <PillRow label={messages.sanctionLabel}>
          {SUSPENSION_DAYS.map((length) => (
            <Pill key={length} size="sm" active={days === length} onClick={() => setDays(length)}>
              <>{messages.sanctions.suspension(length)}</>
            </Pill>
          ))}

          <Pill size="sm" active={days === null} onClick={() => setDays(null)}>
            <>{messages.sanctions.permanent}</>
          </Pill>
        </PillRow>

        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            className="w-auto rounded-full gap-1.5"
            disabled={pending}
            onClick={() => setAction("WARN")}
          >
            <AlertTriangle className="h-3.5 w-3.5" />

            <>{messages.warn}</>
          </Button>

          <Button
            variant="destructive"
            size="sm"
            className="w-auto rounded-full gap-1.5"
            disabled={pending}
            onClick={() => setAction(days === null ? "PERMABAN" : "BAN")}
          >
            {days === null ? <Ban className="h-3.5 w-3.5" /> : <Gavel className="h-3.5 w-3.5" />}

            <>{messages.sanction}</>
          </Button>

          {onDeleteAccount && (
            <Button
              variant="destructive"
              size="sm"
              className="w-auto rounded-full gap-1.5"
              disabled={pending}
              onClick={() => setAction("DELETE")}
            >
              <Trash2 className="h-3.5 w-3.5" />

              <>{messages.deleteAccount}</>
            </Button>
          )}
        </div>

        {profile.activeWarnings > 0 && (
          <p className="text-xs text-text-subtle">
            {messages.activeWarnings(profile.activeWarnings)}
          </p>
        )}
      </div>

      <div className="surface-card space-y-2 p-4">
        <div className="flex items-center gap-2">
          <History className="h-4 w-4 text-text-subtle" />

          <h3 className="text-xs font-semibold uppercase tracking-widest text-text-subtle">
            {messages.historyTitle}
          </h3>
        </div>

        {history.length === 0 ? (
          <EmptyState icon={ShieldAlert} title={messages.historyEmpty} />
        ) : (
          <ul className="space-y-2">
            {history.map((row) => (
              <li key={row.id} className="space-y-1 rounded-xl border border-border-soft p-3">
                <p className="text-xs font-medium uppercase tracking-widest text-text-subtle">
                  {row.typeLabel} · {row.active ? messages.active : messages.inactive}
                </p>

                <p className="text-sm">{row.reason}</p>

                <p className="text-xs text-text-subtle">
                  {row.dueAtLabel
                    ? `${row.createdAtLabel} · ${messages.dueAt(row.dueAtLabel)}`
                    : row.createdAtLabel}
                </p>

                {row.kind === "WARNING" && row.active && (
                  <div className="space-y-2 pt-1">
                    {revoking === row.id ? (
                      <div className="space-y-2">
                        <Input
                          value={revokeReason}
                          onChange={(event) => setRevokeReason(event.target.value)}
                          placeholder={messages.revokeReasonPlaceholder}
                          maxLength={2000}
                          aria-label={messages.revokeReasonPlaceholder}
                        />

                        <div className="flex flex-wrap gap-2">
                          <Button
                            size="sm"
                            className="w-auto rounded-full"
                            disabled={revokeClean.length < 10}
                            onClick={() => revoke(row.id)}
                          >
                            <>{messages.revokeConfirm}</>
                          </Button>

                          <Button
                            variant="outline"
                            size="sm"
                            className="w-auto rounded-full"
                            onClick={() => setRevoking(null)}
                          >
                            <>{messages.cancel}</>
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-auto rounded-full"
                        onClick={() => {
                          setRevoking(row.id);
                          setRevokeReason("");
                          setRevokeFailed(false);
                        }}
                      >
                        <>{messages.revoke}</>
                      </Button>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      <ConfirmDialog
        open={action !== null}
        onOpenChange={(open) => {
          if (!open) setAction(null);
        }}
        title={messages.confirmTitle}
        description={
          action === "WARN"
            ? messages.confirmWarn(target)
            : action === "BAN" && days !== null
              ? messages.confirmSanction(target, days)
              : action === "DELETE"
                ? messages.confirmDeleteAccount(target)
                : messages.confirmBanPermanent(target)
        }
        confirmLabel={messages.confirm}
        cancelLabel={messages.cancel}
        destructive={action !== "WARN"}
        pending={pending}
        onConfirm={() => void confirm()}
      />

      {action !== null && (
        <p className="text-xs text-text-subtle">{messages.confirmReason(clean)}</p>
      )}

      {sanctionFailed && (
        <p role="alert" className="text-xs text-destructive">
          {messages.error}
        </p>
      )}

      {revokeFailed && (
        <p role="alert" className="text-xs text-destructive">
          {messages.revokeError}
        </p>
      )}
    </section>
  );
}
