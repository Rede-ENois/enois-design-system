/**
 * O corpo do painel de observabilidade de UM nó, exatamente como o Control Plane devolve
 * (`GET /admin/network/nodes/{id}/observability`). O app só repara datas e renumera; os campos são
 * os do contrato, para a tela mostrar o que o servidor mediu.
 *
 * <p>O nulo é informação: um ponto sem `cpuPercent` significa "o nó não mediu neste minuto", e o
 * gráfico desenha lacuna. `0` seria uma medida — a de um nó ocioso — e são coisas diferentes.</p>
 */
import type { NetworkNodeObservabilityLine } from "./network-node-observability-line.js";
import type { NetworkNodeObservabilitySample } from "./network-node-observability-sample.js";
import type { NetworkNodeObservabilitySummary } from "./network-node-observability-summary.js";

export type NetworkNodeObservabilityPanel = {
  nodeId: string;
  /** ISO-8601 do instante em que o Control Plane montou o quadro. */
  generatedAt: string;
  /** Um ponto por minuto, do mais antigo ao mais novo. */
  series: NetworkNodeObservabilitySample[];
  /** Linhas do runtime, da mais nova à mais antiga. */
  console: NetworkNodeObservabilityLine[];
  summary: NetworkNodeObservabilitySummary;
  /** Quantas linhas de cada nível na janela. Chave ausente = nível sem linha. */
  consoleLevels: Record<string, number>;
};
