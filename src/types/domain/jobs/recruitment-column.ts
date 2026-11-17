import type { RecruitmentCandidate } from "./recruitment-candidate.js";

/** A stage column. `stageId = null` is the entrance of a flow that is not configured yet. */
export type RecruitmentColumn = {
  stageId: string | null;
  cards: RecruitmentCandidate[];
};
