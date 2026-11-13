import type { CalendarSlot } from "./calendar-slot.js";

export type CalendarSlotPickerProps = {
  /** The slots the mentor published, already filtered to what can be booked. */
  slots: CalendarSlot[];
  /** The slot the reader picked, or `null` while none is chosen. */
  value: string | null;
  /** Reports the chosen slot id; `null` clears the choice. */
  onChange: (slotId: string | null) => void;
  /** Disables every option while the booking request is in flight. */
  disabled?: boolean;
  /** The server refused the booking; the picker says so and keeps the choice. */
  error?: string | null;
  className?: string;
};
