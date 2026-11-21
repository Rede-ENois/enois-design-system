import type { SanctionAppealData } from "./sanction-appeal-data.js";
import type { SanctionData } from "./sanction-data.js";

export interface SanctionsViewProps {
  mode: "history" | "suspended";
  sanctions: SanctionData[];
  appeals: SanctionAppealData[];
  now: number;
  loading: boolean;
  error: boolean;
  refreshing: boolean;
  appealMessage: string;
  onAppealMessageChange: (value: string) => void;
  onAppeal: () => void;
  appealSubmitting: boolean;
  appealError: boolean;
  onRetry: () => void;
  backHref?: string;
  loginHref?: string;
  appealSanctionId?: string;
  onAppealSanctionChange?: (sanctionId: string) => void;
}
