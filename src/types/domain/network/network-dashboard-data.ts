/**
 * O resumo da rede como a administração o vê — a faixa no topo do painel Énóis Network.
 *
 * <p>Contagens são fotografias do momento da consulta, não acumulados: o que a faixa responde é
 * "como a rede está agora". Médias vêm com a contagem de amostras ao lado, porque média sem saber
 * de quantos nós é média não diz nada.</p>
 */
export type NetworkDashboardData = {
  total: number;
  active: number;
  /** Nós que nunca operaram (pendente de aprovação ou sem chave) — indisponível sem culpa. */
  unavailable: number;
  quarantined: number;
  /** Nós com heartbeat recente. */
  alive: number;
  /** Nós fora do balanceamento por falha ou lentidão medida — não é `status`. */
  degraded: number;
  /** Capacidade declarada somada e vagas livres na conta conservadora (saturado/quarentena não promete vaga). */
  declaredCpuCores: number;
  declaredMemoryMb: number;
  freeSlots: number;
  /** CPU média dos reportes recentes; `null` quando ninguém reportou. */
  avgCpuPercent: number | null;
  cpuSamples: number;
  /** Memória média dos reportes recentes; `null` quando ninguém reportou. */
  avgMemoryMb: number | null;
  memorySamples: number;
  /** Versões de runtime em campo, para expor nó defasado antes que ele falhe. */
  runtimeVersions: Record<string, number>;
};
