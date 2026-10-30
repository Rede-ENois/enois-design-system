import type { CommunityCardData } from "./community-card-data.js";

/** A community in the "Perto de você" list. */
export type LocalCommunityItem = Pick<
  CommunityCardData,
  "id" | "name" | "avatar" | "members" | "city" | "state"
> & { href: string };
