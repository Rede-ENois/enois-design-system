import type { ComponentType } from "react";

export type GlobalSearchResultData = {
  id: string;
  type: string;
  title: string;
  subtitle: string;
  image: string | null;
  href: string;
  /** A place in the app (a feature): drawn as a colored squircle with this icon, not as a person. */
  icon?: ComponentType<{ className?: string }>;
  /** The squircle color (a `--table-N` token); defaults to the brand. */
  color?: string;
};
