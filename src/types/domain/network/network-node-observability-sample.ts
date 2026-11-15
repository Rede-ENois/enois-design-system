/**
 * Um ponto do gráfico: o que o nó mediu naquele minuto. Campo nulo = o nó não mediu (lacuna no
 * gráfico), diferente de zero, que é uma medida de nó ocioso.
 */
export type NetworkNodeObservabilitySample = {
  /** ISO-8601 do minuto amostrado. */
  sampledAt: string;
  cpuPercent: number | null;
  memoryMb: number | null;
  diskFreeMb: number | null;
  runningTasks: number | null;
  mode: string | null;
  activity: string | null;
};
