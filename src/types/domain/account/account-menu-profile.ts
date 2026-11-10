/** What the account menu shows about the signed-in person. */
export type AccountMenuProfile = {
  name: string;
  /** Shown under the name instead of the e-mail: less personal data on screen. */
  username: string | null;
  avatar: string | null;
  avatarFrame?: string | null;
};
