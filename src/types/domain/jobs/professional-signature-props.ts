export type ProfessionalSignatureProps = {
  /** The active professional identity that signs the application or proposal. */
  identity: { name: string; username: string } | null;
  /** Where to create or activate the professional profile, when there is no active one. */
  setupHref: string | null;
};
