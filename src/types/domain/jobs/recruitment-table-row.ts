import type { RecruitmentCandidate } from "./recruitment-candidate.js";

/** A table row: the board card plus the stage name the row reads better with. */
export type RecruitmentTableRow = RecruitmentCandidate & {
  stageName: string | null;
};
