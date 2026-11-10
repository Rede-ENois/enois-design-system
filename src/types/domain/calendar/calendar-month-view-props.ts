import type { CalendarAgendaItemData } from "./calendar-agenda-item-data.js";
import type { CalendarEntryKind } from "./calendar-entry-kind.js";
import type { CalendarView } from "./calendar-view.js";

export type CalendarMonthViewProps = {
  /** `YYYY-MM` of the month on screen, in `timeZoneId`. */
  month: string;
  items: CalendarAgendaItemData[];
  /** The zone the reader's day boundaries come from, normally the browser's. */
  timeZoneId: string;
  /** `YYYY-MM-DD` of today in `timeZoneId`; the app passes it so SSR and client agree. */
  today: string;
  selectedDay?: string | null;
  onSelectDay?: (day: string) => void;
  onSelectItem?: (id: string) => void;
  /** Builds the entry detail path; the view never knows about routes. */
  itemHref?: (id: string) => string;
  /** Entry id the reader last touched by keyboard; without a detail screen the list is a link. */
  activeId?: string | null;
  loading?: boolean;
  error?: boolean;
  onRetry?: () => void;
  /** Opens whatever view shows that day. */
  onOpenDay?: (day: string, view: CalendarView) => void;
  /** Draws the kind icon on each entry; the name is always in the accessible label. */
  showKindIcon?: boolean;
  /** Hides the entries of a kind without dropping them from the month grid. */
  hiddenKinds?: CalendarEntryKind[];
  className?: string;
};
