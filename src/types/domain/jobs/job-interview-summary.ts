/**
 * The interview already scheduled for an application, as the applications list shows it. The
 * instants travel in UTC and the zone is the one the employer scheduled in, so the row shows the
 * same clock the agenda does.
 */
export type JobInterviewSummary = {
  id: string;
  startsAt: string;
  endsAt: string;
  timeZoneId: string;
  notes: string | null;
};
