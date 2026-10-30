/** What a community card shows. The app maps its community records into this shape. */
export type CommunityCardData = {
  id: string;
  name: string;
  description: string | null;
  /** Already translated topic name; null hides the label. */
  topicLabel: string | null;
  members: number;
  joined: boolean;
  cover: string | null;
  avatar: string | null;
  /** Optional location; the card shows "City, UF" when present. */
  city?: string | null;
  state?: string | null;
};
