/** Alguém que o app oferece para ser adicionado ao grupo (busca de contatos). */
export type GroupAdminCandidate = {
  id: string;
  name: string;
  avatar?: string | null;
  /** Já participa: a linha aparece desligada com o aviso. */
  alreadyMember?: boolean;
};
