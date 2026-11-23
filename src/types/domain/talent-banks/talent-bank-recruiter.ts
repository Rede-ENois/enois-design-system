/** How the recruiter presents themselves in the talent bank: the public face of the bank owner. */
export type TalentBankRecruiter = {
  userId: string;
  name: string;
  username: string;
  avatar: string | null;
  headline: string | null;
  location: string | null;
};
