/**
 * How long before the start the reminder fires, in minutes. The server accepts exactly these
 * values (`CalendarReminder.ALLOWED_MINUTES`) and the migration carries the same list, so a new
 * value has to be added in all three places.
 */
export type CalendarReminderMinutes = 5 | 15 | 30 | 60 | 1440;
