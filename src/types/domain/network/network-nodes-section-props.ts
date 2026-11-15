import type { NetworkDashboardData } from "./network-dashboard-data.js";
import type { NetworkNodeData } from "./network-node-data.js";
import type { NetworkNodeDetailData } from "./network-node-detail-data.js";
import type { NetworkNodeDetailProps } from "./network-node-detail-props.js";
import type { NetworkProvisionTokenDialogProps } from "./network-provision-token-dialog-props.js";

export type NetworkNodesSectionProps = {
  /**
   * O resumo da rede, quando carregado: a faixa no topo da seção. A composição (faixa + lista)
   * é da view — o app passa os dados, não monta markup ao redor.
   */
  dashboard?: NetworkDashboardData | null;
  /**
   * O painel do nó (capacidade, perfis, histórico): a seção compõe lista + drawer. `detail` é o
   * nó aberto já resolvido pelo app (`null` = fechado); `onOpenNode` marca a linha que o admin
   * abriu. O estado é do app — a view só pede.
   */
  detail?: Omit<NetworkNodeDetailProps, "onOpenChange" | "detail"> & {
    detail: NetworkNodeDetailData | null;
    onOpenNode: (nodeId: string | null) => void;
  };
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
  /**
   * O token de provisionamento: a seção abre o diálogo e o app emite. É o passo anterior ao nó
   * existir — sem ele a seção só administra servidores que já chegaram, e o admin não tem por
   * onde começar. Ausente = a seção não oferece a geração (ex.: quem não administra a rede).
   */
  provisionToken?: Omit<
    NetworkProvisionTokenDialogProps,
    "open" | "onOpenChange" | "onProvision"
  > & {
    onProvision: NetworkProvisionTokenDialogProps["onProvision"];
  };
};
