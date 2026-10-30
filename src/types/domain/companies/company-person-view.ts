/**
 * Someone shown on a company page (a proposer, a reviewer): always the professional identity
 * when there is one, so `href` already points at the right profile.
 */
export type CompanyPersonView = {
  name: string;
  username: string;
  headline?: string | null;
  avatar: string | null;
  href: string;
};
