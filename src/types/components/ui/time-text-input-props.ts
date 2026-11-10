import type { ComponentProps } from "react";

export type TimeTextInputProps = Omit<
  ComponentProps<"input">,
  "type" | "value" | "defaultValue" | "onChange"
> & {
  /** Controlled value as `HH:mm`; the app stores what `onValueChange` hands back. */
  value?: string;
  defaultValue?: string;
  /**
   * Receives `HH:mm` when the clock is complete, "" when the field is empty and the partial text
   * while the reader is still typing (e.g. "19"). A form validating the ISO pair rejects the partial
   * string instead of treating a half-typed hour as "cleared".
   */
  onValueChange?: (time: string) => void;
};
