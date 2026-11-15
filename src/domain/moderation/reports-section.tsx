import { useId, useRef, useState } from "react";

import { Gavel } from "lucide-react";

import { useMessages } from "../../messages/messages-context.js";
import { ListRowSkeletons } from "../../patterns/skeletons/list-row-skeletons.js";
import type { ReportActionConfirmation } from "../../types/domain/moderation/report-action-confirmation.js";
import type { ReportsSectionProps } from "../../types/domain/moderation/reports-section-props.js";
import { Button } from "../../ui/button.js";
import { ConfirmDialog } from "../../ui/confirm-dialog.js";
import { EmptyState } from "../../ui/empty-state.js";
import { Input } from "../../ui/input.js";
import { Label } from "../../ui/label.js";

import { ReportCard } from "./report-card.js";
import { useReportActionFocus } from "./use-report-action-focus.js";

export function ReportsSection({
  reports,
  admin,
  loading,
  error,
  pending,
  actionError,
  onRetry,
  onVote,
  onAdminAction,
}: ReportsSectionProps) {
  const messages = useMessages().reportsSection;
  const id = useId();
  const [reason, setReason] = useState("");
  const [target, setTarget] = useState("");
  const [search, setSearch] = useState("");
  const [confirmation, setConfirmation] = useState<ReportActionConfirmation | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [failed, setFailed] = useState(false);
  const submissionLock = useRef(false);
  const { titleRef, rememberTrigger, watchRemoval, onCloseAutoFocus } =
    useReportActionFocus(reports);
  const busy = pending || submitting;
  const currentReport = reports.find((report) => report.reportId === confirmation?.report.reportId);
  const canConfirm = !!(
    admin &&
    currentReport &&
    currentReport.targetType === confirmation?.report.targetType &&
    (confirmation.action !== "penalize" ||
      (currentReport.canPenalize && currentReport.targetType !== "COMPANY"))
  );
  const query = search.trim().toLocaleLowerCase("pt-BR");
  const filtered = reports.filter(
    (report) =>
      (!reason || report.reason === reason) &&
      (!target || report.targetType === target) &&
      (!query ||
        [report.reportId, report.author, report.reporter, report.content, report.description].some(
          (value) => value?.toLocaleLowerCase("pt-BR").includes(query),
        )),
  );
  const reasons = [
    ...new Set([...reports.map((report) => report.reason), ...(reason ? [reason] : [])]),
  ];
  const targets = [
    ...new Set([...reports.map((report) => report.targetType), ...(target ? [target] : [])]),
  ];
  const hasFilters = !!(reason || target || search);
  const clearFilters = () => {
    setReason("");
    setTarget("");
    setSearch("");
  };
  const confirm = async () => {
    if (!confirmation || !canConfirm || busy || submissionLock.current || loading || error) return;
    submissionLock.current = true;
    setSubmitting(true);
    setFailed(false);
    try {
      const ok = await onAdminAction(confirmation.report.reportId, confirmation.action);
      if (ok) {
        watchRemoval(confirmation.report.reportId);
        setConfirmation(null);
      } else setFailed(true);
    } catch {
      setFailed(true);
    } finally {
      submissionLock.current = false;
      setSubmitting(false);
    }
  };
  const showActionError = failed || actionError;
  const confirmationDescription = confirmation
    ? [
        messages.confirmTarget(
          messages.targets[confirmation.report.targetType] ?? confirmation.report.targetType,
          confirmation.report.author || messages.noAuthor,
          confirmation.report.reportId,
        ),
        messages.confirmEffects[confirmation.action],
      ]
        .filter(Boolean)
        .join(" ")
    : "";

  return (
    <section
      className="min-w-0 space-y-4"
      aria-labelledby={`${id}-title`}
      aria-busy={loading || busy}
    >
      <header className="space-y-1">
        <h2
          ref={titleRef}
          tabIndex={-1}
          id={`${id}-title`}
          className="rounded-sm text-lg font-semibold text-text-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {messages.title}
        </h2>

        <p className="text-sm text-text-subtle">{messages.description}</p>
      </header>
      {showActionError && (
        <p
          role="alert"
          className="rounded-xl border border-border-soft bg-surface-2 p-3 text-sm text-text-strong"
        >
          {messages.actionError}
        </p>
      )}
      {loading ? (
        <div role="status" aria-label={messages.loading}>
          <ListRowSkeletons />
        </div>
      ) : error ? (
        <div className="space-y-3 rounded-2xl border border-border-soft bg-surface-card p-4">
          <p role="alert" className="text-sm text-text-strong">
            {messages.error}
          </p>

          <Button type="button" variant="outline" onClick={onRetry} disabled={busy}>
            {messages.retry}
          </Button>
        </div>
      ) : reports.length === 0 ? (
        <div className="rounded-2xl border border-border-soft bg-surface-card">
          <EmptyState icon={Gavel} title={messages.empty} />
        </div>
      ) : (
        <>
          <div className="space-y-3 rounded-2xl border border-border-soft bg-surface-card p-4">
            <div className="grid min-w-0 gap-3 sm:grid-cols-2">
              <div className="min-w-0 space-y-2">
                <Label htmlFor={`${id}-reason`}>{messages.filterReason}</Label>

                <select
                  id={`${id}-reason`}
                  className="min-h-11 w-full min-w-0 rounded-md border border-input bg-background px-3 py-2 text-base text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:text-sm"
                  value={reason}
                  onChange={(event) => setReason(event.target.value)}
                >
                  <option value="">{messages.allReasons}</option>
                  {reasons.map((value) => (
                    <option key={value} value={value}>
                      {messages.reasons[value] ?? value}
                    </option>
                  ))}
                </select>
              </div>

              <div className="min-w-0 space-y-2">
                <Label htmlFor={`${id}-target`}>{messages.filterTarget}</Label>

                <select
                  id={`${id}-target`}
                  className="min-h-11 w-full min-w-0 rounded-md border border-input bg-background px-3 py-2 text-base text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:text-sm"
                  value={target}
                  onChange={(event) => setTarget(event.target.value)}
                >
                  <option value="">{messages.allTargets}</option>
                  {targets.map((value) => (
                    <option key={value} value={value}>
                      {messages.targets[value] ?? value}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor={`${id}-search`}>{messages.search}</Label>

              <Input
                id={`${id}-search`}
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={messages.searchPlaceholder}
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2">
              <p role="status" className="text-sm text-text-subtle">
                {messages.count(filtered.length, reports.length)}
              </p>
              {hasFilters && (
                <Button type="button" variant="ghost" size="sm" onClick={clearFilters}>
                  {messages.clearFilters}
                </Button>
              )}
            </div>
          </div>
          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-border-soft bg-surface-card p-4">
              <EmptyState
                icon={Gavel}
                title={messages.noFiltered}
                description={messages.noFilteredHint}
              />

              <Button type="button" variant="outline" onClick={clearFilters}>
                {messages.clearFilters}
              </Button>
            </div>
          ) : (
            <ul className="space-y-4">
              {filtered.map((report) => (
                <ReportCard
                  key={report.reportId}
                  report={report}
                  admin={admin}
                  pending={busy}
                  onVote={(reportId, vote) => {
                    if (busy || submissionLock.current) return;
                    rememberTrigger();
                    watchRemoval(reportId);
                    onVote(reportId, vote);
                  }}
                  onRequestAction={(item, action) => {
                    if (!admin || busy || submissionLock.current) return;
                    setFailed(false);
                    rememberTrigger();
                    setConfirmation({ report: item, action });
                  }}
                />
              ))}
            </ul>
          )}
        </>
      )}
      <ConfirmDialog
        open={confirmation !== null}
        onOpenChange={(open) => {
          if (!open && !busy && !submissionLock.current) {
            setConfirmation(null);
            setFailed(false);
          }
        }}
        title={confirmation ? messages.confirmTitles[confirmation.action] : ""}
        description={confirmationDescription}
        error={showActionError ? messages.actionError : undefined}
        onCloseAutoFocus={onCloseAutoFocus}
        confirmLabel={confirmation ? messages.actions[confirmation.action] : ""}
        destructive={confirmation?.action !== "warn"}
        pending={busy}
        disabled={!canConfirm || loading || error}
        onConfirm={() => void confirm()}
      />
    </section>
  );
}
