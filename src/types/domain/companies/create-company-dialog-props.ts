import type { JobOption } from "../jobs/job-option.js";

import type { CreateCompanyValues } from "./create-company-values.js";

export type CreateCompanyDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pending: boolean;
  /** Creating failed, already as screen text. */
  error: string | null;
  /** The size choices: `value` goes to the API, `label` is shown. */
  sizeOptions: JobOption[];
  onSubmit: (values: CreateCompanyValues) => void;
};
