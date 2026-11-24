import type { TalentBankCertification } from "./talent-bank-certification.js";
import type { TalentBankEducation } from "./talent-bank-education.js";
import type { TalentBankEnrollmentState } from "./talent-bank-enrollment-state.js";
import type { TalentBankExperience } from "./talent-bank-experience.js";
import type { TalentBankProfileIdentity } from "./talent-bank-profile-identity.js";

/**
 * The file of one enrolled person: only the blocks she authorized are filled in.
 *
 * <p>An empty list means "not authorized", not "no data": the recruiter never sees a block that
 * the person did not allow.</p>
 */
export type TalentBankCandidateDetailData = {
  enrollmentId: string;
  state: TalentBankEnrollmentState;
  sharedFields: string[];
  consentVersion: string;
  purposeSnapshot: string;
  note: string | null;
  consentedAt: string | null;
  identity: TalentBankProfileIdentity | null;
  skills: string[];
  experiences: TalentBankExperience[];
  educations: TalentBankEducation[];
  certifications: TalentBankCertification[];
  resumeAuthorized: boolean;
  resumeAvailable: boolean;
  resumeName: string | null;
};
