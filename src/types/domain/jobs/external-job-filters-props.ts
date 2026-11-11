import type { ExternalJobFilterValues } from "./external-job-filter-values.js";

export type ExternalJobFiltersProps = {
  value: ExternalJobFilterValues;
  /**
   * Avisado com o filtro que mudou. O app decide se recarrega a lista; a view não busca nada.
   * `null` num campo de seleção significa "tirar o filtro".
   */
  onChange: (patch: Partial<ExternalJobFilterValues>) => void;
  /** Limpa todos os filtros de uma vez. */
  onClear: () => void;
  /** Quantos filtros estão ativos (o app conta; a view só mostra o botão de limpar). */
  activeCount: number;
  /** A lista está recarregando: os controles continuam clicáveis, mas o resultado está a caminho. */
  busy?: boolean;
};
