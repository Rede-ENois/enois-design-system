import type { CompanyPersonView } from "./company-person-view.js";

/** A review left when a microproject was completed. */
export type CompanyReviewView = {
  projectTitle: string;
  /** 1 to 5. */
  rating: number;
  text: string | null;
  /** Already formatted day ("12 de out."). */
  dateLabel: string;
  person: CompanyPersonView;
};
