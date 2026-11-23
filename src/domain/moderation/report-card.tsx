import { useState } from "react";

import { useMessages } from "../../messages/messages-context.js";
import type { ReportCardProps } from "../../types/domain/moderation/report-card-props.js";
import { AppLink } from "../../ui/app-link.js";
import { Button } from "../../ui/button.js";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog.js";
import { Input } from "../../ui/input.js";

/** Empresa nunca é alvo de punição imediata, mesmo que a flag chegue incoerente. */
function penalizable(report: ReportCardProps["report"]) {
  return report.canPenalize && report.targetType !== "COMPANY";
}

export function ReportCard({ report, admin, pending, onVote, onPenalize }: ReportCardProps) {
  const messages = useMessages().reportCard;
  const [confirming, setConfirming] = useState(false);
  const [reason, setReason] = useState("");
  const [penalizeFailed, setPenalizeFailed] = useState(false);
  const [penalizing, setPenalizing] = useState(false);

  const clean = reason.trim();
  const tooShort = clean.length > 0 && clean.length < 10;
  const showPenalize = admin && penalizable(report) && Boolean(onPenalize);

  const closeConfirm = () => {
    setConfirming(false);
    setReason("");
    setPenalizeFailed(false);
  };

  const confirmPenalize = async () => {
    if (!onPenalize || !penalizable(report) || clean.length < 10) return;
    setPenalizing(true);
    try {
      const ok = await onPenalize(report.reportId, clean);
      if (ok) closeConfirm();
      else setPenalizeFailed(true);
    } finally {
      setPenalizing(false);
    }
  };

  return (
    <li className="min-w-0 space-y-4 rounded-2xl border border-border-soft bg-surface-card p-4">
      <header className="space-y-2">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="rounded-full bg-surface-2 px-2.5 py-1 font-semibold text-text-strong">
            {messages.reasons[report.reason] ?? report.reason}
          </span>

          <span className="rounded-full border border-border-soft px-2.5 py-1 text-text-subtle">
            {messages.targets[report.targetType] ?? report.targetType}
          </span>

          <span className="text-text-subtle">{report.createdAtLabel}</span>
        </div>

        <h3 className="break-words text-sm font-semibold text-text-strong">
          {messages.reportReference(report.reportId)}
        </h3>
      </header>

      <dl className="grid min-w-0 gap-3 text-sm sm:grid-cols-2">
        <div className="min-w-0">
          <dt className="text-text-subtle">{messages.reporter}</dt>

          <dd className="break-words font-medium text-text-strong">{report.reporter}</dd>
        </div>

        <div className="min-w-0">
          <dt className="text-text-subtle">{messages.author}</dt>

          <dd className="break-words font-medium text-text-strong">
            {report.author || messages.noAuthor}
          </dd>
        </div>
      </dl>

      <div className="space-y-2">
        <p className="text-xs font-semibold text-text-subtle">{messages.content}</p>

        <div
          className="max-h-48 overflow-y-auto rounded-xl border border-border-soft bg-surface-2 p-3 text-sm whitespace-pre-wrap break-words text-text-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          tabIndex={0}
          role="region"
          aria-label={messages.content}
        >
          {report.content || messages.noContent}
        </div>
      </div>
      {report.description && (
        <div className="space-y-1 border-l-2 border-border-soft pl-3">
          <p className="text-xs font-semibold text-text-subtle">{messages.descriptionLabel}</p>

          <p className="text-sm whitespace-pre-wrap break-words text-text-strong">
            {report.description}
          </p>
        </div>
      )}
      {admin && (
        <AppLink
          href={report.reviewHref}
          className="inline-block rounded-sm text-sm font-medium text-primary-text underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {messages.openReview}
        </AppLink>
      )}
      <section
        className="space-y-3 border-t border-border-soft pt-4"
        aria-label={messages.collectiveTitle}
      >
        <div className="space-y-1">
          <h4 className="text-sm font-semibold text-text-strong">{messages.collectiveTitle}</h4>

          <p className="text-xs text-text-subtle">{messages.collectiveHint}</p>
        </div>

        <ul className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-text-strong">
          <li>{messages.punishVotes(report.punishVotes)}</li>

          <li>{messages.dismissVotes(report.dismissVotes)}</li>

          <li className="font-semibold">{messages.quorum(report.quorum)}</li>
        </ul>
        {report.myVote && (
          <p className="text-xs font-semibold text-text-strong">{messages.myVote(report.myVote)}</p>
        )}
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="rounded-full whitespace-normal"
            aria-pressed={report.myVote === "PUNISH"}
            disabled={pending}
            onClick={() => onVote(report.reportId, "PUNISH")}
          >
            {messages.votePunish}
          </Button>

          <Button
            type="button"
            size="sm"
            variant="outline"
            className="rounded-full whitespace-normal"
            aria-pressed={report.myVote === "DISMISS"}
            disabled={pending}
            onClick={() => onVote(report.reportId, "DISMISS")}
          >
            {messages.voteDismiss}
          </Button>
        </div>
      </section>
      {showPenalize && (
        <section
          className="space-y-3 rounded-xl border border-border-soft bg-surface-2 p-3"
          aria-label={messages.adminTitle}
        >
          <div className="space-y-1">
            <h4 className="text-sm font-semibold text-text-strong">{messages.adminTitle}</h4>

            <p className="text-xs text-text-subtle">{messages.adminHint}</p>
          </div>

          <Button
            type="button"
            size="sm"
            variant="destructive"
            className="rounded-full whitespace-normal"
            disabled={pending}
            onClick={() => setConfirming(true)}
          >
            {messages.penalize}
          </Button>
        </section>
      )}

      {showPenalize && (
        <Dialog
          open={confirming}
          onOpenChange={(next) => {
            if (!next) closeConfirm();
          }}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {messages.penalizeTitle(messages.reportReference(report.reportId))}
              </DialogTitle>

              <DialogDescription className="break-words">
                {messages.penalizeDescription}
              </DialogDescription>
            </DialogHeader>

            <p className="text-xs text-text-subtle">{messages.penalizeEffect}</p>

            <div className="space-y-1">
              <Input
                value={reason}
                onChange={(event) => {
                  setReason(event.target.value);
                  if (penalizeFailed) setPenalizeFailed(false);
                }}
                placeholder={messages.penalizeReasonPlaceholder}
                maxLength={2000}
                aria-label={messages.penalizeReasonPlaceholder}
              />

              {tooShort && (
                <p role="alert" className="text-xs text-text-subtle">
                  {messages.penalizeReasonTooShort}
                </p>
              )}

              {penalizeFailed && (
                <p role="alert" className="break-words text-sm text-text-strong">
                  {messages.penalizeError}
                </p>
              )}
            </div>

            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                className="rounded-full"
                disabled={penalizing}
                onClick={closeConfirm}
              >
                {messages.penalizeCancel}
              </Button>

              <Button
                variant="destructive"
                className="rounded-full"
                disabled={penalizing || pending || !penalizable(report) || clean.length < 10}
                onClick={() => void confirmPenalize()}
              >
                {messages.penalizeConfirm}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </li>
  );
}
