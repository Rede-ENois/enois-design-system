import type { Ref } from "react";

import type { EventCardData } from "./event-card-data.js";

export type EventCardProps = {
  event: EventCardData;
  /** "23 out · 08:00", formatted by the app in its own time zone. */
  dateTimeLabel: string;
  attendancePending: boolean;
  onAttend: () => void;
  onCancelAttend: () => void;
  /**
   * The event was opened from a notification or deep link: a subtle ring marks it. The app owns
   * when it turns on and off, and scrolls to it through `ref`.
   */
  highlighted?: boolean;
  ref?: Ref<HTMLElement>;
};
