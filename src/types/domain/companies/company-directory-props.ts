import type { CompanyDirectoryEntryView } from "./company-directory-entry-view.js";
import type { CompanyPageLink } from "./company-page-link.js";

export type CompanyDirectoryProps = {
  query: string;
  onQueryChange: (query: string) => void;
  sectors: string[];
  /** The selected sector, null for all. */
  sector: string | null;
  onSectorChange: (sector: string | null) => void;
  entries: CompanyDirectoryEntryView[];
  loading: boolean;
  /** The list could not be loaded; `onRetry` asks again. */
  error: boolean;
  onRetry: () => void;
  /** The viewer's own pages; null when signed out (the strip is hidden). */
  myPages: CompanyPageLink[] | null;
  /** Opens the create page dialog; shown only to signed in viewers. */
  onCreatePage?: () => void;
};
