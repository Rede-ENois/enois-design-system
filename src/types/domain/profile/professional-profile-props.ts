import type { ReactNode } from "react";

import type { ProfessionalCertificationItem } from "./professional-certification-item.js";
import type { ProfessionalEducationItem } from "./professional-education-item.js";
import type { ProfessionalProfileData } from "./professional-profile-data.js";
import type { ProfileExperienceItem } from "./profile-experience-item.js";

export type ProfessionalProfileProps = {
  profile: ProfessionalProfileData;
  experiences: ProfileExperienceItem[];
  educations: ProfessionalEducationItem[];
  certifications: ProfessionalCertificationItem[];
  /** Cover drawn by the app (sandboxed HTML or image); `null` falls back to the quiet band. */
  banner?: ReactNode;
  /** Owner only: where to edit the professional profile. */
  editHref?: string | null;
  backHref: string;
  /** Shown under the header when the profile is not active (draft/disabled preview). */
  statusNote?: string | null;
  /** The BUSINESS posts region (list, skeleton or empty state), owned by the app. */
  posts: ReactNode;
};
