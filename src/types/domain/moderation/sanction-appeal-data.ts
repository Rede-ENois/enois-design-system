export interface SanctionAppealData {
  id: string;
  sanctionId: string;
  message: string;
  status: "PENDING" | "APPROVED" | "DENIED";
  createdAt: string;
}
