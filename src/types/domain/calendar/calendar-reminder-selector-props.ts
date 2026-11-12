import type { CalendarReminderMinutes } from "./calendar-reminder-minutes.js";

export type CalendarReminderSelectorProps = {
  /** The reminder the reader already has, or `null` when they have none. */
  value: CalendarReminderMinutes | null;
  /** `null` removes the reminder. */
  onChange: (minutes: CalendarReminderMinutes | null) => void;
  /** Disables every option while the request is in flight. */
  saving?: boolean;
  /** The server refused the change; the surface says so and keeps the previous choice. */
  error?: string | null;
  className?: string;
};
