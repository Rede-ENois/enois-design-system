import type { MicroProjectCardData } from "./micro-project-card-data.js";
import type { MicroProjectProposalItem } from "./micro-project-proposal-item.js";

export type MicroProjectProposalsDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectTitle: string;
  /** Only an open project can still choose someone. */
  projectStatus: MicroProjectCardData["status"];
  loading: boolean;
  /** The list could not be loaded; `onRetry` asks again. */
  error?: boolean;
  onRetry?: () => void;
  proposals: MicroProjectProposalItem[];
  /** The proposal being chosen: every choice is locked meanwhile. */
  selectingId: string | null;
  onSelect: (id: string) => void;
};
