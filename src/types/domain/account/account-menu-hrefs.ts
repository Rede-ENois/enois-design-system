export type AccountMenuHrefs = {
  profile: string;
  wallet: string;
  /** "Conta e segurança": every account, privacy and preference item lives there. */
  account: string;
  support: string;
  /** Role pages: each entry only shows for whoever has the role (href set). */
  guardian?: string;
  moderator?: string;
};
