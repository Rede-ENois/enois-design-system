import type { ModerationReportData } from "./moderation-report-data.js";
import type { ModerationReportVote } from "./moderation-report-vote.js";

export type ReportsSectionProps = {
  reports: ModerationReportData[];
  admin: boolean;
  loading: boolean;
  error: boolean;
  /** Bloqueia votos e nova tentativa enquanto a fila envia uma mutação. */
  pending: boolean;
  onRetry: () => void;
  onVote: (reportId: string, vote: ModerationReportVote) => void;
};
