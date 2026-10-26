/**
 * Fixed microcopy owned by the design system components (accessible labels, empty states,
 * counters). Content and product copy never live here: they come from the app through props.
 */
export type Messages = {
  dialog: { close: string };
  sheet: { close: string };
  confirmDialog: { cancel: string; pending: string };
  charCounter: {
    progress: (used: number, max: number) => string;
    left: (count: number) => string;
    limitReached: string;
  };
  passwordInput: { show: string; hide: string };
  emojiPicker: { search: string; empty: string };
  readMore: { more: string; less: string };
  toast: { region: string; dismiss: string };
  dateTextInput: { placeholder: string; invalid: string; outOfRange: string };
};
