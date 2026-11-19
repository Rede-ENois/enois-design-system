/** Quem do outro lado da proposta: os mesmos dados do par, mais a foto. */
export type StudyPairProposalPartner = {
  id: string;
  username: string;
  name: string;
  /** Foto; sem ela o app mostra as iniciais. */
  avatarUrl?: string | null;
  /** Caminho do perfil, montado pelo app. */
  href: string;
};
