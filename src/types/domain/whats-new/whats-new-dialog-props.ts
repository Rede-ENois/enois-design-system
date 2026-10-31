import type { WhatsNewItem } from "./whats-new-item.js";

export type WhatsNewDialogProps = {
  open: boolean;
  /** Any way of closing (button, X, Esc, overlay) reports `false`: the app marks the release as seen. */
  onOpenChange: (open: boolean) => void;
  /** When the release went out, shown above the title (e.g. "Outubro de 2026"). */
  releaseLabel?: string;
  items: WhatsNewItem[];
};
