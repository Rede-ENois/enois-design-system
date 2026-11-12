import type { NetworkDashboardData } from "./network-dashboard-data.js";
import type { NetworkNodeData } from "./network-node-data.js";

export type NetworkNodesSectionProps = {
  /**
   * O resumo da rede, quando carregado: a faixa no topo da seção. A composição (faixa + lista)
   * é da view — o app passa os dados, não monta markup ao redor.
   */
  dashboard?: NetworkDashboardData | null;
  nodes: NetworkNodeData[];
  loading?: boolean;
  error?: boolean;
  onRefresh: () => void;
  refreshPending?: boolean;
  /** Gera a API key do nó. A chave em claro volta uma única vez, no retorno desta chamada. */
  onIssueKey: (nodeId: string) => void;
  issueKeyPending?: boolean;
  /** Revoga a chave vigente do nó sem mexer no nó. */
  onRevokeKey: (nodeId: string) => void;
  revokeKeyPending?: boolean;
  onApprove: (nodeId: string) => void;
  approvePending?: boolean;
  /** Suspende, põe em quarentena ou revoga. Revogar é terminal. */
  onChangeStatus: (nodeId: string, status: "SUSPENDED" | "QUARANTINED" | "REVOKED") => void;
  statusPending?: boolean;
  /** A chave recém-gerada, para a tela mostrar uma vez e avisar que não aparece de novo. */
  issuedKey: { nodeId: string; apiKey: string; prefix: string } | null;
  onDismissIssuedKey: () => void;
};
