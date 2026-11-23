/** One certification, when the person authorized it. */
export type TalentBankCertification = {
  id: string;
  name: string;
  issuer: string | null;
  issuedAt: string | null;
};
