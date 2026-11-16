export type AdminRemovePostActionProps = {
  /** Reason entered by the administrator (trimmed by the view before calling back). */
  onRemove: (reason: string) => Promise<boolean>;
  pending?: boolean;
  label: string;
  /** Texts of the confirmation opened by the button. */
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel: string;
  reasonPlaceholder: string;
  reasonTooShort: string;
  error?: string | null;
};
