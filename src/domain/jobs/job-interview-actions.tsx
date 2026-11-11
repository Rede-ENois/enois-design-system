import { CalendarClock } from "lucide-react";

import { useMessages } from "../../messages/messages-context.js";
import type { JobInterviewActionsProps } from "../../types/domain/jobs/job-interview-actions-props.js";
import { Badge } from "../../ui/badge.js";
import { Button } from "../../ui/button.js";

const formatters = new Map<string, Intl.DateTimeFormat>();

/** One formatter per zone: the row re-renders on every list update, and building one is costly. */
function dateTimeIn(timeZoneId: string): Intl.DateTimeFormat {
  let formatter = formatters.get(timeZoneId);
  if (!formatter) {
    formatter = new Intl.DateTimeFormat("pt-BR", {
      dateStyle: "short",
      timeStyle: "short",
      timeZone: timeZoneId,
    });
    formatters.set(timeZoneId, formatter);
  }
  return formatter;
}

/**
 * The interview row of an application: the scheduled slot, when there is one, and the actions that
 * change it. The employer sees the same clock the agenda shows, because the formatter reads the
 * instant in the zone the interview was scheduled in, not the machine's.
 */
export function JobInterviewActions({
  interview,
  onSchedule,
  onReschedule,
  onCancel,
  error,
  separated = false,
}: JobInterviewActionsProps) {
  const messages = useMessages().jobInterviewActions;

  return (
    <div
      className={
        separated
          ? "flex flex-wrap items-center gap-2 border-t border-border-soft pt-3"
          : "flex flex-wrap items-center gap-2"
      }
    >
      {interview ? (
        <>
          <Badge variant="secondary" className="gap-1.5">
            <CalendarClock className="h-3 w-3" aria-hidden />
            {messages.scheduledFor(
              dateTimeIn(interview.timeZoneId).format(new Date(interview.startsAt)),
            )}
          </Badge>

          <Button variant="outline" size="sm" className="rounded-full" onClick={onReschedule}>
            {messages.reschedule}
          </Button>

          <Button variant="outline" size="sm" className="rounded-full" onClick={onCancel}>
            {messages.cancel}
          </Button>
        </>
      ) : (
        <Button variant="outline" size="sm" className="rounded-full gap-1.5" onClick={onSchedule}>
          <CalendarClock className="h-4 w-4" aria-hidden />
          {messages.schedule}
        </Button>
      )}

      {error && (
        <span className="text-xs text-destructive" role="status">
          {error}
        </span>
      )}
    </div>
  );
}
