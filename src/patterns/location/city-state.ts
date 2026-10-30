import type { CityStateErrorCode } from "../../types/patterns/city-state-error-code.js";
import type { CityStateValue } from "../../types/patterns/city-state-value.js";

import { BRAZIL_STATES, CITY_MAX_LENGTH } from "./brazil-states.js";

/** Same rules as the backend: both or neither, a known UF, city up to 80 characters. */
export function validateCityState({ city, state }: CityStateValue): CityStateErrorCode | null {
  const trimmed = city.trim();
  if (Boolean(trimmed) !== Boolean(state)) return "CITY_STATE_INCOMPLETE";
  if (state && !BRAZIL_STATES.some((uf) => uf.code === state)) return "INVALID_STATE";
  if (trimmed.length > CITY_MAX_LENGTH) return "CITY_TOO_LONG";
  return null;
}

/** "Belo Horizonte, MG", "MG" or "" when nothing is set. */
export function formatLocation(city?: string | null, state?: string | null): string {
  return [city?.trim(), state].filter(Boolean).join(", ");
}
