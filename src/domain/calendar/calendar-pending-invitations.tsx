import { CalendarClock, Check, CircleHelp, Users, X } from "lucide-react";

import { timeLabel } from "../../lib/calendar/calendar-dates.js";
import { KIND_TONE } from "../../lib/calendar/calendar-kind-tone.js";
import { cn } from "../../lib/utils.js";
import { useMessages } from "../../messages/messages-context.js";
import type { CalendarAnswer } from "../../types/domain/calendar/calendar-answer.js";
import type { CalendarEntryKind } from "../../types/domain/calendar/calendar-entry-kind.js";
import type { CalendarPendingInvitationData } from "../../types/domain/calendar/calendar-pending-invitation-data.js";
import type { CalendarPendingInvitationsProps } from "../../types/domain/calendar/calendar-pending-invitations-props.js";
import { AppLink } from "../../ui/app-link.js";

const ICONS: Record<CalendarEntryKind, typeof Users> = {
  PERSONAL: CalendarClock,
  EVENT: Users,
  MENTORING: Users,
  INTERVIEW: Users,
  MEETING: Users,
  CALL: Users,
  WORKSHOP: Users,
};

const ANSWERS: CalendarAnswer[] = ["ACCEPTED", "TENTATIVE", "DECLINED"];

const ANSWER_ICONS = { ACCEPTED: Check, TENTATIVE: CircleHelp, DECLINED: X };

/**
 * Invitations waiting for an answer, above the agenda. Each one carries its own day, because the
 * invitation may land outside the period on screen; the quick answer is the same the day view
 * offers. Nothing renders when there is no invitation — an empty block above the calendar would be
 * noise every day the reader has answered everything.
 */
export function CalendarPendingInvitations({
  invitations,
  timeZoneId,
  itemHref,
  onRespond,
  respondingId,
  respondError = false,
  className,
}: CalendarPendingInvitationsProps) {
  const messages = useMessages().calendar;

  if (invitations.length === 0) {
    return null;
  }

  return (
    <section
      aria-label={messages.pendingInvitations.title}
      className={cn("flex min-w-0 flex-col gap-2", className)}
    >
      <h2 className="text-xs font-medium uppercase tracking-wide text-text-subtle">
        {messages.pendingInvitations.title}
      </h2>

      {respondError && (
        <p role="alert" className="rounded-xl bg-destructive/10 px-3 py-2 text-xs text-destructive">
          {messages.respondError}
        </p>
      )}

      <ul className="flex min-w-0 flex-col gap-2">
        {invitations.map((invitation) => (
          <li key={invitation.id} className="min-w-0">
            <InvitationRow
              invitation={invitation}
              timeZoneId={timeZoneId}
              href={itemHref?.(invitation.id)}
              onRespond={onRespond}
              responding={respondingId === invitation.id}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}

function InvitationRow({
  invitation,
  timeZoneId,
  href,
  onRespond,
  responding,
}: {
  invitation: CalendarPendingInvitationData;
  timeZoneId: string;
  href?: string;
  onRespond?: (entryId: string, answer: CalendarAnswer) => void;
  responding: boolean;
}) {
  const messages = useMessages().calendar;
  const Icon = ICONS[invitation.kind];
  const when = invitation.allDay
    ? messages.allDay
    : messages.timeRange(
        timeLabel(invitation.startsAt, timeZoneId),
        timeLabel(invitation.endsAt, timeZoneId),
      );
  const day = dayLabel(invitation.startsAt, timeZoneId);
  const Title = (
    <span className="min-w-0 flex-1 truncate text-sm font-medium text-text-strong">
      {invitation.title}
    </span>
  );

  return (
    <div className="flex min-w-0 flex-col gap-2 rounded-xl border border-border-soft bg-card p-3">
      <div className="flex min-w-0 items-center gap-2">
        <span
          className={cn(
            "grid h-7 w-7 shrink-0 place-items-center rounded-lg",
            KIND_TONE[invitation.kind],
          )}
        >
          <Icon aria-hidden className="h-3.5 w-3.5" />
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 items-center gap-2">
            {href ? (
              <AppLink
                href={href}
                aria-label={messages.openEntry(invitation.title)}
                className="min-w-0 flex-1"
              >
                {Title}
              </AppLink>
            ) : (
              Title
            )}

            <span className="shrink-0 rounded-full bg-primary-soft px-2 py-0.5 text-[11px] font-normal text-primary">
              {messages.invited}
            </span>
          </div>

          <p className="truncate text-xs font-normal text-text-subtle">
            {messages.pendingInvitations.when(day, when)}
          </p>
        </div>
      </div>

      {onRespond && (
        <div className="flex flex-wrap items-center gap-2 pl-9">
          {ANSWERS.map((answer) => {
            const AnswerIcon = ANSWER_ICONS[answer];
            const label =
              answer === "ACCEPTED"
                ? messages.accept
                : answer === "TENTATIVE"
                  ? messages.tentative
                  : messages.decline;

            return (
              <button
                key={answer}
                type="button"
                disabled={responding}
                onClick={() => onRespond(invitation.id, answer)}
                className={cn(
                  "inline-flex h-8 items-center gap-1 rounded-full border border-border px-3 text-xs font-normal transition",
                  "hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  "disabled:cursor-not-allowed disabled:opacity-60",
                )}
              >
                <AnswerIcon aria-hidden className="h-3 w-3" />
                {label}
              </button>
            );
          })}

          {responding && (
            <span role="status" className="text-xs font-normal text-text-subtle">
              {messages.responding}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

const DAY_FORMAT = new Map<string, Intl.DateTimeFormat>();

/** The invitation's day in the reader's zone: "próxima sexta" is only useful if it is their day. */
function dayLabel(instant: string, timeZoneId: string): string {
  let formatter = DAY_FORMAT.get(timeZoneId);
  if (!formatter) {
    formatter = new Intl.DateTimeFormat("pt-BR", {
      timeZone: timeZoneId,
      weekday: "short",
      day: "2-digit",
      month: "short",
    });
    DAY_FORMAT.set(timeZoneId, formatter);
  }
  const date = new Date(instant);
  return Number.isNaN(date.getTime()) ? "" : formatter.format(date);
}
