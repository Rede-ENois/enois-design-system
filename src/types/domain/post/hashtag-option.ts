import type { ComponentType } from "react";

/** One choice of a {@link HashtagPicker}: the stored value and the words shown after the "#". */
export type HashtagOption = {
  value: string;
  label: string;
  /** Small icon before the tag inside the list (the post type uses it). */
  icon?: ComponentType<{ className?: string }>;
};
