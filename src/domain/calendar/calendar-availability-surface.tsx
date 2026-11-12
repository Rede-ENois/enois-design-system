import { useState } from "react";

import { windowsToDrafts } from "../../lib/calendar/calendar-availability-draft.js";
import type { CalendarAvailabilityDraft } from "../../types/domain/calendar/calendar-availability-draft.js";
import type { CalendarAvailabilitySurfaceProps } from "../../types/domain/calendar/calendar-availability-surface-props.js";
import type { CalendarAvailabilityWindowInput } from "../../types/domain/calendar/calendar-availability-values.js";
import type { CalendarAvailabilityWindowData } from "../../types/domain/calendar/calendar-availability-window-data.js";

import { CalendarAvailability } from "./calendar-availability.js";

/**
 * The availability screen's wiring: the server's `windows` become the editable draft, and the app
 * runs the replacement. The surface owns the draft so typing survives a re-render of the app;
 * loading the week, the mutation and the error stay with the app (D18).
 *
 * The contract with the app is the `windows` array: a *new* array re-seeds the draft with what the
 * server keeps — so the app passes the response of a save (or a refetch) and the reader sees the
 * stable ids, the trimmed week and the normalized clocks. A refused save leaves `windows` alone,
 * which keeps what the reader typed on screen.
 */
export function CalendarAvailabilitySurface({
  windows,
  timeZoneId,
  savePending = false,
  saveError,
  onSave,
}: CalendarAvailabilitySurfaceProps) {
  const [seeded, setSeeded] = useState<CalendarAvailabilityWindowData[]>(windows);
  const [drafts, setDrafts] = useState<CalendarAvailabilityDraft[]>(() => windowsToDrafts(windows));

  // Adjusting state during render (React's documented pattern): a new week from the app replaces
  // the draft before the paint, with no effect and no flash of stale rows.
  if (windows !== seeded) {
    setSeeded(windows);
    setDrafts(windowsToDrafts(windows));
  }

  return (
    <CalendarAvailability
      drafts={drafts}
      timeZoneId={timeZoneId}
      savePending={savePending}
      saveError={saveError}
      onChange={setDrafts}
      onSave={(week: CalendarAvailabilityWindowInput[]) => void onSave(week)}
    />
  );
}
