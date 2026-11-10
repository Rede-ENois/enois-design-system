import { useEffect, useId, useState } from "react";

import { instantOf, wallClockOf } from "../../lib/calendar/calendar-clock.js";
import { isDay } from "../../lib/calendar/calendar-dates.js";
import {
  MAX_DESCRIPTION,
  MAX_TITLE,
  draftProblems,
  draftToValues,
} from "../../lib/calendar/calendar-entry-draft.js";
import { useMessages } from "../../messages/messages-context.js";
import type { CalendarAgendaItemData } from "../../types/domain/calendar/calendar-agenda-item-data.js";
import type { CalendarEntryDraftProblem } from "../../types/domain/calendar/calendar-entry-draft-problem.js";
import type { CalendarEntryFormBodyProps } from "../../types/domain/calendar/calendar-entry-form-body-props.js";
import type { CalendarEntryFormDraft } from "../../types/domain/calendar/calendar-entry-form-draft.js";
import type { CalendarEntryFormProps } from "../../types/domain/calendar/calendar-entry-form-props.js";
import type { CalendarEntryKind } from "../../types/domain/calendar/calendar-entry-kind.js";
import type { CalendarScope } from "../../types/domain/calendar/calendar-scope.js";
import { Button } from "../../ui/button.js";
import { DateTextInput } from "../../ui/date-text-input.js";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../ui/dialog.js";
import { Input } from "../../ui/input.js";
import { Label } from "../../ui/label.js";
import { PillRow } from "../../ui/pill-row.js";
import { Pill } from "../../ui/pill.js";
import { Switch } from "../../ui/switch.js";
import { Textarea } from "../../ui/textarea.js";
import { TimeTextInput } from "../../ui/time-text-input.js";

const KINDS: CalendarEntryKind[] = [
  "PERSONAL",
  "EVENT",
  "MENTORING",
  "INTERVIEW",
  "MEETING",
  "CALL",
  "WORKSHOP",
];
const SCOPES: CalendarScope[] = ["SOCIAL", "PROFESSIONAL"];
/** Last minute of the day, used when the end hour would wrap to 00:00 and read as before the start. */
const LAST_MINUTE = "23:59";

const clock = (hour: number) => `${String(hour).padStart(2, "0")}:00`;

function draftOf(
  {
    entry,
    defaultScope,
    defaultDay,
    timeZoneId,
  }: Pick<CalendarEntryFormProps, "entry" | "defaultScope" | "defaultDay" | "timeZoneId">,
  now: Date,
): CalendarEntryFormDraft {
  if (entry) {
    const start = wallClockOf(entry.startsAt, entry.timeZoneId);
    return {
      scope: entry.scope,
      kind: entry.kind,
      title: entry.title,
      description: entry.description ?? "",
      day: start.day,
      startTime: start.time,
      endTime: wallClockOf(entry.endsAt, entry.timeZoneId).time,
      allDay: entry.allDay,
      timeZoneId: entry.timeZoneId,
    };
  }

  // Opening on a day the reader chose points at a working hour. Opening on "today" starts at the
  // next full hour, and both the day and the time come from that instant: at 23h30 the next hour is
  // 00h of the *next* day, and keeping today's date would open an entry that has already passed.
  const start = defaultDay
    ? { day: defaultDay, time: clock(9) }
    : (() => {
        const next = new Date(now.getTime() + 60 * 60 * 1000);
        next.setUTCMinutes(0, 0, 0);
        return wallClockOf(next.toISOString(), timeZoneId);
      })();
  const end = wallClockOf(
    new Date(
      Date.parse(instantOf(start.day, start.time, timeZoneId)) + 60 * 60 * 1000,
    ).toISOString(),
    timeZoneId,
  );
  return {
    scope: defaultScope ?? "SOCIAL",
    kind: "PERSONAL",
    title: "",
    description: "",
    day: start.day,
    startTime: start.time,
    // The clock fields carry no date, so an end that lands on the next day would read as before the
    // start; an entry that runs past midnight is written by moving the day instead.
    endTime: end.day === start.day ? end.time : LAST_MINUTE,
    allDay: false,
    timeZoneId,
  };
}

