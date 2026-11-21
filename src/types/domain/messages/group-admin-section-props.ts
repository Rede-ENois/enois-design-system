import type { GroupAdminCandidate } from "./group-admin-candidate.js";
import type { GroupAdminParticipantData } from "./group-admin-participant-data.js";

/**
 * Painel do grupo dentro da conversa: quem participa, o papel de cada um e (para o dono e os
 * administradores) adicionar, promover, rebaixar e remover. Dados via props; o view devolve a
 * intenção e a aplicação roda a rede.
 */
export type GroupAdminSectionProps = {
  groupTitle: string;
  participants: GroupAdminParticipantData[];
  /** O usuário logado é o dono do grupo. */
  isOwner: boolean;
  /** O usuário logado administra o grupo (dono ou administrador). */
  canManage: boolean;
  pending?: boolean;
  error?: string | null;
  /** Called on every search term change; the app answers with a new `candidates` list. */
  onSearchCandidates: (query: string) => void;
  candidates: GroupAdminCandidate[];
  candidatesLoading?: boolean;
  onAddMembers: (userIds: string[]) => Promise<void>;
  onPromote: (userId: string) => Promise<void>;
  onDemote: (userId: string) => Promise<void>;
  onRemove: (userId: string) => Promise<void>;
};
