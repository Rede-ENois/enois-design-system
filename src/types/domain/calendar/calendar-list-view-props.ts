import type { CalendarAgendaItemData } from "./calendar-agenda-item-data.js";

export type CalendarListViewProps = {
  /**
   * Items already cut to the window the app asked the API for; the view only groups them by day.
   * Include the cancelled ones: they stay listed as cancelled.
   */
  items: CalendarAgendaItemData[];
  timeZoneId: string;
  today: string;
  onSelectItem?: (id: string) => void;
  itemHref?: (id: string) => string;
  activeId?: string | null;
  loading?: boolean;
  error?: boolean;
  onRetry?: () => void;
  className?: string;
};
