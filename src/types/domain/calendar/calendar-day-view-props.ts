import type { CalendarAgendaItemData } from "./calendar-agenda-item-data.js";
import type { CalendarAnswer } from "./calendar-answer.js";

export type CalendarDayViewProps = {
  /** `YYYY-MM-DD` in `timeZoneId`. */
  day: string;
  items: CalendarAgendaItemData[];
  timeZoneId: string;
  today: string;
  onSelectItem?: (id: string) => void;
  itemHref?: (id: string) => string;
  activeId?: string | null;
  /** Invitation the reader has not answered; drawn with the quick actions. */
  onRespond?: (entryId: string, participation: CalendarAnswer) => void;
  /** Invitation answer in flight: the buttons of that entry are disabled, `null` disables none. */
  respondingId?: string | null;
  /** Set when a response failed; shown above the entry that was being answered. */
  respondError?: boolean;
  onRetry?: () => void;
  loading?: boolean;
  error?: boolean;
  className?: string;
};
