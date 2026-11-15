import type { ModerationReportVote } from "./moderation-report-vote.js";

export type ModerationReportData = {
  reportId: string;
  reason: string;
  targetType: string;
  reporter: string;
  author: string | null;
  canPenalize: boolean;
  content: string | null;
  description: string | null;
  createdAtLabel: string;
  punishVotes: number;
  dismissVotes: number;
  quorum: number;
  myVote: ModerationReportVote | null;
  reviewHref: string;
};
