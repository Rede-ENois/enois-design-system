import type { WrappedEstado } from "./wrapped-estado.js";

/**
 * As props da experiência completa do Énóis Wrapped. As ações são callbacks do container: a view
 * nunca navega nem compartilha por conta própria. Os links internos usam o AppLink do DS, que
 * delega ao roteador pelo provider do app.
 */
export type WrappedExperienciaProps = {
  state: WrappedEstado;
  /** Nome de exibição da pessoa (é conteúdo, vem do container). */
  nome: string;
  /** Refaz a leitura (estado de erro). */
  onRetry?: () => void;
  /** Dispara o compartilhamento do card (o container decide navigator/clipboard). */
  onShare?: () => void;
};
