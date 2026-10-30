import { useEffect, useState } from "react";

import { useMessages } from "../../messages/messages-context.js";
import { CityStateField } from "../../patterns/location/city-state-field.js";
import type { CommunityLocationFilterProps } from "../../types/domain/communities/community-location-filter-props.js";
import { Button } from "../../ui/button.js";

/** UF + city filter for the communities list. A state alone filters the whole UF. */
export function CommunityLocationFilter({ value, onApply, onClear }: CommunityLocationFilterProps) {
  const messages = useMessages().communityLocationFilter;
  const [draft, setDraft] = useState(value);
  const [error, setError] = useState<string | null>(null);

  // The applied filter can change outside (URL, clear elsewhere): the draft follows it.
  useEffect(() => {
    setDraft({ city: value.city, state: value.state });
    setError(null);
  }, [value.city, value.state]);

  const active = Boolean(value.city || value.state);

  return (
    <form
      role="search"
      aria-label={messages.label}
      className="flex flex-col gap-3"
      onSubmit={(event) => {
        event.preventDefault();
        const city = draft.city.trim();
        if (city && !draft.state) {
          setError(messages.cityNeedsState);
          return;
        }
        setError(null);
        onApply({ city, state: draft.state });
      }}
    >
      <CityStateField
        idPrefix="community-location-filter"
        legend={messages.label}
        hint={messages.hint}
        value={draft}
        error={error}
        onChange={(next) => {
          setDraft(next);
          setError(null);
        }}
      />

      <div className="flex gap-2">
        <Button type="submit" size="sm" className="rounded-full">
          {messages.apply}
        </Button>

        {active && (
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="rounded-full"
            onClick={onClear}
          >
            {messages.clear}
          </Button>
        )}
      </div>
    </form>
  );
}
