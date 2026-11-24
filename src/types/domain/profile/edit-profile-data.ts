/** Os campos do perfil que o diálogo de edição lê para semear o formulário. */
export type EditProfileData = {
  username: string;
  name: string;
  headline?: string | null;
  bio?: string | null;
  company?: string | null;
  location?: string | null;
  birthDate?: string | null;
  availability?: string | null;
  portfolio?: string | null;
  externalLinks?: string[] | null;
  skills?: string[] | null;
  goals?: string[] | null;
  openToWork: boolean;
  isMentor: boolean;
  /** Modo recrutador: abre o painel de banco de talentos. */
  isRecruiter?: boolean | null;
  showRanking?: boolean | null;
  aka?: string | null;
  badges?: string[] | null;
  badge?: string | null;
};
