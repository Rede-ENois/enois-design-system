import type { CalendarView } from "./calendar-view.js";

export type CalendarViewSwitcherProps = {
  value: CalendarView;
  onChange: (view: CalendarView) => void;
  className?: string;
};
