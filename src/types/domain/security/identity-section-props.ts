import type { BadgeKit } from "../badges/badge-kit.js";

import type { IdentityData } from "./identity-data.js";
import type { IdentityValues } from "./identity-values.js";

export type IdentitySectionProps = {
  /** Os valores da conta; trocar o objeto re-semeia os campos. */
  identity?: IdentityData;
  onSave: (values: IdentityValues) => void;
  savePending?: boolean;
  /** Endereços dos emblemas, na ordem do perfil. */
  badges: string[];
  onAddBadge: (file: File) => void;
  onRemoveBadge: (url: string) => void;
  /** Os kits salvos desta conta (últimos 3), do mais recente para o mais antigo. */
  badgeKits: BadgeKit[];
  /** Volta a exibir um kit; a troca salva na hora, igual a adicionar e remover. */
  onApplyBadgeKit: (kit: BadgeKit) => void;
  /** Lista de emblemas sendo salva. */
  badgesPending?: boolean;
  /** Imagem de um emblema subindo. */
  uploading?: boolean;
  /** O histórico ainda carregando. */
  kitsLoading?: boolean;
};
