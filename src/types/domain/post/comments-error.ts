/**
 * Why the comment list shows an error instead of the comments.
 *
 * Only a failed read belongs to the list: it empties the thread, so it replaces the comments with
 * the message and the retry. A refused comment is not the list failing — it shows next to the
 * composer and keeps what is already on screen, or one refused send hides the whole conversation.
 */
export type CommentsError = "load" | "send" | "upload" | "mediaLimit" | "micDenied";

const COMPOSER_ERRORS: readonly CommentsError[] = ["send", "upload", "mediaLimit", "micDenied"];

/** Errors from writing: they belong under the field, not in place of the list. */
export function isComposerError(error: CommentsError | null): error is CommentsError {
  return error !== null && COMPOSER_ERRORS.includes(error);
}
