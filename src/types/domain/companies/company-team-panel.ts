import type { CompanyChecklistItem } from "./company-checklist-item.js";

/** What only the company team sees on its page. */
export type CompanyTeamPanel = {
  checklist: CompanyChecklistItem[];
  counts: { open: number; newProposals: number; inProgress: number; completed: number };
  onNewProject: () => void;
};
