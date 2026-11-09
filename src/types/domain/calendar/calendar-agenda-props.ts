import type { CalendarAgendaItemData } from "./calendar-agenda-item-data.js";
import type { CalendarAnswer } from "./calendar-answer.js";
import type { CalendarEntryKind } from "./calendar-entry-kind.js";
import type { CalendarView } from "./calendar-view.js";

/**
 * The agenda surface: header with the period, the view switcher and the chosen view. The app owns
 * the period, the view and the data; this only draws and reports what the reader clicked.
 */
export type CalendarAgendaProps = {
  view: CalendarView;
  onViewChange: (view: CalendarView) => void;
  /**
   * Period on screen: `YYYY-MM` for the month view, `YYYY-MM-DD` for the week, the day and the
   * list start. The app turns it into the API window.
   */
  period: string;
  /** The reader moved the period with the header arrows or the "today" button. */
  onPeriodChange: (period: string) => void;
  items: CalendarAgendaItemData[];
  timeZoneId: string;
  today: string;
  /** Month view only: the day the reader picked in the grid. */
  selectedDay?: string | null;
  onSelectDay?: (day: string) => void;
  onSelectItem?: (id: string) => void;
  itemHref?: (id: string) => string;
  activeId?: string | null;
  onRespond?: (entryId: string, answer: CalendarAnswer) => void;
  respondingId?: string | null;
  respondError?: boolean;
  onRetry?: () => void;
  loading?: boolean;
  error?: boolean;
  /** What the header announces above the period, e.g. the scope name. */
  eyebrow?: string;
  hiddenKinds?: CalendarEntryKind[];
  /** Label of the header button that opens a blank entry; omitted means no button. */
  newEntryLabel?: string;
  onNewEntry?: () => void;
  className?: string;
};
