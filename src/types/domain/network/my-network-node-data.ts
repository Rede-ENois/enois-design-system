/** Um nó do participante, como a interface do participante o mostra — nunca o de outro participante. */
export type MyNetworkNodeData = {
  id: string;
  displayName: string;
  status: "PENDING_APPROVAL" | "ACTIVE" | "SUSPENDED" | "QUARANTINED" | "REVOKED";
  profiles: string[];
  region: string | null;
  country: string | null;
  runtimeVersion: string | null;
  /** Último contato, já formatado; `null` quando o nó nunca falou com o servidor. */
  lastSeenAtLabel: string | null;
  /** O que o participante cedeu — a rede respeita estes limites. */
  declaredCpuCores: number;
  declaredMemoryMb: number;
  declaredDiskMb: number;
  declaredBandwidthMbps: number;
  /** O que a rede observou no último heartbeat; `null` quando não há medição. */
  observedCpuPercent: number | null;
  observedMemoryMb: number | null;
  observedRunningTasks: number | null;
  /** A contribuição medida: tarefas concluídas por este nó. */
  tasksDone: number;
  /** O nó pode operar agora (ativo, fora de quarentena). */
  operable: boolean;
  /** Motivo da quarentena vigente; `null` fora dela. */
  quarantineReason: string | null;
};
