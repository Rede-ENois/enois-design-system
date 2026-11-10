import type { BadgeKit } from "./badge-kit.js";

/**
 * The badge picker shared by the edit-profile dialog and the identity section: the current
 * set (up to MAX_BADGES, PNG/JPEG/WEBP/GIF) plus a history tab with the last 3 kits.
 */
export type BadgeSelectionProps = {
  /** The current badge addresses, in profile order. */
  badges: string[];
  onAddBadge: (file: File) => void;
  onRemoveBadge: (url: string) => void;
  /** The saved sets of this profile, most recent first (last 3, kept by the backend). */
  badgeKits: BadgeKit[];
  /**
   * Puts a saved set back. Saves immediately in the identity section; in the edit-profile dialog
   * it only fills the form, because there everything applies on "Salvar".
   */
  onApplyBadgeKit: (kit: BadgeKit) => void;
  /** A badge image uploading. */
  uploading?: boolean;
  /** The badge list being saved. */
  badgesPending?: boolean;
  /** The kit history still loading (the tab says so instead of claiming it is empty). */
  kitsLoading?: boolean;
  /** Which tab opens first; the picker owns the tab after that. */
  initialTab?: "current" | "history";
};
