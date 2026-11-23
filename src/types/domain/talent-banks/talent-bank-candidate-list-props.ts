import type { TalentBankCandidateFilters } from "./talent-bank-candidate-filters.js";
import type { TalentBankCandidateListState } from "./talent-bank-candidate-list-state.js";
import type { TalentBankCandidateRow } from "./talent-bank-candidate-row.js";

export type TalentBankCandidateListProps = {
  candidates: TalentBankCandidateRow[];
  filters: TalentBankCandidateFilters;
  onFiltersChange: (filters: TalentBankCandidateFilters) => void;
  activeTotal: number;
  pendingTotal: number;
  hasMore: boolean;
  onLoadMore?: () => void;
  onOpenCandidate: (enrollmentId: string) => void;
  state?: TalentBankCandidateListState;
  onRetry?: () => void;
};
