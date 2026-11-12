import type { NetworkNodeData } from "./network-node-data.js";

/**
 * Um registro do histórico administrativo do nó — a trilha de auditoria lida de volta. `metadata`
 * chega como texto; a view mostra, não interpreta. `dateLabel` já vem formatado do app.
 */
export type NetworkNodeHistoryEntry = {
  id: string;
  actorId: string;
  action: string;
  metadata: string | null;
  dateLabel: string;
};

/** A página por nó: identificação, capacidade declarada (o que a tela edita) e histórico. */
export type NetworkNodeDetailData = {
  node: NetworkNodeData;
  declaredCpuCores: number;
  declaredMemoryMb: number;
  declaredDiskMb: number;
  declaredBandwidthMbps: number;
  /** Perfis autorizados, para a edição em pílulas. */
  availableProfiles: string[];
};
