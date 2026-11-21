import type { GroupAdminCandidate } from "./group-admin-candidate.js";

/** Formulário de adicionar pessoas ao grupo, dentro do painel do grupo. */
export type GroupAddFormProps = {
  candidates: GroupAdminCandidate[];
  candidatesLoading?: boolean;
  pending: boolean;
  /** Called on every search term change; the app answers with a new `candidates` list. */
  onSearchCandidates: (query: string) => void;
  onAddMembers: (userIds: string[]) => Promise<void>;
};
