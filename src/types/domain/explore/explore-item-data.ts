import type { ComponentType } from "react";

import type { SignalData } from "../../components/ui/signal-data.js";

/** One room in the Explore hub. */
export type ExploreItemData = {
  href: string;
  label: string;
  /** One line on what the room is for. */
  description: string;
  icon: ComponentType<{ className?: string }>;
  /** The room's table color. */
  color: string;
  signal?: SignalData | null;
  /** Extra words the filter matches ("loja" finds the marketplace). */
  keywords?: string[];
};
