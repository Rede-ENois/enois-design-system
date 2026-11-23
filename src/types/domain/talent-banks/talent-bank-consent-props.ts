import type { TalentBankDetail } from "./talent-bank-detail.js";
import type { TalentBankEnrollment } from "./talent-bank-enrollment.js";

export type TalentBankConsentProps = {
  bank: TalentBankDetail;
  selectedFields: string[];
  onToggleField: (key: string) => void;
  note: string;
  onNoteChange: (value: string) => void;
  /** "details" shows what the bank is; "authorize" shows what will be shared. */
  step: "details" | "authorize";
  enrollment: TalentBankEnrollment | null;
  /** Moves from the details step to the authorization step. */
  onStart: () => void;
  /** Sends the authorization and confirms it. */
  onConfirm: () => void;
  onBack: () => void;
  onRevoke: () => void;
  onErase: () => void;
  pending?: boolean;
  error?: string | null;
};
