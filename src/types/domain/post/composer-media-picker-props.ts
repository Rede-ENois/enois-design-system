import type { ComposerMediaDraft } from "./composer-media-draft.js";

export type ComposerMediaPickerProps = {
  /** Already chosen attachments, in the order they will be published. */
  items: ComposerMediaDraft[];
  /**
   * Receives the files the person picked. The picker owns the file input; checking and uploading
   * stay with the app, which answers by updating `items`.
   */
  onFiles: (files: File[]) => void;
  onRemove: (index: number) => void;
  /** Hidden once the composer reached the attachment limit. */
  canAddMore?: boolean;
  /** What the file dialog offers. Defaults to images. */
  accept?: string;
  /** Whether the dialog takes more than one file at a time. Defaults to true. */
  multiple?: boolean;
};
