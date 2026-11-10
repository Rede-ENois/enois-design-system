export type ProfileResumeDialogProps = {
  /**
   * Controlled opening, for when another control opens it (e.g. `ProfileEditMenu`). Given, the
   * dialog draws no button of its own.
   */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Currículo atual (endereço no storage) e o nome do arquivo, quando existe. */
  resumeUrl?: string | null;
  resumeName?: string | null;
  /** Envio ou gravação em andamento. */
  busy?: boolean;
  /** Recebe o PDF já conferido (tipo e tamanho) para subir e salvar. */
  onUpload: (file: File) => void;
  onRemove: () => void;
};
