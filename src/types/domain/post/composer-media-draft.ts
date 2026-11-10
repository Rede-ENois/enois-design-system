/** An attachment waiting in a composer, as the picker view renders it. */
export type ComposerMediaDraft = {
  /**
   * Object URL of the local file, already checked by the app. Absent when the app refused the URL
   * it got: the tile keeps its place (and its remove button), just without the image.
   */
  preview: string | null | undefined;
  /**
   * Where the upload stands: the picker shows a veil while the image is checked, and a cover when
   * it is refused.
   */
  status?: "checking" | "allowed" | "prohibited";
  /** Filled by the app once the file is uploaded; the view never reads it. */
  mediaId?: string;
};
