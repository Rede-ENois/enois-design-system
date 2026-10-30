/** A community suggested by the starter pack. */
export type OnboardingCommunityItem = {
  id: string;
  name: string;
  description: string | null;
  /** Translated topic label, or null when the community has none. */
  topicLabel: string | null;
  avatar: string | null;
  memberCount: number;
};
