import type { NetworkNodeApiRequest } from "./network-node-api-request.js";
import type { NetworkNodeDetailData } from "./network-node-detail-data.js";
import type { NetworkNodeHistoryEntry } from "./network-node-history-entry.js";

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
  /**
   * As rotas que a rede oferece (a mesma lista que vai assinada para o nó). O admin escolhe pelo
   * nome: a URL vive só na configuração assinada, e o pedido daqui leva o nome, nunca um endereço.
   */
  routes: string[];
  /** Pede a rota (pelo nome) neste nó. A requisição leva alvo: é este nó que executa. */
  onRequestRoute: (route: string) => void;
  routePending?: boolean;
  /** As requisições em aberto do nó — o que está na fila ou executando. */
  apiRequests: NetworkNodeApiRequest[];
  apiRequestsLoading?: boolean;
  onOpenChange: (open: boolean) => void;
};
