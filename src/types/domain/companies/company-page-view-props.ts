import type { CompanyFollowState } from "./company-follow-state.js";
import type { CompanyJobItem } from "./company-job-item.js";
import type { CompanyPageData } from "./company-page-data.js";
import type { CompanyReviewView } from "./company-review-view.js";
import type { CompanyStats } from "./company-stats.js";
import type { CompanyTeamPanel } from "./company-team-panel.js";
import type { MicroProjectActions } from "./micro-project-actions.js";
import type { MicroProjectCardData } from "./micro-project-card-data.js";
import type { MicroProjectViewer } from "./micro-project-viewer.js";

export type CompanyPageViewProps = {
  company: CompanyPageData;
  stats: CompanyStats;
  /** The viewer's role on the page, already a label ("Dono"); absent for outsiders. */
  roleLabel?: string | null;
  backHref: string;
  /** Opens the edit panel; absent when the viewer cannot edit. */
  onEdit?: () => void;
  /** The follow button; null hides it (signed out). */
  follow?: CompanyFollowState | null;
  /** The team panel; null for outsiders. */
  team?: CompanyTeamPanel | null;
  jobs: CompanyJobItem[];
  /** All the company jobs, when there are more than the ones listed. */
  jobsHref?: string | null;
  projects: MicroProjectCardData[];
  /** What the viewer can do on the microprojects (`canPropose` from the API). */
  viewer: MicroProjectViewer;
  projectActions: MicroProjectActions;
  reviews: CompanyReviewView[];
};
