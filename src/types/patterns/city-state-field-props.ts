import type { CityStateValue } from "./city-state-value.js";

export type CityStateFieldProps = {
  value: CityStateValue;
  onChange: (value: CityStateValue) => void;
  /** Already translated error, shown under the inputs in place of the hint. */
  error?: string | null;
  disabled?: boolean;
  /** Overrides the default "Localização" legend. */
  legend?: string;
  /** Overrides the default "both or neither" hint (filters accept a state alone). */
  hint?: string;
  /** Prefix for the input ids, so the field can appear twice on one page. */
  idPrefix?: string;
};
