import type { RecruitmentBatchTarget } from "./recruitment-batch-target.js";
import type { RecruitmentCandidate } from "./recruitment-candidate.js";
import type { RecruitmentColumn } from "./recruitment-column.js";
import type { RecruitmentStage } from "./recruitment-stage.js";
import type { RecruitmentSummary } from "./recruitment-summary.js";

export type RecruitmentBoardProps = {
  stages: RecruitmentStage[];
  columns: RecruitmentColumn[];
  /** Applications that left the process; shown apart, never dragged back into a stage. */
  rejected: RecruitmentCandidate[];
  summary: RecruitmentSummary;
  selectedIds: string[];
  onToggleSelected: (applicationId: string) => void;
  onOpen: (applicationId: string) => void;
  onBatchMove: (target: RecruitmentBatchTarget) => void;
  pending?: boolean;
  error?: string | null;
  /** Outcome of the last batch, already worded by the app. */
  resultNote?: string | null;
};
