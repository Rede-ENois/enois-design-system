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
    /** Bloco de ação administrativa imediata, separado da decisão coletiva. */
    adminTitle: string;
    adminHint: string;
    penalize: string;
    penalizeTitle: (reference: string) => string;
    penalizeDescription: string;
    penalizeConfirm: string;
    penalizeCancel: string;
    penalizeReasonPlaceholder: string;
    penalizeReasonTooShort: string;
    penalizeError: string;
    /**
     * Explica a RESTRICTION imediata sem inventar banimento nem duração: a decisão coletiva
     * continua sendo o caminho para a sanção.
     */
    penalizeEffect: string;
  };
  reportsSection: {
    title: string;
    description: string;
    empty: string;
    error: string;
    retry: string;
    loading: string;
    /** Explica o recorte mostrado; não é a contagem padrão da fila. */
    count: (visible: number, total: number) => string;
    filterReason: string;
    filterTarget: string;
    allReasons: string;
    allTargets: string;
    search: string;
    searchPlaceholder: string;
    clearFilters: string;
    noFiltered: string;
    noFilteredHint: string;
  };
};
