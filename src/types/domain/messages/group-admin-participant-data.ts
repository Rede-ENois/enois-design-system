import type { AuthorNameStyle } from "../name/author-name-style.js";

/** Os campos do participante que o painel do grupo lê, como o app os carregou. */
export type GroupAdminParticipantData = {
  userId: string;
  name: string;
  /** Personalização do nome (tema/fonte/cor). */
  nameStyle?: AuthorNameStyle | null;
  avatar?: string | null;
  role: "OWNER" | "ADMIN" | "MEMBER";
};
