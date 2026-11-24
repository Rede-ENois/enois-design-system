/** O estado do formulário de informações, sem tratamento: o app valida e monta o PUT. */
export type EditProfileValues = {
  username: string;
  name: string;
  headline: string;
  bio: string;
  company: string;
  location: string;
  birthDate: string;
  availability: string;
  portfolio: string;
  linksText: string;
  skillsText: string;
  goalsText: string;
  openToWork: boolean;
  isMentor: boolean;
  isRecruiter: boolean;
  showRanking: boolean;
  aka: string;
  badges: string[];
};
