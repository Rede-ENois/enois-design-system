import type { RecruitmentScorePart } from "./recruitment-score-part.js";

/**
 * The screening score: a 0–100 total plus the signals that formed it.
 *
 * `available = false` means the job says nothing to compare against; the view says so instead of
 * drawing a zero, because "0" reads as "bad candidate" and this is not that.
 */
export type RecruitmentScore = {
  total: number;
  available: boolean;
  components: RecruitmentScorePart[];
};
