import type { TalentBankDiscoveryState } from "./talent-bank-discovery-state.js";
import type { TalentBankSummary } from "./talent-bank-summary.js";

export type TalentBankDiscoveryProps = {
  banks: TalentBankSummary[];
  search: string;
  onSearchChange: (value: string) => void;
  areas: string[];
  area: string;
  onAreaChange: (value: string) => void;
  state?: TalentBankDiscoveryState;
  onRetry?: () => void;
};
