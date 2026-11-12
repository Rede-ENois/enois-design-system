import type { NetworkNodeData } from "./network-node-data.js";

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
