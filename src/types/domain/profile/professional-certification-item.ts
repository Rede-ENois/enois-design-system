/** One certification; `credentialUrl` is already a safe http(s) link or `null`. */
export type ProfessionalCertificationItem = {
  id: string;
  name: string;
  issuer?: string | null;
  /** Formatted issue date ("jun. 2025") or `null`. */
  issuedLabel: string | null;
  credentialUrl?: string | null;
};
