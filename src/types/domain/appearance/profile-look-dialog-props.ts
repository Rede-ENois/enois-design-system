import type { ProfileLookPair } from "../../lib/theme/profile-look-pair.js";

export type ProfileLookDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** O que está gravado hoje (as duas vitrines). */
  value: ProfileLookPair;
  /** Salvar: recebe as duas vitrines editadas; fechar é decisão de quem chama. */
  onSave: (next: ProfileLookPair) => void;
  /**
   * Cada mudança do rascunho, antes do "Salvar". Serve para o dono do perfil se vestir com o
   * que está sendo escolhido — a prévia acontece sobre a página real, não numa miniatura.
   */
  onDraftChange?: (next: ProfileLookPair) => void;
  saving?: boolean;
};
