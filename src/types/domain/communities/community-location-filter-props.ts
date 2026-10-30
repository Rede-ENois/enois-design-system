import type { CityStateValue } from "../../patterns/city-state-value.js";

export type CommunityLocationFilterProps = {
  /** Applied filter; empty strings mean no filter. */
  value: CityStateValue;
  /** Called with a valid filter: state alone, or city plus state. */
  onApply: (value: CityStateValue) => void;
  onClear: () => void;
};
