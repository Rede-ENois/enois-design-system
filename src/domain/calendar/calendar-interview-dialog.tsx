import { useEffect, useId, useState } from "react";

import { CalendarClock } from "lucide-react";

import { instantOf, wallClockOf } from "../../lib/calendar/calendar-clock.js";
import { isDay } from "../../lib/calendar/calendar-dates.js";
import { useMessages } from "../../messages/messages-context.js";
import type { CalendarInterviewData } from "../../types/domain/calendar/calendar-interview-data.js";
import type { CalendarInterviewDialogProps } from "../../types/domain/calendar/calendar-interview-dialog-props.js";
import type { CalendarInterviewDraft } from "../../types/domain/calendar/calendar-interview-draft.js";
import type { CalendarInterviewProblem } from "../../types/domain/calendar/calendar-interview-problem.js";
import type { CalendarInterviewValues } from "../../types/domain/calendar/calendar-interview-values.js";
import { Button } from "../../ui/button.js";
import { DateTextInput } from "../../ui/date-text-input.js";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog.js";
import { Label } from "../../ui/label.js";
import { Textarea } from "../../ui/textarea.js";
import { TimeTextInput } from "../../ui/time-text-input.js";

/** The server's ceiling (`JobInterview.MAX_DURATION`): eight hours. */
const MAX_DURATION_MS = 8 * 60 * 60 * 1000;
const CLOCK = /^([01]\d|2[0-3]):([0-5]\d)$/;
const LAST_MINUTE = "23:59";

function draftOf(
  interview: CalendarInterviewData | null | undefined,
  timeZoneId: string,
): CalendarInterviewDraft {
  if (interview) {
    const start = wallClockOf(interview.startsAt, interview.timeZoneId);
    return {
      day: start.day,
      startTime: start.time,
      endTime: wallClockOf(interview.endsAt, interview.timeZoneId).time,
      notes: interview.notes ?? "",
    };
  }

  // A new interview opens on the next full hour, in the zone it will be written in: at 23h30 the
  // next hour is 00h of the next day, and keeping today's date would open a time already past.
  const next = new Date(Date.now() + 60 * 60 * 1000);
  next.setUTCMinutes(0, 0, 0);
  const start = wallClockOf(next.toISOString(), timeZoneId);
  const end = wallClockOf(
    new Date(
      Date.parse(instantOf(start.day, start.time, timeZoneId)) + 60 * 60 * 1000,
    ).toISOString(),
    timeZoneId,
  );
  return {
    day: start.day,
    startTime: start.time,
    // The clock fields carry no date, so an end on the next day would read as before the start.
    endTime: end.day === start.day ? end.time : LAST_MINUTE,
    notes: "",
  };
}

/**
 * The interview dialog (fase 5). The employer picks a day and a time for an application; the
 * interview becomes a commitment in both agendas through the app's request.
 *
 * The dialog never fetches or saves: it reports the values in the API shape, and the app owns the
 * mutation, the idempotency key and the error it hands back as `saveError`. The day and the clocks
 * are wall-clock values in the interview's zone and become instants once, on save.
 */
