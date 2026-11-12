import type { NetworkNodeDetailData } from "./network-node-detail-data.js";
import type { NetworkNodeHistoryEntry } from "./network-node-detail-data.js";

export type NetworkNodeDetailProps = {
  detail: NetworkNodeDetailData | null;
  history: NetworkNodeHistoryEntry[];
  historyLoading?: boolean;
  /** Salva a capacidade (campo ausente = mantém o vigente). */
  onSaveCapacity: (capacity: {
    cpuCores?: number;
    memoryMb?: number;
    diskMb?: number;
    bandwidthMbps?: number;
  }) => void;
  capacityPending?: boolean;
  /** Redefine os perfis autorizados (lista vazia = nó sem tarefa). */
  onSaveProfiles: (profiles: string[]) => void;
  profilesPending?: boolean;
  onOpenChange: (open: boolean) => void;
};
