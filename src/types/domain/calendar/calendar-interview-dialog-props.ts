import type { CalendarInterviewData } from "./calendar-interview-data.js";
import type { CalendarInterviewValues } from "./calendar-interview-values.js";

/**
 * The interview dialog (fase 5): the employer picks a day and a time for an application, and the
 * interview becomes a commitment in both agendas. The app owns the request; the dialog reports the
 * values and draws the error the app hands back.
 */
export type CalendarInterviewDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** The interview already scheduled, to reschedule; absent to schedule a new one. */
  interview?: CalendarInterviewData | null;
  /** IANA id the new interview is written in; the app passes the profile's zone. */
  timeZoneId: string;
  /** Name shown in the title, so the employer knows which application is being scheduled. */
  candidateName?: string | null;
  savePending?: boolean;
  /** Shown under the title when the server rejected the save. */
  saveError?: string | null;
  onSave: (values: CalendarInterviewValues) => void;
};