export function CalendarInterviewDialog({
  open,
  onOpenChange,
  interview = null,
  timeZoneId,
  candidateName = null,
  savePending = false,
  saveError = null,
  onSave,
}: CalendarInterviewDialogProps) {
  const messages = useMessages().calendar.interviewDialog;
  const fieldId = useId();
  const id = (name: string) => `${fieldId}-${name}`;

  // The body remounts on every open, so a cancelled draft never comes back filled in.
  const [opened, setOpened] = useState(0);
  useEffect(() => {
    if (open) setOpened((count) => count + 1);
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[88vh] max-w-lg overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-normal">
            <CalendarClock aria-hidden className="size-4" />
            {interview && candidateName ? messages.editTitle(candidateName) : messages.createTitle}
          </DialogTitle>

          <DialogDescription>{messages.description}</DialogDescription>
        </DialogHeader>

        <FormBody
          key={`${opened}-${interview?.id ?? "new"}`}
          interview={interview}
          timeZoneId={timeZoneId}
          savePending={savePending}
          saveError={saveError}
          onSave={onSave}
          onCancel={() => onOpenChange(false)}
          id={id}
        />
      </DialogContent>
    </Dialog>
  );
}

function FormBody({
  interview,
  timeZoneId,
  savePending,
  saveError,
  onSave,
  onCancel,
  id,
}: {
  interview: CalendarInterviewData | null;
  timeZoneId: string;
  savePending: boolean;
  saveError: string | null;
  onSave: (values: CalendarInterviewValues) => void;
  onCancel: () => void;
  id: (name: string) => string;
}) {
  const messages = useMessages().calendar.interviewDialog;
  const [draft, setDraft] = useState(() => draftOf(interview, timeZoneId));
  const [submitted, setSubmitted] = useState(false);

  const update = <K extends keyof CalendarInterviewDraft>(
    key: K,
    value: CalendarInterviewDraft[K],
  ) => setDraft((current) => ({ ...current, [key]: value }));

  const problem = problemOf(draft, timeZoneId);
  // The button stays enabled while the draft has a problem: a disabled button cannot say what is
  // wrong, and the reader would be stuck without knowing why.
  const shownProblem = submitted ? problem : null;

  const problemText: Record<NonNullable<typeof problem>, string> = {
    day: messages.invalidDay,
    clock: messages.invalidClock,
    endBeforeStart: messages.endBeforeStart,
    tooLong: messages.durationTooLong,
  };

  const save = () => {
    setSubmitted(true);
    const values = valuesOf(draft, timeZoneId);
    if (values) onSave(values);
  };

  return (
    <form
      className="flex min-w-0 flex-col gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        save();
      }}
    >
      {saveError ? (
        <p role="alert" className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {saveError}
        </p>
      ) : null}

      <div className="flex min-w-0 flex-col gap-1.5">
        <Label htmlFor={id("day")}>{messages.dayLabel}</Label>

        <DateTextInput
          id={id("day")}
          value={draft.day}
          onValueChange={(day) => update("day", day)}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex min-w-0 flex-col gap-1.5">
          <Label htmlFor={id("start")}>{messages.startLabel}</Label>

          <TimeTextInput
            id={id("start")}
            value={draft.startTime}
            onValueChange={(time) => update("startTime", time)}
            required
          />
        </div>

        <div className="flex min-w-0 flex-col gap-1.5">
          <Label htmlFor={id("end")}>{messages.endLabel}</Label>

          <TimeTextInput
            id={id("end")}
            value={draft.endTime}
            onValueChange={(time) => update("endTime", time)}
            required
          />
        </div>
      </div>

      <div className="flex min-w-0 flex-col gap-1.5">
        <Label htmlFor={id("notes")}>{messages.notesLabel}</Label>

        <Textarea
          id={id("notes")}
          value={draft.notes}
          onChange={(event) => update("notes", event.target.value)}
          placeholder={messages.notesPlaceholder}
          rows={3}
          maxLength={1000}
        />
      </div>

      <p className="text-xs leading-snug text-text-subtle">{messages.zoneHint(timeZoneId)}</p>

      {shownProblem ? (
        <p role="alert" className="text-sm text-destructive">
          {problemText[shownProblem]}
        </p>
      ) : null}

      <DialogFooter className="gap-2">
        <Button
          type="button"
          variant="outline"
          className="rounded-full"
          disabled={savePending}
          onClick={onCancel}
        >
          {messages.cancel}
        </Button>

        <Button type="submit" className="rounded-full" disabled={savePending}>
          {savePending ? messages.saving : messages.save}
        </Button>
      </DialogFooter>
    </form>
  );
}

function problemOf(
  draft: CalendarInterviewDraft,
  timeZoneId: string,
): CalendarInterviewProblem | null {
  if (!isDay(draft.day)) return "day";
  if (!CLOCK.test(draft.startTime) || !CLOCK.test(draft.endTime)) return "clock";

  const startsAt = instantOf(draft.day, draft.startTime, timeZoneId);
  const endsAt = instantOf(draft.day, draft.endTime, timeZoneId);
  if (!startsAt || !endsAt) return "clock";
  if (Date.parse(endsAt) <= Date.parse(startsAt)) return "endBeforeStart";
  if (Date.parse(endsAt) - Date.parse(startsAt) > MAX_DURATION_MS) return "tooLong";
  return null;
}

function valuesOf(
  draft: CalendarInterviewDraft,
  timeZoneId: string,
): CalendarInterviewValues | null {
  if (problemOf(draft, timeZoneId) !== null) return null;

  const startsAt = instantOf(draft.day, draft.startTime, timeZoneId);
  const endsAt = instantOf(draft.day, draft.endTime, timeZoneId);
  if (!startsAt || !endsAt) return null;

  const notes = draft.notes.trim();
  return {
    startsAt,
    endsAt,
    timeZoneId,
    notes: notes.length > 0 ? notes : null,
  };
}
