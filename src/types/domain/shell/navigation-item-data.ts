import type { ComponentType } from "react";

import type { SignalData } from "../../components/ui/signal-data.js";

import type { NavigationSection } from "./navigation-section.js";

/** One main navigation entry, already filtered and resolved by the app. */
export type NavigationItemData = {
  href: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
  /** The current route is this entry (or below it). */
  active: boolean;
  /** Group the entry is listed under; entries without one go to the top. */
  section?: NavigationSection;
  /** What is new there (unread messages, pending requests, news, an event today). */
  signal?: SignalData | null;
};
