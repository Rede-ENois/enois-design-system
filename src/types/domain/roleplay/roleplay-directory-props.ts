import type { ReactNode } from "react";

import type { RoleplayCampaignData } from "./roleplay-campaign-data.js";
import type { RoleplaySystemOption } from "./roleplay-system-option.js";

export type RoleplayDirectoryProps = {
  campaigns: RoleplayCampaignData[];
  loading?: boolean;
  loadError?: boolean;
  onRetry?: () => void;
  /** The campaigns the viewer is in; hidden when absent (public discovery without session). */
  mine?: RoleplayCampaignData[];
  /** Controlled search text; when given, the field never keeps its own state. */
  searchValue?: string;
  /** Search is a server filter; the app owns the query, the view only reports the text. */
  onSearch?: (value: string) => void;
  /** Opens the create dialog; absent when the viewer has no session. */
  onCreate?: () => void;
  /** Opens the campaign; the app owns routing. */
  onOpen: (campaign: RoleplayCampaignData) => void;
  /** Where the create action lands when `onCreate` is a navigation instead of a dialog. */
  createAction?: ReactNode;
  /** Catalog for the create dialog; the app resolves the family from it. */
  systems: RoleplaySystemOption[];
  onCreateSubmit?: (values: {
    name: string;
    description: string | null;
    setting: string | null;
    gameSystem: string;
    systemFamily: string | null;
    visibility: "PUBLIC" | "PRIVATE";
  }) => void;
  creating?: boolean;
  createError?: string | null;
};
