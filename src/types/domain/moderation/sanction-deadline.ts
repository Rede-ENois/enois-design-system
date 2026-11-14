export interface SanctionDeadline {
  kind: "APPEAL" | "END" | "NONE";
  at: string | null;
}
