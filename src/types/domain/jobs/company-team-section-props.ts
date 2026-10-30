import type { CompanyMemberCandidate } from "./company-member-candidate.js";

export type CompanyTeamSectionProps = {
  /**
   * The team. `name`, `username` and `avatar` are optional for older callers: without them the row
   * falls back to a short id.
   */
  members: {
    userId: string;
    role: string;
    name?: string | null;
    username?: string | null;
    avatar?: string | null;
  }[];
  search: string;
  onSearchChange: (search: string) => void;
  /** Resultados da busca (o app só busca com 2+ letras). */
  results: CompanyMemberCandidate[];
  selected: CompanyMemberCandidate | null;
  onSelectedChange: (selected: CompanyMemberCandidate | null) => void;
  role: string;
  onRoleChange: (role: string) => void;
  addPending: boolean;
  onAdd: () => void;
};
