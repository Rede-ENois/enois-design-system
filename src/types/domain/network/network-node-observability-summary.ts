/** Os agregados da janela, calculados pelo Control Plane sobre as amostras que ele guarda. */
export type NetworkNodeObservabilitySummary = {
  cpuAvgPercent: number | null;
  cpuMaxPercent: number | null;
  memoryMbLatest: number | null;
  diskFreeMbLatest: number | null;
  runningTasksLatest: number | null;
  sampleCount: number;
};
