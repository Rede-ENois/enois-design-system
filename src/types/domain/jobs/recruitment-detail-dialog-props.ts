import type { ReactNode } from "react";

import type { RecruitmentDetailView } from "./recruitment-detail-view.js";

export type RecruitmentDetailDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  detail: RecruitmentDetailView | null;
  /** Actions composed by the app (interview, rejection): this package does not fetch or route. */
  children?: ReactNode;
};
