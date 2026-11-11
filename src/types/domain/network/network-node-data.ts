/**
 * Um nó da rede cooperativa, como a administração o vê.
 *
 * <p>Nada aqui é segredo: a API key em claro nunca chega a esta visão — só o prefixo, que serve
 * para reconhecer a chave numa varredura sem revelar nada.</p>
 */
export type NetworkNodeData = {
  id: string;
  displayName: string;
  ownerUserId: string;
  status: "PENDING_APPROVAL" | "ACTIVE" | "SUSPENDED" | "QUARANTINED" | "REVOKED";
  profiles: string[];
  region: string | null;
  runtimeVersion: string | null;
  /** Último contato, já formatado; `null` quando o nó nunca falou com o servidor. */
  lastSeenAtLabel: string | null;
  /** Prefixo da chave vigente (`enk_nd_ab12`), ou `null` quando o nó ainda não tem chave. */
  keyPrefix: string | null;
  /** A chave vigente foi usada alguma vez; sem isso o admin não sabe se o nó já conectou. */
  keyUsed: boolean;
};
