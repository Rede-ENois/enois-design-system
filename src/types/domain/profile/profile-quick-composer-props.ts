import type { ProfileQuickComposerData } from "./profile-quick-composer-data.js";

/**
 * The profile composer is a launcher: publishing happens in the app's full composer, where the
 * post type and topic are chosen. Each shortcut hands off to it.
 */
export type ProfileQuickComposerProps = {
  profile: ProfileQuickComposerData;
  /** Opens the full composer. */
  onCompose: () => void;
  /** Opens the full composer with the photos or the video just picked attached. */
  onComposeWithMedia: (files: File[]) => void;
  /** Opens the article editor. Without it, the shortcut is not shown. */
  onWriteArticle?: () => void;
};
