/** A group suggested by the starter pack. */
export type OnboardingGroupItem = {
  id: string;
  name: string;
  description: string | null;
  /** Translated topic label, or null when the group has none. */
  topicLabel: string | null;
  avatar: string | null;
  memberCount: number;
};
