import type { GroupAdminParticipantData } from "./group-admin-participant-data.js";
import type { GroupViewerRole } from "./group-viewer-role.js";

/** Linha de um participante: papel, promover/rebaixar e remover (com confirmação). */
export type GroupParticipantRowProps = {
  participant: GroupAdminParticipantData;
  viewerRole: GroupViewerRole;
  pending: boolean;
  onPromote: (userId: string) => Promise<void>;
  onDemote: (userId: string) => Promise<void>;
  onRemove: (userId: string) => Promise<void>;
};
