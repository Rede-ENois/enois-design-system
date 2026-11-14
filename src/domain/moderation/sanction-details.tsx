import { useMessages } from "../../messages/messages-context.js";
import type { SanctionData } from "../../types/domain/moderation/sanction-data.js";
import type { SanctionDeadline } from "../../types/domain/moderation/sanction-deadline.js";

export function SanctionDate({ at }: { at: string }) {
  const messages = useMessages().sanctionsView;
  const date = new Date(at);
  if (!Number.isFinite(date.getTime())) return <span>{messages.invalidDate}</span>;
  return (
    <time dateTime={at}>
      {new Intl.DateTimeFormat("pt-BR", {
        dateStyle: "short",
        timeStyle: "long",
        timeZone: "UTC",
      }).format(date)}
    </time>
  );
}

function Deadline({
  deadline,
  now,
  suspended,
}: {
  deadline: SanctionDeadline;
  now: number;
  suspended: boolean;
}) {
  const messages = useMessages().sanctionsView;
  if (deadline.kind === "NONE") return <p>{messages.noDeadline}</p>;
  const at = deadline.at ? Date.parse(deadline.at) : NaN;
  const remaining =
    Number.isFinite(now) && Number.isFinite(at) ? Math.max(0, Math.ceil((at - now) / 60000)) : null;
  const end = deadline.kind === "END";
  return (
    <div className="space-y-2">
      <h3 className="font-semibold">{end ? messages.endTitle : messages.appealTitle}</h3>
      {!Number.isFinite(at) ? (
        <p>{messages.invalidDeadline}</p>
      ) : (
        <>
          <p className="font-medium">
            {remaining === null
              ? messages.invalidRemaining
              : remaining === 0
                ? messages.expired
                : (end ? messages.endRemaining : messages.appealRemaining)(
                    Math.floor(remaining / 60),
                    remaining % 60,
                  )}
          </p>

          <p>
            {end ? messages.endAt : messages.appealAt} <SanctionDate at={deadline.at!} />
          </p>
          {remaining === 0 && <p>{messages.verify}</p>}
        </>
      )}
      {!end && suspended && <p>{messages.appealExplanation}</p>}
    </div>
  );
}

export function SanctionDetails({ sanction, now }: { sanction: SanctionData; now: number }) {
  const messages = useMessages().sanctionsView;
  const evidence = sanction.evidence;
  const safeText = evidence.kind === "UNAVAILABLE" ? "" : (evidence.text?.trim() ?? "");
  return (
    <div className="min-w-0 space-y-4 text-sm text-text-strong">
      <div className="flex min-w-0 flex-wrap items-center justify-between gap-2">
        <h2 className="text-base font-semibold">{messages.type[sanction.type]}</h2>

        <span className="rounded-full bg-surface-2 px-3 py-1">
          {messages.status[sanction.status]}
        </span>
      </div>

      <p>
        {messages.createdAt} <SanctionDate at={sanction.createdAt} />
      </p>

      <div className="space-y-1">
        <h3 className="font-semibold">{messages.reason}</h3>

        <p className="whitespace-pre-wrap break-words [overflow-wrap:anywhere]">
          {sanction.reason?.trim() || messages.noReason}
        </p>
      </div>

      <div className="space-y-1">
        <h3 className="font-semibold">{messages.evidence}</h3>
        {evidence.kind === "BEHAVIOR" && (
          <>
            <p className="font-medium">{messages.behaviorEvidence}</p>

            <p>{messages.behaviorExplanation}</p>
          </>
        )}
        {evidence.kind === "MEDIA" && <p className="font-medium">{messages.mediaEvidence}</p>}
        {evidence.kind === "TEXT" && <p className="font-medium">{messages.textEvidence}</p>}
        <p className="whitespace-pre-wrap break-words [overflow-wrap:anywhere]">
          {safeText ? safeText.slice(0, 600) : messages.noEvidence}
        </p>
        {safeText.length > 600 && <p>{messages.truncated}</p>}
      </div>

      <Deadline deadline={sanction.deadline} now={now} suspended={sanction.type === "SUSPENDED"} />
    </div>
  );
}
