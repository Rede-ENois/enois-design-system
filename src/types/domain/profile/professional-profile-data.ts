/** The public work identity shown on /profissional/{username}. Never carries the social @. */
export type ProfessionalProfileData = {
  name: string;
  /** The professional @, independent from the social one. */
  username: string;
  headline?: string | null;
  bio?: string | null;
  avatar?: string | null;
  location?: string | null;
  industry?: string | null;
  identityVerified?: boolean | null;
  /** Account reputation (shared by both identities); `null` hides it. */
  reputation?: number | null;
  /** Already formatted by the app in its own time zone ("mar. 2026"). */
  memberSinceLabel?: string | null;
  skills: string[];
  /** Safe http(s) links, already filtered by the app. */
  links: string[];
};
