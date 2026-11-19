import type { ExploreHubState } from "./explore-hub-state.js";
import type { ExploreSectionData } from "./explore-section-data.js";

export type ExploreHubProps = {
  /** Sections in order; the app leaves out the rooms the person turned off. */
  sections: ExploreSectionData[];
  /** Estado do hub inteiro; ausente lê como pronto (compatível com quem não passava estado). */
  state?: ExploreHubState;
  /** Chamar de novo quando o carregamento falhar: refaz a busca de sinais e preferências. */
  onRetry?: () => void;
};
