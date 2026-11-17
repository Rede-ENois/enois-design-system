import type { NetworkNodeObservabilityPanel } from "./network-node-observability-panel.js";

export type NetworkNodeObservabilityProps = {
  /**
   * O quadro do nó. `null` é "ainda não carregou" — a view mostra o estado de carregamento, nunca
   * zeros, porque zero de CPU não é "sem dado": é um nó ocioso.
   */
  panel: NetworkNodeObservabilityPanel | null;
  loading?: boolean;
  /** Erro já traduzido pelo app (rede, 404 do nó, 403). Vermelho, não "carregando". */
  error?: string | null;
  /** Recarrega o quadro. A tela chama a cada poucos segundos; o botão é para quem está olhando. */
  onRefresh?: () => void;
  /** Instante da última leitura, já formatado pelo app (fuso do navegador de quem olha). */
  refreshedAtLabel?: string | null;
};
