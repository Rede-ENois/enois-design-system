import type { MyNetworkNodeData } from "./my-network-node-data.js";

export type MyNetworkNodesProps = {
  nodes: MyNetworkNodeData[];
  loading?: boolean;
  error?: boolean;
  onRefresh: () => void;
  refreshPending?: boolean;
  /** Desconexão voluntária: suspende o nó e cai as chaves, com confirmação. */
  onDisconnect: (nodeId: string) => void;
  disconnectPending?: boolean;
  /** Abre o diálogo de ingresso (novo servidor). Sem ela, a seção não oferece o botão. */
  onJoin?: () => void;
};
