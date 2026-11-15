import type { ModerationReportData } from "./moderation-report-data.js";
import type { ModerationReportVote } from "./moderation-report-vote.js";
import type { ReportAdminAction } from "./report-admin-action.js";

export type ReportsSectionProps = {
  reports: ModerationReportData[];
  admin: boolean;
  loading: boolean;
  error: boolean;
  pending: boolean;
  /** Erro controlado opcional; falhas da confirmação atual são tratadas pela própria view. */
  actionError?: boolean;
  onRetry: () => void;
  onVote: (reportId: string, vote: ModerationReportVote) => void;
  onAdminAction: (reportId: string, action: ReportAdminAction) => Promise<boolean>;
};
