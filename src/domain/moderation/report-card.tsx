import { useMessages } from "../../messages/messages-context.js";
import type { ReportCardProps } from "../../types/domain/moderation/report-card-props.js";
import { AppLink } from "../../ui/app-link.js";
import { Button } from "../../ui/button.js";

export function ReportCard({ report, admin, pending, onVote }: ReportCardProps) {
  const messages = useMessages().reportCard;
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
    </li>
  );
}
