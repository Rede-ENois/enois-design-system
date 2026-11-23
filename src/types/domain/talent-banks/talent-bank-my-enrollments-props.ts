import type { TalentBankMyEnrollment } from "./talent-bank-my-enrollment.js";

export type TalentBankMyEnrollmentsProps = {
  enrollments: TalentBankMyEnrollment[];
  onOpen?: (enrollmentId: string) => void;
  onRevoke?: (enrollmentId: string) => void;
  onErase?: (enrollmentId: string) => void;
  /** The enrollment whose action is running, if any. */
  busyEnrollmentId?: string | null;
  error?: string | null;
};
