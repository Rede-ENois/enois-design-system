import type { LocalCommunityItem } from "./local-community-item.js";

export type LocalCommunitiesSectionProps = {
  /** Viewer's city and state; null city means the profile has no city yet. */
  viewerCity: string | null;
  viewerState: string | null;
  /** Communities in the viewer's city first, then the rest of the state (API order). */
  items: LocalCommunityItem[];
  loading: boolean;
  error: boolean;
  onRetry: () => void;
  /** Opens wherever the viewer sets their city (usually the profile edit). */
  onSetCity: () => void;
};
