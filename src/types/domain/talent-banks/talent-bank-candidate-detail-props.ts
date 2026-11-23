import type { TalentBankCandidateDetailData } from "./talent-bank-candidate-detail-data.js";

export type TalentBankCandidateDetailProps = {
  candidate: TalentBankCandidateDetailData;
  onDownloadResume?: () => void;
  onClose?: () => void;
  pending?: boolean;
  error?: string | null;
};
