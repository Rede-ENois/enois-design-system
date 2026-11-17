/**
 * Fixed microcopy of the notice dialog: the "notice" identification, the accessible description,
 * the confirm button and the close button. Notice title, body and publication date are content
 * and come from the app through props.
 */
export type NoticesMessages = {
  notices: {
    /** Compact identification in the dialog header ("Aviso"). */
    label: string;
    /** Screen-reader-only description of the dialog. */
    description: string;
    /** Confirm button in the footer. */
    confirm: string;
    /** Accessible name of the close button in the header. */
    close: string;
  };
};
