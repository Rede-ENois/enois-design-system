import type { AuthorNameStyle } from "../name/author-name-style.js";

/** A pessoa por trás de um desafio ou de uma participação: desafios são NOMINAIS. */
export type DesafioAuthorView = {
  id: string;
  name: string | null;
  username: string | null;
  avatar: string | null;
  avatarFrame: string | null;
  nameStyle: AuthorNameStyle | null;
};
