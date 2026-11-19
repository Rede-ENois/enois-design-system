import type { ComposerMediaTransport } from "./composer-media-transport.js";

/** An attachment waiting in a composer, as the picker view renders it. */
export type ComposerMediaDraft = {
  /** Stable draft identity, unique within the picker. Keep it across retries and reorders. */
  id?: string;
  /**
   * Object URL of the local file, already checked by the app. Absent when the app refused the URL
   * it got: the tile keeps its place (and its remove button), just without the image.
   */
  preview: string | null | undefined;
  /**
   * Where moderation stands: the picker shows a veil while the image is checked, and a cover when
   * it is refused.
   */
  status?: "checking" | "allowed" | "prohibited";
  /** Optional per-file transport feedback. The picker hides it when moderation prohibits the item. */
  transport?: ComposerMediaTransport;
  /** Filled by the app once the file is uploaded; the view never reads it. */
  mediaId?: string;
};
