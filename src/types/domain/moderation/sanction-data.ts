import type { SanctionDeadline } from "./sanction-deadline.js";
import type { SanctionEvidence } from "./sanction-evidence.js";

export interface SanctionData {
  id: string;
  type: "RESTRICTION" | "SUSPENDED" | "BAN" | "PERMABAN";
  status: "ACTIVE" | "REMOVED";
  reason: string | null;
  createdAt: string;
  deadline: SanctionDeadline;
  evidence: SanctionEvidence;
  canAppeal: boolean;
}
