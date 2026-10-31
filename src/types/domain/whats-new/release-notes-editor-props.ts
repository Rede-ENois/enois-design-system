import type { WhatsNewItem } from "./whats-new-item.js";

export type ReleaseNotesEditorProps = {
  /** The draft being edited; `id` is only a local key. */
  items: WhatsNewItem[];
  onItemsChange: (items: WhatsNewItem[]) => void;
  /** When the release on air was published, already formatted; null when nothing is on air. */
  liveSince: string | null;
  publishing?: boolean;
  retiring?: boolean;
  onPublish: () => void;
  onRetire: () => void;
  /** Limits mirrored from the API. */
  maxItems?: number;
  maxTitleLength?: number;
  maxDescriptionLength?: number;
};
