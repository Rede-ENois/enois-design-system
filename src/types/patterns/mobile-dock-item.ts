import type { ComponentType } from "react";

import type { SignalData } from "../components/ui/signal-data.js";

/** One destination in the mobile dock. */
export type MobileDockItem = {
  href: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
  active: boolean;
  signal?: SignalData | null;
};
