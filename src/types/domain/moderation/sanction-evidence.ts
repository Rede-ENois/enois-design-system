export interface SanctionEvidence {
  kind: "TEXT" | "MEDIA" | "BEHAVIOR" | "UNAVAILABLE";
  text: string | null;
}
