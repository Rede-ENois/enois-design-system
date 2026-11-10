import { Ban, CalendarClock, Check, CircleHelp, Users, X } from "lucide-react";

import { KIND_TONE } from "../../lib/calendar/calendar-kind-tone.js";
import { cn } from "../../lib/utils.js";
import { useMessages } from "../../messages/messages-context.js";
import type { CalendarAgendaItemData } from "../../types/domain/calendar/calendar-agenda-item-data.js";
import type { CalendarAnswer } from "../../types/domain/calendar/calendar-answer.js";
import type { CalendarEntryKind } from "../../types/domain/calendar/calendar-entry-kind.js";
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

/**
 * One entry as a row: time, title, kind and the reader's place. Shared by the day view and the
 * list so the same entry looks the same in both; the month cell uses a compact version.
 */
export function CalendarEntryRow({
  item,
  time,
  href,
  active = false,
  onRespond,
  responding = false,
  showQuickAnswer = false,
}: {
  item: CalendarAgendaItemData;
  /** Already formatted `HH:mm` for start and end, or `null` for an all-day entry. */
  time: { start: string; end: string } | null;
  href?: string;
  active?: boolean;
  onRespond?: (entryId: string, answer: CalendarAnswer) => void;
  responding?: boolean;
  showQuickAnswer?: boolean;
}) {
  const messages = useMessages().calendar;
  const entry = item.entry;
  const Icon = ICONS[entry.kind];
  const cancelled = entry.cancelledAt !== null;
  const pending = item.participation === "INVITED";
  const Title = (
    <span
      className={cn(
        "min-w-0 flex-1 truncate text-sm font-medium",
        cancelled && "text-text-subtle line-through",
      )}
    >
      {entry.title}
    </span>
  );

  return (
    <div
      data-active={active || undefined}
      data-cancelled={cancelled || undefined}
      className={cn(
        "flex min-w-0 flex-col gap-2 rounded-xl border border-border-soft bg-card p-3",
        active && "ring-2 ring-primary/40",
        cancelled && "opacity-70",
      )}
    >
      <div className="flex min-w-0 items-center gap-2">
        <span
          className={cn(
            "grid h-7 w-7 shrink-0 place-items-center rounded-lg",
            KIND_TONE[entry.kind],
          )}
        >
          <Icon aria-hidden className="h-3.5 w-3.5" />
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 items-center gap-2">
            {href ? (
              <AppLink
                href={href}
                aria-label={messages.openEntry(entry.title)}
                className="min-w-0 flex-1"
              >
                {Title}
              </AppLink>
            ) : (
              Title
            )}

            {cancelled && (
              <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-[11px] font-normal text-text-subtle">
                {messages.cancelled}
              </span>
            )}

            {pending && (
              <span className="shrink-0 rounded-full bg-primary-soft px-2 py-0.5 text-[11px] font-normal text-primary">
                {messages.invited}
              </span>
            )}
          </div>

          <p className="truncate text-xs font-normal text-text-subtle">
            {entry.allDay || !time ? messages.allDay : messages.timeRange(time.start, time.end)}
          </p>
        </div>
      </div>

      {showQuickAnswer && pending && onRespond && (
        <div className="flex flex-wrap items-center gap-2 pl-9">
          {(["ACCEPTED", "TENTATIVE", "DECLINED"] as CalendarAnswer[]).map((answer) => {
            const label =
              answer === "ACCEPTED"
                ? messages.accept
                : answer === "TENTATIVE"
                  ? messages.tentative
                  : messages.decline;
            const AnswerIcon =
              answer === "ACCEPTED" ? Check : answer === "TENTATIVE" ? CircleHelp : X;

            return (
              <button
                key={answer}
                type="button"
                disabled={responding}
                onClick={() => onRespond(entry.id, answer)}
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

      {item.participation && !pending && (
        <p className="flex items-center gap-1 pl-9 text-[11px] font-normal text-text-subtle">
          {item.participation === "DECLINED" ? (
            <Ban aria-hidden className="h-3 w-3" />
          ) : (
            <Check aria-hidden className="h-3 w-3" />
          )}
          {messages.participations[item.participation]}
        </p>
      )}
    </div>
  );
}
