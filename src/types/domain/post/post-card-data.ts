import type { AuthorContributorTag } from "../name/author-contributor-tag.js";
import type { AuthorNameStyle } from "../name/author-name-style.js";

import type { PostType } from "./post-type.js";

/** What the post card reads from a post (the app's post record fits it as is). */
export type PostCardData = {
  id: string;
  type: PostType;
  content: string;
  authorName: string;
  /** Personalização do nome do autor (tema/fonte/cor). */
  authorStyle?: AuthorNameStyle | null;
  /** Tag "Contribuinte" quando o autor tem selo ativo; ausente = não é contribuinte. */
  authorContributor?: AuthorContributorTag | null;
  authorAvatar: string | null;
  authorAvatarFrame?: string | null;
  authorBadge?: string | null;
  authorBadges?: string[] | null;
  community?: { name: string; joined: boolean } | null;
  repostOf?: string | null;
  repostOfAuthor?: string | null;
  repostWithOpinion?: boolean;
  repostOfContent?: string | null;
  repostOfMediaIds?: string[] | null;
  pageHtml?: string | null;
  tags: string[];
  mediaIds: string[];
  editedAt?: string | null;
  expiresAt?: string | null;
  /** QUESTION only: an answer was accepted. Absent reads as open. */
  resolved?: boolean;
};
