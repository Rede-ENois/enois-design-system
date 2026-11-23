import type { ModerationReportData } from "./moderation-report-data.js";
import type { ModerationReportVote } from "./moderation-report-vote.js";

export type ReportCardProps = {
  report: ModerationReportData;
  /** Mostra o link de revisão; a autorização real continua no servidor. */
  admin: boolean;
  /** Bloqueia os votos enquanto a fila está enviando outra mutação. */
  pending: boolean;
  onVote: (reportId: string, vote: ModerationReportVote) => void;
  /**
   * Aplica a punição imediata desta denúncia com o motivo aparado; resolve `true` no sucesso.
   * Opcional: sem ele o botão "Punir agora" não aparece, para uma tela antiga não alcançar um
   * backend que ainda não expõe a operação. A autorização real continua no servidor.
   */
  onPenalize?: (reportId: string, reason: string) => Promise<boolean>;
};
