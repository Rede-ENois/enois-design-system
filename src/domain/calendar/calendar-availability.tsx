import { useId, useState } from "react";

import { Trash2 } from "lucide-react";

import {
  MAX_WINDOWS,
  draftProblems,
  draftsToWindows,
  emptyDraft,
} from "../../lib/calendar/calendar-availability-draft.js";
import { useMessages } from "../../messages/messages-context.js";
import type { CalendarAvailabilityDraftProblem } from "../../types/domain/calendar/calendar-availability-draft-problem.js";
import type { CalendarAvailabilityDraft } from "../../types/domain/calendar/calendar-availability-draft.js";
import type { CalendarAvailabilityProps } from "../../types/domain/calendar/calendar-availability-props.js";
import { Button } from "../../ui/button.js";
import { Label } from "../../ui/label.js";
import { PillRow } from "../../ui/pill-row.js";
import { Pill } from "../../ui/pill.js";
import { TimeTextInput } from "../../ui/time-text-input.js";

const DAYS = [1, 2, 3, 4, 5, 6, 7];

/**
 * The reader's weekly availability as one editable list of windows, one per rule ("Toda segunda,
 * das 9h às 12h"). Saving is a replacement (D24): what the app receives here is the whole week,
 * and whatever the reader took off the list simply stops existing.
 *
 * Controlled like the entry form: the week lives with the app, validation runs on save (not on
 * every keystroke), and the component never fetches or saves.
 */
export function CalendarAvailability({
  drafts,
  timeZoneId,
  savePending = false,
  saveError,
  onChange,
  onSave,
}: CalendarAvailabilityProps) {
  const messages = useMessages().calendar.availability;
  const fieldId = useId();
  const [submitted, setSubmitted] = useState(false);

  const problems = draftProblems(drafts);
  const cannotSave = problems.length > 0 || savePending;

  // Only shown after a save attempt: a red line while the start time is halfway typed is noise.
  const shown = submitted ? problems[0] : undefined;
  const texts: Record<CalendarAvailabilityDraftProblem, string> = {
    day: messages.dayProblem,
    clock: messages.clockProblem,
    endBeforeStart: messages.endBeforeStartProblem,
    overlaps: messages.overlapsProblem,
    tooMany: messages.tooManyProblem(MAX_WINDOWS),
  };

  const update = (index: number, patch: Partial<CalendarAvailabilityDraft>) =>
    onChange(drafts.map((draft, at) => (at === index ? { ...draft, ...patch } : draft)));

  const remove = (index: number) => onChange(drafts.filter((_, at) => at !== index));

  const save = () => {
    setSubmitted(true);
    const windows = draftsToWindows(drafts, timeZoneId);
    if (windows) onSave(windows);
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

      <fieldset className="min-w-0 border-0 p-0">
        <legend className="mb-1.5 text-sm font-medium text-text-strong">{messages.title}</legend>

        <p className="mb-2 text-xs leading-snug text-text-subtle">{messages.hint}</p>

        {drafts.length === 0 ? (
          <p className="rounded-lg bg-surface-2 px-3 py-2 text-sm text-text-subtle">
            {messages.emptyTitle} — {messages.emptyHint}
          </p>
        ) : (
          <ul className="flex min-w-0 flex-col gap-3">
            {drafts.map((draft, index) => {
              const day = messages.dayLabel(draft.day);
              const label = messages.windowLabel(
                day,
                `${draft.startsAt || "--:--"} – ${draft.endsAt || "--:--"}`,
              );
              const rowId = `${fieldId}-window-${index}`;
              const startId = `${rowId}-start`;
              const endId = `${rowId}-end`;

              return (
                <li
                  key={rowId}
                  aria-label={label}
                  className="flex min-w-0 flex-col gap-2 rounded-lg bg-surface-2 p-3"
                >
                  <div className="flex min-w-0 items-center justify-between gap-2">
                    <PillRow label={messages.title}>
                      {DAYS.map((value) => (
                        <Pill
                          key={value}
                          size="sm"
                          active={draft.day === value}
                          onClick={() => update(index, { day: value })}
                        >
                          {messages.dayLabel(value)}
                        </Pill>
                      ))}
                    </PillRow>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label={messages.removeWindow(label)}
                      onClick={() => remove(index)}
                    >
                      <Trash2 />
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex min-w-0 flex-col gap-1">
                      <Label htmlFor={startId} className="sr-only">
                        {messages.startLabel}
                      </Label>

                      <TimeTextInput
                        id={startId}
                        value={draft.startsAt}
                        onValueChange={(startsAt) => update(index, { startsAt })}
                        required
                      />
                    </div>

                    <div className="flex min-w-0 flex-col gap-1">
                      <Label htmlFor={endId} className="sr-only">
                        {messages.endLabel}
                      </Label>

                      <TimeTextInput
                        id={endId}
                        value={draft.endsAt}
                        onValueChange={(endsAt) => update(index, { endsAt })}
                        required
                      />
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        <div className="mt-3 flex justify-start">
          <Button
            type="button"
            variant="outline"
            className="rounded-full"
            disabled={drafts.length >= MAX_WINDOWS}
            onClick={() => onChange([...drafts, emptyDraft()])}
          >
            {messages.addWindow}
          </Button>
        </div>
      </fieldset>

      <p className="text-xs leading-snug text-text-subtle">{messages.zoneHint(timeZoneId)}</p>

      {shown ? (
        <p role="alert" className="text-sm text-destructive">
          {texts[shown]}
        </p>
      ) : null}

      <div className="flex justify-end pt-1">
        <Button type="submit" className="rounded-full" disabled={cannotSave}>
          {savePending ? messages.saving : messages.save}
        </Button>
      </div>
    </form>
  );
}
