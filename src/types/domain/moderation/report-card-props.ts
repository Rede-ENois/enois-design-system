import type { ModerationReportData } from "./moderation-report-data.js";
import type { ModerationReportVote } from "./moderation-report-vote.js";

export type ReportCardProps = {
  report: ModerationReportData;
  /** Mostra o link de revisão; a autorização real continua no servidor. */
  admin: boolean;
  /** Bloqueia os votos enquanto a fila está enviando outra mutação. */
  pending: boolean;
  onVote: (reportId: string, vote: ModerationReportVote) => void;
};
