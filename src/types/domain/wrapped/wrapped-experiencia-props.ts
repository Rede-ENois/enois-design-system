import type { ComponentType } from "react";

import type { LinkProps } from "../../adapters/link-props.js";

import type { WrappedEstado } from "./wrapped-estado.js";

/**
 * As props da experiência completa do Énóis Wrapped. As ações são callbacks do container: a view
 * nunca navega nem compartilha por conta própria (o router e o navegador vivem no app).
 */
export type WrappedExperienciaProps = {
  state: WrappedEstado;
  /** Nome de exibição da pessoa (é conteúdo, vem do container). */
  nome: string;
  /** Refaz a leitura (estado de erro). */
  onRetry?: () => void;
  /** Dispara o compartilhamento do card (o container decide navigator/clipboard). */
  onShare?: () => void;
  /** O link do app (o container passa o Link do roteador). Sem ele, os links não aparecem. */
  LinkComponent?: ComponentType<LinkProps>;
};