/**
 * Create and edit share one dialog: an entry to edit opens it filled in. The day and the two clocks
 * are wall-clock values in the entry's zone and become instants once, on save, so "19h" stays 19h
 * for whoever wrote it whatever zone the browser is in.
 *
 * The form never fetches, routes or saves: it reports the values in the API shape, and the app owns
 * the mutation, the idempotency key and the error it hands back as `saveError`.
 */
export function CalendarEntryFormDialog({
  open,
  onOpenChange,
  entry,
  defaultScope,
  defaultDay,
  timeZoneId,
  conflicts,
  savePending = false,
  saveError,
  onSave,
}: CalendarEntryFormProps) {
  const form = useMessages().calendar.form;
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
          <DialogTitle className="font-normal">
            {entry ? form.editTitle : form.createTitle}
          </DialogTitle>
        </DialogHeader>

        <FormBody
          key={`${opened}-${entry?.id ?? "new"}`}
          entry={entry}
          defaultScope={defaultScope}
          defaultDay={defaultDay}
          timeZoneId={timeZoneId}
          conflicts={conflicts}
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

function dayAfter(day: string): string | null {
  const parsed = new Date(`${day}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime())) return null;
  return new Date(parsed.getTime() + 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

function FormBody({
  entry,
  defaultScope,
  defaultDay,
  timeZoneId,
  conflicts,
  savePending = false,
  saveError,
  onSave,
  onCancel,
  id,
}: CalendarEntryFormBodyProps) {
  const messages = useMessages().calendar;
  const form = messages.form;
  const [draft, setDraft] = useState(() =>
    draftOf({ entry, defaultScope, defaultDay, timeZoneId }, new Date()),
  );
  const [submitted, setSubmitted] = useState(false);

  const problems = draftProblems(draft);
  const cannotSave = problems.length > 0 || savePending;
  const update = <K extends keyof CalendarEntryFormDraft>(
    key: K,
    value: CalendarEntryFormDraft[K],
  ) => setDraft((current) => ({ ...current, [key]: value }));

  // Only shown after a save attempt: a red line under "Termina" while the start time is still being
  // typed is noise.
  const shownProblem = submitted ? problems[0] : undefined;
  const problemText: Record<CalendarEntryDraftProblem, string> = {
    title: form.titleProblem(MAX_TITLE),
    description: form.descriptionProblem(MAX_DESCRIPTION),
    day: form.invalidDay,
    clock: form.invalidClock,
    endBeforeStart: form.endBeforeStart,
    tooLong: form.durationTooLong,
  };

  const save = () => {
    setSubmitted(true);
    const values = draftToValues(draft);
    if (values) onSave(values);
  };

  const startsAt = isDay(draft.day) ? instantOf(draft.day, draft.startTime, draft.timeZoneId) : "";
  const endsAt = isDay(draft.day) ? instantOf(draft.day, draft.endTime, draft.timeZoneId) : "";

  // The warning follows what is on the fields, not what the app fetched: the caller hands the
  // list for the window (D23) and the form picks the ones the draft actually touches. Half-open:
  // ending exactly when another begins is not a clash. An all-day entry covers its whole day.
  const clashes = (conflicts ?? []).filter((item) => {
    if (item.entry.cancelledAt) return false;
    if (item.entry.id === entry?.id) return false;
    if (!startsAt || !endsAt) return false;
    const from = draft.allDay ? `${draft.day}T00:00:00` : startsAt;
    const to = draft.allDay ? dayAfter(draft.day) : endsAt;
    if (!to) return false;
    return (
      Date.parse(item.entry.startsAt) < Date.parse(to) &&
      Date.parse(item.entry.endsAt) > Date.parse(from)
    );
  });

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

      <fieldset className="min-w-0 border-0 p-0">
        <legend className="mb-1.5 text-sm font-medium text-text-strong">{form.scopeLabel}</legend>

        <PillRow label={form.scopeLabel}>
          {SCOPES.map((scope) => (
            <Pill key={scope} active={draft.scope === scope} onClick={() => update("scope", scope)}>
              {messages.scopes[scope]}
            </Pill>
          ))}
        </PillRow>
      </fieldset>

      <fieldset className="min-w-0 border-0 p-0">
        <legend className="mb-1.5 text-sm font-medium text-text-strong">{form.kindLabel}</legend>

        <PillRow label={form.kindLabel}>
          {KINDS.map((kind) => (
            <Pill
              key={kind}
              size="sm"
              active={draft.kind === kind}
              onClick={() => update("kind", kind)}
            >
              {messages.kinds[kind]}
            </Pill>
          ))}
        </PillRow>
      </fieldset>

      <div className="flex min-w-0 flex-col gap-1.5">
        <Label htmlFor={id("title")}>{form.titleLabel}</Label>

        <Input
          id={id("title")}
          value={draft.title}
          onChange={(event) => update("title", event.target.value)}
          placeholder={form.titlePlaceholder}
          maxLength={MAX_TITLE}
          autoComplete="off"
          required
        />
      </div>

      <div className="flex min-w-0 flex-col gap-1.5">
        <Label htmlFor={id("description")}>{form.descriptionLabel}</Label>

        <Textarea
          id={id("description")}
          value={draft.description}
          onChange={(event) => update("description", event.target.value)}
          placeholder={form.descriptionPlaceholder}
          rows={3}
          maxLength={MAX_DESCRIPTION}
        />
      </div>

      <div className="flex min-w-0 flex-col gap-1.5">
        <Label htmlFor={id("day")}>{form.dayLabel}</Label>

        <DateTextInput
          id={id("day")}
          value={draft.day}
          onValueChange={(day) => update("day", day)}
          required
        />
      </div>

      <div className="flex items-center justify-between gap-3">
        <Label htmlFor={id("allDay")} className="flex min-w-0 flex-col gap-0.5">
          <span className="font-medium text-text-strong">{form.allDayLabel}</span>

          <span className="text-xs font-normal leading-snug text-text-subtle">
            {form.allDayHint}
          </span>
        </Label>

        <Switch
          id={id("allDay")}
          checked={draft.allDay}
          onCheckedChange={(allDay) => update("allDay", allDay)}
        />
      </div>

      {!draft.allDay && (
        <div className="grid grid-cols-2 gap-3">
          <div className="flex min-w-0 flex-col gap-1.5">
            <Label htmlFor={id("start")}>{form.startLabel}</Label>

            <TimeTextInput
              id={id("start")}
              value={draft.startTime}
              onValueChange={(time) => update("startTime", time)}
              required
            />
          </div>

          <div className="flex min-w-0 flex-col gap-1.5">
            <Label htmlFor={id("end")}>{form.endLabel}</Label>

            <TimeTextInput
              id={id("end")}
              value={draft.endTime}
              onValueChange={(time) => update("endTime", time)}
              required
            />
          </div>
        </div>
      )}

      <p className="text-xs leading-snug text-text-subtle">
        {/* The two instants make the zone readable: what the reader types is a time, and what the
            API stores is the moment it stands for. */}
        {form.zoneHint(draft.timeZoneId)}
        {startsAt && endsAt ? (
          <>
            {" · "}
            <time dateTime={startsAt} className="tabular-nums">
              {startsAt.slice(11, 16)}
            </time>
            {" – "}
            <time dateTime={endsAt} className="tabular-nums">
              {endsAt.slice(11, 16)}
            </time>
            {" UTC"}
          </>
        ) : null}
      </p>

      {clashes.length > 0 ? (
        <p
          role="status"
          className="rounded-lg bg-opportunity/10 px-3 py-2 text-sm text-opportunity"
        >
          {form.conflictWarning(clashes.length)}
        </p>
      ) : null}

      {shownProblem ? (
        <p role="alert" className="text-sm text-destructive">
          {problemText[shownProblem]}
        </p>
      ) : null}

      <div className="flex justify-end gap-2 pt-1">
        <Button type="button" variant="outline" className="rounded-full" onClick={onCancel}>
          {form.cancel}
        </Button>

        <Button type="submit" className="rounded-full" disabled={cannotSave}>
          {savePending ? form.saving : form.save}
        </Button>
      </div>
    </form>
  );
}
