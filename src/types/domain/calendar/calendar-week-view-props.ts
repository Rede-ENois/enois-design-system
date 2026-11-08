import type { CalendarAgendaItemData } from "./calendar-agenda-item-data.js";

export type CalendarWeekViewProps = {
  /**
   * Any day of the week on screen (`YYYY-MM-DD`). The grid always runs from Sunday to Saturday;
   * an entry is placed on the day of its start.
   */
  week: string;
  items: CalendarAgendaItemData[];
  timeZoneId: string;
  today: string;
  selectedDay?: string | null;
  onSelectDay?: (day: string) => void;
  onSelectItem?: (id: string) => void;
  itemHref?: (id: string) => string;
  activeId?: string | null;
  loading?: boolean;
  error?: boolean;
  onRetry?: () => void;
  className?: string;
};
