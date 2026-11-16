import type { RecruitmentScore } from "./recruitment-score.js";
import type { RecruitmentStatus } from "./recruitment-status.js";

/** One application as the board and the table draw it. */
export type RecruitmentCandidate = {
  applicationId: string;
  userId: string;
  name: string;
  avatarUrl: string | null;
  headline: string | null;
  status: RecruitmentStatus;
  /** Status copy comes from the app: this package does not own product vocabulary. */
  statusLabel: string;
  appliedAt: string | null;
  stageId: string | null;
  rejected: boolean;
  score: RecruitmentScore | null;
};
