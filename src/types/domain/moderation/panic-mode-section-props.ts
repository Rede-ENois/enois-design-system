export type PanicModeSectionProps = {
  active: boolean;
  /** Panic mode is forced by the environment: the toggle is disabled. */
  envLocked: boolean;
  /** Recolhe somente os controles inativos e disponíveis. Padrão: false. */
  compact?: boolean;
  loading?: boolean;
  /** Falha ao confirmar o estado atual. Não permite alternar com um retrato incerto. */
  error?: boolean;
  onRetry?: () => void;
  /** The toggle is being saved. */
  pending?: boolean;
  /** Called after the confirmation dialog. */
  onActivate: () => void;
  onDeactivate: () => void;
};
