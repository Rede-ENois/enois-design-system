/** One step of the page completeness checklist. An undone step with `onAction` is a button. */
export type CompanyChecklistItem = {
  key: string;
  label: string;
  done: boolean;
  onAction?: () => void;
};
