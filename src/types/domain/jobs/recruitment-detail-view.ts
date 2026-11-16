import type { RecruitmentAnswer } from "./recruitment-answer.js";
import type { RecruitmentScore } from "./recruitment-score.js";

/**
 * The candidate file: the profile snapshot the application was made with, not today's profile.
 *
 * The recruiter decides on what the person had when they applied; showing the current profile
 * would silently change an old application.
 */
export type RecruitmentDetailView = {
  applicationId: string;
  name: string;
  avatarUrl: string | null;
  headline: string | null;
  identityVerified: boolean;
  reputation: number;
  experienceYears: number;
  experiencesCount: number;
  location: string | null;
  skills: string[];
  message: string | null;
  answers: RecruitmentAnswer[];
  statusLabel: string;
  score: RecruitmentScore | null;
};
