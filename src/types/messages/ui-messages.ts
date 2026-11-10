/**
 * Fixed microcopy owned by the design system components (accessible labels, empty states,
 * counters). Content and product copy never live here: they come from the app through props.
 */
export type UiMessages = {
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
  timeTextInput: { placeholder: string; invalid: string };
  skeletonList: { loading: string };
  badgeSelection: {
    /** "Emblemas" / "Histórico": the two tabs of the badge picker. */
    currentTab: string;
    historyTab: string;
    /** "2 de 5 em uso": the counter next to the section title. */
    usage: (used: number, max: number) => string;
    add: string;
    sending: string;
    remove: string;
    hint: string;
    full: string;
    /** The history tab before any set has been replaced. */
    historyEmpty: string;
    /** Puts a saved set back on the profile. */
    applyKit: string;
  };
  signal: {
    new: string;
    today: string;
    count: (count: number) => string;
    messages: (count: number) => string;
  };
};
