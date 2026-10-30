import type { NewMicroProjectValues } from "./new-micro-project-values.js";

export type NewMicroProjectDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pending: boolean;
  /** Publishing failed, already as screen text. */
  error: string | null;
  onSubmit: (values: NewMicroProjectValues) => void;
};
