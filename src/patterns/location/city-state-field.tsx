import { useId } from "react";

import { cn } from "../../lib/utils.js";
import { useMessages } from "../../messages/messages-context.js";
import type { CityStateFieldProps } from "../../types/patterns/city-state-field-props.js";
import { Input } from "../../ui/input.js";
import { Label } from "../../ui/label.js";

import { BRAZIL_STATES, CITY_MAX_LENGTH } from "./brazil-states.js";

/** City text input plus UF select, controlled. Reused by the community, profile and event forms. */
export function CityStateField({
  value,
  onChange,
  error,
  disabled,
  legend,
  hint,
  idPrefix,
}: CityStateFieldProps) {
  const messages = useMessages().cityStateField;
  const autoId = useId();
  const id = idPrefix ?? autoId;
  const noteId = `${id}-note`;

  return (
    <fieldset className="min-w-0 space-y-2" disabled={disabled}>
      <legend className="mb-2 text-sm font-medium leading-none">{legend ?? messages.legend}</legend>

      <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_12rem]">
        <div className="min-w-0 space-y-1.5">
          <Label htmlFor={`${id}-city`} className="text-xs text-text-subtle">
            {messages.cityLabel}
          </Label>

          <Input
            id={`${id}-city`}
            value={value.city}
            maxLength={CITY_MAX_LENGTH}
            showCounter={false}
            autoComplete="address-level2"
            placeholder={messages.cityPlaceholder}
            aria-describedby={noteId}
            aria-invalid={error ? true : undefined}
            onChange={(event) => onChange({ ...value, city: event.target.value })}
          />
        </div>

        <div className="min-w-0 space-y-1.5">
          <Label htmlFor={`${id}-state`} className="text-xs text-text-subtle">
            {messages.stateLabel}
          </Label>

          <select
            id={`${id}-state`}
            value={value.state}
            autoComplete="address-level1"
            aria-describedby={noteId}
            aria-invalid={error ? true : undefined}
            onChange={(event) => onChange({ ...value, state: event.target.value })}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
          >
            <option value="">{messages.statePlaceholder}</option>

            {BRAZIL_STATES.map((uf) => (
              <option key={uf.code} value={uf.code}>
                {uf.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <p
        id={noteId}
        aria-live="polite"
        className={cn("text-xs", error ? "text-destructive" : "text-text-subtle")}
      >
        {error || (hint ?? messages.hint)}
      </p>
    </fieldset>
  );
}
