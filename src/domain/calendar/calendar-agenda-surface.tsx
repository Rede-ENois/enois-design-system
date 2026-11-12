import { useState } from "react";

import { dayOfPeriod } from "../../lib/calendar/calendar-period.js";
import { useMessages } from "../../messages/messages-context.js";
import type { CalendarAgendaSurfaceDraft } from "../../types/domain/calendar/calendar-agenda-surface-draft.js";
import type { CalendarAgendaSurfaceProps } from "../../types/domain/calendar/calendar-agenda-surface-props.js";
import type { CalendarEntryFormValues } from "../../types/domain/calendar/calendar-entry-form-values.js";

import { CalendarAgenda } from "./calendar-agenda.js";
import { CalendarEntryFormDialog } from "./calendar-entry-form-dialog.js";
import { CalendarPendingInvitations } from "./calendar-pending-invitations.js";

/**
 * The agenda with the entry form wired in: the header button opens a blank entry, and the dialog
 * closes only when the app reports the save went through, so a refusal keeps what the reader typed.
 *
 * The surface holds one piece of state the agenda cannot: which entry is in the form. The window,
 * the invitations and the mutation stay with the app.
 */
export function CalendarAgendaSurface({
  newEntryScope,
  editingEntry,
  onEditingChange,
  savePending = false,
  saveError,
  conflicts,
  pendingInvitations,
  onSave,
  ...agenda
}: CalendarAgendaSurfaceProps) {
  const messages = useMessages().calendar;
  const [draft, setDraft] = useState<CalendarAgendaSurfaceDraft | null>(null);

  // An entry the app wants to edit wins over the local draft: opening it from another screen has to
  // show that entry, not whatever was left half-written here.
  const form: CalendarAgendaSurfaceDraft | null = editingEntry
    ? { kind: "edit", entry: editingEntry }
    : draft;
  const close = () => {
    setDraft(null);
    onEditingChange?.(null);
  };
  const save = async (values: CalendarEntryFormValues) => {
    const saved = await onSave(values, form?.kind === "edit" ? form.entry : null);
    if (saved) close();
  };

  return (
    <>
      <CalendarPendingInvitations
        invitations={pendingInvitations ?? []}
        timeZoneId={agenda.timeZoneId}
        itemHref={agenda.itemHref}
        onRespond={agenda.onRespond}
        respondingId={agenda.respondingId}
        respondError={agenda.respondError}
      />
      <CalendarAgenda
        {...agenda}
        newEntryLabel={messages.newEntry}
        onNewEntry={() => {
          onEditingChange?.(null);
          setDraft({ kind: "new" });
        }}
      />
      <CalendarEntryFormDialog
        open={form !== null}
        onOpenChange={(open) => {
          if (!open) close();
        }}
        entry={form?.kind === "edit" ? form.entry : null}
        defaultScope={newEntryScope}
        // A blank entry starts on the day the reader is looking at, so saving it does not send them
        // to a day they cannot see. A picked day in the month grid beats the period.
        defaultDay={
          form?.kind === "new"
            ? (agenda.selectedDay ?? dayOfPeriod(agenda.period, agenda.today))
            : null
        }
        timeZoneId={agenda.timeZoneId}
        conflicts={conflicts}
        savePending={savePending}
        saveError={saveError}
        onSave={(values) => void save(values)}
      />
    </>
  );
}
