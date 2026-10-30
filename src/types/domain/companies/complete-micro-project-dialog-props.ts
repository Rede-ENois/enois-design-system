import type { CompleteMicroProjectValues } from "./complete-micro-project-values.js";

export type CompleteMicroProjectDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Who delivered the project (the chosen proposer). */
  personName: string;
  pending: boolean;
  /** Completing failed, already as screen text. */
  error?: string | null;
  onConfirm: (values: CompleteMicroProjectValues) => void;
};
