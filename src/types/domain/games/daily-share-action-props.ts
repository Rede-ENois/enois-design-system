import type { DailyShareStatus } from "./daily-share-status.js";

export type DailyShareActionProps = {
  onShare: () => void;
  status?: DailyShareStatus;
  /** Full-width primary button (stats dialog) instead of the outline one. */
  block?: boolean;
};
