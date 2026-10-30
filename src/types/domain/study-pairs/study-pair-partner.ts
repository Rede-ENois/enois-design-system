export type StudyPairPartner = {
  id: string;
  username: string;
  name: string;
  avatarUrl?: string | null;
  /** Profile path, built by the app. */
  href: string;
};
