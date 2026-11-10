import type { ExploreSectionData } from "./explore-section-data.js";

export type ExploreHubProps = {
  /** Sections in order; the app leaves out the rooms the person turned off. */
  sections: ExploreSectionData[];
};
