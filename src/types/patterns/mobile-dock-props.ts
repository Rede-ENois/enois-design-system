import type { ComponentType } from "react";

import type { MobileDockItem } from "./mobile-dock-item.js";

export type MobileDockProps = {
  /** Four destinations: two go left of the main action, two to the right. */
  items: MobileDockItem[];
  /** The one action that lives in the middle (publish). */
  action: { label: string; icon: ComponentType<{ className?: string }>; onClick: () => void };
};
