import type { ModerationReportVote } from "../domain/moderation/moderation-report-vote.js";

export type ReportsMessages = {
  reportCard: {
    reporter: string;
    author: string;
    noAuthor: string;
    noContent: string;
    content: string;
    descriptionLabel: string;
    reportReference: (id: string) => string;
    collectiveTitle: string;
    collectiveHint: string;
    punishVotes: (count: number) => string;
    dismissVotes: (count: number) => string;
    quorum: (count: number) => string;
    myVote: (vote: ModerationReportVote) => string;
    votePunish: string;
    voteDismiss: string;
    openReview: string;
    /** Nomes de motivo conhecidos; chave ausente cai no identificador bruto. */
    reasons: Record<string, string | undefined>;
    /** Nomes de alvo conhecidos; chave ausente cai no identificador bruto. */
    targets: Record<string, string | undefined>;
  };
};
